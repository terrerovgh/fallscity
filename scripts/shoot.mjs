// Full-page screenshots of the built site for visual review: node scripts/shoot.mjs [baseUrl]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const base = process.argv[2] ?? 'http://localhost:4321';
const out = new URL('../artifacts/qa/', import.meta.url).pathname;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [path, tag] of [['/', 'en'], ['/es/', 'es']]) {
  for (const w of [320, 390, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'UTC', reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.clock.setFixedTime(new Date(theme === 'light' ? '2026-01-01T12:00:00Z' : '2026-01-01T22:00:00Z'));
      await page.goto(base + path, { waitUntil: 'networkidle' });
      if (await page.locator('html').getAttribute('data-theme') !== theme) throw new Error(`Expected ${theme} theme on ${path}`);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: `${out}${tag}-${w}-${theme}.png`, fullPage: true });
      console.log(tag, w, theme, 'h-overflow:', overflow);
      await ctx.close();
    }
  }
}
await browser.close();
