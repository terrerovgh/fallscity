import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = resolve('artifacts/studies');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const files = ['01-folio', '02-signal', '03-room'];
for (const name of files) {
  for (const [label, width, height] of [['mobile', 390, 844], ['desktop', 1440, 1000]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(resolve(`studies/${name}.html`)).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
const sheets = [];
for (const name of files) {
  const image = await sharp(`${out}/${name}-desktop.png`).resize({ width: 580, height: 650, fit: 'cover', position: 'top' }).png().toBuffer();
  sheets.push(image);
}
await sharp({ create: { width: 1800, height: 700, channels: 3, background: '#c8c8c0' } })
  .composite(sheets.map((input, index) => ({ input, left: 15 + index * 600, top: 20 })))
  .png().toFile(`${out}/contact-sheet.png`);
console.log(`Saved studies and contact sheet to ${out}`);
