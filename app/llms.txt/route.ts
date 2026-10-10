import { getPublishedPosts } from "@/lib/posts";
import { SITE, absoluteUrl } from "@/lib/site";

// Plain-text site summary for AI crawlers. Generated so the article list never goes stale.
export async function GET() {
  const posts = await getPublishedPosts();
  const articles =
    posts.length > 0
      ? posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt}`).join("\n")
      : "- No articles published yet.";

  const body = `# ${SITE.name}

> ${SITE.name} (${SITE.domain}) is a free, independent 2026 guide that helps adults (18+) learn how to sell feet pics online safely, anonymously, and profitably, then connects them to a trusted creator platform to start earning.

${SITE.name} is an advertising-supported affiliate guide, not a payment processor or marketplace itself. It explains the feet-pics side hustle in plain language and links out to a recommended creator platform (${SITE.affiliateName}) where users can sign up and sell. ${SITE.name} is not officially affiliated with ${SITE.affiliateName}.

## Primary topic
- Primary keyword: sell feet pics online
- Audience: adults (18+) who want flexible, discreet, low-cost income from selling feet pictures
- Core promise: anonymity, you set your own prices, secure payments, fast payouts, free to start

## Key pages
- [Home](${absoluteUrl("/")}): The full guide — features, benefits, how it works in 4 steps, what you can sell, FAQ, and tips.
- [Blog](${absoluteUrl("/blog")}): In-depth articles on privacy, pricing, photography, and getting paid.
- [About](${absoluteUrl("/about")}): What ${SITE.name} is, how it is funded, and its editorial principles.
- [Contact](${absoluteUrl("/contact")}): Contact form for questions and corrections.
- [Affiliate Disclosure](${absoluteUrl("/affiliate-disclosure")}): How the site earns money.
- [Disclaimer](${absoluteUrl("/disclaimer")}): Earnings, legal, and age disclaimers.
- [Privacy Policy](${absoluteUrl("/privacy-policy")})
- [Terms of Use](${absoluteUrl("/terms")})

## Articles
${articles}

## Key facts
- 18+ only; users must comply with local laws and platform terms.
- No need to show your face; creators stay anonymous.
- Free to start; only standard platform fees apply on actual sales.
- All primary calls to action link to: ${SITE.affiliateUrl}

## Feeds
- Sitemap: ${absoluteUrl("/sitemap.xml")}
- RSS: ${absoluteUrl("/feed.xml")}

## Disclaimer
Affiliate/advertising-supported, independent site. Not owned by, endorsed by, or officially affiliated with ${SITE.affiliateName} (${SITE.affiliateUrl}). Ratings, statistics, and testimonials are illustrative and not guarantees of income.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
