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

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type RateLimitState = { count: number; resetAt: number };

/**
 * Where the CMS keeps its data. Two implementations exist: Turso (used whenever
 * TURSO_DATABASE_URL is set, i.e. on Vercel) and JSON files under content/ (local development).
 */
export interface ContentStore {
  listPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | null>;
  /** Inserts the post, or replaces the one with the same id. */
  savePost(post: Post): Promise<void>;
  deletePost(id: string): Promise<void>;

  listMessages(): Promise<ContactMessage[]>;
  addMessage(message: ContactMessage): Promise<void>;
  deleteMessage(id: string): Promise<void>;

  /** Current attempt counter for a rate-limit key, or null when there is none / it has expired. */
  getRateLimit(key: string, now: number): Promise<RateLimitState | null>;
  /** Adds one attempt, starting a new window of `windowMs` if the previous one has expired. */
  bumpRateLimit(key: string, windowMs: number, now: number): Promise<void>;
  clearRateLimit(key: string): Promise<void>;
}
