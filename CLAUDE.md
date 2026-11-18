# CLAUDE.md

Landing page for Falls City Dev Studio (fallscity.dev). See README.md for commands.

- Stack is Astro static with TypeScript, React Bits and GSAP. Use the semantic colors in `src/styles/tokens.css`. The page copy, contact email link and first portfolio screenshots are present in the static HTML.
- A Cloudflare Worker named `fallscity` (`worker/index.ts`, `wrangler.jsonc`, own `worker/tsconfig.json`) serves `dist/`: canonical host, 301s from the old site's URLs, EN/ES routing by `?lang=` cookie / `Accept-Language`, `GET /api/inquiry/config` and `POST /api/inquiry` (Turnstile + Resend), and the Google verification file. Form variables are Worker runtime variables, not build variables (README, `.env.example`). A new page whose ES path is not `/es` + EN path must be added to `TRANSLATED_PATHS`. Tests: `scripts/test-worker.mjs`; the form flow is tested in `test-ui.mjs` with the API mocked.
- Content lives only in `src/data/site.ts`, always `{ en, es }`. Voice: first person singular ("I build"), speaking to the owner as "you"/"tú". Sell benefits (what the owner gains); never say who the site is for (no audience/niche sections). No decorative numbering (01, 02…) or eyebrow labels repeating a heading. EN routes at `/`, ES under `/es/` (privacy: `/privacy/`, `/es/privacidad/`).
- Truthfulness: describe only what the client sites really do. No invented clients, numbers, testimonials or prices; services are negotiated per client.
- The portfolio shows desktop and mobile screenshots in each project link. ScrollTrigger moves the screenshots within the two device frames and resets them when reduced motion is enabled.
- The benefits carousel is a horizontal scroll-snap list with keyboard and button navigation. Its six scenes play when centered in view and render as static illustrations in reduced motion.
- The site uses light mode from 07:00 through 18:59 local time and dark mode at night. The contact section uses the dark theme.
- Before shipping, run `npm test` to check the build, Worker routes, contact flow, responsive layout and keyboard behavior.
- The internal tool for generating client sites from templates is a separate project; this landing must not mention it.
- `main` of `terrerovgh/fallscity` is what Cloudflare builds and serves, so a push there is a production deploy. Do not deploy, change DNS or push without the owner's explicit OK.
