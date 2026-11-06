#!/usr/bin/env node
// Static SEO audit of the built site in dist/. Run after `npm run build`:
//   npm run audit:seo
// Checks every HTML page for title/description/canonical/robots/H1/JSON-LD,
// internal links and fragments, image alt attributes, and checks the sitemap
// and robots.txt for consistency. Exits non-zero on any error.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ORIGIN = 'https://fallscity.dev';
const DIST = process.argv[2] ?? new URL('../dist/', import.meta.url).pathname;
const errors = [];
const warnings = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const decode = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (match) return decode(match[1] ?? match[2] ?? match[3] ?? '');
  // A bare boolean attribute (e.g. `alt`) is present with an empty value.
  return new RegExp(`\\s${name}(?=[\\s/>])`, 'i').test(tag) ? '' : null;
};
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
const metaContent = (html, key, value) => {
  const tag = tags(html, 'meta').find((t) => attr(t, key) === value);
  return tag ? attr(tag, 'content') : null;
};
const stripTags = (html) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

/** Map a dist file to its public URL path ("/services/" for services/index.html). */
const urlPathFor = (file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
};

const files = walk(DIST);
// Google Search Console verification files (public/google*.html) are not site pages.
const isVerificationFile = (f) => /^google[0-9a-f]+\.html$/.test(relative(DIST, f));
const htmlFiles = files.filter((f) => f.endsWith('.html') && !isVerificationFile(f));
const pages = new Map(); // url path -> { html, ids, indexable, canonical }

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const path = urlPathFor(file);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const robots = metaContent(html, 'name', 'robots') ?? '';
  const indexable = !/noindex/i.test(robots);
  const canonicalTag = tags(html, 'link').find((t) => attr(t, 'rel') === 'canonical');
  pages.set(path, { html, ids, indexable, canonical: canonicalTag ? attr(canonicalTag, 'href') : null, file });
}

const titles = new Map();
const descriptions = new Map();

for (const [path, page] of pages) {
  const { html, indexable, canonical } = page;
  const label = path;

  // <html lang>
  const lang = attr(tags(html, 'html')[0] ?? '', 'lang');
  if (lang !== 'en-US') fail(label, `html lang is "${lang}", expected "en-US"`);

  // Title and description
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : '';
  if (!title) fail(label, 'missing <title>');
  const description = metaContent(html, 'name', 'description') ?? '';
  if (!description) fail(label, 'missing meta description');

  // H1
  const h1s = html.match(/<h1\b[\s\S]*?<\/h1>/gi) ?? [];
  if (h1s.length !== 1) fail(label, `expected exactly one <h1>, found ${h1s.length}`);

  if (indexable) {
    if (titles.has(title)) fail(label, `duplicate title (also on ${titles.get(title)})`);
    titles.set(title, label);
    if (descriptions.has(description)) fail(label, `duplicate meta description (also on ${descriptions.get(description)})`);
    descriptions.set(description, label);

    const expected = `${ORIGIN}${path}`;
    if (canonical !== expected) fail(label, `canonical is "${canonical}", expected "${expected}"`);
    const ogUrl = metaContent(html, 'property', 'og:url');
    if (ogUrl !== expected) fail(label, `og:url is "${ogUrl}", expected "${expected}"`);
  } else if (canonical) {
    warn(label, 'noindex page also declares a canonical URL');
  }

  // Social image must be absolute
  const ogImage = metaContent(html, 'property', 'og:image');
  if (!ogImage?.startsWith(`${ORIGIN}/`)) fail(label, `og:image is not an absolute production URL: ${ogImage}`);
  else if (!existsSync(join(DIST, new URL(ogImage).pathname))) fail(label, `og:image file missing: ${ogImage}`);

  // JSON-LD must parse, and must not claim unverified properties
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(block[1]);
    } catch (error) {
      fail(label, `invalid JSON-LD: ${error.message}`);
      continue;
    }
    const text = JSON.stringify(data);
    for (const banned of ['aggregateRating', '"review"', 'telephone', 'openingHours', '"address"', '"geo"', 'FAQPage']) {
      if (text.includes(banned)) fail(label, `JSON-LD contains ${banned}; only add it once the owner verifies the facts`);
    }
    for (const id of text.matchAll(/"@id":"([^"]+)"/g)) {
      if (!id[1].startsWith(`${ORIGIN}/`)) fail(label, `JSON-LD @id is not on the production origin: ${id[1]}`);
    }
  }

  // Images need an alt attribute (empty is fine for decorative images)
  for (const img of tags(html, 'img')) {
    if (attr(img, 'alt') === null) fail(label, `<img> without alt: ${img.slice(0, 120)}`);
  }

  // Internal links resolve to a built file, use trailing slashes, and fragments exist
  for (const a of tags(html, 'a')) {
    const href = attr(a, 'href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    let url;
    try {
      url = new URL(href, `${ORIGIN}${path}`);
    } catch {
      fail(label, `unparseable link: ${href}`);
      continue;
    }
    if (url.origin !== ORIGIN) {
      if (/^https?:\/\/(www\.)?fallscity\.dev/i.test(href)) fail(label, `link to non-canonical host: ${href}`);
      continue;
    }
    const target = url.pathname;
    const isFile = /\.[a-z0-9]+$/i.test(target);
    if (!isFile && !target.endsWith('/') && pages.has(`${target}/`)) {
      fail(label, `internal link without trailing slash (redirects): ${href}`);
      continue;
    }
    const targetPage = pages.get(target);
    if (!targetPage && !(isFile && existsSync(join(DIST, target)))) {
      fail(label, `broken internal link: ${href}`);
      continue;
    }
    if (url.hash && targetPage && !targetPage.ids.has(decodeURIComponent(url.hash.slice(1)))) {
      fail(label, `link to missing fragment: ${href}`);
    }
    if (targetPage && !targetPage.indexable && page.indexable && !target.startsWith('/privacy/')) {
      warn(label, `links to noindex page ${target}`);
    }
  }
}

// Sitemap: every URL is built, indexable, and self-canonical; every indexable page is listed
const sitemapIndex = join(DIST, 'sitemap-index.xml');
if (!existsSync(sitemapIndex)) fail('sitemap', 'sitemap-index.xml missing');
else {
  const listed = new Set();
  for (const loc of readFileSync(sitemapIndex, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const file = join(DIST, new URL(loc[1]).pathname);
    if (!loc[1].startsWith(`${ORIGIN}/`) || !existsSync(file)) {
      fail('sitemap', `child sitemap missing or off-origin: ${loc[1]}`);
      continue;
    }
    for (const url of readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) listed.add(url[1]);
  }
  for (const url of listed) {
    const path = url.startsWith(ORIGIN) ? url.slice(ORIGIN.length) : null;
    const page = path ? pages.get(path) : null;
    if (!page) fail('sitemap', `lists a URL with no built page: ${url}`);
    else if (!page.indexable) fail('sitemap', `lists a noindex page: ${url}`);
    else if (page.canonical !== url) fail('sitemap', `lists a non-canonical URL: ${url}`);
  }
  for (const [path, page] of pages) {
    if (page.indexable && !listed.has(`${ORIGIN}${path}`)) fail('sitemap', `indexable page missing from sitemap: ${path}`);
  }
}

// robots.txt
const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) fail('robots.txt', 'missing');
else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) fail('robots.txt', 'missing production Sitemap directive');
  if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) fail('robots.txt', 'blocks the whole site');
}

// 404 page must exist (Cloudflare Pages serves it with a 404 status) and be noindex
const notFound = pages.get('/404.html');
if (!notFound) fail('404', 'dist/404.html missing');
else if (notFound.indexable) fail('404', '404 page is indexable');

const indexable = [...pages.values()].filter((p) => p.indexable).length;
console.log(`SEO audit: ${pages.size} HTML pages (${indexable} indexable).`);
for (const w of new Set(warnings)) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);
if (errors.length) {
  console.log(`${errors.length} error(s).`);
  process.exit(1);
}
console.log('No errors.');
