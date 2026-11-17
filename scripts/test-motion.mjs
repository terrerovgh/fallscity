import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:4321';
await mkdir('artifacts/motion', { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];
for (const [label, width, height] of [['mobile', 390, 844], ['desktop', 1440, 900]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
  await page.goto(base, { waitUntil: 'networkidle' });
  const supports = await page.evaluate(() => CSS.supports('(animation-timeline: view()) and (animation-range: entry)'));
  assert(supports, `Native scroll timelines required in test Chromium (${label})`);
  const moments = [
    { name: 'opening', target: '.hero-art-frame picture', driver: '.hero-art-frame', positions: [-height, -height * .45, 0] },
    { name: 'proof', target: '.work-image', driver: '.work-image', positions: [-height * .85, -height * .55, -height * .25] },
    { name: 'product', target: '.publish-node:nth-child(1)', driver: '.product-story', positions: [-height, -height * .5, 0] },
  ];
  for (const moment of moments) {
    const states = [];
    const top = await page.locator(moment.driver).first().evaluate((element) => element.getBoundingClientRect().top + scrollY);
    for (const [index, offset] of moment.positions.entries()) {
      await page.evaluate((y) => scrollTo({ top: Math.max(0, y), behavior: 'instant' }), top + offset);
      await page.waitForTimeout(150);
      const state = await page.locator(moment.target).first().evaluate((element) => {
        const computed = getComputedStyle(element);
        return { scrollY: Math.round(scrollY), transform: computed.transform, opacity: computed.opacity, animationName: computed.animationName, animationTimeline: computed.animationTimeline, animationRange: computed.animationRange };
      });
      states.push(state);
      await page.screenshot({ path: `artifacts/motion/${label}-${moment.name}-${index}.png` });
    }
    if (moment.name !== 'product' || label === 'desktop') assert.notEqual(states[0]?.transform, states[2]?.transform, `${moment.name} changes with scroll (${label})`);
    await page.evaluate((y) => scrollTo({ top: Math.max(0, y), behavior: 'instant' }), top + moment.positions[0]);
    await page.waitForTimeout(150);
    const reverse = await page.locator(moment.target).first().evaluate((element) => getComputedStyle(element).transform);
    assert.equal(reverse, states[0]?.transform, `${moment.name} reverses (${label})`);
    report.push({ viewport: { label, width, height }, moment: moment.name, states, reverse });
  }
  await page.close();
}
const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await reduced.goto(base);
assert.equal(await reduced.locator('.hero-art-frame picture').evaluate((element) => getComputedStyle(element).animationName), 'none');
assert.equal(await reduced.locator('.work-image').first().evaluate((element) => getComputedStyle(element).animationName), 'none');
report.push({ reducedMotion: 'passed; static content and no scroll animations' });
await reduced.close();
await browser.close();
await writeFile('artifacts/motion/states.json', `${JSON.stringify(report, null, 2)}\n`);
console.log('Motion QA passed: three positions, reverse, mobile/desktop, reduced-motion.');
