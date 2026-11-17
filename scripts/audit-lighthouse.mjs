import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const base = 'http://127.0.0.1:4321';
let server;
process.on('exit', () => { if (server) server.kill('SIGTERM'); });
async function reachable() { try { return (await fetch(base)).ok; } catch { return false; } }
if (!(await reachable())) {
  server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4321'], { stdio: 'ignore' });
  for (let i = 0; i < 60 && !(await reachable()); i++) await new Promise((resolve) => setTimeout(resolve, 500));
}
await mkdir('artifacts/lighthouse', { recursive: true });
await mkdir('artifacts/performance', { recursive: true });
const reports = [];
for (let run = 1; run <= 3; run++) {
  const browser = await chromium.launch({ headless: true, args: ['--remote-debugging-port=9222'] });
  try {
    const result = await lighthouse(`${base}/`, {
      port: 9222,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
    }, undefined);
    if (!result) throw new Error('Lighthouse returned no report');
    await writeFile(`artifacts/lighthouse/home-mobile-${run}.json`, result.report);
    reports.push({
      run,
      performance: result.lhr.categories.performance.score * 100,
      accessibility: result.lhr.categories.accessibility.score * 100,
      seo: result.lhr.categories.seo.score * 100,
      lcpMs: result.lhr.audits['largest-contentful-paint'].numericValue,
      cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
    });
    console.log(`Lighthouse ${run}: performance ${reports.at(-1).performance}, accessibility ${reports.at(-1).accessibility}, SEO ${reports.at(-1).seo}`);
  } finally {
    await browser.close();
  }
}
const median = (key) => reports.map((report) => report[key]).sort((a, b) => a - b)[1];
const summary = {
  configuration: 'Lighthouse 13.6.0; Chromium 159; mobile emulation 390×844; DPR 1; default simulated throttling; static Astro preview; three runs.',
  reports,
  median: {
    performance: median('performance'), accessibility: median('accessibility'), seo: median('seo'), lcpMs: median('lcpMs'), cls: median('cls'),
  },
  objectives: { performance: 90, accessibility: 95, seo: 95, lcpMs: 2500, cls: .1 },
  note: 'Local laboratory measurements only. No field INP or real-user availability is claimed.',
};
await writeFile('artifacts/lighthouse/summary.json', `${JSON.stringify(summary, null, 2)}\n`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
await page.addInitScript(() => {
  window.__longTasks = [];
  try { new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__longTasks.push(entry.duration); }).observe({ type: 'longtask', buffered: true }); } catch {}
});
await page.goto(base, { waitUntil: 'networkidle' });
await browser.startTracing({ path: 'artifacts/performance/home-mobile-trace.json', screenshots: false });
const frames = await page.evaluate(async () => {
  const intervals = [];
  let previous = performance.now();
  const height = document.documentElement.scrollHeight - innerHeight;
  for (let y = 0; y <= height; y += Math.max(45, innerHeight * .09)) {
    scrollTo(0, y);
    await new Promise(requestAnimationFrame);
    const now = performance.now(); intervals.push(now - previous); previous = now;
  }
  for (let y = height; y >= 0; y -= Math.max(45, innerHeight * .09)) {
    scrollTo(0, y);
    await new Promise(requestAnimationFrame);
    const now = performance.now(); intervals.push(now - previous); previous = now;
  }
  return intervals;
});
const traceBuffer = await browser.stopTracing();
await writeFile('artifacts/performance/home-mobile-trace.json', traceBuffer);
const sorted = [...frames].sort((a, b) => a - b);
const performanceSummary = {
  configuration: 'Chromium trace and requestAnimationFrame intervals during automated scroll down/up on mobile home; not a field measurement.',
  frames: frames.length,
  meanFrameMs: frames.reduce((sum, value) => sum + value, 0) / frames.length,
  p95FrameMs: sorted[Math.floor(sorted.length * .95)],
  maxFrameMs: sorted.at(-1),
  longTasks: await page.evaluate(() => window.__longTasks),
  trace: 'artifacts/performance/home-mobile-trace.json',
};
await writeFile('artifacts/performance/summary.json', `${JSON.stringify(performanceSummary, null, 2)}\n`);
await browser.close();
if (server) server.kill('SIGTERM');
console.log(`Median: ${JSON.stringify(summary.median)}. Trace and frame intervals saved.`);
