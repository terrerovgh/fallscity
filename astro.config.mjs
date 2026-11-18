// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fallscity.dev',
  output: 'static',
  vite: { ssr: { noExternal: ['gsap'] } },
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-US' } },
    }),
  ],
});
