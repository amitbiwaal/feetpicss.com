import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ROBOTS_INDEX, RSS_ALTERNATE } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { types: RSS_ALTERNATE },
  formatDetection: { telephone: false, email: false, address: false },
  robots: ROBOTS_INDEX,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "dark",
};

const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#org"),
      name: SITE.name,
      url: absoluteUrl("/"),
      description:
        "FeetPicss is an independent guide that helps creators sell feet pics online safely, anonymously, and profitably.",
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png"), width: 512, height: 512 },
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: SITE.name,
      description: "Learn how to sell feet pics online in 2026 with the FeetPicss guide.",
      publisher: { "@id": absoluteUrl("/#org") },
      inLanguage: SITE.language,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: globals.css sets smooth scrolling for in-page anchor links; this tells
    // Next.js to switch it off while changing pages, so a new page opens at the top instantly.
    <html lang={SITE.language} data-scroll-behavior="smooth">
      <body>
        {children}
        <JsonLd data={siteGraph} />
      </body>
    </html>
  );
}
