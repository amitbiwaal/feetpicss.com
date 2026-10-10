import type { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import { SiteChrome } from "@/components/SiteChrome";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: ROBOTS_NOINDEX,
};

// Handles URLs that match no route at all; these render outside the (site) layout, so the chrome is added here.
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
