import sanitizeHtml from "sanitize-html";
import { AFFILIATE_REL, SITE, isAffiliateHost, slugify } from "./site";

export type TocItem = { id: string; text: string; level: 2 | 3 };

function linkAttributes(href: string | undefined): Record<string, string> {
  if (!href) return {};
  let url: URL;
  try {
    url = new URL(href, SITE.url);
  } catch {
    return {};
  }
  // Relative links and #anchors resolve against the site URL, so they count as internal too.
  if (url.origin === SITE.url || url.protocol === "mailto:") return { href };
  // Anything else that is not a normal web link (javascript:, data:, …) loses its href entirely.
  if (url.protocol !== "http:" && url.protocol !== "https:") return {};
  return {
    href,
    target: "_blank",
    rel: isAffiliateHost(url.hostname) ? AFFILIATE_REL : "noopener noreferrer",
  };
}

/**
 * Editor output is never trusted: everything saved through the CMS passes through here,
 * so only plain formatting tags survive and scripts / inline handlers / odd URL schemes are dropped.
 */
export function sanitizePostHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "h2", "h3", "h4", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "blockquote", "code", "pre", "hr", "br", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "decoding"],
      ol: ["start"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    exclusiveFilter: (frame) => {
      // Images must be site uploads or absolute https URLs.
      if (frame.tag === "img") return !/^(\/uploads\/|https:\/\/)/.test(frame.attribs.src ?? "");
      // Empty paragraphs are editor leftovers (blank lines, the spacer after an image); drop them.
      return frame.tag === "p" && !frame.text.trim() && frame.mediaChildren.length === 0;
    },
    transformTags: {
      // The page title is the only h1, so headings pasted in as h1 are demoted.
      h1: "h2",
      b: "strong",
      i: "em",
      a: (tagName, attribs) => ({ tagName, attribs: linkAttributes(attribs.href) }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, alt: attribs.alt ?? "", loading: "lazy", decoding: "async" },
      }),
    },
  }).trim();
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' };

/** Plain text of a fragment. sanitize-html re-escapes text, so the four entities it emits are decoded. */
export function htmlToText(html: string): string {
  return sanitizeHtml(html.replace(/<\/(p|h[1-6]|li|blockquote|pre)>|<br\s*\/?>/gi, "$& "), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&(?:amp|lt|gt|quot);/g, (entity) => ENTITIES[entity])
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(html: string): number {
  const words = htmlToText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function excerptFromHtml(html: string, maxLength = 160): string {
  const text = htmlToText(html);
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 1)).replace(/[\s,.;:!?-]+$/, "")}…`;
}

/**
 * Adds anchor ids to h2/h3 and returns the table of contents.
 * Relies on sanitizePostHtml having stripped every attribute from headings.
 */
export function withHeadingAnchors(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<(h2|h3)>([\s\S]*?)<\/\1>/g, (match, tag: string, inner: string) => {
    const text = htmlToText(inner);
    if (!text) return match;
    const base = slugify(text) || "section";
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    toc.push({ id, text, level: tag === "h2" ? 2 : 3 });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { html: out, toc };
}
