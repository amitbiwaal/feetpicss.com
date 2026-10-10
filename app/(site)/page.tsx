import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";
import { CtaBand } from "@/components/CtaBand";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { HOME_FAQS } from "@/lib/faq";
import { getPublishedPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({ title: SITE.title, absoluteTitle: true, description: SITE.description, path: "/" }),
  keywords: [
    "sell feet pics online",
    "sell feet pics",
    "how to sell feet pictures",
    "make money selling feet pics",
    "where to sell feet pics",
    "sell feet pics anonymously",
    "become a feet model",
    "FeetPicss",
  ],
};

type IconItem = { icon: IconName; title: string; text: string };
type TextItem = { title: string; text: string };

const TRUST: { icon: IconName; label: string }[] = [
  { icon: "shield", label: "100% Anonymous" },
  { icon: "lock", label: "Secure Payments" },
  { icon: "bolt", label: "Fast Payouts" },
  { icon: "tag", label: "You Set Prices" },
];

const INTRO_POINTS = [
  "Free, beginner-friendly guide to selling feet pics online",
  "Built around privacy, safety, and staying anonymous",
  "You keep full control of your content and your prices",
  "Strictly for verified adults aged 18 and over",
];

const FEATURES: IconItem[] = [
  {
    icon: "shield",
    title: "Stay Anonymous",
    text: "Sell feet pics without ever revealing your identity or showing your face. FeetPicss prioritizes platforms that protect your privacy from day one.",
  },
  {
    icon: "tag",
    title: "Set Your Own Prices",
    text: "You decide what every photo, set, and custom request is worth. FeetPicss puts pricing power firmly in your hands.",
  },
  {
    icon: "lock",
    title: "Secure Payments",
    text: "FeetPicss steers you toward platforms with safe, built-in payment processing.",
  },
  { icon: "bolt", title: "Fast Payouts", text: "Get paid quickly and reliably, with transparent fees." },
  {
    icon: "camera",
    title: "Easy Uploads",
    text: "No tech skills needed. Snap, upload, and list your feet pics in minutes — FeetPicss shows you exactly how.",
  },
  {
    icon: "globe",
    title: "Worldwide Buyers",
    text: "Reach a global audience of buyers actively searching for feet content, even if you start with zero followers.",
  },
];

const BENEFITS: TextItem[] = [
  {
    title: "Low effort, low startup cost",
    text: "No inventory, no shipping, no expensive gear. With FeetPicss you can start with just your phone and the feet you already have.",
  },
  {
    title: "Flexible, work-anytime income",
    text: "Sell feet pics on your own schedule — mornings, weekends, or whenever suits you. FeetPicss is built for fitting around real life.",
  },
  {
    title: "Total privacy and control",
    text: "Stay anonymous, block who you want, and only share what you're comfortable with. FeetPicss keeps you in charge at all times.",
  },
  {
    title: "Scalable earnings",
    text: "Start small, then grow with subscriptions, bundles, and custom requests. FeetPicss shows you how to turn first sales into repeat income.",
  },
];

const STEPS: TextItem[] = [
  {
    title: "Create your free account",
    text: "Sign up in minutes through the FeetPicss-recommended platform. No upfront cost to join.",
  },
  {
    title: "Verify you're 18+",
    text: "Confirm your age to keep the community safe. Your details stay private and protected.",
  },
  {
    title: "Upload & price your pics",
    text: "Add your feet pics, write a short description, and set prices that work for you.",
  },
  {
    title: "Get paid & grow",
    text: "Make sales, build repeat buyers, and watch your FeetPicss side hustle grow.",
  },
];

const CATEGORIES = [
  "Single feet pics",
  "Themed photo sets",
  "Soles & arches",
  "Pedicure & nail art",
  "Heels & sandals",
  "Stockings & socks",
  "Seasonal sets",
  "Short feet videos",
  "Custom requests",
  "Photo bundles",
  "Monthly subscriptions",
  "Loyal-buyer perks",
];

const REASONS: IconItem[] = [
  {
    icon: "heart",
    title: "Beginner-first guidance",
    text: "No jargon, no gatekeeping. FeetPicss explains everything in plain language so anyone can start.",
  },
  {
    icon: "shield",
    title: "Safety comes first",
    text: "Privacy, anonymity, and scam-avoidance are baked into every FeetPicss tip and recommendation.",
  },
  {
    icon: "wallet",
    title: "Built around real earnings",
    text: "FeetPicss focuses on what actually helps you get paid — not hype or empty promises.",
  },
];

const VERSUS_WIN = [
  "Stay completely anonymous",
  "Built-in secure payments",
  "Buyers actively searching for feet content",
  "You set your own prices",
  "Scam & chargeback protection",
  "Free to start",
];

const VERSUS_LOSE = [
  "Identity is often exposed",
  "Risky payments in DMs",
  "Hit-or-miss, unpredictable audience",
  "Limited pricing control",
  "You're on your own if something goes wrong",
  "Unpredictable costs and bans",
];

const USES: IconItem[] = [
  {
    icon: "bolt",
    title: "Students & side-hustlers",
    text: "Earn extra cash around classes or a day job. FeetPicss fits into any schedule.",
  },
  {
    icon: "heart",
    title: "Stay-at-home parents",
    text: "Make money from home in spare moments, with full privacy. FeetPicss keeps it discreet.",
  },
  {
    icon: "camera",
    title: "Aspiring content creators",
    text: "Test the waters of paid content with low risk. FeetPicss is a friendly first step.",
  },
  {
    icon: "wallet",
    title: "Anyone saving for a goal",
    text: "Put toward bills, travel, or savings. FeetPicss helps you start earning fast.",
  },
  {
    icon: "shield",
    title: "Privacy-conscious earners",
    text: "Want income without a public profile? FeetPicss is built around anonymity.",
  },
  {
    icon: "star",
    title: "Total beginners",
    text: "Never sold content before? FeetPicss walks you through every step from zero.",
  },
];

const STATS = [
  { value: "4.8/5", label: "Average creator rating" },
  { value: "100%", label: "Anonymous by design" },
  { value: "24/7", label: "Global buyer demand" },
  { value: "$0", label: "To get started" },
];

const TESTIMONIALS = [
  {
    quote:
      "I had no idea where to start. FeetPicss made selling feet pics online feel safe and totally doable — I made my first sale the same week.",
    name: "Mia R.",
    role: "New creator",
  },
  {
    quote:
      "The anonymity is what sold me. Thanks to FeetPicss I sell on my terms, keep my face out of it, and get paid reliably.",
    name: "Jas K.",
    role: "Side-hustler",
  },
  {
    quote:
      "Clear, honest, and beginner-friendly. FeetPicss answered every question I had before I spent a single minute uploading.",
    name: "Alex T.",
    role: "Part-time creator",
  },
];

const CHECKLIST: TextItem[] = [
  { title: "Create your free account", text: "Sign up on the FeetPicss-recommended platform — no upfront cost." },
  {
    title: "Verify that you're 18 or older",
    text: "A quick age check keeps the community safe and your details private.",
  },
  {
    title: "Set up an anonymous profile",
    text: "Choose a creator name and stay completely faceless if you prefer.",
  },
  {
    title: "Upload feet pics & set your prices",
    text: "List a few well-lit photos and decide exactly what each is worth.",
  },
  {
    title: "Share, sell & reinvest",
    text: "Make sales, learn what buyers love, and grow your FeetPicss income.",
  },
];

const TIPS: TextItem[] = [
  {
    title: "Nail the lighting",
    text: "Natural light and a clean background instantly make feet pics look more professional and sell better.",
  },
  {
    title: "Keep feet camera-ready",
    text: "A fresh pedicure, moisturized skin, and tidy nails are the FeetPicss basics buyers consistently reward.",
  },
  {
    title: "Offer variety",
    text: "Angles, poses, props, and themes give buyers more to choose from — and more reasons to return.",
  },
  {
    title: "Watermark your work",
    text: "Protect your content from theft with a subtle watermark, a habit every FeetPicss creator should build.",
  },
  {
    title: "Post consistently",
    text: "Regular uploads keep you visible and build loyal repeat buyers over time.",
  },
  {
    title: "Protect your privacy",
    text: "Never share personal details, remove photo metadata, and keep identifying features out of frame.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": absoluteUrl("/#faq"),
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

function pad(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function HeroVisual() {
  return (
    <svg viewBox="0 0 560 460" role="img" aria-labelledby="heroTitle">
      <title id="heroTitle">Creator selling feet pics online and earning money with FeetPicss</title>
      <defs>
        <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a1f44" />
          <stop offset="1" stopColor="#150f24" />
        </linearGradient>
        <linearGradient id="heroPh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5c8a" />
          <stop offset="1" stopColor="#ffb454" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="460" rx="28" fill="url(#heroBg)" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" />
      <rect x="180" y="58" width="200" height="362" rx="30" fill="#2b2042" stroke="rgba(255,255,255,.10)" />
      <rect x="194" y="82" width="172" height="314" rx="18" fill="#fbf6fd" />
      <path d="M194 100a18 18 0 0 1 18-18h136a18 18 0 0 1 18 18v134H194z" fill="url(#heroPh)" />
      <circle cx="280" cy="150" r="34" fill="#ffffff" opacity="0.9" />
      <circle cx="280" cy="150" r="15" fill="#ff5c8a" />
      <rect x="214" y="258" width="132" height="14" rx="7" fill="#e7def0" />
      <rect x="214" y="284" width="96" height="14" rx="7" fill="#e7def0" />
      <rect x="214" y="328" width="132" height="42" rx="21" fill="url(#heroPh)" />
      <text x="280" y="355" fontFamily="Arial,Helvetica,sans-serif" fontSize="16" fontWeight="bold" fill="#3a1206" textAnchor="middle">
        Sell now
      </text>
      <circle cx="116" cy="150" r="36" fill="#ffb454" />
      <text x="116" y="163" fontFamily="Arial" fontSize="32" fontWeight="bold" fill="#5a2e00" textAnchor="middle">
        $
      </text>
      <circle cx="446" cy="332" r="42" fill="#ffb454" />
      <text x="446" y="347" fontFamily="Arial" fontSize="36" fontWeight="bold" fill="#5a2e00" textAnchor="middle">
        $
      </text>
      <circle cx="436" cy="120" r="22" fill="none" stroke="#ffd9a8" strokeWidth="6" />
    </svg>
  );
}

export default async function HomePage() {
  const latestPosts = (await getPublishedPosts()).slice(0, 3);
  const faqColumns = [HOME_FAQS.slice(0, 4), HOME_FAQS.slice(4)];

  return (
    <>
      <JsonLd data={faqJsonLd} />

      {/* 1. HERO */}
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">FeetPicss · 2026 Creator Guide</span>
          <h1>
            Sell Feet Pics Online — Safely, Anonymously, and on Your Terms with{" "}
            <span className="grad-text">FeetPicss</span>
          </h1>
          <p className="lead">
            FeetPicss is your free, no-nonsense guide to selling feet pictures online. Set your own prices, stay
            completely anonymous, and get paid fast — start your feet pics side hustle today.
          </p>
          <div className="cta-row">
            <AffiliateLink className="btn lg">Start Selling on InstaFeet</AffiliateLink>
          </div>
          <p className="note">18+ only · No face required · Free to get started</p>
          <ul className="trust">
            {TRUST.map((item) => (
              <li key={item.label}>
                <Icon name={item.icon} /> {item.label}
              </li>
            ))}
          </ul>
          <div className="hero-visual">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 2. INTRO */}
      <section className="alt" id="about">
        <div className="wrap">
          <div className="head center">
            <span className="eyebrow">What is FeetPicss</span>
            <h2>What Is FeetPicss?</h2>
            <p className="lead">
              Want to <strong>sell feet pics online</strong> but not sure where to start? FeetPicss makes it simple.
              We&apos;re an independent guide built for everyday people who want to turn photos of their feet into
              real, discreet income — no inventory, no shipping, and no need to ever show your face.
            </p>
            <p className="muted">
              FeetPicss cuts through the confusion and points you to a trusted creator platform where you can sign up,
              upload your photos, set your prices, and start earning on your own terms.
            </p>
            <div className="cta-row centered">
              <AffiliateLink>Create Your Free Account</AffiliateLink>
              <Link className="btn ghost" href="/about">
                More about FeetPicss
              </Link>
            </div>
          </div>
          <div className="strip">
            {INTRO_POINTS.map((point) => (
              <div className="item" key={point}>
                <Icon name="check" />
                <h3>{point}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section id="features">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Highlights</span>
            <h2>Key Features of Selling Feet Pics with FeetPicss</h2>
            <p className="lead">
              Everything FeetPicss looks for in a great place to sell feet pics online — so you can earn with
              confidence.
            </p>
          </div>
          <div className="bento">
            {FEATURES.map((feature) => (
              <article className="tile" key={feature.title}>
                <span className="badge">
                  <Icon name={feature.icon} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BENEFITS */}
      <section className="alt" id="benefits">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Why it works</span>
            <h2>Benefits of Selling Feet Pics Online with FeetPicss</h2>
            <p className="lead">
              There&apos;s a reason this side hustle keeps growing. Here&apos;s what makes selling feet pics online
              with FeetPicss so appealing.
            </p>
          </div>
          <div className="rows">
            {BENEFITS.map((benefit, index) => (
              <div className="benefit" key={benefit.title}>
                <div className="big-n grad-text" aria-hidden="true">
                  {pad(index)}
                </div>
                <div>
                  <h3>{benefit.title}</h3>
                  <p className="muted">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Step by step</span>
            <h2>How to Sell Feet Pics with FeetPicss in 4 Steps</h2>
            <p className="lead">FeetPicss keeps it simple. You can be set up and ready to earn the same day.</p>
          </div>
          <div className="stepper">
            {STEPS.map((step, index) => (
              <div className="step" key={step.title}>
                <div className="dot" aria-hidden="true">
                  {index + 1}
                </div>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="cta-row centered" style={{ marginTop: 34 }}>
            <AffiliateLink className="btn lg">Get Started Free</AffiliateLink>
          </div>
        </div>
      </section>

      {/* 6. CATEGORIES */}
      <section className="alt" id="categories">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">What you can offer</span>
            <h2>What You Can Sell on FeetPicss</h2>
            <p className="lead">
              There&apos;s more demand — and more variety — than most beginners expect. FeetPicss helps you find your
              niche.
            </p>
          </div>
          <ul className="cat-grid">
            {CATEGORIES.map((category) => (
              <li className="cat" key={category}>
                {category}
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 22 }}>
            FeetPicss creators mix and match these to keep buyers coming back — variety is one of the easiest ways to
            increase your income.
          </p>
        </div>
      </section>

      {/* 7. WHY CHOOSE */}
      <section id="why">
        <div className="wrap split">
          <div className="aside">
            <span className="eyebrow">Our promise</span>
            <h2>Why Choose FeetPicss to Sell Feet Pics Online</h2>
            <p className="lead">
              FeetPicss exists to make selling feet pics online safer, simpler, and more profitable for beginners.
            </p>
            <div className="cta-row">
              <AffiliateLink>Join InstaFeet Now</AffiliateLink>
            </div>
          </div>
          <div className="list">
            {REASONS.map((reason) => (
              <div className="reason" key={reason.title}>
                <span className="badge">
                  <Icon name={reason.icon} />
                </span>
                <div>
                  <h3>{reason.title}</h3>
                  <p className="muted">{reason.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COMPARISON */}
      <section className="alt" id="compare">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">What sets it apart</span>
            <h2>What Sets FeetPicss Apart</h2>
            <p className="lead">
              See why the FeetPicss-recommended approach beats trying to sell feet pics on random social media.
            </p>
          </div>
          <div className="versus">
            <div className="vs-card win">
              <h3>
                <Icon name="star" /> The FeetPicss way
              </h3>
              <ul className="vs-list">
                {VERSUS_WIN.map((item) => (
                  <li key={item}>
                    <span className="mark y" aria-hidden="true">
                      ✓
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="vs-card">
              <h3>Random social media</h3>
              <ul className="vs-list">
                {VERSUS_LOSE.map((item) => (
                  <li key={item}>
                    <span className="mark n" aria-hidden="true">
                      ✕
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. USE CASES */}
      <section id="who">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Who it&apos;s for</span>
            <h2>Who FeetPicss Is For</h2>
            <p className="lead">
              If you&apos;re 18 or older and want flexible, discreet income, FeetPicss was made for you.
            </p>
          </div>
          <div className="uses">
            {USES.map((use) => (
              <div className="use" key={use.title}>
                <span className="badge">
                  <Icon name={use.icon} />
                </span>
                <div>
                  <h3>{use.title}</h3>
                  <p className="muted">{use.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF */}
      <section className="alt" id="community">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Trust signals</span>
            <h2>The FeetPicss Creator Community</h2>
            <p className="lead">
              A growing community of everyday creators are learning to sell feet pics online with FeetPicss.
            </p>
          </div>
          <div className="stats">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="num grad-text">{stat.value}</div>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="tgrid">
            {TESTIMONIALS.map((testimonial) => (
              <figure className="card" key={testimonial.name}>
                <div className="stars" role="img" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <blockquote>
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <figcaption className="who">
                  <span className="avatar" aria-hidden="true">
                    {testimonial.name.charAt(0)}
                  </span>
                  <span>
                    {testimonial.name}
                    <small>{testimonial.role}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="note">
            Ratings and testimonials are illustrative examples used to show typical creator experiences.
          </p>
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Questions &amp; answers</span>
            <h2>FeetPicss FAQ: Selling Feet Pics Online</h2>
            <p className="lead">The most common questions FeetPicss gets about how to sell feet pics online.</p>
          </div>
          <div className="faq faq-cols">
            {faqColumns.map((column, columnIndex) => (
              <div className="faq-col" key={columnIndex}>
                {column.map((faq, index) => (
                  <details key={faq.question} open={columnIndex === 0 && index === 0}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. GETTING STARTED */}
      <section className="alt" id="start">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Ready in minutes</span>
            <h2>Getting Started with FeetPicss</h2>
            <p className="lead">Follow this quick FeetPicss checklist and you could make your first sale today.</p>
          </div>
          <div className="start-grid">
            <ol className="tl">
              {CHECKLIST.map((item, index) => (
                <li className="node" key={item.title}>
                  <div className="num" aria-hidden="true">
                    {index + 1}
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="start-cta">
              <h3>Start your FeetPicss journey now</h3>
              <p className="muted">It&apos;s free to begin, you stay anonymous, and you&apos;re always in control.</p>
              <div className="cta-row">
                <AffiliateLink className="btn lg">Start Earning Today</AffiliateLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. TIPS */}
      <section id="tips">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Best practices</span>
            <h2>Tips to Sell More Feet Pics with FeetPicss</h2>
            <p className="lead">
              Small tweaks make a big difference. These FeetPicss tips help you stand out and earn more.
            </p>
          </div>
          <div className="tips">
            {TIPS.map((tip, index) => (
              <div className="tip" key={tip.title}>
                <div className="idx grad-text" aria-hidden="true">
                  {pad(index)}
                </div>
                <div>
                  <h3>{tip.title}</h3>
                  <p className="muted">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. LATEST GUIDES (only once something is published) */}
      {latestPosts.length > 0 ? (
        <section className="alt" id="guides">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">From the blog</span>
              <h2>Latest FeetPicss Guides</h2>
              <p className="lead">In-depth, practical articles on selling feet pics safely and earning more.</p>
            </div>
            <ul className="post-grid">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} heading="h3" />
                </li>
              ))}
            </ul>
            <div className="cta-row centered" style={{ marginTop: 30 }}>
              <Link className="btn ghost" href="/blog">
                View all articles
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* 15. FINAL CTA */}
      <CtaBand />
    </>
  );
}
