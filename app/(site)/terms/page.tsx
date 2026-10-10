import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that apply when you use FeetPicss: who the site is for, how our content may be used, affiliate links, and the limits of our responsibility.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      path="/terms"
      eyebrow="Legal"
      lead="The rules for using FeetPicss. By using the site you agree to these terms."
      updated={SITE.pagesLastModified}
    >
      <h2>1. About these terms</h2>
      <p>
        These terms apply to your use of FeetPicss ({SITE.domain}). If you do not agree with them, please do not use
        the site.
      </p>

      <h2>2. Adults only</h2>
      <p>
        FeetPicss is intended strictly for adults aged 18 and over (or the age of majority where you live, if
        higher). By using the site you confirm that you meet this requirement.
      </p>

      <h2>3. Information, not advice</h2>
      <p>
        Everything on FeetPicss is general information for educational purposes. It is not legal, tax, financial or
        professional advice. Laws about selling adult-oriented content, and the tax treatment of what you earn, vary
        by location — you are responsible for understanding and following the rules that apply to you. See our{" "}
        <Link href="/disclaimer">disclaimer</Link>.
      </p>

      <h2>4. We are a guide, not a platform</h2>
      <p>
        FeetPicss does not host creator content, process payments, or manage accounts. When you sign up with a
        third-party platform such as {SITE.affiliateName}, your relationship is with that platform and is governed by
        its own terms and policies. We are not responsible for third-party sites, their availability, their fees, or
        how they handle your account or your data.
      </p>

      <h2>5. Affiliate links</h2>
      <p>
        Some links on the site are affiliate links, and we may earn a commission when you use them. Details are in
        our <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>

      <h2>6. No guarantee of results</h2>
      <p>
        We do not promise that you will earn any particular amount, or anything at all, by following the information
        on this site. Ratings, statistics and testimonials shown on the site are illustrative examples.
      </p>

      <h2>7. Our content</h2>
      <p>
        The text, design and graphics on FeetPicss belong to FeetPicss or its licensors. You may read and share links
        to our pages, but you may not copy, republish or sell our content without permission. Other companies&apos;
        names and trademarks belong to their owners.
      </p>

      <h2>8. Acceptable use</h2>
      <p>
        Do not misuse the site: don&apos;t attempt to disrupt it, gain unauthorised access to it, scrape it in a way
        that harms its operation, or use the contact form to send spam or unlawful material.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        The site is provided “as is”, without warranties of any kind. To the fullest extent permitted by law,
        FeetPicss is not liable for any loss or damage arising from your use of the site, from reliance on its
        content, or from your dealings with third-party platforms. Nothing in these terms limits liability that
        cannot legally be limited.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update the site and these terms at any time. The “last updated” date above shows when the terms last
        changed; continuing to use the site means you accept the current version.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms? <Link href="/contact">Get in touch</Link>.
      </p>
    </ContentPage>
  );
}
