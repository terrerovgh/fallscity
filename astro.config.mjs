// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fallscity.dev',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-US' } },
    }),
  ],
});
