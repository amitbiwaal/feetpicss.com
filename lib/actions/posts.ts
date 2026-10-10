"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "../auth";
import { isUploadedImageUrl } from "../media-url";
import {
  POSTS_TAG,
  RESERVED_SLUGS,
  readPostById,
  removePost,
  uniqueSlug,
  writePost,
  type Post,
  type PostImage,
  type PostStatus,
} from "../posts";
import { excerptFromHtml, htmlToText, sanitizePostHtml } from "../sanitize";
import { SITE, slugify } from "../site";
import { isValidId } from "../storage";

export type PostInput = {
  /** Chosen when the editor is opened; the post file is created on the first save. */
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: PostImage | null;
  category: string;
  tags: string[];
  author: string;
  seoTitle: string;
  seoDescription: string;
  status: PostStatus;
};

export type SaveResult =
  | { ok: true; id: string; slug: string; status: PostStatus }
  | { ok: false; errors: Record<string, string> };

const MAX_CONTENT_BYTES = 600_000;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function parseCoverImage(value: unknown): PostImage | null {
  if (!value || typeof value !== "object") return null;
  const { url, alt, width, height } = value as Record<string, unknown>;
  // Only images that went through the upload route are accepted as covers.
  if (!isUploadedImageUrl(url)) return null;
  const w = Number(width);
  const h = Number(height);
  if (!Number.isInteger(w) || !Number.isInteger(h) || w <= 0 || h <= 0) return null;
  return { url, alt: text(alt, 200), width: w, height: h };
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value.map((tag) => text(tag, 30)).filter(Boolean);
  return [...new Set(tags)].slice(0, 10);
}

export async function savePostAction(input: PostInput): Promise<SaveResult> {
  await requireAdmin();

  const errors: Record<string, string> = {};
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  const status: PostStatus = raw.status === "published" ? "published" : "draft";
  const title = text(raw.title, 140);
  if (!title) errors.title = "Add a title.";

  const rawContent = typeof raw.content === "string" ? raw.content : "";
  if (rawContent.length > MAX_CONTENT_BYTES) errors.content = "This post is too long to save.";
  const content = errors.content ? "" : sanitizePostHtml(rawContent);
  const plain = htmlToText(content);
  if (status === "published" && plain.length < 50) {
    errors.content = "Write some content before publishing.";
  }

  if (!isValidId(raw.id)) return { ok: false, errors: { form: "This post has an invalid id. Reload the page." } };
  const id = raw.id;
  const existing: Post | null = await readPostById(id);

  const wantedSlug = slugify(text(raw.slug, 100) || title);
  if (title && !wantedSlug) errors.slug = "Use letters and numbers in the URL slug.";
  if (RESERVED_SLUGS.has(wantedSlug)) errors.slug = `"${wantedSlug}" is reserved. Pick a different slug.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const slug = await uniqueSlug(wantedSlug, id);
  const now = new Date().toISOString();

  const post: Post = {
    id,
    slug,
    title,
    excerpt: text(raw.excerpt, 300) || excerptFromHtml(content, 160),
    content,
    coverImage: parseCoverImage(raw.coverImage),
    category: text(raw.category, 40) || "Guides",
    tags: parseTags(raw.tags),
    author: text(raw.author, 60) || SITE.defaultAuthor,
    status,
    seoTitle: text(raw.seoTitle, 70),
    seoDescription: text(raw.seoDescription, 170),
    publishedAt: existing?.publishedAt ?? (status === "published" ? now : null),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await writePost(post);

  // Drafts never reach the public site, so the cache only needs expiring when a live post is involved.
  if (post.status === "published" || existing?.status === "published") updateTag(POSTS_TAG);

  return { ok: true, id: post.id, slug: post.slug, status: post.status };
}

export async function deletePostAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  const existing = isValidId(id) ? await readPostById(id) : null;
  if (!existing) return { ok: false };
  await removePost(existing.id);
  if (existing.status === "published") updateTag(POSTS_TAG);
  return { ok: true };
}
