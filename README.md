# FeetPicss

The feetpicss.com website: a Next.js (App Router) + React site with a built-in blog CMS.

- **Public site** — home page, blog (list, categories, pagination, posts), About, Contact, Privacy Policy, Terms, Affiliate Disclosure, Disclaimer, 404.
- **Admin panel** (`/admin`) — write, edit, preview, publish and delete blog posts with a rich text editor and image uploads; read contact-form messages.
- **No database** — posts, uploads and messages are files in the `content/` folder.

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## Settings (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public address of the site, no trailing slash. Used for canonical URLs, the sitemap and Open Graph tags. Rebuild after changing it. |
| `ADMIN_USERNAME` | Admin login name (default `admin`). |
| `ADMIN_PASSWORD` | Admin password, at least 10 characters. Changing it signs everyone out. |
| `SESSION_SECRET` | Random string of 32+ characters used to sign admin sessions. |
| `CONTENT_DIR` | Optional. Where content is stored. Defaults to `./content`. |

Login is disabled until `ADMIN_PASSWORD` and `SESSION_SECRET` are set — there is no default password.

## Writing blog posts

1. Open `/admin` and sign in.
2. **New post** → write the title and the article. The toolbar has headings, bold/italic, lists, quotes, links and images.
3. In the side panel set the URL slug, excerpt, category, tags, cover image and the SEO title / meta description (a search-result preview updates as you type).
4. **Save draft** keeps it private (use **Preview** to check it). **Publish** puts it live immediately; **Update** republishes changes.

Uploaded images are resized to at most 1600px wide, converted to WebP, and stripped of metadata (including GPS location).

Links to hosts listed in `AFFILIATE_HOSTS` (`lib/site.ts`) automatically get `rel="sponsored nofollow"`.

## Where content lives

```
content/
  posts/      one JSON file per post (drafts and published)
  uploads/    images uploaded through the editor
  messages/   contact-form messages (git-ignored: they contain personal data)
```

**Back up this folder.** It is the whole CMS. Commit `content/posts` and `content/uploads` to git, or copy the folder regularly.

## Hosting

The admin panel writes to disk, so the site needs a **Node.js server with a persistent filesystem** — a VPS, a Node hosting plan, or a container with a mounted volume (point `CONTENT_DIR` at the volume).

On serverless hosts with a read-only filesystem (for example Vercel), the public site works with the posts that were committed at build time, but saving from `/admin` will fail. To edit there, run the admin locally, commit `content/`, and redeploy — or replace the functions in `lib/storage.ts` with a database.

Serve the site over HTTPS in production.

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
app/uploads/       serves uploaded images
components/        UI components (components/admin = editor)
lib/               content storage, auth, sanitizing, SEO helpers, server actions
proxy.ts           redirects signed-out visitors away from /admin
legacy-static/     the original single-file landing page, kept for reference
```

This project uses Next.js 16 with Cache Components. Some conventions differ from older Next.js versions — see `AGENTS.md` and the docs bundled in `node_modules/next/dist/docs/`.
