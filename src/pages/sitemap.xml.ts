// /sitemap.xml: every indexable page in both languages, each English URL
// followed by its Spanish counterpart, with the same hreflang alternates the
// pages declare (en-US, es-US, x-default). Pages are discovered from
// src/pages/[...lang]/, so a new page is listed automatically; noindex pages
// (the privacy draft) stay out. `npm run audit:seo` checks this file against
// the built pages.
import type { APIRoute } from 'astro';
import { privacyIsDraft, site } from '../config/site';
import { alternatesFor, langs, localizePath } from '../i18n';

/** Site paths in reading order; anything not listed here sorts after these. */
const order = [
  '/',
  '/services/',
  '/services/web-design/',
  '/services/seo-foundations/',
  '/services/website-maintenance/',
  '/process/',
  '/about/',
  '/contact/',
];

const noindexPaths = new Set(privacyIsDraft ? ['/privacy/'] : []);

/** "./[...lang]/services/index.astro" -> "/services/" */
const routeOf = (file: string) =>
  `/${file.replace(/^\.\/\[\.\.\.lang\]\//, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, '')}/`.replace(/\/+/g, '/');

const rank = (path: string) => {
  const index = order.indexOf(path);
  return index === -1 ? order.length : index;
};

// Brackets are glob syntax, so glob every page and keep the [...lang] ones.
const paths = Object.keys(import.meta.glob('./**/*.astro'))
  .filter((file) => file.startsWith('./[...lang]/'))
  .map(routeOf)
  .filter((path) => !noindexPaths.has(path))
  .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

const url = (path: string) => new URL(path, site.url).href;
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const entry = (loc: string, alternates: ReturnType<typeof alternatesFor>) =>
  [
    '  <url>',
    `    <loc>${escape(url(loc))}</loc>`,
    ...alternates.map(
      (alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escape(url(alt.path))}"/>`,
    ),
    '  </url>',
  ].join('\n');

export const GET: APIRoute = () => {
  const entries = paths.flatMap((path) => {
    const alternates = alternatesFor(path);
    return langs.map((lang) => entry(localizePath(path, lang), alternates));
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
