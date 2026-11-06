import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages that are noindex must stay out of the sitemap. /privacy/ is noindex
// while `privacyIsDraft` in src/config/site.ts is true; keep the two in sync.
const excludedFromSitemap = new Set(['https://fallscity.dev/privacy/']);

export default defineConfig({
  site: 'https://fallscity.dev',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !excludedFromSitemap.has(page) })],
  build: {
    inlineStylesheets: 'auto',
  },
});
