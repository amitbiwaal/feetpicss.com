import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Affiliate Disclosure",
  description:
    "FeetPicss is supported by affiliate advertising. Learn which links are affiliate links, how we earn commissions, and how that affects our content.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <ContentPage
      title="Affiliate Disclosure"
      path="/affiliate-disclosure"
      eyebrow="Legal"
      lead="FeetPicss is free to read because it is supported by affiliate advertising. Here is exactly how that works."
      updated={SITE.pagesLastModified}
    >
      <h2>The short version</h2>
      <p>
        Some links on FeetPicss are affiliate links. If you click one and sign up or make a purchase, we may earn a
        commission from the company you signed up with. <strong>It never costs you anything extra.</strong>
      </p>

      <h2>Which links are affiliate links</h2>
      <p>
        Buttons and links that send you to {SITE.affiliateName} — for example “Start Selling on InstaFeet” or “Create
        Your Free Account” — are affiliate links. They open in a new tab and are marked as sponsored links in the
        page code. Articles on our blog may contain affiliate links too, and say so near the top of the article.
      </p>

      <h2>Our relationship with the platforms we mention</h2>
      <p>
        FeetPicss is an independent guide. We are <strong>not</strong> owned by, operated by, endorsed by, or
        officially affiliated with {SITE.affiliateName}. All trademarks, brand names and logos belong to their
        respective owners. We cannot access or manage any account you hold with a third-party platform.
      </p>

      <h2>How this affects what we write</h2>
      <p>
        Affiliate income pays for running the site, and it does influence which platform we link to most
        prominently. It does not change our safety advice: we tell you to protect your identity, avoid off-platform
        payments, and check the laws where you live, whether or not you ever click one of our links.
      </p>

      <h2>No guarantees</h2>
      <p>
        A recommendation is not a promise of results. Read the platform&apos;s own terms, fees and payout rules
        before you sign up, and see our <Link href="/disclaimer">disclaimer</Link> for more on earnings.
      </p>

      <h2>Questions</h2>
      <p>
        If anything about how we earn money is unclear, <Link href="/contact">ask us</Link>.
      </p>
    </ContentPage>
  );
}
