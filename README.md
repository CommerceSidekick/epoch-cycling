# epochcycling.com

The riding tribe of Epoch Health System. Ride. Fuel. Optimize.

Built to `EPOCH_CYCLING` website spec v1.0 (2026-11-15) with the owner's 2026-11-16 additions:
Optimize now explains the three Epoch Total Health services (AI Health System, Personal Coaching,
EpochEdge), with EpochEdge described generically and handed off to epochhealthsystem.com.

## Stack

- Astro 7 (static output) + Tailwind CSS 4 + TypeScript strict
- Vercel adapter (`@astrojs/vercel`) for the two on-demand routes: `POST /api/forms` and `/thanks`
- Forms land in Supabase (`form_submissions` table) and/or a signed webhook
- Self-hosted fonts (Archivo variable, Barlow, JetBrains Mono), no third-party scripts by default

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:4321 (style guide at `/dev/styleguide`) |
| `npm run build` | Brand assets, Astro build, Vercel post-build (headers, domain redirects, CSP hashes), copy checks in preview mode |
| `npm run build:strict` | Same, but copy checks run in launch mode: placeholders, PENDING claims and unapproved snippets fail the build |
| `npm run check:copy` | Re-run checks C1 to C13 against the last build |
| `npm run check:links` | Internal link check of the last build (plus the three anti-doping URLs) |
| `npm run og` | Re-render the Open Graph images in `public/og/` (needs Playwright locally) |

## Environment variables (Vercel project settings)

| Name | Required | Notes |
|---|---|---|
| `SUPABASE_URL` | one sink required in production | e.g. `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | with `SUPABASE_URL` | server only, never `PUBLIC_` |
| `FORM_WEBHOOK_URL` | optional second sink | CRM, email service or automation |
| `FORM_WEBHOOK_SECRET` | with webhook | HMAC-SHA256 of the body in `X-Epoch-Signature` |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | recommended | Cloudflare Turnstile; honeypot is always on |
| `PUBLIC_ANALYTICS_DOMAIN` | optional | cookieless Plausible-compatible analytics |

Create the table with `supabase/migrations/20261116000000_form_submissions.sql` (RLS on, no public policies;
only the service role writes). In production (`VERCEL_ENV=production`) the form API returns 503 if no sink is set.

## Where things live

- `src/config/brand.ts`, `src/config/site.ts`, `src/config/integrations.ts`: every name, URL, price, Riders Club
  number and feature flag. Empty strings render as visible `[bracketed]` placeholders with `data-placeholder`.
- `src/content/snippets/`: all clinical-adjacent copy (handoff block, handoff page, anti-doping notes, labs small
  print, Total Health services, EpochEdge). Each has `counselApproved: false` until healthcare counsel signs off (L8).
- `src/content/faq.ts`: 21 FAQ entries in 7 groups, stable ids.
- `src/content/{products,kit,stories,events,riders,legal}`: typed collections (`src/content.config.ts`).
  No riders and no events ship at launch; empty states render.
- `scripts/check-copy.mjs`: checks C1 to C13 (dashes, banned words, clinical terms, restricted-term allowlist,
  tokens, legacy names, prices near medical words, placeholders, event waivers, exclamation points, signature line,
  clinical domain, snippet approval).
- `redirects.config.mjs`: path redirects (spec 4.2). Domain redirects and security headers: `scripts/vercel-postbuild.mjs`.

## Domains (Vercel)

1. Add `epochcycling.com` as the production domain and `www.epochcycling.com` (redirected to apex).
2. Add `epochmtb.com` and `www.epochmtb.com` to the same project. The post-build routes send both to
   `https://epochcycling.com/mtb` with a 301.
3. After DNS is live, verify: `curl -sI https://epochmtb.com/?utm_source=ig` should return 301 to `/mtb`
   with the query string kept.

## Before launch

See spec section 7.9 (L1 to L19). The build is deliberately honest until then: placeholders are visible,
GMP/testing/certification lines stay hidden, Strava and Garmin say PLANNED, rider and event sections show
empty states, legal pages are `noindex` drafts, and `npm run build:strict` lists everything still open.
