# Duta Teknik Salatiga — project context

Rebuild of the expired WordPress site alattekniksalatiga.com (toko alat teknik, besi & safety di Salatiga).
The original WordPress + SQL zips in the repo root are the only source material (git- and vercel-ignored).
Talk to the owner in Bahasa Indonesia.

## Stack & layout

- `web/` — Next.js 16 (App Router, Turbopack, `cacheComponents`, Tailwind v4). See `web/AGENTS.md`:
  read `web/node_modules/next/dist/docs/` before writing Next.js code.
- `studio/` — standalone Sanity Studio v6 (project `v7qqo7r0`, dataset `production`), served at `/admin`.
  `sanity.cli.ts` sets `project.basePath: '/admin'` (do NOT also set basePath in `sanity.config.ts` → `/admin/admin` bug).
- Node via nvm: prefix commands with `export PATH=~/.nvm/versions/node/v24.14.0/bin:$PATH`.

## How it fits together

- All content (55 products, 3 categories, home/about/settings singletons) lives in Sanity. Fetchers in
  `web/src/sanity/fetch.ts` use `'use cache'` + `cacheLife("max")` and tag `sanity-content`.
- Publish in Studio → Sanity webhook → `web/src/app/api/revalidate` → `revalidateTag` (live in ~5 s).
  Webhook id `IRrzDtODu0r3zvEi`; secret is in Vercel env `SANITY_REVALIDATE_SECRET`.
- `web` build runs `build:admin` first (builds Studio into `web/public/admin`, ignored), then `next build`.
  Next fallback rewrites `/admin/*` → `/admin/index.html`.
- Old WordPress URLs are 308-redirected in `web/next.config.ts`.
- Types: `cd studio && npm run typegen` → `web/sanity.types.ts`.
- `studio/scripts/import-wordpress.ts` was the one-off import; it needs the deleted `web/src/data` JSON
  (regenerate with `web/scripts/wp-import/`) before re-running.

## Deploy & accounts

- Vercel project `alattekniksalatiga` (team "Arif Hidyawan's projects", CLI user `revelationsoft`),
  Root Directory `web`, `sourceFilesOutsideRootDirectory` on. Live: https://alattekniksalatiga.vercel.app
  (admin: /admin). Deploys so far were via `vercel --prod` CLI.
  Since 2026-10-12 `vercel --prod` fails with "Not authorized" (logged in as `revelationsoft`, link OK).
  Unverified guess: Hobby plan rejects deploys whose latest commit author email (`hello@arifhidyawan.com`,
  commit 277b539) isn't on the Vercel account. Content-only changes (Sanity) don't need a deploy.
- GitHub: https://github.com/arifhdev/alattekniksalatiga (`main`). Local git pushes as `arif-hidyawan`
  (collaborator) over HTTPS.
- Sanity: only member is "Revelation Soft Indonesia" (Administrator, Google login). New editors are invited
  via sanity.io/manage → Members (email + password signup works). CORS already includes the vercel.app
  domain, localhost:3000/3100/3333, and alattekniksalatiga.com (+www).

## Status / next steps (as of 2026-10-12)

- [ ] Fix Vercel CLI deploy "Not authorized" (see Deploy & accounts) before the next code change.
- [ ] Connect GitHub repo to Vercel for auto-deploy (`vercel git connect`; Vercel account `revelationsoft`
      needs GitHub App access to `arifhdev/alattekniksalatiga`).
- [ ] Owner to test login at /admin and a publish.
- [ ] 5 products have no photo (Alderon, Spandek Pasir, SolarFlat, Scaffolding, Baby Roller) — upload via admin.
- [ ] Suggest adding a second Sanity Administrator as backup.
- [ ] Later: custom domain alattekniksalatiga.com → add in Vercel, update webhook URL, update `siteUrl` in
      `web/src/lib/site.ts` if needed.
- Done 2026-10-12: WhatsApp 0878-1375-5756 added as main (Customer Service 1; first array item = main number
      everywhere). Product "Pipa HDPE" (`/produk/pipa-hdpe`, Teknik) added with Wikimedia Commons CC BY-SA photos —
      credit line at end of body; owner should verify specs/stock and may swap in own photos.
- Decided: stay on Sanity (owner asked about Supabase; not worth rebuilding admin unless customer
  accounts/orders/stock are needed).
