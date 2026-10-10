import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="notfound">
      <div className="wrap narrow">
        <p className="code grad-text">404</p>
        <h1>This page could not be found</h1>
        <p className="lead">
          The link may be old or the page may have moved. Head back to the guide or browse the latest articles.
        </p>
        <div className="cta-row centered">
          <Link className="btn" href="/">
            Go to the homepage
          </Link>
          <Link className="btn ghost" href="/blog">
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
