import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages that are noindex must stay out of the sitemap. /privacy/ (in both
// languages) is noindex while `privacyIsDraft` in src/config/site.ts is true;
// keep the two in sync.
const excludedFromSitemap = new Set(['https://fallscity.dev/privacy/', 'https://fallscity.dev/es/privacy/']);

export default defineConfig({
  site: 'https://fallscity.dev',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !excludedFromSitemap.has(page),
      // Adds <xhtml:link hreflang> alternates for /x/ <-> /es/x/ to the sitemap.
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-US' } },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
