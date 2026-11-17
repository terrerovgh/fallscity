# Falls City Dev Studio · fallscity.dev

Minimalist landing page for the studio: websites, SEO, hosting and business tools for tattoo artists, barbershops and beauty salons. It shows real projects (desktop and phone screenshots) and explains each service. No public prices; contact is by email (`info@fallscity.dev`).

Static Astro 7 and hand-written CSS, served by a small Cloudflare Worker (`worker/index.ts`). The only client JavaScript is the contact form, which is rendered only when it is configured. English at `/`, Spanish at `/es/`.

## Commands

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm test           # astro check + build + Worker tests (scripts/test-worker.mjs) + Playwright/Axe checks (scripts/test-ui.mjs)
npm run test:worker   # Worker only: mocked unit tests, then a wrangler dev smoke test over dist/
npm run capture    # retake the screenshots of the client sites
node scripts/shoot.mjs http://localhost:4321   # full-page review captures in artifacts/qa/
node scripts/og.mjs http://localhost:4321      # regenerate public/og.jpg from the hero
```

Playwright uses the browsers in `~/.cache/ms-playwright` (`npx playwright install chromium` on a new machine).

## Content

Everything visible is in `src/data/site.ts` as `{ en, es }`: projects, services, process steps and interface copy. Components in `src/components/` hold layout only. Do not add invented clients, results, reviews or prices.

### Screenshots
`src/assets/work/<site>-<page>-<desktop|mobile>.jpg`, made by `scripts/capture.mjs` (1440×900 @1.5x and 390×844 @2x). Astro turns them into AVIF/WebP at build time. To add a project: add its pages to `SITES` in the capture script, run it, then add the project to `projects` in `site.ts`.

On 2026-11-17 leeyrealty.com and durafencemetal.com answered Cloudflare error 1000 ("DNS points to prohibited IP"), so their screenshots were taken from local builds of `terrerovgh/leey` and `terrerovgh/durafence`:

```sh
node scripts/capture.mjs --only=leey --base:leey=http://127.0.0.1:5101
```

## Worker

`worker/index.ts` runs in front of the static files (`wrangler.jsonc`: assets in `dist/`, Worker first except `/_astro/*` and `/fonts/*`, `404.html` for unknown paths):

- **Canonical host:** `http://` and `www.` redirect (308) to `https://fallscity.dev`.
- **Old URLs:** pages from the previous site (`/pricing/`, `/work/`, `/contact/`, `/services/…`, trade pages…) redirect (301) to the matching section of the home page; `/sitemap.xml` goes to `/sitemap-index.xml`.
- **Language:** the EN/ES switch links carry `?lang=`, which stores a `lang` cookie. Without it, the cookie or `Accept-Language` picks the language (crawlers are never redirected). `/privacy/` ↔ `/es/privacidad/`.
- **`POST /api/inquiry`:** the contact form. It checks origin, size, fields, a honeypot and the fill time, verifies Turnstile, and emails the message through Resend (reply-to: the sender). Nothing is stored.

## Contact form and environment variables

Same variables as the previous site (see `.env.example`):

| Variable | Where | Purpose |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | build variable | Turnstile widget |
| `PUBLIC_INQUIRY_ENABLED` | build variable | `true` renders the form |
| `TURNSTILE_SECRET_KEY` | Worker secret | Turnstile verification |
| `RESEND_API_KEY` | Worker secret | sends the email |
| `INQUIRY_TO_EMAIL` | Worker secret | where messages arrive |
| `INQUIRY_FROM_EMAIL` | Worker secret | verified Resend sender |

The form is rendered only when both `PUBLIC_*` variables are set at build time; otherwise the contact section shows only the email address, and the privacy page leaves out the form paragraph. Without the four secrets the API answers `503 not_configured`. For local tests with `wrangler dev`, put the secrets in `.dev.vars` (ignored by git). Cloudflare's test keys (`1x00000000000000000000AA` site key) let you see the widget locally.

## Deploy

Cloudflare Worker `falls-city-dev-studio` with static assets, deployed from `main` of `terrerovgh/fallscity`: build `npm run build`, then `npx wrangler deploy` (or `npm run deploy`). `public/_headers` sets security and cache headers.
