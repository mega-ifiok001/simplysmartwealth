# Simply Smart Wealth

The original Stories HTML template migrated to Next.js App Router, React, and TypeScript. Theme CSS and static images are retained; the application renders TSX pages rather than serving the original HTML files.

## Run locally

From `C:\Users\LENOVO\Documents\simplysmartwealth`:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. To use a different port, run `npm run dev -- --port 3100`.

## Production and validation

```bash
npm run build
npm run verify
npm start
```

Development output uses `.next`; local production output uses `.next-production`, allowing a build while the development server is running. `npm start` serves the production build on port 3000 by default. On Vercel the build always targets `.next` (see "Deploying to Vercel" below), because Vercel's Next.js builder collects that directory; `NEXT_DIST_DIR` overrides the directory everywhere.

The verification script checks `href` and `src` references in every generated App Router HTML page against prerendered routes and local files. The explicit `/404` demonstration link is expected to display the not-found page. External URLs and fragment-only links are skipped. This is not a browser, accessibility, image-decoding, CSS-resource, or backend test.

## Deploying to Vercel

Vercel runs `npm install` then `npm run build`. `postinstall` generates the Prisma client, and `build` runs `prisma generate && next build`. No `vercel.json` is required.

### Required environment variables

Set these under Project → Settings → Environment Variables (Production, and Preview if you build previews):

| Variable | Value | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string | Used at runtime. |
| `DIRECT_URL` | Neon **direct** (non-pooled) URL | Used by migrations and `db:backup`. |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Required. Never prefix with `NEXT_PUBLIC_`. |
| `NEXTAUTH_URL` | `https://your-real-domain.com` | **Must be a full `http(s)://` URL. Never leave this variable set to an empty string** — an empty value makes `next-auth/react` throw `TypeError: Invalid URL` (`ERR_INVALID_URL`) while the build prerenders any page that imports the auth client. |
| `APP_URL` | Same as `NEXTAUTH_URL` | Used in verification, reset, and newsletter links. |
| `TRUST_PROXY` | `true` | Correct on Vercel: its edge overwrites `x-forwarded-for`, so per-IP rate limits work instead of collapsing into one shared bucket. |
| `EMAIL_MODE` | `smtp` | `console` only logs messages to the build/runtime log. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | your mail provider | Required for verification, password reset, and newsletter mail. |
| `EMAIL_FROM` | `Simply Smart Wealth <noreply@your-domain.com>` | Must be a domain you are allowed to send from. |
| `CONTACT_NOTIFY_EMAIL` | your inbox | Optional; enables contact-form notifications. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary dashboard | Optional; only needed to upload cover images. |

`NEXTAUTH_URL` is normalized at build time by `next.config.ts` (blank or malformed values are unset so NextAuth can fall back instead of crashing), but set it correctly anyway — it is what NextAuth uses for callback and redirect URLs at runtime.

### First deployment

```bash
npm run db:migrate   # prisma migrate deploy, run against production once
npm run admin:create # creates the first admin; refuses if one already exists
```

### After deployment

- Confirm the Vercel build log contains no `Export encountered an error on /login/page`.
- Sign in at `/admin/login` and confirm the dashboard loads. Reader-account routes (`/login`, `/register`, `/account`, `/forgot-password`, `/auth/*`) no longer exist and 301-redirect.
- Post a comment on a published article and confirm it appears immediately, then confirm Reply opens an inline reply form.
- Run `npm run verify` locally after a production build to re-check generated links.
- `NEXTAUTH_URL` blank, unset-but-required, or missing its scheme is the most common cause of auth redirect loops after a successful deploy.

## Source locations

- `C:\Users\LENOVO\Documents\simplysmartwealth\app`: routes, metadata, global styles, and root layout.
- `C:\Users\LENOVO\Documents\simplysmartwealth\components`: shared layouts and client-side interactions.
- `C:\Users\LENOVO\Documents\simplysmartwealth\public\assets`: theme styles, images, fonts, and retained legacy assets. Legacy template JavaScript is not imported by the application.
- `C:\Users\LENOVO\Documents\simplysmartwealth\scripts`: migration utilities and verification scripts.

Routes include the real blog surface: `/`, `/category`, `/category/[slug]`, `/posts/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, `/search`, `/newsletter/confirm`, `/newsletter/unsubscribe`, and `/admin/*`. The former reader-account routes (`/login`, `/account`, `/register`, `/forgot-password`, `/auth/verify`, `/auth/reset`) were removed and 301-redirect to `/admin/login` or `/`. The original template demo URLs (`/home-2`, `/home-3`, `/single*`, `/category-list`, `/category-grid`, `/category-masonry`, `/category-big`, `/categories/*`, `/author`, `/typography`) no longer exist as pages and 301-redirect to their real equivalents.

## Publishing backend setup (first milestone)

The application now includes a full admin publishing flow: create a draft, attach up to 5 categories, schedule publication by UTC datetime, upload or replace a cover, save revisions automatically, publish or unpublish, and revalidate the affected public pages. The homepage uses saved settings, features selected posts, lists published posts with pagination, and links to the real article and category routes. Contact, About, Privacy, and Terms are settings-backed with a shared public layout. Admin has protected comment review and contact inbox screens; comments publish immediately and can be hidden or deleted.

Use Node.js 24 LTS for the scripts and tests. From `C:\Users\LENOVO\Documents\simplysmartwealth`:

1. Rotate previously shared database and Cloudinary secrets.
2. Copy `C:\Users\LENOVO\Documents\simplysmartwealth\.env.example` to `C:\Users\LENOVO\Documents\simplysmartwealth\.env` and enter replacement values locally.
3. Set `DATABASE_URL` to a Neon development branch's pooled URL and `DIRECT_URL` to its direct URL. Both must refer to the same database. Do not target a production database for first-run testing.
4. Set a randomly generated `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and Cloudinary configuration. No secret should have a `NEXT_PUBLIC_` prefix.
5. Install dependencies and initialize the database explicitly:

```bash
npm ci
npm run db:generate
npm run db:status
npm run db:migrate
npm run admin:create
```

The configured database already has an administrator; do not rerun bootstrap there. The migration instructions above require review for any other database because the current baseline assumes the legacy tables exist. The bootstrap command creates only the first admin and refuses if one exists. Set `ADMIN_EMAIL`, `ADMIN_NAME`, and a strong `ADMIN_PASSWORD` (12+ characters, at most 72 UTF-8 bytes), then remove `ADMIN_PASSWORD` after creation. `npm run admin:password` is an explicit local recovery command for the configured administrator; it is not a public password-reset flow.

```bash
npm run dev
```

Open http://localhost:3000/admin/login. From the dashboard you can create and edit posts, schedule works by UTC datetime, attach categories, upload covers, and publish/unpublish. The dashboard shows published, scheduled, and draft counts and the inbox shows resolved/unresolved filters and pagination. After publishing a post, it appears on the homepage when selected and is reachable from the real public article and category pages. Drafts are not served publicly. Article bodies are plain text, not HTML. Replacement and deleted-post images remain in Cloudinary; orphan cleanup is manual for now. Administrators cannot change their own password from the UI yet; rotate `ADMIN_PASSWORD` in the environment and redeploy instead.

### Public accounts and newsletter

The public site now has a real reader-account system separate from the admin login:

- `/register` creates a reader account (Prisma model `Reader`), emails a 24-hour double-opt-in verification link, and signs in at `/login` using NextAuth's separate `reader` credentials provider. Unverified accounts cannot sign in.
- `/auth/verify?token=…` confirms the email and enables sign-in.
- `/account` (protected) shows the signed-in reader and offers sign-out.
- The footer newsletter form (`Subscriber` model) is a database-backed double-opt-in flow with a 72-hour confirmation link, `/newsletter/confirm` and `/newsletter/unsubscribe` token pages, and honest neutral responses that cannot be used to probe whether an address is subscribed.
- Password reset exists at `/forgot-password` and `/auth/reset`; reset links are single-use, 1-hour tokens (`AuthToken` model, bcrypt-hashed at rest). The flow covers reader accounts only; administrators cannot self-reset yet (change `ADMIN_PASSWORD` in the environment and redeploy to rotate an admin password).
- Contact-form submissions can email the site owner via `CONTACT_NOTIFY_EMAIL`; comment/inbox screens keep working as before.

Reader logins are limited to six attempts per 15 minutes per normalized email; registration, password reset, and newsletter attempts are per-IP limited. Registration, verification, and reset emails are sent through `lib/email.ts`, which uses `nodemailer` with pooled SMTP when `EMAIL_MODE=smtp` and prints messages to the server log in development (`EMAIL_MODE=console`, the default).

### Operations, hardening, and backups

- **Security headers** are applied in `next.config.ts` for every route: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and production-only HSTS.
- **Trusted-proxy handling**: `lib/request-ip.ts` ignores `x-forwarded-for` unless `TRUST_PROXY=true`, in which case the left-most forwarded entry is used for per-IP rate limiting. Without a trusted proxy, per-IP buckets fall back to a shared global bucket so limits always apply. Set `TRUST_PROXY=true` only when your host's proxy overwrites the header.
- **Email**: set `EMAIL_MODE=smtp`, `SMTP_HOST/PORT/USER/PASS`, `EMAIL_FROM`, `NEXTAUTH_URL`/`APP_URL` (public base URL used in links), and optionally `CONTACT_NOTIFY_EMAIL`.
- **Backups**: `node scripts/backup-db.mjs backup [file]` runs `pg_dump` (custom format) against `DIRECT_URL`/`DATABASE_URL`; `node scripts/backup-db.mjs restore <file>` restores with `--clean --if-exists` after a printed warning. Requires the PostgreSQL client tools on PATH and is intended to be scheduled by your host's cron.
- Rate limits apply on all public forms plus admin/reader login. Deployment-level IP/global request limits at the host/CDN are still recommended before exposing the site to the open internet.

### Verification

```bash
npm test
npm run build
npm run test:smoke
npm run verify
```

Unit tests cover validation, settings, pagination, publication rules, and revision scheduling. The credential-free smoke test runs on port 3198. After a production build, `npm run test:live` connects to the configured database and admin credentials on port 3197 and verifies settings-backed pages, a featured/post listing homepage, post create → schedule → revision snapshot → publish → unpublish, real admin login and protected dashboard, authenticated inbox/comment filters and pagination, contact submission through the rendered server action with database persistence and inbox visibility, and a migrated public article. It deletes only its uniquely marked test contact and does not yet test Cloudinary uploads, browser interactions, or manual upload-side verification. The publishing test method is deliberately black-box and form-driven; its result is stored in the logs, but it is not a deterministic guarantee against future change.

Authentication uses an eight-hour JWT session plus an active-admin database check for every protected page/action. Administrators are the only accounts on the site: there is no public sign-up, sign-in, or account recovery, and readers comment anonymously. Admin logins are limited to five attempts per 15 minutes per email, comments to five per 10 minutes per client IP, and contact messages to three per hour per client IP — all through one shared PostgreSQL-backed limiter (the `SubmissionAttempt` table). MFA, additional-admin management, audit history, and richer role management are not included yet. Add deployment-level IP/global rate limits and periodically remove expired `SubmissionAttempt` records before public deployment.

A previous audit reported six advisories; these were resolved by pinning patched transitive versions via npm `overrides` (postcss ^8.5.28, sharp ^0.35.4, deepmerge-ts ^8.0.2). `npm audit` now reports 0 vulnerabilities. Re-run `npm audit` after future dependency changes.

### Comments/contact deployment notes

Public form throttling is per-IP when `TRUST_PROXY=true` and per-global-bucket otherwise, all through one shared PostgreSQL-backed limiter (the `SubmissionAttempt` table); comment forms also carry a hidden honeypot field that silently discards bot submissions. Deploy behind a trusted proxy that overwrites `x-forwarded-for` and applies IP/global request limits; the application limiter alone is not sufficient spam protection. Comments publish immediately with no approval step, so the admin screen is a review tool: unapprove a comment to hide it (it disappears from the article) or delete it permanently. Replies are threaded one level deep; replying to a reply attaches to the same top-level comment, so threads never nest unbounded. Comments and the inbox use 20-item pages with stable newest-first ordering and total counts. Comments filter by all/approved/hidden; messages filter by all/open/resolved/unread. Invalid page numbers fall back safely. Contact submissions can trigger an owner notification email; comment notifications and text search are not implemented. The primary contact page now uses the saved contact email and no longer includes template business details. Policy text must be reviewed by the site owner; empty policy pages explicitly say the policy has not been published and request no indexing.

The configured database has been reconciled and baselined with `20260917020000_baseline_reconcile`. Existing records were preserved: 1 administrator (formerly User), 16 posts, 5 categories, 16 post/category links, 3 contact messages, 13 settings, and 15 subscribers. The migration is a transformation of that legacy schema, **not an empty-database bootstrap**. Do not run it on a fresh database: a portable baseline/initialization path still needs implementation. Do not reset an existing database or edit the applied migration. Use reviewed incremental migrations for subsequent changes.

## Scope and remaining work

- Admins are the only accounts: there is no public registration, sign-in, or password recovery. Newsletter double-opt-in is implemented. Not yet available: MFA, additional-admin management, audit history, richer role management, and per-comment email notifications.
- Many navigation links remain standard anchors. A complete `next/link` conversion and centralized post-data model have not been implemented.
- Icons on some pages load Ionicons from a third-party CDN.
- Full browser testing of mobile navigation, overlays, sliders, theme persistence, and visual fidelity remains necessary.
- Migration generators depend on original HTML or temporary extraction files that are no longer in the working tree. They are historical utilities, not part of the build. Do not rerun `npm run convert` on the current app; edit the TSX source directly. Original files remain available in Git history.
- Review framework/dependency security updates before public deployment; a successful build is not a dependency security audit. `npm audit` reported 0 vulnerabilities at the time of the last dependency change.
