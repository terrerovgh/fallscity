import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://fallscity.dev',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    build: { cssMinify: 'esbuild' },
  },
});
