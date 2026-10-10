import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

const DESCRIPTION =
  "Contact FeetPicss with questions about our guides, corrections, or partnership enquiries. Send us a message using the contact form.";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: DESCRIPTION,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact FeetPicss"
        lead="Questions about a guide, a correction, or a partnership idea? Send us a message."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="page-body">
        <div className="wrap contact-grid">
          <div className="panel">
            <h2>Send a message</h2>
            <ContactForm />
          </div>

          <div className="panel">
            <h2>Before you write</h2>
            <p className="muted">
              FeetPicss is an independent guide. We can&apos;t access, fix, or verify accounts on{" "}
              {SITE.affiliateName} or any other platform — for account, payout or verification problems, contact that
              platform&apos;s own support team.
            </p>
            <h3>We can help with</h3>
            <ul className="checks">
              <li>
                <Icon name="check" />
                <span>Questions about our guides and articles</span>
              </li>
              <li>
                <Icon name="check" />
                <span>Corrections and out-of-date information</span>
              </li>
              <li>
                <Icon name="check" />
                <span>Advertising and partnership enquiries</span>
              </li>
              <li>
                <Icon name="check" />
                <span>
                  Privacy requests — see the <Link href="/privacy-policy">privacy policy</Link>
                </span>
              </li>
            </ul>
            <p className="note">This site is for adults aged 18 and over.</p>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": absoluteUrl("/contact#webpage"),
          url: absoluteUrl("/contact"),
          name: "Contact FeetPicss",
          description: DESCRIPTION,
          isPartOf: { "@id": absoluteUrl("/#website") },
          inLanguage: SITE.language,
        }}
      />
    </>
  );
}
