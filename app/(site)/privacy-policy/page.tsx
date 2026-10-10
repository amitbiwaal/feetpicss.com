import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How FeetPicss handles your information: what we collect through the contact form, the cookies we use, affiliate links, and your privacy rights.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      path="/privacy-policy"
      eyebrow="Legal"
      lead="What information FeetPicss collects, why, and the choices you have."
      updated={SITE.pagesLastModified}
    >
      <p>
        This policy explains how FeetPicss ({SITE.domain}, “we”, “us”) handles information when you visit this
        website. FeetPicss is an informational guide: you cannot create an account here, upload photos, or make
        payments through this site.
      </p>

      <h2>Information we collect</h2>
      <h3>Messages you send us</h3>
      <p>
        If you use the <Link href="/contact">contact form</Link>, we store the name, email address, subject and
        message you enter so that we can read and answer it. Please don&apos;t include photos, identity documents or
        other sensitive details in a message.
      </p>
      <h3>Technical data</h3>
      <p>
        Like most websites, the server that hosts FeetPicss may automatically log basic technical details of each
        request — such as IP address, browser type, the page requested and the time. We use this to keep the site
        running, to limit abuse of the contact form, and to diagnose problems.
      </p>

      <h2>Cookies</h2>
      <p>
        FeetPicss does not set advertising or tracking cookies for visitors. The only cookie the site itself sets is
        a sign-in cookie used by site administrators. If we add analytics or advertising tools in the future, this
        policy will be updated before they are switched on.
      </p>

      <h2>Affiliate links and other websites</h2>
      <p>
        Many links on FeetPicss lead to third-party websites, including {SITE.affiliateName}. When you follow an
        affiliate link, the destination site may use cookies or similar technology to record that you arrived from
        FeetPicss. Those sites have their own privacy policies, and we do not control how they handle your data. See
        our <Link href="/affiliate-disclosure">affiliate disclosure</Link> for more.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To reply to messages you send us.</li>
        <li>To operate, secure and improve the website.</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>How long we keep it</h2>
      <p>
        Contact messages are kept only for as long as needed to deal with your enquiry and are then deleted. Server
        logs are kept for a limited period by our hosting provider.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to ask for a copy of the personal information we hold
        about you, to have it corrected or deleted, or to object to how it is used. To make a request, use the{" "}
        <Link href="/contact">contact form</Link> and tell us which email address you wrote from.
      </p>

      <h2>Age restriction</h2>
      <p>
        FeetPicss is intended strictly for adults aged 18 and over. We do not knowingly collect information from
        anyone under 18. If you believe a minor has sent us personal information, contact us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The “last updated” date at the top of the page shows when it
        last changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? <Link href="/contact">Send us a message</Link>.
      </p>
    </ContentPage>
  );
}
