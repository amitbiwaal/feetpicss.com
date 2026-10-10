"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Opens the editor for a brand-new post. The post id is generated here, on every click, so each
 * click gets its own editor URL. (A <Link> to /admin/posts/new is not used: the router can reuse a
 * previous redirect and reopen the last new post.) Without JavaScript, or when opened in a new
 * tab, the plain href still works — /admin/posts/new redirects to a fresh id on the server.
 */
export function NewPostLink({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      className={className}
      href="/admin/posts/new"
      onClick={(event) => {
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
        // crypto.randomUUID only exists on secure origins (https or localhost).
        if (modified || typeof crypto.randomUUID !== "function") return;
        event.preventDefault();
        router.push(`/admin/posts/${crypto.randomUUID()}`);
      }}
    >
      {children}
    </a>
  );
}
