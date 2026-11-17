# Falls City Dev Studio · fallscity.dev

Minimalist landing page for the studio: websites, SEO, hosting and business tools for tattoo artists, barbershops and beauty salons. It shows real projects (desktop and phone screenshots) and explains each service. No public prices; contact is by email (`info@fallscity.dev`).

Static Astro 7, hand-written CSS, no client JavaScript. English at `/`, Spanish at `/es/`.

## Commands

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm test           # astro check + build + Playwright/Axe checks (scripts/test-ui.mjs)
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

## Deploy (not done yet)

Intended for Cloudflare Pages: build command `npm run build`, output `dist`, Node 22+. `public/_headers` sets security and cache headers. fallscity.dev currently serves the older site from `terrerovgh/fallscity`; switching it over is a deliberate step.
