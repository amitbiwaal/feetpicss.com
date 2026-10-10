import "server-only";
import path from "node:path";
import { MESSAGES_DIR, POSTS_DIR, deleteFile, isValidId, readJsonDir, readJsonFile, writeJsonFile } from "../storage";
import type { ContactMessage, ContentStore, Post, RateLimitState } from "../types";

// Local-development store: one JSON file per post / message under content/.
// Not usable on Vercel, where the filesystem is read-only — see turso-store.ts.

function fileFor(dir: string, id: string): string {
  // Ids become file names, so anything that is not a UUID is rejected before touching the disk.
  if (!isValidId(id)) throw new Error("Invalid id");
  return path.join(dir, `${id}.json`);
}

// A single dev server process, so counters can simply live in memory.
const rateLimits = new Map<string, RateLimitState>();

export const fileStore: ContentStore = {
  listPosts: () => readJsonDir<Post>(POSTS_DIR),
  getPost: (id) => (isValidId(id) ? readJsonFile<Post>(fileFor(POSTS_DIR, id)) : Promise.resolve(null)),
  savePost: (post) => writeJsonFile(fileFor(POSTS_DIR, post.id), post),
  deletePost: (id) => deleteFile(fileFor(POSTS_DIR, id)),

  listMessages: () => readJsonDir<ContactMessage>(MESSAGES_DIR),
  addMessage: (message) => writeJsonFile(fileFor(MESSAGES_DIR, message.id), message),
  deleteMessage: (id) => deleteFile(fileFor(MESSAGES_DIR, id)),

  async getRateLimit(key, now) {
    const state = rateLimits.get(key);
    return state && state.resetAt > now ? state : null;
  },
  async bumpRateLimit(key, windowMs, now) {
    const state = rateLimits.get(key);
    if (state && state.resetAt > now) state.count += 1;
    else rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    if (rateLimits.size > 5000) {
      for (const [k, s] of rateLimits) if (s.resetAt <= now) rateLimits.delete(k);
    }
  },
  async clearRateLimit(key) {
    rateLimits.delete(key);
  },
};
