import Link from "next/link";
import { cacheLife } from "next/cache";
import { SITE } from "@/lib/site";
import { LogoMark } from "./Logo";

const COLUMNS = [
  {
    title: "Guide",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#categories", label: "What you can sell" },
      { href: "/#tips", label: "Selling tips" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "FeetPicss",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

// Reading the clock is only allowed inside a cached scope when the page is prerendered.
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getUTCFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="site">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/" aria-label="FeetPicss home">
              <LogoMark />
              FeetPicss
            </Link>
            <p>{SITE.tagline}</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-legal">
          <p>
            <strong>Affiliate disclosure:</strong> FeetPicss ({SITE.domain}) is an independent, advertising-supported
            guide. We may earn a commission when you sign up or make a purchase through links on this site, at no extra
            cost to you. <Link href="/affiliate-disclosure">Read our affiliate disclosure</Link>.
          </p>
          <p>
            FeetPicss is <strong>not</strong> owned by, operated by, endorsed by, or officially affiliated with{" "}
            {SITE.affiliateName}. All trademarks, brand names, and logos are the property of their respective owners.
            This website is intended strictly for adults aged 18 and over. Ratings, statistics, and testimonials shown
            on this site are illustrative examples and are not guarantees of income or results.
          </p>
          <p className="copy">
            © {year} FeetPicss · {SITE.domain} — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
