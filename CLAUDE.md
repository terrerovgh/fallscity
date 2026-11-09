# AGENTS.md

## Project

Business context (clients, offer, pricing, process) lives in the private knowledge base, which is kept locally next to this repository as `../fallscity-knowledge/` and is never committed here: see `../fallscity-knowledge/00-README.md` and `../fallscity-knowledge/AGENTS.md`. Never copy anything from `../fallscity-knowledge/07-referencia/` into the site.

This repository (checked out locally as `web/`) contains the Falls City Dev Studio marketing website. It is an Astro 7 static site with strict TypeScript, custom CSS, and one Cloudflare Pages Function for project inquiries. The canonical production origin is `https://fallscity.dev`.

## Commands

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

Run `npm test` (type check, build, and the SEO audit over `dist/`) after meaningful changes. Test Cloudflare Pages Functions through Wrangler, not Astro's static preview. Do not claim provider-backed email delivery unless a real configured submission has been observed.

## Conventions

- Keep pages static. Do not add React, a CMS, a database, or a backend framework without a clear requirement.
- Put shared business configuration in `src/config/site.ts` and reusable service/process/FAQ content in `src/data/`.
- Reuse tokens and component patterns in `src/styles/global.css`; keep JavaScript limited to necessary interaction.
- Preserve semantic HTML, one clear H1 per page, keyboard access, visible focus, reduced-motion support, and responsive behavior at 390px, 768px, and 1440px.
- Update unique metadata and visible structured-data sources when page content changes. Never add unverified schema properties.
- Each indexable URL owns one search intent. `/` targets "web design Louisville"; `/services/web-design/`, `/services/website-maintenance/`, and `/services/seo-foundations/` own their service intents; `/es/` owns the Spanish intent "diseño de páginas web Louisville". Do not create neighborhood/ZIP/city pages or guides without substantial owner-verified content.
- Service area (owner-confirmed 2026-11-09): based in Louisville, working remotely with businesses across Kentucky, in English or Spanish. Express that in copy and in `areaServed` (`src/lib/seo.ts`), not through per-city pages. The only public contact detail is `site.email`; there is no public address or phone, so never add `address`, `telephone`, or `LocalBusiness` schema.
- Internal links use trailing slashes. Organization/WebSite JSON-LD live on `/` only; other pages pass `breadcrumbs`/`pageType` to `BaseLayout`. Keep noindex pages out of the sitemap filter in `astro.config.mjs`.
- Use American English for public copy, except `/es/`, which is written in neutral US Spanish using *usted* (copy in `src/data/es.ts`). `/` and `/es/` declare reciprocal hreflang alternates (en-US, es-US, x-default); keep them in sync, and `npm run audit:seo` checks them. Keep the tone clear, practical, local, and free of exaggerated claims.

## Business guardrails

The offering is limited to professional website design/development, SEO foundations, domains/hosting/SSL, and website maintenance. Do not position the studio as a broad marketing, advertising, social media, CRM, enterprise software, or AI automation provider.

Do not invent prices, testimonials, reviews, projects, clients, team members, biographies, certifications, achievements, addresses, phone numbers, email addresses, rankings, or guarantees.

The portfolio in `src/data/portfolio.ts` lists live sites supplied by the owner (November 2026). Keep its descriptions limited to what each site itself states; do not add clients, results, or testimonials. Screenshots in `src/assets/portfolio/` are real captures of each homepage. Recapture them when a site changes, and remove an entry if its site goes offline.

The privacy page is a draft requiring owner/legal review before launch. Keep that status visible until review is complete.

## Security and external actions

Secrets belong only in server environment variables. `PUBLIC_TURNSTILE_SITE_KEY` is the sole intentionally public form key. Never commit `.env`, `.dev.vars`, credentials, inquiry contents, or personal data.

The endpoint must retain server validation, Turnstile verification, honeypot/timing checks, safe error handling, and genuine delivery confirmation. Never replace it with simulated success.

Do not deploy publicly, modify DNS, purchase services, connect paid providers, or send inquiries to external recipients without explicit user authorization.
