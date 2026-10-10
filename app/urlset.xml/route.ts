import { categorySlug, getCategories, getPublishedPosts } from "@/lib/posts";
import { POSTS_PER_PAGE, SITE, absoluteUrl } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

// The sitemap, served at /sitemap.xml through a rewrite in next.config.ts.
//
// It deliberately does not live at app/sitemap.ts or app/sitemap.xml/route.ts: Next.js treats any
// route whose path ends in /sitemap.xml as a "metadata route", and on Vercel those stayed frozen
// at their build-time output — newly published posts never appeared. A normal route handler
// under another name is refreshed whenever the posts cache is, exactly like feed.xml.

const STATIC_PAGES = [
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/affiliate-disclosure",
  "/disclaimer",
];

type Entry = { path: string; lastModified: string };

function latest(dates: string[], fallback: string): string {
  return dates.reduce((newest, date) => (date > newest ? date : newest), "") || fallback;
}

export async function GET() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  // Listing pages change whenever a post does, so their lastmod follows the newest post.
  const listingModified = latest(posts.map((post) => post.updatedAt), SITE.pagesLastModified);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const entries: Entry[] = [
    { path: "/", lastModified: listingModified },
    { path: "/blog", lastModified: listingModified },
    ...STATIC_PAGES.map((path) => ({ path, lastModified: SITE.pagesLastModified })),
    ...Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
      path: `/blog/page/${index + 2}`,
      lastModified: listingModified,
    })),
    ...categories.map((category) => ({
      path: `/blog/category/${category.slug}`,
      lastModified: latest(
        posts.filter((post) => categorySlug(post.category) === category.slug).map((post) => post.updatedAt),
        listingModified,
      ),
    })),
    ...posts.map((post) => ({ path: `/blog/${post.slug}`, lastModified: post.updatedAt })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => `<url>\n<loc>${escapeXml(absoluteUrl(entry.path))}</loc>\n<lastmod>${entry.lastModified}</lastmod>\n</url>`)
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
