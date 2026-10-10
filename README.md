# FeetPicss

The feetpicss.com website: a Next.js (App Router) + React site with a built-in blog CMS, deployed on Vercel.

- **Public site** — home page, blog (list, categories, pagination, posts), About, Contact, Privacy Policy, Terms, Affiliate Disclosure, Disclaimer, 404.
- **Admin panel** (`/admin`) — write, edit, preview, publish and delete blog posts with a rich text editor and image uploads; read contact-form messages.
- **Storage** — posts and messages in a Turso (SQLite) database, images in Vercel Blob.

## Production (Vercel)

| What | Where |
| --- | --- |
| Hosting | Vercel project `feetpicss` |
| Database | Turso, resource `feetpicss-db` (Vercel Marketplace integration) |
| Images | Vercel Blob store `feetpicss-blob` (public) |

Environment variables on the Vercel project:

| Variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Set by the Turso integration. When present, posts and messages are stored in Turso. |
| `BLOB_READ_WRITE_TOKEN` | Set by the Blob store. When present, uploads go to Vercel Blob. |
| `NEXT_PUBLIC_SITE_URL` | Public address of the site, no trailing slash. Used for canonical URLs, the sitemap and Open Graph tags. Redeploy after changing it. |
| `ADMIN_USERNAME` | Admin login name (default `admin`). |
| `ADMIN_PASSWORD` | Admin password, at least 10 characters. Changing it signs everyone out. |
| `SESSION_SECRET` | Random string of 32+ characters used to sign admin sessions. |

Login is disabled until `ADMIN_PASSWORD` and `SESSION_SECRET` are set — there is no default password. Environment variable changes only apply to new deployments.

The database tables are created automatically the first time the app talks to an empty database.

Deploy with `vercel deploy --prod`, or connect the GitHub repository to the Vercel project so every push to `main` deploys.

## Writing blog posts

1. Open `/admin` on the live site and sign in.
2. **New post** → write the title and the article. The toolbar has headings, bold/italic, lists, quotes, links and images.
3. In the side panel set the URL slug, excerpt, category, tags, cover image and the SEO title / meta description (a search-result preview updates as you type).
4. **Save draft** keeps it private (use **Preview** to check it). **Publish** puts it live immediately; **Update** republishes changes.

Publishing refreshes the affected pages, the sitemap, the RSS feed and `llms.txt` straight away — no redeploy needed.

Uploaded images are resized to at most 1600px wide, converted to WebP, and stripped of metadata (including GPS location). Photos larger than about 4 MB are scaled down in the browser before upload, because Vercel rejects larger requests.

Links to hosts listed in `AFFILIATE_HOSTS` (`lib/site.ts`) automatically get `rel="sponsored nofollow"`.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

With only the admin variables in `.env.local`, local development is **isolated from production**: posts and messages are JSON files in `content/` and uploads go to `content/uploads/`. Nothing you do locally touches the live site.

To work against the production database and Blob store instead, add `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` and `BLOB_READ_WRITE_TOKEN` to `.env.local` (`vercel env pull` fetches them). Be careful: posts you publish locally are then live.

Note: `vercel link` and `vercel env pull` rewrite `.env.local` and may append lines to `.gitignore` — check both afterwards.

## Backups

The Turso database and the Blob store are the whole CMS — the site has no other copy of the posts. Check which backup and restore options your Turso plan includes (Vercel → Storage → `feetpicss-db` → open the Turso dashboard), and keep your own export of important posts if the plan does not cover it.

## SEO features

- Every public page is fully prerendered HTML; new posts are rendered once on first request and cached.
- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter tags (`lib/seo.ts`).
- Structured data: Organization, WebSite, FAQPage (home), BlogPosting, Blog, BreadcrumbList.
- Generated `/sitemap.xml`, `/robots.txt`, `/feed.xml` (RSS), `/llms.txt`, web manifest and share image.
- Unknown URLs return a real 404; `/admin` and `/api` are disallowed and `noindex`.

## Project layout

```
app/(site)/        public pages (shared header/footer)
app/admin/         admin panel
app/api/admin/     image upload endpoint
app/urlset.xml/    the sitemap (served at /sitemap.xml via a rewrite — see the comment in the file)
app/uploads/       serves locally stored uploads (development only)
components/        UI components (components/admin = editor)
lib/store/         storage back ends: turso-store.ts (production), file-store.ts (local)
lib/               auth, sanitizing, SEO helpers, media, server actions
proxy.ts           redirects signed-out visitors away from /admin
content/           local-development data (not used on Vercel)
legacy-static/     the original single-file landing page, kept for reference
```

This project uses Next.js 16 with Cache Components. Some conventions differ from older Next.js versions — see `AGENTS.md` and the docs bundled in `node_modules/next/dist/docs/`.
