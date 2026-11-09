# Falls City Dev Studio

Official marketing website for Falls City Dev Studio, a Louisville web design and development studio. The canonical production origin is `https://fallscity.dev`.

## Technology

- Astro 7 with static output and strict TypeScript
- Custom responsive CSS and self-hosted variable fonts
- Cloudflare Worker for language routing and project inquiries
- Cloudflare Turnstile and Resend for spam protection and delivery
- Three.js for the optional homepage logo enhancement

No client-side application framework, CMS, database, or analytics runtime is used.

## Local development

Requirements: a Node.js release supported by Astro 7 and npm.

```sh
npm install
npm run dev
```

Available commands:

```sh
npm run check      # Astro and TypeScript diagnostics
npm run build      # Production build in dist/
npm run preview    # Serve the static production build
npm run audit:seo  # Validate the generated HTML in dist/
npm test           # Check, build, and SEO audit
```

Astro's development and preview servers do not run the Worker. Test language redirects and the inquiry endpoint through Wrangler after a build:

```sh
npm run build && npx wrangler dev
```

## Project structure

```text
src/
  assets/          Brand source files, skyline SVG, and portfolio screenshots
  components/      Shared UI, navigation, metadata, and form components
  config/          Business identity and public runtime configuration
  data/            Services, process, FAQs, portfolio (in both languages), and logo geometry
  i18n/            Language helpers, routing, and shared interface strings
  layouts/         Global page layout
  lib/             SEO helpers
  pages/           Static routes
  scripts/         Optional 3D logo enhancement
  styles/          Design tokens and global responsive styles
worker/            Cloudflare Worker: canonical host, language redirects, inquiry endpoint
public/            Public brand assets, favicons, robots.txt, and headers
scripts/           SVG generator and static SEO audit
```

## Environment configuration

Copy `.env.example` to a local environment file and provide only the values needed for the environment. Never commit real credentials.

- `PUBLIC_TURNSTILE_SITE_KEY`: intentionally public browser key.
- `TURNSTILE_SECRET_KEY`: server-only Turnstile secret.
- `RESEND_API_KEY`: server-only Resend key.
- `INQUIRY_TO_EMAIL`: private inquiry recipient.
- `INQUIRY_FROM_EMAIL`: verified Resend sender.

Without a public Turnstile key, the form stays disabled with a visible configuration notice. The endpoint returns success only after server validation, Turnstile verification, and confirmed delivery.

## Artwork

The homepage logo uses `src/data/logo-mark.ts` and `src/scripts/logo3d.ts`, with `public/brand/fallscity-mark.svg` as its static fallback. The enhancement is lazy-loaded and respects WebGL availability, Save-Data, page visibility, and reduced motion.

The Louisville riverfront is a hand-drawn SVG without lettering. It appears in the mobile/tablet navbar, the desktop homepage hero, and the footer. Edit its generator rather than the generated file:

```sh
python3 scripts/louisville-skyline.py src/assets/brand/louisville-skyline.svg
```

The generator uses only Python's standard library. Keep its `583 × 115` viewBox synchronized with the skyline proportions in `src/styles/global.css`.

Portfolio entries live in `src/data/portfolio.ts`. Their real desktop and mobile screenshots live in `src/assets/portfolio/`; Astro generates responsive AVIF/WebP variants during the build.

## Deployment

Production runs as a Cloudflare Worker with static assets, built by Workers Builds from this repository and configured in `wrangler.jsonc`:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Static assets: `dist/`, served through `worker/index.ts` (pages and `/api/*`); `/_astro/*` and `/brand/*` are served directly
- Server variables and secrets are set in the Cloudflare dashboard and kept across deploys (`keep_vars`)
- Production origin: `https://fallscity.dev`

Configure public and server environment variables separately for preview and production. Verify real inquiry delivery before enabling the form publicly.

## Content and SEO

The site is bilingual. Every page is generated in English (at the root) and Spanish (under `/es/`) from `src/pages/[...lang]/`; page copy lives beside the markup as `{ en, es }` objects, shared interface strings in `src/i18n/index.ts`, and both languages of the services, process, FAQ, and portfolio data in `src/data/`. Each indexable page declares reciprocal hreflang alternates, the sitemap includes them, and the SEO audit validates them.

Visitors are sent to their language by `worker/language.ts`: an explicit choice from the EN/ES switcher (stored in a `lang` cookie) wins, otherwise the browser's `Accept-Language` decides. Crawlers and requests without a language preference are served the URL they asked for, so both versions can be indexed. The off-site local SEO checklist (Search Console, Google Business Profile, citations, reviews) lives in the owner's private knowledge base, outside this repository.

Each indexable page owns one search intent and has unique metadata. Internal links use trailing slashes. Organization and WebSite structured data are emitted only on the homepage; other pages use the appropriate page and breadcrumb types.

The sitemap excludes noindex pages. `/privacy/` remains a visible draft and is excluded until owner/legal review is complete and `privacyIsDraft` in `src/config/site.ts` is updated together with `astro.config.mjs`.

Public copy must stay factual and focused on website design/development, SEO foundations, domains/hosting/SSL, and maintenance. Do not add unverified prices, testimonials, rankings, contact details, or guarantees.
