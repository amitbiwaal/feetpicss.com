import type { ReactNode } from "react";
import { AFFILIATE_REL, SITE } from "@/lib/site";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/** Every outbound affiliate CTA goes through here so the rel attributes can never be forgotten. */
export function AffiliateLink({ children, className = "btn", onClick }: Props) {
  return (
    <a className={className} href={SITE.affiliateUrl} target="_blank" rel={AFFILIATE_REL} onClick={onClick}>
      {children}
    </a>
  );
}
