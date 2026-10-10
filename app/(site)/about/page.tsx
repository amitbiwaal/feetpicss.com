import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

const DESCRIPTION =
  "FeetPicss is an independent, free guide that helps adults learn how to sell feet pics online safely and anonymously. Learn who we are and how the site is funded.";

export const metadata: Metadata = pageMetadata({
  title: "About Us: Our Mission and How We're Funded",
  description: DESCRIPTION,
  path: "/about",
});

const PRINCIPLES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "shield",
    title: "Safety before sales",
    text: "Privacy, anonymity and scam-avoidance come first in everything we publish. If a shortcut puts your identity at risk, we say so.",
  },
  {
    icon: "book",
    title: "Plain language",
    text: "No jargon and no gatekeeping. Our guides are written so a complete beginner can follow them from the first step.",
  },
  {
    icon: "wallet",
    title: "No income promises",
    text: "Earnings depend on effort, consistency and demand. We explain what helps, and we never guarantee results.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="About FeetPicss"
        lead="An independent, free guide for adults who want to sell feet pics online — safely, anonymously, and on their own terms."
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <section className="page-body">
        <div className="wrap">
          <div className="grid-2">
            <div className="panel">
              <h2>What FeetPicss is</h2>
              <p>
                FeetPicss ({SITE.domain}) is a guide, not a marketplace. We don&apos;t host photos, process payments,
                or run creator accounts. We explain how selling feet pictures online works, what to watch out for, and
                how to get started — then point you to a dedicated creator platform where you can actually sell.
              </p>
              <p className="muted">
                Everything on the site is free to read. You never need an account with us, and we never ask for your
                photos.
              </p>
            </div>
            <div className="panel">
              <h2>How we&apos;re funded</h2>
              <p>
                FeetPicss is supported by affiliate advertising. Some links — including our buttons to{" "}
                {SITE.affiliateName} — are affiliate links, which means we may earn a commission if you sign up, at no
                extra cost to you.
              </p>
              <p className="muted">
                We are not owned by, operated by, or officially affiliated with {SITE.affiliateName}. Read the full{" "}
                <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">How we work</span>
            <h2>Our editorial principles</h2>
            <p className="lead">Three rules shape every guide and recommendation on FeetPicss.</p>
          </div>
          <div className="grid-3">
            {PRINCIPLES.map((principle) => (
              <div className="panel" key={principle.title}>
                <span className="badge">
                  <Icon name={principle.icon} />
                </span>
                <h3>{principle.title}</h3>
                <p className="muted">{principle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="grid-2">
            <div className="panel">
              <h2>Who the site is for</h2>
              <p>
                FeetPicss is written strictly for adults aged 18 and over. Selling adult-oriented content is regulated
                differently around the world, so it is your responsibility to follow the laws where you live and the
                terms of any platform you use.
              </p>
              <p className="muted">
                See our <Link href="/disclaimer">disclaimer</Link> for details on earnings, legal and tax topics.
              </p>
            </div>
            <div className="panel">
              <h2>Spotted a mistake?</h2>
              <p>
                Platforms change their rules and fees. If something on the site is out of date or unclear, tell us and
                we&apos;ll review it.
              </p>
              <div className="cta-row">
                <Link className="btn" href="/contact">
                  Contact FeetPicss
                </Link>
                <Link className="btn ghost" href="/blog">
                  Read the blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": absoluteUrl("/about#webpage"),
          url: absoluteUrl("/about"),
          name: "About FeetPicss",
          description: DESCRIPTION,
          isPartOf: { "@id": absoluteUrl("/#website") },
          about: { "@id": absoluteUrl("/#org") },
          inLanguage: SITE.language,
        }}
      />
    </>
  );
}
