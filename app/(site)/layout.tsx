import { SiteChrome } from "@/components/SiteChrome";

// Every public page must be fully prerendered: crawlers always get complete HTML, and a URL that
// was not built ahead of time (a brand-new post) is rendered once, in full, then cached — which
// also means an unknown slug returns a real 404 status instead of a streamed "soft 404".
export const ensureStatic = "navigation";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteChrome>{children}</SiteChrome>;
}
