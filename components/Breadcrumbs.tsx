import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus the matching BreadcrumbList structured data. Home is added automatically. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((crumb, index) => (
          <li key={crumb.path}>
            {index === trail.length - 1 ? (
              <span aria-current="page">{crumb.name}</span>
            ) : (
              <Link href={crumb.path}>{crumb.name}</Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
          })),
        }}
      />
    </nav>
  );
}
