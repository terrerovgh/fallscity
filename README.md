# Falls City Dev Studio · fallscity.dev

Bilingual site for Falls City Dev Studio, featuring real client projects in desktop and mobile previews, a benefits carousel, and a contact form for project proposals.

Astro prerenders the pages in English at `/` and Spanish at `/es/`. React Bits supplies the visual effects and GSAP ScrollTrigger animates the headings, diagrams, process timeline and portfolio screens. The portfolio and benefits carousels advance in view and pause on hover, keyboard focus or touch. Their slides are available with native scrolling in reduced motion. The hero ribbon uses the blue artwork extracted from the original logo.

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

Bilingual page copy and illustration labels are maintained in `src/data/site.ts`. The site follows local time, with the light theme from 07:00 through 18:59 and the dark theme at night. The default without JavaScript is light.

React Bits components and their license live in `src/components/react-bits/`. The optional React Bits Starter registry requires `REACTBITS_LICENSE_KEY` for future component installation. The production build has no dependency on Starter credentials.

### Service and process illustrations

The twelve editorial illustrations live in `src/assets/illustrations/`. Astro serves responsive AVIF and WebP versions. Service labels stay in HTML so they can be localized, and the illustrations render before their scroll effects start.

### Screenshots
`src/assets/work/<site>-<page>-<desktop|mobile>.jpg`, made by `scripts/capture.mjs` (1440×900 @1.5x and 390×844 @2x). Astro turns them into AVIF/WebP at build time. To add a project: add its pages to `SITES` in the capture script, run it, then add the project to `projects` in `site.ts`.

On 2026-11-17 leeyrealty.com and durafencemetal.com answered Cloudflare error 1000 ("DNS points to prohibited IP"), so their screenshots were taken from local builds of `terrerovgh/leey` and `terrerovgh/durafence`:

```sh
node scripts/capture.mjs --only=leey --base:leey=http://127.0.0.1:5101
```

## Worker

`worker/index.ts` runs in front of the static files (`wrangler.jsonc`: Worker `fallscity`, assets in `dist/`, Worker first except `/_astro/*` and `/fonts/*`, `404.html` for unknown paths, `keep_vars` so dashboard variables survive deploys):

- **Canonical host:** `http://` and `www.` redirect (308) to `https://fallscity.dev`.
- **Old URLs:** pages from the previous site (`/pricing/`, `/work/`, `/contact/`, `/services/…`, trade pages…) redirect (301) to the matching section of the home page; `/sitemap.xml` goes to `/sitemap-index.xml`.
- **Language:** the EN/ES switch links carry `?lang=`, which stores a `lang` cookie. Without it, the cookie or `Accept-Language` picks the language (crawlers are never redirected). `/privacy/` ↔ `/es/privacidad/`.
- **`GET /api/inquiry/config`:** `{ enabled, siteKey }`. `enabled` is true only when all four secrets are set (and `PUBLIC_INQUIRY_ENABLED` is not `false`).
- **`POST /api/inquiry`:** checks origin, size, fields, a honeypot and the fill time, verifies Turnstile, and emails the message through Resend (reply-to: the sender). Nothing is stored.
- **Search engines:** serves `/google684d937ef0685901.html` (Search Console); `public/BingSiteAuth.xml` and the `msvalidate.01` meta on the home pages cover Bing.

## Contact form

`Contact.astro` always shows the email link. The form is rendered hidden; `src/scripts/inquiry.ts` asks `/api/inquiry/config` and shows it only if delivery works, then renders Turnstile (`interaction-only`), validates each field in place (EN/ES messages), counts characters, keeps an unsent draft in `localStorage`, and on success shows a confirmation and pushes `generate_lead` to the GTM `dataLayer`. If sending fails, it offers an email link with the message prefilled.

### Variables (runtime, on the Worker)

Set them in Cloudflare > Workers > **fallscity** > Settings > Variables and Secrets (not build variables: those don't reach the Worker). Locally, use `.dev.vars`. See `.env.example`.

| Variable | Type | Purpose |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | text | Turnstile widget key (public) |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile verification |
| `RESEND_API_KEY` | secret | sends the email |
| `INQUIRY_TO_EMAIL` | secret | where messages arrive |
| `INQUIRY_FROM_EMAIL` | secret | verified Resend sender, e.g. `Falls City <web@fallscity.dev>` |
| `PUBLIC_INQUIRY_ENABLED` | text, optional | `false` hides the form |

```sh
npx wrangler secret put RESEND_API_KEY      # prompts for the value; same for the other secrets
```

A `PUBLIC_TURNSTILE_SITE_KEY` build variable still works as a fallback for the key.

## Analytics

Google Tag Manager `GTM-WFTPCFT4` loads only on `fallscity.dev` (not previews or localhost). The privacy page describes it.

## Deploy

Workers Builds deploys `main` of `terrerovgh/fallscity` to the `fallscity` Worker (build `npm run build`, then `wrangler deploy`). Manual: `npm run deploy`. `public/_headers` sets security and cache headers.
