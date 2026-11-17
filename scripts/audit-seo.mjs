import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const errors = [];
const notes = [];
const htmlFiles = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
await walk(root.pathname);
const expectedRoutes = ['', 'panel', 'pricing', 'local-seo', 'work', 'barbershops', 'salons', 'nails', 'piercing', 'process', 'about', 'contact'];
const expectedPaths = expectedRoutes.flatMap((route) => [`${route ? `${route}/` : ''}index.html`, `es/${route ? `${route}/` : ''}index.html`]);
for (const path of expectedPaths) {
  if (!htmlFiles.some((file) => file.endsWith(`/dist/${path}`))) errors.push(`Missing route: ${path}`);
}
const canonicalCounts = new Map();
const internalLinks = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const path = relative(root.pathname, file);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (!title) errors.push(`${path}: missing title`);
  if (h1s.length !== 1) errors.push(`${path}: expected one h1, found ${h1s.length}`);
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) errors.push(`${path}: missing/short description`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (path !== '404.html') {
    if (!canonical?.startsWith('https://fallscity.dev/')) errors.push(`${path}: invalid canonical`);
    else canonicalCounts.set(canonical, (canonicalCounts.get(canonical) ?? 0) + 1);
  }
  const noindex = /<meta name="robots" content="noindex,nofollow"/.test(html) || /content="noindex"/.test(html);
  const shouldNoindex = /privacy|brand-preview|404\.html/.test(path);
  if (noindex !== shouldNoindex) errors.push(`${path}: noindex mismatch`);
  if (!noindex) {
    for (const lang of ['en-US', 'es-US', 'x-default']) if (!html.includes(`hreflang="${lang}"`)) errors.push(`${path}: missing ${lang} alternate`);
    const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (!og?.includes(`/brand/social-${path.startsWith('es/') ? 'es' : 'en'}.png`)) errors.push(`${path}: wrong social card`);
  }
  if (/LocalBusiness|AggregateRating|"telephone"|award-winning|AI-powered|Founding Partner/i.test(html)) errors.push(`${path}: prohibited schema or public claim`);
  if (!/lang="(en-US|es-US)"/.test(html)) errors.push(`${path}: missing html language`);
  for (const match of html.matchAll(/href="(\/(?!\/)[^"]*)"/g)) {
    const href = match[1];
    if (/^\/(api|brand|fonts|_astro)\//.test(href) || /\.[a-z0-9]+$/i.test(href) || href.startsWith('/api/')) continue;
    const clean = href.split(/[?#]/)[0];
    if (clean !== '/' && clean !== '/es/' && !clean.endsWith('/')) errors.push(`${path}: internal link without trailing slash ${href}`);
    internalLinks.push({ source: path, clean });
  }
}
for (const { source, clean } of internalLinks) {
  if (clean.startsWith('/api/')) continue;
  const target = clean.endsWith('/') ? `${clean}index.html` : clean;
  try { await stat(`${root.pathname}${target.replace(/^\//, '')}`); } catch { errors.push(`${source}: broken internal link ${clean}`); }
}
for (const [canonical, count] of canonicalCounts) if (count > 1) errors.push(`Duplicate canonical: ${canonical}`);
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const urlCount = (sitemap.match(/<url>/g) ?? []).length;
if (urlCount !== 24) errors.push(`Sitemap should contain 24 URLs, found ${urlCount}`);
if (/privacy|brand-preview|404/.test(sitemap)) errors.push('Noindex content in sitemap');
for (const route of expectedRoutes) for (const lang of ['en', 'es']) {
  const url = `https://fallscity.dev${lang === 'es' ? '/es' : ''}/${route ? `${route}/` : ''}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`Sitemap missing ${url}`);
}
const motion = await readFile(new URL('../src/styles/motion.css', import.meta.url), 'utf8');
if (/\banimation\s*:/.test(motion)) errors.push('Motion CSS uses animation shorthand');
if (!motion.includes('@supports((animation-timeline:view()) and (animation-range:entry))')) errors.push('Motion support gate missing');
const astroFiles = await readdir(new URL('_astro/', root));
const compiledCss = (await Promise.all(astroFiles.filter((file) => file.endsWith('.css')).map((file) => readFile(new URL(`_astro/${file}`, root), 'utf8')))).join('\n');
if (!compiledCss.includes('animation-timeline') || !compiledCss.includes('animation-range')) errors.push('Compiled CSS lost scroll longhands');
if (/animation:[^;}]*hero-frame/.test(compiledCss)) errors.push('Compiled CSS reintroduced animation shorthand');
notes.push(`${htmlFiles.length} HTML documents checked; ${urlCount} sitemap URLs`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO audit passed. ${notes.join('. ')}.`);
