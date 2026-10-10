import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/site";
import { preconnectToImageHost } from "./hints";
import { LogoMark } from "./Logo";

type Props = {
  post: PostSummary;
  /** Heading level for the title: h2 on listing pages, h3 when the card sits under a section h2. */
  heading?: "h2" | "h3";
  /** Set on the first card of a page so its image is not lazy-loaded (it is usually the LCP element). */
  priority?: boolean;
};

export function PostCard({ post, heading: Heading = "h2", priority = false }: Props) {
  const href = `/blog/${post.slug}`;
  if (priority) preconnectToImageHost(post.coverImage?.url);
  return (
    <article className="post-card">
      {post.coverImage ? (
        <span className="thumb">
          {/* Uploads are already resized and converted to WebP when they are saved. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage.url}
            alt=""
            width={post.coverImage.width}
            height={post.coverImage.height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
          />
        </span>
      ) : (
        <span className="thumb empty">
          <LogoMark />
        </span>
      )}
      <div className="body">
        <span className="pill">{post.category}</span>
        <Heading>
          <Link href={href}>{post.title}</Link>
        </Heading>
        <p>{post.excerpt}</p>
        <div className="meta">
          {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> : null}
          <span className="dot">{post.readingMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
