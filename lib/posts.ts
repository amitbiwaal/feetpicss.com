import "server-only";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import { readingMinutes } from "./sanitize";
import { slugify } from "./site";
import { POSTS_DIR, deleteFile, isValidId, readJsonDir, readJsonFile, writeJsonFile } from "./storage";

export type PostStatus = "draft" | "published";

export type PostImage = { url: string; alt: string; width: number; height: number };

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Sanitized HTML. */
  content: string;
  coverImage: PostImage | null;
  category: string;
  tags: string[];
  author: string;
  status: PostStatus;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostSummary = Omit<Post, "content"> & { readingMinutes: number };

export type Category = { name: string; slug: string; count: number };

/** Every cached read below carries this tag; saving or deleting a post expires it. */
export const POSTS_TAG = "posts";

/** `/blog/page/…` and `/blog/category/…` are real routes, so a post can never claim these slugs. */
export const RESERVED_SLUGS = new Set(["page", "category"]);

function postFile(id: string): string {
  if (!isValidId(id)) throw new Error("Invalid post id");
  return path.join(POSTS_DIR, `${id}.json`);
}

function toSummary(post: Post): PostSummary {
  const { content, ...rest } = post;
  return { ...rest, readingMinutes: readingMinutes(content) };
}

function byNewest(a: { publishedAt: string | null; updatedAt: string }, b: typeof a): number {
  return (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt);
}

/* ---------- Uncached access: admin panel and mutations only ---------- */

export async function readAllPosts(): Promise<Post[]> {
  const posts = await readJsonDir<Post>(POSTS_DIR);
  return posts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function readPostById(id: string): Promise<Post | null> {
  if (!isValidId(id)) return null;
  return readJsonFile<Post>(postFile(id));
}

export async function writePost(post: Post): Promise<void> {
  await writeJsonFile(postFile(post.id), post);
}

export async function removePost(id: string): Promise<void> {
  await deleteFile(postFile(id));
}

/** Returns a slug no other post uses, appending -2, -3… when needed. */
export async function uniqueSlug(wanted: string, ownId: string): Promise<string> {
  const base = slugify(wanted) || "post";
  const taken = new Set(
    (await readAllPosts()).filter((post) => post.id !== ownId).map((post) => post.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug) || RESERVED_SLUGS.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

/* ---------- Cached access: everything the public site renders ---------- */

async function loadPublished(): Promise<Post[]> {
  const posts = await readJsonDir<Post>(POSTS_DIR);
  return posts.filter((post) => post.status === "published" && post.publishedAt).sort(byNewest);
}

export async function getPublishedPosts(): Promise<PostSummary[]> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("max");
  return (await loadPublished()).map(toSummary);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("max");
  return (await loadPublished()).find((post) => post.slug === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("max");
  const categories = new Map<string, Category>();
  for (const post of await loadPublished()) {
    const slug = slugify(post.category);
    if (!slug) continue;
    const existing = categories.get(slug);
    if (existing) existing.count += 1;
    else categories.set(slug, { name: post.category, slug, count: 1 });
  }
  return [...categories.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function categorySlug(category: string): string {
  return slugify(category);
}
