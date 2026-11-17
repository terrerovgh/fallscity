# CLAUDE.md

Landing page for Falls City Dev Studio (fallscity.dev). See README.md for commands.

- Stack: Astro 7 static, TypeScript strict, own CSS (`src/styles/tokens.css`, `src/styles/base.css`). No Tailwind, no UI framework, no client JS. Keep it that way unless asked.
- Content lives only in `src/data/site.ts`, always `{ en, es }`. Voice: first person singular ("I build"), speaking to the owner as "you"/"tú". Sell benefits (what the owner gains); never say who the site is for (no audience/niche sections). No decorative numbering (01, 02…) or eyebrow labels repeating a heading. EN routes at `/`, ES under `/es/` (privacy: `/privacy/`, `/es/privacidad/`).
- Truthfulness: describe only what the client sites really do. No invented clients, numbers, testimonials or prices; services are negotiated per client.
- The work section's page switcher is a radio group + `:has()` (CSS only, with a first-page fallback). Keep the `data-page` indices and the `input[value]` selectors in `base.css` in sync (max 4 pages per project).
- Motion is opt-in (`prefers-reduced-motion: no-preference`) and scroll-driven reveals sit behind `@supports (animation-timeline: view())`.
- Colors: semantic tokens with a `prefers-color-scheme` fallback, then `light-dark()`.
- Before finishing a change: `npm test` (astro check, build, Axe light/dark, overflow 320–1440, switcher mouse/keyboard/no-JS, reduced motion) and look at screenshots from `scripts/shoot.mjs`.
- The internal tool for generating client sites from templates is a separate project; this landing must not mention it.
- Do not deploy, change DNS or push without the owner's explicit OK.
