import type { ReactNode } from "react";
import { formatDate } from "@/lib/site";
import { PageHero } from "./PageHero";

type Props = {
  title: string;
  path: string;
  eyebrow?: string;
  lead?: string;
  /** ISO date shown as "Last updated". */
  updated?: string;
  children: ReactNode;
};

/** Shared shell for text-heavy pages (legal pages and similar). */
export function ContentPage({ title, path, eyebrow, lead, updated, children }: Props) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} crumbs={[{ name: title, path }]} narrow />
      <section className="page-body">
        <div className="wrap narrow">
          {updated ? (
            <p className="updated">
              Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
            </p>
          ) : null}
          <div className="prose">{children}</div>
        </div>
      </section>
    </>
  );
}
