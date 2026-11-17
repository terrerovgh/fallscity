// Captures desktop and phone screenshots of the client sites shown on the landing.
// Usage: node scripts/capture.mjs [--only=<id>] [--base:<id>=<url>]
// leeyrealty.com and durafencemetal.com were returning Cloudflare error 1000 on
// 2026-11-17, so they were captured from local builds of their repos:
//   node scripts/capture.mjs --base:leey=http://127.0.0.1:5101 --base:dura=http://127.0.0.1:5102
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = new URL('../src/assets/work/', import.meta.url);

/** pages: [name, path, anchor selector to scroll to (optional)] */
const SITES = {
  nina: {
    base: 'https://goodnina.com',
    pages: [['home', '/'], ['gallery', '/galeria'], ['book', '/', '#agendar']],
  },
  tony: {
    base: 'https://tonytattoo.com',
    pages: [['home', '/'], ['portfolio', '/', '#portfolio'], ['book', '/', '#booking']],
  },
  leey: {
    base: 'https://leeyrealty.com',
    pages: [['home', '/'], ['properties', '/properties'], ['area', '/areas/valdosta'], ['blog', '/blog']],
  },
  dura: {
    base: 'https://durafencemetal.com',
    pages: [['home', '/'], ['estimate', '/estimate/'], ['quote', '/quote/']],
  },
};

const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--only='))?.slice(7);
for (const a of args.filter((a) => a.startsWith('--base:'))) {
  const [id, url] = a.slice(7).split('=');
  if (SITES[id]) SITES[id].base = url.replace(/\/$/, '');
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const [id, site] of Object.entries(SITES)) {
  if (only && only !== id) continue;
  for (const [device, opts] of Object.entries(DEVICES)) {
    const ctx = await browser.newContext({ ...opts, reducedMotion: 'reduce', colorScheme: 'light', locale: 'en-US' });
    const page = await ctx.newPage();
    for (const [name, path, anchor] of site.pages) {
      const url = site.base + path;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        // Trigger lazy images, then come back.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        });
        await page.evaluate(() => document.fonts.ready);
        if (anchor) {
          await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
          }, anchor);
        }
        await page.waitForTimeout(900);
        const file = new URL(`${id}-${name}-${device}.jpg`, OUT);
        await page.screenshot({ path: file.pathname, type: 'jpeg', quality: 88 });
        console.log('ok  ', id, name, device);
      } catch (e) {
        console.log('FAIL', id, name, device, e.message.split('\n')[0]);
      }
    }
    await ctx.close();
  }
}
await browser.close();
