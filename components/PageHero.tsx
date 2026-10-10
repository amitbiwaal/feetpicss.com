import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  narrow?: boolean;
};

export function PageHero({ eyebrow, title, lead, crumbs, narrow = false }: Props) {
  return (
    <section className="page-hero">
      <div className={`wrap${narrow ? " narrow" : ""}`}>
        <Breadcrumbs items={crumbs} />
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </section>
  );
}
