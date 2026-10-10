import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const PRIVATE = ["/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // AI / LLM crawlers are welcome on the public content.
      { userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "PerplexityBot"], allow: "/", disallow: PRIVATE },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
