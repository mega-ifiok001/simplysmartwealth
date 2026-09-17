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

Development output uses `.next`; production output uses `.next-production`, allowing a build while the development server is running. `npm start` serves the production build on port 3000 by default.

The verification script checks `href` and `src` references in every generated App Router HTML page against prerendered routes and local files. The explicit `/404` demonstration link is expected to display the not-found page. External URLs and fragment-only links are skipped. This is not a browser, accessibility, image-decoding, CSS-resource, or backend test.

## Source locations

- `C:\Users\LENOVO\Documents\simplysmartwealth\app`: routes, metadata, global styles, and root layout.
- `C:\Users\LENOVO\Documents\simplysmartwealth\components`: shared layouts and client-side interactions.
- `C:\Users\LENOVO\Documents\simplysmartwealth\public\assets`: theme styles, images, fonts, and retained legacy assets. Legacy template JavaScript is not imported by the application.
- `C:\Users\LENOVO\Documents\simplysmartwealth\scripts`: migration utilities and verification scripts.

Routes include `/`, `/home-2`, `/home-3`, category and article layout variants, `/about`, `/author`, `/contact`, `/login`, `/register`, `/search`, and `/typography`.

## Publishing backend setup (first milestone)

The application now includes a full admin publishing flow: create a draft, attach up to 5 categories, schedule publication by UTC datetime, upload or replace a cover, save revisions automatically, publish or unpublish, and revalidate the affected public pages. The homepage uses saved settings, features selected posts, lists published posts with pagination, and links to the real article and category routes. Contact, About, Privacy, and Terms are settings-backed with a shared public layout. Admin has protected comment moderation and contact inbox screens.

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

Open http://localhost:3000/admin/login. From the dashboard you can create and edit posts, schedule works by UTC datetime, attach categories, upload covers, and publish/unpublish. The dashboard shows published, scheduled, and draft counts and the inbox shows resolved/unresolved filters and pagination. After publishing a post, it appears on the homepage when selected and is reachable from the real public article and category pages. Drafts are not served publicly. Article bodies are plain text, not HTML. Replacement and deleted-post images remain in Cloudinary; orphan cleanup is manual for now. A previous run left the configured administrator unable to change its own password; that workflow is not yet available.

### Verification

```bash
npm test
npm run build
npm run test:smoke
npm run verify
```

Unit tests cover validation, settings, pagination, publication rules, and revision scheduling. The credential-free smoke test runs on port 3198. After a production build, `npm run test:live` connects to the configured database and admin credentials on port 3197 and verifies settings-backed pages, a featured/post listing homepage, post create → schedule → revision snapshot → publish → unpublish, real admin login and protected dashboard, authenticated inbox/comment filters and pagination, contact submission through the rendered server action with database persistence and inbox visibility, and a migrated public article. It deletes only its uniquely marked test contact and does not yet test Cloudinary uploads, browser interactions, or manual upload-side verification. The publishing test method is deliberately black-box and form-driven; its result is stored in the logs, but it is not a deterministic guarantee against future change.

Authentication uses an eight-hour JWT session plus an active-admin database check for every protected page/action. Logins are limited to five attempts per 15 minutes per normalized email, comments to five per 10 minutes per client IP, and contact messages to three per hour per client IP — all through one shared PostgreSQL-backed limiter (the `SubmissionAttempt` table). Add deployment-level IP/global rate limits and periodically remove expired `SubmissionAttempt` records before public deployment. Account recovery, MFA, additional-admin management, audit history, and richer role management are not included yet.

A previous audit reported six advisories; these were resolved by pinning patched transitive versions via npm `overrides` (postcss ^8.5.28, sharp ^0.35.4, deepmerge-ts ^8.0.2). `npm audit` now reports 0 vulnerabilities. Re-run `npm audit` after future dependency changes.

### Comments/contact deployment notes

Public form throttling currently uses `x-forwarded-for` when present and is skipped when that header is absent. Deploy behind a trusted proxy that overwrites this header and applies IP/global request limits; the application limiter alone is not sufficient spam protection. Moderation defaults to unapproved. Comment moderation and the inbox now use 20-item pages with stable newest-first ordering and total counts. Comments filter by pending/approved; messages filter by all/open/resolved/unread. Invalid page numbers fall back safely. Email notifications, text search, and deletion confirmations are not implemented yet. The primary contact page now uses the saved contact email and no longer includes template business details. Policy text must be reviewed by the site owner; empty policy pages explicitly say the policy has not been published and request no indexing.

The configured database has been reconciled and baselined with `20260917020000_baseline_reconcile`. Existing records were preserved: 1 administrator (formerly User), 16 posts, 5 categories, 16 post/category links, 3 contact messages, 13 settings, and 15 subscribers. The migration is a transformation of that legacy schema, **not an empty-database bootstrap**. Do not run it on a fresh database: a portable baseline/initialization path still needs implementation. Do not reset an existing database or edit the applied migration. Use reviewed incremental migrations for subsequent changes.

## Scope and remaining work

- Public `/login` and `/register` and newsletter signup remain template UI, not backend integrations. Comments and the contact form are database-backed with moderation and inbox screens in the admin. Admin authentication is separate at `/admin/login`; do not enter admin credentials into the demo forms. Search and category browsing are database-backed.
- Many navigation links remain standard anchors. A complete `next/link` conversion and centralized post-data model have not been implemented.
- Icons on some pages load Ionicons from a third-party CDN.
- Full browser testing of mobile navigation, overlays, sliders, theme persistence, and visual fidelity remains necessary.
- Migration generators depend on original HTML or temporary extraction files that are no longer in the working tree. They are historical utilities, not part of the build. Do not rerun `npm run convert` on the current app; edit the TSX source directly. Original files remain available in Git history.
- Review framework/dependency security updates before public deployment; a successful build is not a dependency security audit.
