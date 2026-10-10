import type { MetadataRoute } from "next";
import { categorySlug, getCategories, getPublishedPosts } from "@/lib/posts";
import { POSTS_PER_PAGE, SITE, absoluteUrl } from "@/lib/site";

const STATIC_PAGES = [
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/affiliate-disclosure",
  "/disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  // Listing pages change whenever a post does, so their lastmod follows the newest post.
  const newest = posts.reduce((latest, post) => (post.updatedAt > latest ? post.updatedAt : latest), "");
  const listingModified = newest || SITE.pagesLastModified;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return [
    { url: absoluteUrl("/"), lastModified: listingModified },
    { url: absoluteUrl("/blog"), lastModified: listingModified },
    ...STATIC_PAGES.map((path) => ({ url: absoluteUrl(path), lastModified: SITE.pagesLastModified })),
    ...Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
      url: absoluteUrl(`/blog/page/${index + 2}`),
      lastModified: listingModified,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/blog/category/${category.slug}`),
      lastModified: posts
        .filter((post) => categorySlug(post.category) === category.slug)
        .reduce((latest, post) => (post.updatedAt > latest ? post.updatedAt : latest), ""),
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
    })),
  ];
}
