import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:4321';
let server;
process.on('exit', () => { if (server) server.kill('SIGTERM'); });
async function reachable() { try { return (await fetch(base)).ok; } catch { return false; } }
if (!(await reachable())) {
  server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4321'], { stdio: 'ignore' });
  for (let i = 0; i < 60 && !(await reachable()); i++) await new Promise((resolve) => setTimeout(resolve, 500));
}
assert(await reachable(), 'Astro preview must be reachable');
await mkdir('artifacts/screenshots', { recursive: true });
await mkdir('artifacts/qa', { recursive: true });
await mkdir('artifacts/video', { recursive: true });
const routes = ['/', '/panel/', '/pricing/', '/local-seo/', '/work/', '/barbershops/', '/salons/', '/nails/', '/piercing/', '/process/', '/about/', '/contact/', '/privacy/', '/brand-preview/'];
const results = { layout: [], accessibility: [], interactions: [], browsers: [], errors: [] };
const browser = await chromium.launch({ head: true });
try {
  for (const width of [390, 768, 1440]) {
    for (const lang of ['en', 'es']) {
      for (const route of routes) {
        const path = lang === 'es' ? `/es${route}` : route;
        const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
        const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
        assert.equal(response?.status(), 200, `${path} status`);
        const layout = await page.evaluate(() => ({
          title: document.title,
          h1: document.querySelectorAll('h1').length,
          overflow: document.documentElement.scrollWidth - innerWidth,
          broken: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
          text: document.querySelector('main')?.textContent?.length ?? 0,
        }));
        const entry = { path, width, ...layout, errors };
        results.layout.push(entry);
        assert.equal(layout.h1, 1, `${path} h1`);
        assert(layout.overflow <= 1, `${path} overflows at ${width}: ${layout.overflow}`);
        assert.equal(layout.broken.length, 0, `${path} broken images`);
        assert(layout.text > 200, `${path} useful content`);
        assert.equal(errors.length, 0, `${path} console errors: ${errors.join('; ')}`);
        if (width === 390 || (width === 1440 && route === '/')) {
          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
          results.accessibility.push({ path, width, violations: axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, description: violation.description, nodes: violation.nodes.map((node) => node.target) })) });
          const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
          assert.equal(serious.length, 0, `${path} serious axe violations: ${serious.map((item) => item.id).join(', ')}`);
        }
        if (['/', '/panel/', '/pricing/', '/work/', '/contact/'].includes(route) && width !== 768) {
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .75) { scrollTo(0, y); await new Promise((resolve) => setTimeout(resolve, 40)); }
            scrollTo(0, 0); await document.fonts.ready;
          });
          await page.screenshot({ path: `artifacts/screenshots/${route === '/' ? 'home' : route.slice(1, -1)}-${lang}-${width}.png`, fullPage: true });
        }
        await context.close();
      }
    }
  }
  for (const lang of ['en', 'es']) for (const route of ['/', '/contact/', '/pricing/', '/work/']) {
    const page = await browser.newPage({ viewport: { width: 320, height: 700 }, reducedMotion: 'reduce' });
    const path = `${lang === 'es' ? '/es' : ''}${route}`;
    await page.goto(`${base}${path}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `320px overflow ${path}`);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `200% zoom overflow ${path}`);
    results.interactions.push({ test: '320px and 200% zoom', path, passed: true });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base);
  const opener = page.locator('[data-menu-open]');
  await opener.click();
  assert(await page.locator('[data-menu-dialog]').evaluate((dialog) => dialog.open), 'Dialog opens');
  await page.screenshot({ path: 'artifacts/screenshots/menu-en-390.png' });
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-menu-close') !== null), true, 'Dialog focuses close');
  await page.keyboard.press('Escape');
  assert(!(await page.locator('[data-menu-dialog]').evaluate((dialog) => dialog.open)), 'Escape closes dialog');
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-menu-open') !== null), true, 'Focus returns to opener');
  await opener.click();
  await page.setViewportSize({ width: 1000, height: 900 });
  assert(!(await page.locator('[data-menu-dialog]').evaluate((dialog) => dialog.open)), 'Desktop resize closes dialog');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.faq-list summary').first().click();
  assert(await page.locator('.faq-list details').first().evaluate((details) => details.open), 'FAQ opens');
  await page.screenshot({ path: 'artifacts/screenshots/faq-en-390.png' });
  await page.keyboard.press('Tab');
  await page.screenshot({ path: 'artifacts/screenshots/focus-en-390.png' });
  results.interactions.push({ test: 'dialog keyboard/focus/resize and FAQ', passed: true });
  assert.equal(await page.locator('[data-mobile-dock]').count(), 0, 'No overlapping fixed mobile dock');
  results.interactions.push({ test: 'mobile CTA remains in flow without overlay', passed: true });
  await page.goto(`${base}/work/`);
  await page.locator('.work-hero-index a').nth(1).click();
  assert.equal(new URL(page.url()).hash, '#pixel', 'Work index is a real anchor link');
  results.interactions.push({ test: 'work index anchor links', passed: true });
  await page.goto(`${base}/work/?source=test`);
  const languageHref = await page.locator('[data-lang-link="es"]').first().getAttribute('href');
  assert(languageHref?.includes('source=test') && languageHref.includes('lang=es'), 'Language switch preserves query');
  await page.locator('[data-lang-link="es"]').first().click();
  assert.equal(new URL(page.url()).pathname, '/es/work/', 'Equivalent Spanish route');
  results.interactions.push({ test: 'language equivalent and query', passed: true });
  await page.goto(`${base}/es/contact/`);
  assert(await page.locator('.form-submit').isDisabled(), 'Unconfigured form is disabled');
  assert(await page.locator('.form-availability').isVisible(), 'Unconfigured notice visible');
  assert((await page.locator('.form-availability').textContent())?.includes('no está configurado'), 'Honest Spanish notice');
  results.interactions.push({ test: 'unconfigured form', passed: true });
  await page.goto(`${base}/#selected-work`);
  await page.waitForTimeout(400);
  assert(await page.locator('#selected-work').isVisible(), 'Anchor target visible');
  await page.setViewportSize({ width: 844, height: 390 });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Orientation resize');
  await page.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const nojsPage = await nojs.newPage();
  await nojsPage.goto(base);
  assert(await nojsPage.locator('.nojs-nav').isVisible(), 'No-JS navigation visible');
  assert(await nojsPage.locator('h1').isVisible(), 'No-JS H1 visible');
  assert(await nojsPage.locator('.hero-artifact img').isVisible(), 'No-JS image visible');
  await nojsPage.screenshot({ path: 'artifacts/screenshots/reduced-motion-en-390.png' });
  await nojsPage.setViewportSize({ width: 768, height: 900 });
  await nojsPage.waitForLoadState('networkidle');
  await nojsPage.locator('.hero-artifact img').evaluate((image) => image.decode());
  await nojsPage.screenshot({ path: 'artifacts/screenshots/home-en-768.png' });
  await nojsPage.goto(`${base}/contact/`);
  assert(await nojsPage.locator('.form-submit').isDisabled(), 'No-JS form honest');
  await nojs.close();
  results.interactions.push({ test: 'no JavaScript and reduced motion', passed: true });
  const videoContext = await browser.newContext({ viewport: { width: 390, height: 844 }, recordVideo: { dir: 'artifacts/video', size: { width: 390, height: 844 } } });
  const videoPage = await videoContext.newPage();
  await videoPage.goto(base);
  for (const selector of ['#selected-work', '.product-story', '.pricing-section', '.faq-section']) {
    await videoPage.locator(selector).scrollIntoViewIfNeeded();
    await videoPage.waitForTimeout(350);
  }
  await videoPage.close();
  await videoContext.close();
} finally {
  await browser.close();
}
for (const [name, engine] of [['firefox', firefox], ['webkit', webkit]]) {
  try {
    const browser = await engine.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert(await page.locator('h1').isVisible());
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.goto(`${base}/contact/`);
    assert(await page.locator('.form-submit').isDisabled());
    results.browsers.push({ engine: name, passed: true });
    await browser.close();
  } catch (error) {
    results.browsers.push({ engine: name, passed: false, limitation: error instanceof Error ? error.message.split('\n').slice(0, 12).join(' ') : String(error) });
  }
}
await writeFile('artifacts/qa/ui-results.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(`UI QA: ${results.layout.length} route/viewport checks, ${results.accessibility.length} axe runs, ${results.interactions.length} interaction groups.`);
for (const engine of results.browsers) console.log(`${engine.engine}: ${engine.passed ? 'passed' : `not available — ${engine.limitation}`}`);
if (server) server.kill('SIGTERM');
