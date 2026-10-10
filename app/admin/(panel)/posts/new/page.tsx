import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { newId } from "@/lib/storage";

// Admin pages render per request behind the session check; waiting for them on navigation is intended.
export const instant = false;

/**
 * A new post gets its id — and therefore its permanent editor URL — before anything is written.
 * Nothing is stored until the first save, so opening this page and leaving creates no empty drafts.
 */
export default async function NewPostPage() {
  await requireAdmin();
  redirect(`/admin/posts/${newId()}`);
}
