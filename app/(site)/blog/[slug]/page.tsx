import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PostArticle } from "@/components/PostArticle";
import { PostCard } from "@/components/PostCard";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { htmlToText } from "@/lib/sanitize";
import { ROBOTS_NOINDEX, pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

// The slug is read before anything renders so that an unknown post is a real 404 response and a
// known one is complete HTML. That makes this a deliberately blocking route.
export const instant = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  // At least one entry is required; before the first post exists the placeholder is built as a 404.
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "first-post" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article not found", robots: ROBOTS_NOINDEX };
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.coverImage
      ? { ...post.coverImage, alt: post.coverImage.alt || post.title }
      : undefined,
    publishedTime: post.publishedAt ?? undefined,
    modifiedTime: post.updatedAt,
    authors: [post.author],
    tags: post.tags,
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const others = (await getPublishedPosts()).filter((item) => item.id !== post.id);
  const related = [
    ...others.filter((item) => item.category === post.category),
    ...others.filter((item) => item.category !== post.category),
  ].slice(0, 3);

  const url = absoluteUrl(`/blog/${post.slug}`);
  const isTeamAuthor = post.author === SITE.defaultAuthor;

  return (
    <>
      <PostArticle post={post} />

      {related.length > 0 ? (
        <section className="alt">
          <div className="wrap">
            <div className="head">
              <h2>Keep reading</h2>
            </div>
            <ul className="post-grid">
              {related.map((item) => (
                <li key={item.id}>
                  <PostCard post={item} heading="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          headline: post.title,
          description: post.seoDescription || post.excerpt,
          image: [absoluteUrl(post.coverImage?.url ?? "/opengraph-image")],
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: isTeamAuthor
            ? { "@type": "Organization", name: post.author, url: absoluteUrl("/about") }
            : { "@type": "Person", name: post.author },
          publisher: { "@id": absoluteUrl("/#org") },
          articleSection: post.category,
          keywords: post.tags.join(", ") || undefined,
          wordCount: htmlToText(post.content).split(" ").filter(Boolean).length,
          inLanguage: SITE.language,
          isAccessibleForFree: true,
        }}
      />
    </>
  );
}
