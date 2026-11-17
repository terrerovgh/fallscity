# CLAUDE.md

Landing page for Falls City Dev Studio (fallscity.dev). See README.md for commands.

- Stack: Astro 7 static, TypeScript strict, own CSS (`src/styles/tokens.css`, `base.css`, `benefits.css`). No Tailwind, no UI framework. Client JS is allowed where it helps (owner OK, 2026-11-17): today the contact form (`src/scripts/inquiry.ts`) and Google Tag Manager (only on fallscity.dev). Everything must still work without JS (email link, CSS-only carousel).
- A Cloudflare Worker named `fallscity` (`worker/index.ts`, `wrangler.jsonc`, own `worker/tsconfig.json`) serves `dist/`: canonical host, 301s from the old site's URLs, EN/ES routing by `?lang=` cookie / `Accept-Language`, `GET /api/inquiry/config` and `POST /api/inquiry` (Turnstile + Resend), and the Google verification file. Form variables are Worker runtime variables, not build variables (README, `.env.example`). A new page whose ES path is not `/es` + EN path must be added to `TRANSLATED_PATHS`. Tests: `scripts/test-worker.mjs`; the form flow is tested in `test-ui.mjs` with the API mocked.
- Content lives only in `src/data/site.ts`, always `{ en, es }`. Voice: first person singular ("I build"), speaking to the owner as "you"/"tú". Sell benefits (what the owner gains); never say who the site is for (no audience/niche sections). No decorative numbering (01, 02…) or eyebrow labels repeating a heading. EN routes at `/`, ES under `/es/` (privacy: `/privacy/`, `/es/privacidad/`).
- Truthfulness: describe only what the client sites really do. No invented clients, numbers, testimonials or prices; services are negotiated per client.
- The work section's page switcher is a radio group + `:has()` (CSS only, with a first-page fallback). Keep the `data-page` indices and the `input[value]` selectors in `base.css` in sync (max 4 pages per project).
- The benefits carousel (`Benefits.astro`, `BenefitArt.astro`, `src/styles/benefits.css`) is CSS only: it auto-advances, and picking a dot stops it. Its keyframe percentages assume exactly 6 benefits, and the `input[value]` selectors cover 0–5. With reduced motion or without `:has()`, it falls back to a static grid showing each illustration's final frame.
- Motion is opt-in (`prefers-reduced-motion: no-preference`) and scroll-driven reveals sit behind `@supports (animation-timeline: view())`.
- Colors: semantic tokens with a `prefers-color-scheme` fallback, then `light-dark()`.
- Before finishing a change: `npm test` (astro check, build, Worker tests, Axe light/dark, overflow 320–1440, switcher mouse/keyboard/no-JS, reduced motion) and look at screenshots from `scripts/shoot.mjs`.
- The internal tool for generating client sites from templates is a separate project; this landing must not mention it.
- `main` of `terrerovgh/fallscity` is what Cloudflare builds and serves, so a push there is a production deploy. Do not deploy, change DNS or push without the owner's explicit OK.
