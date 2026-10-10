export const SITE = {
  name: "FeetPicss",
  domain: "feetpicss.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://feetpicss.com").replace(/\/+$/, ""),
  title: "Sell Feet Pics Online Safely (2026) | FeetPicss",
  description:
    "Want to sell feet pics online? FeetPicss is your free 2026 guide to selling feet pictures safely and anonymously, setting your own prices, and getting paid fast.",
  tagline: "Your free guide to selling feet pics online — safely, anonymously, and on your terms.",
  locale: "en_US",
  language: "en",
  themeColor: "#120c1c",
  affiliateUrl: "https://www.instafeet.com/",
  affiliateName: "InstaFeet",
  defaultAuthor: "FeetPicss Editorial Team",
  // Date the static (non-blog) pages were last meaningfully edited. Used for sitemap lastmod.
  pagesLastModified: "2026-10-10",
} as const;

/** Links to these hosts are marked rel="sponsored nofollow" wherever they appear. */
export const AFFILIATE_HOSTS = ["instafeet.com"];

export const AFFILIATE_REL = "sponsored nofollow noopener";

export const POSTS_PER_PAGE = 9;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isAffiliateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return AFFILIATE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // Drop apostrophes instead of hyphenating them, so "Beginner's" becomes "beginners", not "beginner-s".
    .replace(/['’‘`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
