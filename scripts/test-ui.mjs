// UI checks against a running preview: node scripts/test-ui.mjs [baseUrl]
// Axe (light + dark), page switcher by mouse and keyboard, horizontal overflow, reduced motion.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { spawn, spawnSync } from 'node:child_process';

// Without a base URL, serve the build with astro preview (or reuse the one already running:
// Astro allows a single preview server per project and reports its URL).
let server;
let startedPreview = false;
let base = process.argv[2];
if (!base) {
  const astro = new URL('../node_modules/.bin/astro', import.meta.url).pathname;
  server = spawn(astro, ['preview', '--port', '4399'], { stdio: ['ignore', 'pipe', 'pipe'] });
  base = await new Promise((resolve, reject) => {
    const onData = (d) => {
      const text = String(d);
      const m = text.match(/http:\/\/localhost:\d+/);
      if (m) {
        startedPreview = !/already running/.test(text);
        resolve(m[0]);
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    setTimeout(() => reject(new Error('astro preview did not report a URL')), 30000);
  });
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
}

const browser = await chromium.launch();
let failures = 0;
const check = (ok, msg) => {
  console.log(ok ? 'PASS' : 'FAIL', msg);
  if (!ok) failures++;
};

for (const path of ['/', '/es/', '/privacy/', '/es/privacidad/']) {
  for (const colorScheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    check(violations.length === 0, `axe ${path} ${colorScheme}${violations.map((v) => `\n     ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join('')}`);
    await ctx.close();
  }
}

// Overflow at small widths
for (const width of [320, 390, 768, 1024, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  const page = await ctx.newPage();
  for (const path of ['/', '/es/']) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(over === 0, `no horizontal overflow ${path} @${width}px (${over})`);
  }
  await ctx.close();
}

// Page switcher
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const project = page.locator('.project').first();
  const visible = async () => project.locator('[data-page]').evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.dataset.page));
  check(JSON.stringify(await visible()) === '["0"]', 'only first page visible initially');
  await project.getByText('Gallery', { exact: true }).click();
  check(JSON.stringify(await visible()) === '["1"]', 'click "Gallery" shows page 1 only');
  const img = project.locator('[data-page="1"] .laptop img');
  await img.scrollIntoViewIfNeeded();
  await page.waitForFunction((el) => el.complete && el.naturalWidth > 0, await img.elementHandle());
  check(true, 'gallery screenshot loads after switching');
  await project.locator('input[value="1"]').focus();
  await page.keyboard.press('ArrowRight');
  check(JSON.stringify(await visible()) === '["2"]', 'ArrowRight moves to page 2');
  const focusRing = await project.locator('label:has(input[value="2"])').evaluate((el) => getComputedStyle(el).outlineStyle);
  check(focusRing === 'solid', 'keyboard focus is visible on the switcher');
  await ctx.close();
}

// No JS: page still renders all sections and the switcher still works (CSS only)
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base + '/es/');
  const n = await page.locator('main section').count();
  check(n === 7, `no-JS renders 7 sections (${n})`);
  await page.locator('.project').nth(1).getByText('Portafolio', { exact: true }).click();
  const shown = await page.locator('.project').nth(1).locator('[data-page]').evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.dataset.page));
  check(JSON.stringify(shown) === '["1"]', 'no-JS switcher works');
  await ctx.close();
}

// Contact: without the form build variables there is no form, only the email link
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const forms = await page.locator('#contact form').count();
  const mail = await page.locator('#contact a[href^="mailto:info@fallscity.dev"]').count();
  check(forms === 0 && mail === 1, `contact without form config: ${forms} forms, ${mail} mailto link`);
  const langHref = await page.locator('.lang a[hreflang="es"]').getAttribute('href');
  check(langHref === '/es/?lang=es', `language switch sets the cookie through ?lang= (${langHref})`);
  await ctx.close();
}

// Benefits carousel (motion allowed): one slide at a time, auto-advance, manual pick, axe
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const car = page.locator('.carousel');
  await car.scrollIntoViewIfNeeded();
  const shown = () => car.locator('.slide').evaluateAll((els) => els.map((e, i) => [i, +getComputedStyle(e).opacity]).filter(([, o]) => o > 0.5).map(([i]) => i));
  // Jump the CSS timeline instead of waiting: t seconds into the cycle.
  const at = (t) => page.evaluate((ms) => document.getAnimations().forEach((a) => { if (a.animationName !== 'reveal') { a.pause(); a.currentTime = ms; } }), t * 1000);
  await at(3);
  check(JSON.stringify(await shown()) === '[0]', 'carousel shows only slide 0 at 3s');
  await at(6 * 4 + 3);
  check(JSON.stringify(await shown()) === '[4]', 'carousel advances to slide 4 at 27s');
  await page.evaluate(() => document.getAnimations().forEach((a) => a.play()));
  await car.getByRole('radio', { name: 'A brand that earns trust' }).check();
  await page.waitForTimeout(700);
  check(JSON.stringify(await shown()) === '[2]', 'picking a dot shows slide 2');
  const running = await car.locator('.slide').evaluateAll((els) => els.filter((e) => getComputedStyle(e).animationName === 'benefit-slide').length);
  check(running === 0, 'picking a dot stops the rotation');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(700);
  check(JSON.stringify(await shown()) === '[3]', 'ArrowRight moves the carousel to slide 3');
  await page.waitForTimeout(6000);
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    const { violations } = await new AxeBuilder({ page }).include('#benefits').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    check(violations.length === 0, `axe carousel ${colorScheme}${violations.map((v) => `\n     ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join('')}`);
  }
  await ctx.close();
}

// Reduced motion: reveal content is fully visible without scrolling
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const hidden = await page.locator('.reveal').evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  check(hidden === 0, `reduced motion: all .reveal at opacity 1 (${hidden} not)`);
  await ctx.close();
}

await browser.close();
server?.kill();
if (startedPreview) {
  // Astro 7 keeps preview running in the background; stop the one this run started.
  spawnSync(new URL('../node_modules/.bin/astro', import.meta.url).pathname, ['preview', 'stop'], { stdio: 'ignore' });
}
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
