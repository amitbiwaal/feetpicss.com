import Link from "next/link";
import type { Category, PostSummary } from "@/lib/posts";
import { PostCard } from "./PostCard";

type Props = {
  posts: PostSummary[];
  categories: Category[];
  activeCategory?: string;
  page: number;
  totalPages: number;
};

function pageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

export function BlogListing({ posts, categories, activeCategory, page, totalPages }: Props) {
  return (
    <section className="page-body">
      <div className="wrap">
        {categories.length > 1 ? (
          <nav aria-label="Blog categories">
            <ul className="chip-row">
              <li>
                <Link className="chip" href="/blog" aria-current={activeCategory ? undefined : "page"}>
                  All posts
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    className="chip"
                    href={`/blog/category/${category.slug}`}
                    aria-current={activeCategory === category.slug ? "page" : undefined}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {posts.length === 0 ? (
          <div className="empty-state">
            <h2>New guides are on the way</h2>
            <p className="muted">We are working on our first articles. Check back soon.</p>
            <Link className="btn ghost" href="/">
              Back to the homepage
            </Link>
          </div>
        ) : (
          <ul className="post-grid">
            {posts.map((post, index) => (
              <li key={post.id}>
                <PostCard post={post} priority={index === 0} />
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 ? (
          <nav className="pager" aria-label="Blog pages">
            {page > 1 ? (
              <Link className="btn ghost" href={pageHref(page - 1)} rel="prev">
                ← Newer posts
              </Link>
            ) : (
              <span />
            )}
            <span className="count">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link className="btn ghost" href={pageHref(page + 1)} rel="next">
                Older posts →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
