// Renders public/og.jpg (1200x630) from the built hero: node scripts/og.mjs [baseUrl]
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce', timezoneId: 'UTC' });
await page.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.addStyleTag({ content: `
  .site-header, .site-footer, main > :not(.hero), astro-dev-toolbar { display: none }
  .hero { min-height: 630px; display: grid; align-items: center; padding-block: 0 }
  .hero > .wrap { width: calc(100% - 112px) }
  .hero .actions { display: none }
  .hero .og-signature { width: 196px; margin-bottom: 2rem }
` });
await page.evaluate(async () => {
  const logo = document.querySelector('.site-header .logo-wordmark').cloneNode(true);
  logo.classList.add('og-signature');
  logo.style.display = 'block';
  document.querySelector('#hero-title').before(logo);
  await logo.decode();
  await document.fonts.ready;
});
await page.screenshot({ path: new URL('../public/og.jpg', import.meta.url).pathname, type: 'jpeg', quality: 86 });
await browser.close();
