// Renders public/og.jpg (1200x630) from the built hero: node scripts/og.mjs [baseUrl]
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '.site-header{display:none} .hero{padding-block:3.2rem 0} .hero .actions{display:none} main > :not(.hero){display:none}' });
await page.waitForTimeout(300);
await page.screenshot({ path: new URL('../public/og.jpg', import.meta.url).pathname, type: 'jpeg', quality: 86 });
await browser.close();
