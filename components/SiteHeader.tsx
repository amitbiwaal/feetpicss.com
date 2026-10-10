"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AffiliateLink } from "./AffiliateLink";
import { LogoMark } from "./Logo";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#why", label: "Why FeetPicss" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site">
      <div className={`wrap nav${open ? " open" : ""}`}>
        <Link className="brand" href="/" aria-label="FeetPicss home" onClick={close}>
          <LogoMark />
          FeetPicss
        </Link>
        <button
          type="button"
          className="hamburger"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav className="nav-links" id="primary-nav" aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={close}>
              {link.label}
            </Link>
          ))}
          <AffiliateLink onClick={close}>Start Free</AffiliateLink>
        </nav>
      </div>
    </header>
  );
}
