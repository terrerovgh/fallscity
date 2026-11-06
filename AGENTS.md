# AGENTS.md

## Project

This repository contains the Falls City Dev Studio marketing website. It is an Astro 7 static site with strict TypeScript, custom CSS, and one Cloudflare Pages Function for project inquiries. The canonical production origin is `https://fallscity.dev`.

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
- SEO conventions (details in `docs/SEO_LOUISVILLE.md`): each indexable URL owns one search intent. `/` targets "web design Louisville"; `/services/web-design/`, `/services/website-maintenance/`, and `/services/seo-foundations/` own their service intents. Do not create neighborhood/ZIP/city pages or guides without substantial owner-verified content. Internal links use trailing slashes. Organization/WebSite JSON-LD live on `/` only; other pages pass `breadcrumbs`/`pageType` to `BaseLayout`. Keep noindex pages out of the sitemap filter in `astro.config.mjs`. Run `npm test` (check, build, `audit:seo`) after content or metadata changes.
- Use American English for public copy. Keep the tone clear, practical, local, and free of exaggerated claims.

## Business guardrails

The offering is limited to professional website design/development, SEO foundations, domains/hosting/SSL, and website maintenance. Do not position the studio as a broad marketing, advertising, social media, CRM, enterprise software, or AI automation provider.

Do not invent prices, testimonials, reviews, projects, clients, team members, biographies, certifications, achievements, addresses, phone numbers, email addresses, rankings, or guarantees. Existing research Markdown files are background material, not approval to publish their unverified values.

The portfolio in `src/data/portfolio.ts` lists live sites supplied by the owner (November 2026). Keep its descriptions limited to what each site itself states; do not add clients, results, or testimonials. Screenshots in `src/assets/portfolio/` are real captures of each homepage. Recapture them when a site changes, and remove an entry if its site goes offline.

The privacy page is a draft requiring owner/legal review before launch. Keep that status visible until review is complete.

## Security and external actions

Secrets belong only in server environment variables. `PUBLIC_TURNSTILE_SITE_KEY` is the sole intentionally public form key. Never commit `.env`, `.dev.vars`, credentials, inquiry contents, or personal data.

The endpoint must retain server validation, Turnstile verification, honeypot/timing checks, safe error handling, and genuine delivery confirmation. Never replace it with simulated success.

Do not deploy publicly, modify DNS, purchase services, connect paid providers, or send inquiries to external recipients without explicit user authorization.
