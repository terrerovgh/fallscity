// Full-page screenshots of the built site for visual review: node scripts/shoot.mjs [baseUrl]
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4321';
const out = new URL('../artifacts/qa/', import.meta.url).pathname;
const browser = await chromium.launch();
for (const [path, tag] of [['/', 'en'], ['/es/', 'es']]) {
  for (const w of [390, 768, 1440]) {
    for (const scheme of w === 1440 ? ['light', 'dark'] : ['light']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: `${out}${tag}-${w}-${scheme}.png`, fullPage: true });
      console.log(tag, w, scheme, 'h-overflow:', overflow);
      await ctx.close();
    }
  }
}
await browser.close();
