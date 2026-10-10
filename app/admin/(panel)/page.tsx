import type { Metadata } from "next";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { NewPostLink } from "@/components/admin/NewPostLink";
import { deletePostAction } from "@/lib/actions/posts";
import { requireAdmin } from "@/lib/auth";
import { readAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/site";

export const metadata: Metadata = { title: "Posts" };

// Admin pages render per request behind the session check; waiting for them on navigation is intended.
export const instant = false;

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await readAllPosts();
  const published = posts.filter((post) => post.status === "published").length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Posts</h1>
          <p>
            {posts.length} total · {published} published · {posts.length - published} draft
            {posts.length - published === 1 ? "" : "s"}
          </p>
        </div>
        <NewPostLink className="a-btn primary">+ New post</NewPostLink>
      </div>

      {posts.length === 0 ? (
        <div className="a-empty">
          <h2>No posts yet</h2>
          <p>Write your first article to start building the blog.</p>
          <NewPostLink className="a-btn primary">Write a post</NewPostLink>
        </div>
      ) : (
        <table className="a-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Category</th>
              <th scope="col">Last edited</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="title">
                  <Link href={`/admin/posts/${post.id}`}>{post.title}</Link>
                  <small>/blog/{post.slug}</small>
                </td>
                <td>
                  <span className={`status ${post.status}`}>{post.status}</span>
                </td>
                <td>{post.category}</td>
                <td>{formatDate(post.updatedAt)}</td>
                <td>
                  <div className="actions">
                    <Link className="a-btn small" href={`/admin/posts/${post.id}`}>
                      Edit
                    </Link>
                    {post.status === "published" ? (
                      <a className="a-btn small" href={`/blog/${post.slug}`} target="_blank" rel="noopener">
                        View
                      </a>
                    ) : (
                      <a className="a-btn small" href={`/admin/posts/${post.id}/preview`} target="_blank" rel="noopener">
                        Preview
                      </a>
                    )}
                    <DeleteButton
                      action={deletePostAction.bind(null, post.id)}
                      confirmText={`Delete "${post.title}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
