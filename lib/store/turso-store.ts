import "server-only";
import { connect, type Connection } from "@tursodatabase/serverless";
import type { ContactMessage, ContentStore, Post, RateLimitState } from "../types";

// Production store: a Turso (SQLite) database reached over HTTP.
//
// Posts and messages are stored as JSON in a `data` column; the few fields that are queried or
// must be unique (slug, status, dates) are also kept as real columns.

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS posts (
     id TEXT PRIMARY KEY,
     slug TEXT NOT NULL UNIQUE,
     status TEXT NOT NULL,
     published_at TEXT,
     updated_at TEXT NOT NULL,
     data TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS messages (
     id TEXT PRIMARY KEY,
     created_at TEXT NOT NULL,
     data TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
     key TEXT PRIMARY KEY,
     count INTEGER NOT NULL,
     reset_at INTEGER NOT NULL
   )`,
];

/** A connection is one sequential stream, so each operation opens its own (this is cheap: no socket until first use). */
function open(): Connection {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  return connect({ url, authToken: process.env.TURSO_AUTH_TOKEN });
}

let schemaReady: Promise<void> | null = null;

/** Creates the tables on first use in each server instance, so a brand-new database just works. */
function ready(): Promise<void> {
  schemaReady ??= open()
    .batch(SCHEMA)
    .then(() => undefined)
    .catch((error: unknown) => {
      schemaReady = null; // let the next request try again instead of caching the failure
      throw error;
    });
  return schemaReady;
}

async function db(): Promise<Connection> {
  await ready();
  return open();
}

type DataRow = { data: string };

export const tursoStore: ContentStore = {
  async listPosts() {
    const rows = (await (await db()).all("SELECT data FROM posts")) as DataRow[];
    return rows.map((row) => JSON.parse(row.data) as Post);
  },

  async getPost(id) {
    const row = (await (await db()).get("SELECT data FROM posts WHERE id = ?", id)) as DataRow | undefined;
    return row ? (JSON.parse(row.data) as Post) : null;
  },

  async savePost(post) {
    await (await db()).run(
      `INSERT INTO posts (id, slug, status, published_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         slug = excluded.slug,
         status = excluded.status,
         published_at = excluded.published_at,
         updated_at = excluded.updated_at,
         data = excluded.data`,
      post.id,
      post.slug,
      post.status,
      post.publishedAt,
      post.updatedAt,
      JSON.stringify(post),
    );
  },

  async deletePost(id) {
    await (await db()).run("DELETE FROM posts WHERE id = ?", id);
  },

  async listMessages() {
    const rows = (await (await db()).all("SELECT data FROM messages")) as DataRow[];
    return rows.map((row) => JSON.parse(row.data) as ContactMessage);
  },

  async addMessage(message) {
    await (await db()).run(
      "INSERT INTO messages (id, created_at, data) VALUES (?, ?, ?)",
      message.id,
      message.createdAt,
      JSON.stringify(message),
    );
  },

  async deleteMessage(id) {
    await (await db()).run("DELETE FROM messages WHERE id = ?", id);
  },

  async getRateLimit(key, now) {
    const row = (await (await db()).get(
      "SELECT count, reset_at FROM rate_limits WHERE key = ? AND reset_at > ?",
      key,
      now,
    )) as { count: number; reset_at: number } | undefined;
    return row ? ({ count: Number(row.count), resetAt: Number(row.reset_at) } satisfies RateLimitState) : null;
  },

  async bumpRateLimit(key, windowMs, now) {
    // The count is updated by a single upsert, so two serverless instances counting at the same
    // moment cannot lose an attempt. The second statement just clears out expired keys.
    await (await db()).batch([
      {
        sql: `INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)
              ON CONFLICT(key) DO UPDATE SET
                count = CASE WHEN rate_limits.reset_at <= ? THEN 1 ELSE rate_limits.count + 1 END,
                reset_at = CASE WHEN rate_limits.reset_at <= ? THEN excluded.reset_at ELSE rate_limits.reset_at END`,
        args: [key, now + windowMs, now, now],
      },
      { sql: "DELETE FROM rate_limits WHERE reset_at <= ?", args: [now] },
    ]);
  },

  async clearRateLimit(key) {
    await (await db()).run("DELETE FROM rate_limits WHERE key = ?", key);
  },
};
