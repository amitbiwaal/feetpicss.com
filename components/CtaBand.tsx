import { AffiliateLink } from "./AffiliateLink";

type Props = { title?: string; text?: string; button?: string };

export function CtaBand({
  title = "Start Selling Feet Pics Online with FeetPicss Today",
  text = "Free to begin, fully anonymous, and entirely on your terms. Join the creators turning feet pics into income with FeetPicss.",
  button = "Create Your Free Account",
}: Props) {
  return (
    <section>
      <div className="wrap">
        <div className="cta-band">
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="cta-row">
            <AffiliateLink className="btn lg dark">{button}</AffiliateLink>
          </div>
        </div>
      </div>
    </section>
  );
}
