import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/auth";
import { readAllPosts } from "@/lib/posts";
import { isValidId } from "@/lib/storage";

export const metadata: Metadata = { title: "Edit post" };

// Admin pages render per request behind the session check; waiting for them on navigation is intended.
export const instant = false;

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isValidId(id)) notFound();

  const posts = await readAllPosts();
  // No file for this id yet means a post that has not been saved for the first time (see posts/new).
  const post = posts.find((item) => item.id === id) ?? null;
  const categories = [...new Set(posts.map((item) => item.category))].sort();

  return (
    <PostEditor
      // A different post must start from a fresh editor, never from the previous post's state.
      key={id}
      isNew={!post}
      categories={categories}
      initial={{
        id,
        title: post?.title ?? "",
        slug: post?.slug ?? "",
        excerpt: post?.excerpt ?? "",
        content: post?.content ?? "",
        coverImage: post?.coverImage ?? null,
        category: post?.category ?? "",
        tags: post?.tags ?? [],
        author: post?.author ?? "",
        seoTitle: post?.seoTitle ?? "",
        seoDescription: post?.seoDescription ?? "",
        status: post?.status ?? "draft",
      }}
    />
  );
}
