import Link from "next/link";
import type { Post } from "@/lib/posts";
import { readingMinutes, withHeadingAnchors } from "@/lib/sanitize";
import { formatDate, slugify } from "@/lib/site";
import { AffiliateLink } from "./AffiliateLink";
import { Breadcrumbs } from "./Breadcrumbs";

/** The full article view. Shared by the public post page and the admin draft preview. */
export function PostArticle({ post }: { post: Post }) {
  const { html, toc } = withHeadingAnchors(post.content);
  const published = post.publishedAt ?? post.updatedAt;
  const showUpdated = post.updatedAt.slice(0, 10) > published.slice(0, 10);
  const category = slugify(post.category);

  return (
    <article>
      <header className="article-head">
        <div className="wrap narrow">
          <Breadcrumbs
            items={[
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />
          <Link className="pill" href={`/blog/category/${category}`}>
            {post.category}
          </Link>
          <h1>{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          <div className="meta">
            <span>By {post.author}</span>
            <span className="dot">
              <time dateTime={published}>{formatDate(published)}</time>
            </span>
            {showUpdated ? (
              <span className="dot">
                Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </span>
            ) : null}
            <span className="dot">{readingMinutes(post.content)} min read</span>
          </div>
          <p className="note">
            This article may contain affiliate links. <Link href="/affiliate-disclosure">How we earn money</Link>.
          </p>
          {post.coverImage ? (
            <figure className="cover">
              {/* Uploads are already resized and converted to WebP when they are saved. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                width={post.coverImage.width}
                height={post.coverImage.height}
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          ) : null}
        </div>
      </header>

      <div className={`wrap article-layout${toc.length < 2 ? " no-toc" : ""}`}>
        <div>
          {/* post.content was sanitized by sanitizePostHtml when it was saved. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="inline-cta" aria-label="Get started">
            <h2>Ready to try it yourself?</h2>
            <p>
              Create a free creator account, stay anonymous, and set your own prices. You must be 18 or older to sign
              up.
            </p>
            <AffiliateLink>Start Selling on InstaFeet</AffiliateLink>
            <p className="note">Affiliate link — we may earn a commission at no extra cost to you.</p>
          </aside>

          {post.tags.length > 0 ? (
            <ul className="tag-row" aria-label="Tags">
              {post.tags.map((tag) => (
                <li className="tag" key={tag}>
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {toc.length >= 2 ? (
          <nav className="toc" aria-label="Table of contents">
            <h2>On this page</h2>
            <ol>
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "sub" : undefined}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
    </article>
  );
}
