import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/BlogListing";
import { PageHero } from "@/components/PageHero";
import { categorySlug, getCategories, getPublishedPosts } from "@/lib/posts";
import { ROBOTS_NOINDEX, pageMetadata } from "@/lib/seo";

// Deliberately blocking: the category is resolved first so an unknown one is a real 404 response.
export const instant = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  // At least one entry is required; with no posts yet the placeholder is simply built as a 404.
  return categories.length > 0
    ? categories.map((category) => ({ category: category.slug }))
    : [{ category: "guides" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) return { title: "Category not found", robots: ROBOTS_NOINDEX };
  return pageMetadata({
    title: `${category.name}: Articles on Selling Feet Pics`,
    description: `All FeetPicss articles in the ${category.name} category — practical advice for selling feet pics online safely and profitably.`,
    path: `/blog/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category: slug } = await params;
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const inCategory = posts.filter((post) => categorySlug(post.category) === category.slug);
  return (
    <>
      <PageHero
        eyebrow="Blog category"
        title={category.name}
        lead={`${category.count} article${category.count === 1 ? "" : "s"} on ${category.name.toLowerCase()} for feet pic sellers.`}
        crumbs={[
          { name: "Blog", path: "/blog" },
          { name: category.name, path: `/blog/category/${category.slug}` },
        ]}
      />
      <BlogListing posts={inCategory} categories={categories} activeCategory={category.slug} page={1} totalPages={1} />
    </>
  );
}
