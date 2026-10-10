import type { Metadata } from "next";
import { BlogListing } from "@/components/BlogListing";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { getCategories, getPublishedPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { POSTS_PER_PAGE, SITE, absoluteUrl } from "@/lib/site";

const DESCRIPTION =
  "Practical, beginner-friendly guides on how to sell feet pics online: staying anonymous, pricing, avoiding scams, taking better photos, and getting paid.";

export const metadata: Metadata = pageMetadata({
  title: "Blog: Guides to Selling Feet Pics Online",
  description: DESCRIPTION,
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const firstPage = posts.slice(0, POSTS_PER_PAGE);

  return (
    <>
      <PageHero
        eyebrow="FeetPicss Blog"
        title="Guides to Selling Feet Pics Online"
        lead="Straightforward advice on privacy, pricing, photography and getting paid — written for beginners."
        crumbs={[{ name: "Blog", path: "/blog" }]}
      />
      <BlogListing posts={firstPage} categories={categories} page={1} totalPages={totalPages} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": absoluteUrl("/blog#blog"),
          url: absoluteUrl("/blog"),
          name: `${SITE.name} Blog`,
          description: DESCRIPTION,
          inLanguage: SITE.language,
          publisher: { "@id": absoluteUrl("/#org") },
          blogPost: firstPage.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
          })),
        }}
      />
    </>
  );
}
