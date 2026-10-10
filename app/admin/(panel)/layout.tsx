import Link from "next/link";
import { NewPostLink } from "@/components/admin/NewPostLink";
import { LogoMark } from "@/components/Logo";
import { logoutAction } from "@/lib/actions/auth";

// Each page under this layout checks the session itself (requireAdmin); loading.tsx is the
// boundary they stream in behind, so moving between admin pages responds immediately.
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="admin-bar">
        <div className="inner">
          <Link className="brand" href="/admin">
            <LogoMark />
            <span>
              FeetPicss <small>Admin</small>
            </span>
          </Link>
          <nav className="admin-nav" aria-label="Admin">
            <Link href="/admin">Posts</Link>
            <NewPostLink>New post</NewPostLink>
            <Link href="/admin/messages">Messages</Link>
            <a href="/" target="_blank" rel="noopener">
              View site ↗
            </a>
          </nav>
          <form action={logoutAction}>
            <button className="a-btn small" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </>
  );
}
