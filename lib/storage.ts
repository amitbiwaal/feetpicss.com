import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * All CMS data lives on disk under this folder (posts, contact messages, uploads).
 * Override with CONTENT_DIR when the app runs somewhere the project folder is read-only.
 */
export const CONTENT_DIR = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(/* turbopackIgnore: true */ process.cwd(), "content");

export const POSTS_DIR = path.join(CONTENT_DIR, "posts");
export const MESSAGES_DIR = path.join(CONTENT_DIR, "messages");
export const UPLOADS_DIR = path.join(CONTENT_DIR, "uploads");

const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function newId(): string {
  return randomUUID();
}

/** Ids become file names, so anything that is not a UUID is rejected before touching the disk. */
export function isValidId(id: unknown): id is string {
  return typeof id === "string" && ID_PATTERN.test(id);
}

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

export async function readJsonFile<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

export async function readJsonDir<T>(dir: string): Promise<T[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
  const items = await Promise.all(
    names.filter((name) => name.endsWith(".json")).map((name) => readJsonFile<T>(path.join(dir, name))),
  );
  return items.filter((item): item is Awaited<T> => item !== null);
}

/** Write to a temp file first so a crash mid-write can never leave a half-written post behind. */
export async function writeJsonFile(file: string, data: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomUUID()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(tmp, file);
}

export async function deleteFile(file: string): Promise<void> {
  await rm(file, { force: true });
}
