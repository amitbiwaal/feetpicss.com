import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "Important information about FeetPicss: no income guarantees, illustrative testimonials, no legal or tax advice, and our 18+ age requirement.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <ContentPage
      title="Disclaimer"
      path="/disclaimer"
      eyebrow="Legal"
      lead="Please read this before relying on anything published on FeetPicss."
      updated={SITE.pagesLastModified}
    >
      <h2>Earnings disclaimer</h2>
      <p>
        FeetPicss does not guarantee that you will make money selling feet pictures. What a creator earns depends on
        many things outside our control, including effort, consistency, content quality, pricing, competition and
        buyer demand. Many people who try this earn little or nothing. Any figures or examples on the site are for
        illustration only and are not typical results or promises.
      </p>

      <h2>Ratings, statistics and testimonials</h2>
      <p>
        Ratings, statistics and testimonials shown on FeetPicss are illustrative examples used to show the kind of
        experience a creator might have. They are not verified reviews from identifiable customers and should not be
        read as evidence of results you will achieve.
      </p>

      <h2>Not legal, tax or financial advice</h2>
      <p>
        Our content is general information only. It is not legal, tax, financial or professional advice, and it does
        not take your personal circumstances into account. Rules on selling adult-oriented content differ between
        countries and regions, and money you earn is usually taxable income. Speak to a qualified professional if
        you need advice.
      </p>

      <h2>Adults only</h2>
      <p>
        This website is intended strictly for adults aged 18 and over. Nothing on FeetPicss is directed at minors,
        and reputable platforms verify every creator&apos;s age before allowing them to sell.
      </p>

      <h2>Third-party platforms</h2>
      <p>
        FeetPicss is not owned by, operated by, endorsed by, or officially affiliated with {SITE.affiliateName} or any
        other platform we mention. Platforms change their features, fees, payout schedules and rules without notice,
        so always confirm the current details on the platform&apos;s own website. We are not responsible for the
        content, policies or practices of any third-party site.
      </p>

      <h2>Accuracy</h2>
      <p>
        We work to keep our guides accurate and current, but we cannot guarantee that every detail is complete or up
        to date. If you spot an error, <Link href="/contact">let us know</Link>.
      </p>

      <h2>Affiliate relationships</h2>
      <p>
        We may earn a commission when you use links on this site. See the{" "}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link> for details.
      </p>
    </ContentPage>
  );
}
