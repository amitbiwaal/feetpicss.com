import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogListing } from "@/components/BlogListing";
import { PageHero } from "@/components/PageHero";
import { getCategories, getPublishedPosts } from "@/lib/posts";
import { ROBOTS_NOINDEX, pageMetadata } from "@/lib/seo";
import { POSTS_PER_PAGE } from "@/lib/site";

function parsePage(value: string): number | null {
  return /^[1-9]\d{0,3}$/.test(value) ? Number(value) : null;
}

// Deliberately blocking: the page number is checked first so an out-of-range page is a real 404 response.
export const instant = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  // At least one entry is required; when there is no page 2 yet, "2" is built as a 404.
  return Array.from({ length: Math.max(totalPages - 1, 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const page = parsePage((await params).page);
  if (page === null) return { title: "Page not found", robots: ROBOTS_NOINDEX };
  return pageMetadata({
    title: `Blog: Guides to Selling Feet Pics Online — Page ${page}`,
    description: `Page ${page} of the FeetPicss blog: practical guides on how to sell feet pics online safely and anonymously.`,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPaginatedPage({ params }: PageProps<"/blog/page/[page]">) {
  const page = parsePage((await params).page);
  if (page === null) notFound();
  // Page 1 lives at /blog; a second URL for the same list would be duplicate content.
  if (page === 1) permanentRedirect("/blog");

  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (page > totalPages) notFound();

  const start = (page - 1) * POSTS_PER_PAGE;
  return (
    <>
      <PageHero
        eyebrow="FeetPicss Blog"
        title={`Guides to Selling Feet Pics Online — Page ${page}`}
        crumbs={[
          { name: "Blog", path: "/blog" },
          { name: `Page ${page}`, path: `/blog/page/${page}` },
        ]}
      />
      <BlogListing
        posts={posts.slice(start, start + POSTS_PER_PAGE)}
        categories={categories}
        page={page}
        totalPages={totalPages}
      />
    </>
  );
}
