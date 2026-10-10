import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/PostArticle";
import { requireAdmin } from "@/lib/auth";
import { readPostById } from "@/lib/posts";

export const metadata: Metadata = { title: "Preview" };

// Admin pages render per request behind the session check; waiting for them on navigation is intended.
export const instant = false;

export default async function PreviewPostPage({ params }: PageProps<"/admin/posts/[id]/preview">) {
  await requireAdmin();
  const { id } = await params;
  const post = await readPostById(id);
  if (!post) notFound();

  return (
    <>
      <div className="preview-banner" role="status">
        Preview of the last saved version ({post.status}). Only signed-in admins can see this page.{" "}
        <Link href={`/admin/posts/${post.id}`}>Back to editing</Link>
      </div>
      <PostArticle post={post} />
    </>
  );
}
