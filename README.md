# Falls City Dev Studio

The official marketing website for Falls City Dev Studio, a Louisville-based web design and development studio. The production canonical URL is `https://fallscity.dev`.

**Current status:** implemented and buildable locally; not deployed. The inquiry form is deliberately disabled until its providers are configured.

## Stack

- Astro 7 with static output
- Strict TypeScript and `astro check`
- Modern custom CSS with reusable design tokens
- Self-hosted Fraunces and Public Sans variable fonts
- Cloudflare Pages Functions for the inquiry endpoint
- Cloudflare Turnstile for spam protection
- Resend's HTTPS API for inquiry delivery

There is no React runtime, CMS, database, analytics package, or client-side framework. The JavaScript enhancements are mobile navigation, inline form submission, and the homepage's 3D logo mark.

### Portfolio

The "Selected work" section (`/#work`) lists every live site with a screenshot, a short description, and a link. On phones (≤620px) it becomes a horizontal swipe carousel, and each card also shows the site's real mobile homepage. Entries live in `src/data/portfolio.ts`; screenshots (desktop 1440×900, mobile 390×844) live in `src/assets/portfolio/` and are converted by Astro into responsive AVIF/WebP at build time. To add or refresh a site, capture new screenshots at those sizes, save them as WebP in that folder, and update the data file.

### 3D logo mark

The homepage hero renders the official logo mark in 3D with Three.js (`src/scripts/logo3d.ts`). It is built from `src/data/logo-mark.ts`, generated from the traced official logo (`public/brand/fallscity-logo.svg`). The static SVG mark (`public/brand/fallscity-mark.svg`) is the poster and fallback: the scene is lazy-loaded after first paint, starts flat and pixel-aligned with that poster, then rises into a shallow relief: the three building silhouettes step out of the page (tallest at the back, smallest in front), each waterfall sits just proud of the building it pours from, and depth comes from fine inward chamfers and soft shadows cast onto the page. After the rise only the water moves: fine threads that lengthen as they fall, and a thin highlight tracing each fall's lip. It is skipped when WebGL is unavailable or Save-Data is on, renders a single static frame under `prefers-reduced-motion`, and pauses while off-screen or in a hidden tab. Front faces are unlit so the brand colors (`#0d1927`, `#0096b8`) render exactly, and each piece's sides are tinted to its front color until it extrudes. The poster's CSS width must match `FRAME_PX` in `logo3d.ts`.

## Local development

Requirements: a current Node.js release supported by Astro 7 and npm.

```sh
npm install
npm run dev
```

Astro serves the local site at the URL printed in the terminal. Other commands:

```sh
npm run check    # TypeScript and Astro diagnostics
npm run build    # Production output in dist/
npm run preview  # Serve the static production build
```

`astro dev` and `astro preview` do not execute Cloudflare Pages Functions. Use Wrangler's Pages development server when testing the inquiry endpoint locally.

## Project structure

```text
src/
  components/       Shared UI, metadata, navigation, and form components
  config/site.ts    Business identity, production URL, navigation, public form key
  data/             Service, process, and FAQ content
  layouts/          Global HTML layout
  lib/seo.ts        Structured-data ids and helpers
  pages/            Static routes (services/ holds the hub and one page per service)
  styles/           Global design system and responsive styles
functions/
  api/inquiry.ts    Cloudflare Pages inquiry endpoint
public/             Favicon, social-sharing images, robots.txt, and Cloudflare _headers
scripts/
  seo-audit.mjs     Static SEO checks over dist/
docs/
  SEO_LOUISVILLE.md SEO audit, keyword map, ledger, and owner checklist
```

## Inquiry form configuration

The form collects only the name, email, optional business name, service selection, project details, privacy consent, and anti-spam fields. It does not use a website database. Both browser and server validation are implemented. A successful response is returned only after Turnstile verification and accepted delivery by Resend.

### 1. Turnstile

Create a Cloudflare Turnstile widget for the hostnames that will serve the form. Add the public site key to the build environment:

```text
PUBLIC_TURNSTILE_SITE_KEY=your_public_site_key
```

Add the secret only to the server environment:

```text
TURNSTILE_SECRET_KEY=your_server_secret
```

Without a public site key, the form renders disabled with an explicit configuration notice. Without the remaining server variables, the endpoint returns HTTP 503 and never claims success.

### 2. Resend

Verify a sending identity/domain in Resend, create a restricted API key, and choose the real recipient for project inquiries. Configure:

```text
RESEND_API_KEY=your_server_api_key
INQUIRY_TO_EMAIL=verified_recipient@example.com
INQUIRY_FROM_EMAIL=Website Inquiries <inquiries@your-verified-domain.example>
```

The `INQUIRY_FROM_EMAIL` value must be a valid sender authorized by Resend. `INQUIRY_TO_EMAIL` is not displayed publicly.

`.env.example` lists all variables without credentials. For local builds, place the public variable in `.env`. For local Pages Functions, use Wrangler's supported local secret mechanism, such as `.dev.vars`, or explicitly supplied environment variables. Never commit real values.

### 3. Local endpoint verification

After building, run Wrangler against `dist/` using its current documented command:

```sh
npx wrangler pages dev dist
```

Send valid and invalid requests to `/api/inquiry` and inspect the responses. A complete end-to-end delivery test requires working provider credentials and a test Turnstile token. Local static preview alone is not a valid form test.

## Deployment

Recommended target: Cloudflare Pages, with the `functions/` directory retained at the project root.

1. Create a Pages project connected to this repository or use an authorized direct-upload workflow.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Use a Node.js version supported by the installed Astro release.
4. Set `PUBLIC_TURNSTILE_SITE_KEY` in the build environment and all server variables in the Pages project environment. Configure production and preview values deliberately.
5. Deploy a private/review preview and verify every page, the mobile menu, and real form delivery before connecting the production domain.
6. After explicit authorization, connect `fallscity.dev`, configure the apex/www redirect policy, and verify HTTPS. `.dev` requires HTTPS.
7. Verify that the canonical URL and sitemap use `https://fallscity.dev`.

No deployment, DNS change, paid service connection, or external account setup has been performed by this implementation.

## SEO and content

`docs/SEO_LOUISVILLE.md` is the SEO record: audit, keyword-to-URL map, change ledger, validation results, owner checklist, and roadmap.

- `src/components/SEO.astro` generates canonical, Open Graph, Twitter, robots, and JSON-LD metadata. Organization and WebSite are emitted on `/` only; other pages reference them by `@id` (`src/lib/seo.ts`) and add WebPage, BreadcrumbList, and (on service pages) Service. `noindex` pages get no canonical or JSON-LD.
- `@astrojs/sitemap` generates the sitemap; `astro.config.mjs` filters out noindex pages (currently the draft `/privacy/`, controlled by `privacyIsDraft` in `src/config/site.ts`). `public/robots.txt` references `https://fallscity.dev/sitemap-index.xml`.
- `public/_headers` (Cloudflare Pages) sends `X-Robots-Tag: noindex` on `*.pages.dev` hostnames and long-lived caching for `/_astro/*`.
- `npm run audit:seo` checks the built `dist/` (titles, descriptions, canonicals, H1s, JSON-LD, links, fragments, alt attributes, sitemap, robots). `npm test` runs check, build, and the audit.

Structured data includes only the business name, URL, logo, Louisville service area, and offered services. Do not add addresses, ratings, reviews, hours, phone numbers, or email addresses unless the owner has verified them; the audit fails on those properties until its banned list is deliberately updated. FAQPage markup is not used (Google removed FAQ rich results in 2026); FAQs stay visible on the page.

Customer-facing copy must remain focused on website design/development, SEO foundations, domains/hosting/SSL, and maintenance. Do not invent pricing, rankings, clients, testimonials, achievements, biographies, or service guarantees.

## Launch checklist

- [ ] Owner reviews all copy and confirms the Falls City Dev Studio name and domain are approved for use.
- [ ] Owner/legal reviewer finalizes `src/pages/privacy.astro`; replace draft language and add a verified privacy contact method and effective date. Then set `privacyIsDraft = false` and remove `/privacy/` from the sitemap exclusion in `astro.config.mjs`.
- [ ] Configure and test Turnstile, Resend, sender identity, and real inquiry recipient.
- [ ] Submit a genuine test inquiry on the deployed preview and verify receipt, error handling, and spam protection.
- [ ] Run `npm test` (check, build, SEO audit) with no errors.
- [ ] Run link, keyboard, responsive, accessibility, and Lighthouse checks on the final deployed preview.
- [ ] Review social-sharing image, favicon, page titles, descriptions, canonicals, structured data, sitemap, and robots.txt.
- [ ] Obtain explicit authorization before deployment, DNS changes, or paid services.
- [ ] Connect `fallscity.dev`, verify HTTPS and redirects, and test the live inquiry path.
- [ ] Verify Search Console ownership and submit `https://fallscity.dev/sitemap-index.xml`.
- [ ] Establish maintenance, provider-key rotation, inquiry retention, and backup responsibilities.
