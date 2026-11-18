// UI checks against a running preview: node scripts/test-ui.mjs [baseUrl]
// Local-time themes, Axe, responsive layout, portfolio scroll and the inquiry form.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

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

async function setThemeTime(page, theme) {
  const hour = theme === 'light' ? '12' : '22';
  await page.clock.setFixedTime(new Date(`2026-01-01T${hour}:00:00Z`));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
}

const themeState = (page) => page.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  scheme: getComputedStyle(document.documentElement).colorScheme,
  schemeMeta: document.querySelector('meta[name="color-scheme"]').content,
  bar: document.querySelector('meta[name="theme-color"]').content,
  background: getComputedStyle(document.body).backgroundColor,
}));
const expected = {
  light: { theme: 'light', scheme: 'light', schemeMeta: 'light', bar: '#f7f8fc', background: 'rgb(247, 248, 252)' },
  dark: { theme: 'dark', scheme: 'dark', schemeMeta: 'dark', bar: '#111726', background: 'rgb(17, 23, 38)' },
};
async function checkTheme(page, theme, label, hasJavaScript = true) {
  const state = await themeState(page);
  const want = { ...expected[theme], theme: hasJavaScript ? theme : undefined };
  check(Object.keys(want).every((key) => state[key] === want[key]), `${label} (${JSON.stringify(state)})`);
}

// Exercise both boundaries without reloading and use a local time different from UTC.
{
  const ctx = await browser.newContext({ timezoneId: 'America/New_York', colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-01-01T11:59:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T11:59:59Z'));
  await page.goto(base + '/');
  await checkTheme(page, 'dark', '06:59 local starts dark with a light system preference');
  await page.clock.runFor(1_000);
  await checkTheme(page, 'light', '07:00 switches to light on the open page');
  await page.emulateMedia({ colorScheme: 'dark' });
  await checkTheme(page, 'light', 'changing the system preference leaves the time-based theme');
  await page.clock.setSystemTime(new Date('2026-01-01T23:59:59Z'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await checkTheme(page, 'light', '18:59 local is still light');
  await page.clock.runFor(1_000);
  await checkTheme(page, 'dark', '19:00 switches to dark on the open page');
  await page.clock.setSystemTime(new Date('2026-01-02T12:00:00Z'));
  await checkTheme(page, 'dark', 'the clock changed while the tab timer was suspended');
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await checkTheme(page, 'light', 'returning to the visible tab refreshes the theme immediately');
  await ctx.close();
}

for (const path of ['/', '/es/', '/privacy/', '/es/privacidad/']) {
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ timezoneId: 'UTC', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await setThemeTime(page, theme);
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await checkTheme(page, theme, `initial theme ${path} ${theme}`);
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    check(violations.length === 0, `axe ${path} ${theme}${violations.map((v) => `\n     ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join('')}`);
    await ctx.close();
  }
}

// Responsive signatures, focus, reduced motion and overflow in both themes.
for (const width of [320, 390, 768, 1024, 1440]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 800 },
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const theme of ['light', 'dark']) {
    await setThemeTime(page, theme);
    await page.emulateMedia({ colorScheme: theme === 'light' ? 'dark' : 'light' });
    for (const path of ['/', '/es/']) {
      await page.goto(base + path);
      const label = `${path} @${width}px ${theme}`;
      const signature = width < 528 ? 'fallscity-symbol.svg' : theme === 'dark' ? 'fallscity-inverse.svg' : 'wordmark.webp';
      const logo = await page.locator('.site-header .logo img:visible').evaluate((img) => ({
        src: img.currentSrc,
        loaded: img.complete && img.naturalWidth > 0,
        scheme: getComputedStyle(img).colorScheme,
      }));
      check(logo.src.endsWith('/brand/' + signature) && logo.loaded && logo.scheme === theme, `signature ${label}`);
      const cta = page.locator('.hero .primary');
      await page.keyboard.press('Tab');
      await cta.focus();
      const focus = await cta.evaluate((el) => {
        const style = getComputedStyle(el);
        return [style.outlineStyle, style.outlineColor];
      });
      const accent = theme === 'light' ? 'rgb(42, 76, 245)' : 'rgb(174, 187, 243)';
      check(focus[0] === 'solid' && focus[1] === accent, `hero action keyboard focus ${label}`);
      const layout = await page.evaluate(() => {
        const hero = document.querySelector('.hero');
        return {
          over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          contact: getComputedStyle(document.querySelector('.contact')).backgroundColor,
          ribbon: hero.querySelector('.hero-ribbon img').naturalWidth,
          animated: hero.getAnimations({ subtree: true }).length,
        };
      });
      check(layout.over === 0 && layout.ribbon === 870 && layout.animated === 0, `static hero and no horizontal overflow ${label}`);
      check(layout.contact === expected.dark.background, `Ink contact band ${label}`);
    }
  }
  await ctx.close();
}

// Normal motion hydrates the official effects, while the heading stays accessible.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/es/');
  const title = page.getByRole('heading', { level: 1, name: /Una web para conseguir más clientes/ });
  await title.locator('.split-word').first().waitFor();
  check(await title.isVisible(), 'Split Text animates the title while preserving its accessible name');
  const ribbon = page.locator('.hero-ribbon');
  check(await ribbon.locator('img').evaluate(image => image.decode().then(() => image.naturalWidth === 870)),
    'hero loads the ribbon from the original logo');
  check(await ribbon.evaluate(element => getComputedStyle(element, '::after').animationName === 'ribbon-light'),
    'hero sheen uses CSS without WebGL');
  await page.locator('.project-art').first().hover();
  check(await page.locator('.project-art').first().locator('.glare-hover__glare').count() === 1, 'project preview uses Glare Hover');
  const benefitSlides = page.locator('#benefit-slides');
  await benefitSlides.scrollIntoViewIfNeeded();
  await benefitSlides.locator('[data-playing] .art-found').waitFor();
  await page.waitForFunction(() => document.querySelector('.art-found .f-query').getAnimations().length === 1);
  check(true, 'first benefit illustration plays on entry');
  await benefitSlides.focus();
  await page.keyboard.press('End');
  await benefitSlides.locator('[data-playing] .art-one').waitFor();
  await page.keyboard.press('ArrowLeft');
  await benefitSlides.locator('[data-playing] .art-control').waitFor();
  check(await benefitSlides.locator('.art').count() === 6, 'keyboard changes to the selected animated benefit');
  check(await page.locator('#benefits button, #work button').count() === 0, 'both carousels omit visible controls');
  await page.locator('.visual-design').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.visual-design [data-visual-part]').style.opacity === '1');
  check(await page.locator('#services [data-visual]').count() === 9, 'each service and tool has a visual');
  await page.locator('[data-process-step]').last().scrollIntoViewIfNeeded();
  await page.locator('[data-process-step][data-step-lit]').last().waitFor();
  check(await page.locator('[data-process-step]').count() === 3, 'process shows three illustrated steps');
  const mail = page.locator('#contact .mail');
  await mail.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.star-border__light').width > 300);
  const hasStar = () => mail.locator('canvas').evaluate(canvas => {
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels.some((value, index) => index % 4 === 3 && value > 0);
  });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.star-border__light');
    return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 3 && value > 0);
  });
  await page.waitForTimeout(1800);
  check(!(await hasStar()), 'Star Border finishes one pass and clears its drawing');
  check(errors.length === 0, `no browser runtime errors (${errors.join('; ')})`);
  await ctx.close();
}

// Autoplay follows viewport visibility, and pauses on keyboard focus, mouse hover and touch.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.clock.install();
  await page.goto(base + '/');
  const portfolio = page.locator('#work [data-carousel]');
  const benefits = page.locator('#benefit-slides');
  const index = track => track.evaluate(el => Math.round(el.scrollLeft / el.clientWidth));
  const tick = async ms => {
    await page.clock.runFor(ms);
    await page.waitForTimeout(550);
    await page.clock.runFor(350);
  };
  await portfolio.scrollIntoViewIfNeeded();
  await portfolio.locator('[data-playing]').waitFor();
  await page.mouse.move(1, 120);
  await tick(7600);
  check(await index(portfolio) === 1, 'portfolio autoplays after entering view');
  await portfolio.hover();
  await tick(7600);
  check(await index(portfolio) === 1, 'mouse hover pauses portfolio autoplay');
  await portfolio.focus();
  await page.mouse.move(1, 120);
  await page.keyboard.press('End');
  await tick(600);
  check(await index(portfolio) === 3, 'keyboard reaches the last portfolio project');
  await tick(7600);
  check(await index(portfolio) === 3, 'keyboard focus pauses portfolio autoplay');
  await portfolio.evaluate(el => el.blur());
  await tick(8200);
  await page.waitForFunction(() => {
    const track = document.querySelector('#work [data-carousel]');
    return Math.abs(track.scrollLeft) < 1 && track.children.length === 4;
  });
  check(true, 'portfolio wraps and removes the temporary slide');

  await benefits.scrollIntoViewIfNeeded();
  await benefits.locator('[data-playing] .art-found').waitFor();
  await tick(8600);
  check(await index(benefits) === 1, 'benefits autoplays its next illustration');
  await benefits.dispatchEvent('pointerdown', { pointerType: 'touch', bubbles: true });
  await tick(8600);
  check(await index(benefits) === 1, 'touch pauses the benefits carousel');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await tick(8600);
  check(await index(benefits) === 1 && await benefits.locator('[data-playing]').count() === 0, 'reduced motion leaves the selected slide static');
  await ctx.close();
}

// Each portfolio link previews desktop and mobile together and scrolls both with the page.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const projects = page.locator('.project');
  check(await projects.count() === 4, 'four projects appear in the portfolio');
  const project = projects.first();
  const tracks = project.locator('[data-screen-track]');
  const offset = async () => tracks.evaluateAll(elements => elements.map(element =>
    new DOMMatrix(getComputedStyle(element).transform).m42
  ));
  check((await offset()).every(value => value === 0), 'both screens start on their first capture');
  await project.evaluate(element => {
    window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - innerHeight * 0.35, behavior: 'instant' });
  });
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.project:first-child [data-screen-track]')].every(track =>
      new DOMMatrix(getComputedStyle(track).transform).m42 < -40
    ),
  );
  check(await tracks.count() === 2, 'page scroll moves the content inside both screens');
  const previewImage = await project.locator('.laptop img').first().boundingBox();
  check(previewImage?.width > 260 && previewImage?.height > 150, 'desktop capture fills the project preview');
  const link = project.getByRole('link', { name: /Nina Romero/ });
  await page.keyboard.press('Tab');
  await link.focus();
  check(await link.evaluate(element => getComputedStyle(element).outlineStyle === 'solid'), 'project link has visible keyboard focus');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.project:first-child [data-screen-track]')].every(track =>
      getComputedStyle(track).transform === 'none'
    ),
  );
  check(true, 'reducing motion resets both screens to the first capture');
  await ctx.close();
}

// No JS: every section, client link and the first snapshot in each device remains available.
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(base + '/es/');
  await checkTheme(page, 'light', 'no-JS uses light even with a dark system preference', false);
  const n = await page.locator('main section').count();
  check(n === 7, `no-JS renders 7 sections (${n})`);
  check(await page.locator('.project-link').count() === 4, 'no-JS displays all project links');
  const image = page.locator('.project .phone img').first();
  check((await image.getAttribute('src'))?.includes('nina-home-mobile') && await image.isVisible(), 'no-JS displays the first mobile capture');
  await ctx.close();
}

// Contact: without a configured Worker (astro preview has no /api) only the email link shows
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const formVisible = await page.locator('#contact form').isVisible();
  const mail = await page.locator('#contact .contact-intro a[href^="mailto:info@fallscity.dev"]').count();
  check(!formVisible && mail === 1, `contact without delivery config: form hidden (${!formVisible}), ${mail} mailto link`);
  const langHref = await page.locator('.lang a[hreflang="es"]').getAttribute('href');
  check(langHref === '/es/?lang=es', `language switch sets the cookie through ?lang= (${langHref})`);
  await ctx.close();
}

// Contact form flow with the Worker and Turnstile mocked
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'UTC' });
  const page = await ctx.newPage();
  let posted;
  let reply = { status: 422, body: { ok: false, code: 'validation_error', fields: { email: 'invalid' } } };
  await page.route('**/api/inquiry/config', (route) => route.fulfill({ json: { enabled: true, siteKey: '1x00000000000000000000AA' } }));
  await page.route('**/api/inquiry', (route) => {
    posted = route.request().postDataJSON();
    return route.fulfill({ status: reply.status, json: reply.body });
  });
  await page.route('https://challenges.cloudflare.com/**', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: "let cb; window.turnstile = { render(el, o) { cb = o.callback; setTimeout(() => cb('stub-token'), 50); return 'w1'; }, reset() { setTimeout(() => cb('stub-token'), 50); } };",
  }));
  await page.goto(base + '/es/', { waitUntil: 'networkidle' });
  const form = page.locator('#contact form');
  await form.waitFor({ state: 'visible' });
  check(await page.locator('#contact').evaluate((el) => el.classList.contains('has-form')), 'form shows when the Worker reports delivery configured');

  await form.getByRole('button', { name: 'Enviar mensaje' }).click();
  const invalid = await form.locator('[aria-invalid="true"]').evaluateAll((els) => els.map((e) => e.name));
  check(JSON.stringify(invalid) === '["name","email","message","privacy"]', `empty submit marks required fields (${invalid})`);
  check(await page.evaluate(() => document.activeElement?.getAttribute('name')) === 'name', 'focus moves to the first invalid field');
  check((await page.locator('#e-name').textContent()) === 'Escribe tu nombre.', 'field errors are in Spanish on /es/');

  await form.getByLabel('Tu nombre').fill('Ada Lovelace');
  await form.getByLabel('Correo electrónico').fill('ada@example.com');
  await form.getByLabel('¿Qué necesitas?').fill('Una web con galería y reservas en línea para mi estudio.');
  await form.getByRole('checkbox').check();
  check(await form.locator('[aria-invalid="true"]').count() === 0, 'errors clear as fields are fixed');
  check(/\/ 3000/.test(await page.locator('[data-count]').textContent()), 'message shows a character counter');

  await form.getByRole('button', { name: 'Enviar mensaje' }).click();
  await page.locator('#e-email:not([hidden])').waitFor({ timeout: 8000 });
  check(posted?.['cf-turnstile-response'] === 'stub-token' && posted?.language === 'es' && posted?.privacy === true, 'payload carries token, language and consent');
  check(await form.getByLabel('Correo electrónico').getAttribute('aria-invalid') === 'true', 'server field errors are shown on the field');

  reply = { status: 503, body: { ok: false, code: 'not_configured' } };
  await form.getByRole('button', { name: 'Enviar mensaje' }).click();
  const errorBox = page.locator('[data-error]');
  await errorBox.waitFor({ state: 'visible', timeout: 8000 });
  const mailHref = await errorBox.locator('a').getAttribute('href');
  check(decodeURIComponent(mailHref).includes('galería y reservas'), 'send error offers email with the message prefilled');

  reply = { status: 202, body: { ok: true, code: 'accepted', id: 'x' } };
  await form.getByRole('button', { name: 'Enviar mensaje' }).click();
  await page.locator('[data-sent]').waitFor({ state: 'visible', timeout: 8000 });
  check((await page.locator('[data-sent-body]').textContent()).includes('ada@example.com'), 'success panel confirms the reply address');
  check(await page.evaluate(() => document.activeElement?.matches('[data-sent-title]')), 'focus moves to the success message');
  check(await page.evaluate(() => localStorage.getItem('fallscity-inquiry-draft')) === null, 'draft is cleared after sending');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    await setThemeTime(page, theme);
    const { violations } = await new AxeBuilder({ page }).include('#contact').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    check(violations.length === 0, `axe contact success ${theme}${violations.map((v) => `\n     ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join('')}`);
  }
  await page.getByRole('button', { name: 'Enviar otro mensaje' }).click();
  check(await form.isVisible() && (await form.getByLabel('Tu nombre').inputValue()) === '', '"send another" brings back an empty form');
  await form.getByRole('button', { name: 'Enviar mensaje' }).click();
  for (const theme of ['light', 'dark']) {
    await setThemeTime(page, theme);
    const { violations } = await new AxeBuilder({ page }).include('#contact').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    check(violations.length === 0, `axe contact form with errors ${theme}${violations.map((v) => `\n     ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join('')}`);
  }
  await mkdir(new URL('../artifacts/qa/', import.meta.url), { recursive: true });
  await page.locator('#contact').screenshot({ path: new URL('../artifacts/qa/contact-form-errors.png', import.meta.url).pathname });
  await ctx.close();
}

// The native mobile menu and FAQ remain operable with reduced motion.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/es/');
  const menu = page.getByLabel('Menú', { exact: true });
  await menu.focus();
  await page.keyboard.press('Enter');
  check(await page.locator('.mobile-nav').getAttribute('open') !== null, 'mobile navigation opens from the keyboard');
  await page.locator('.mobile-nav').getByRole('link', { name: 'Preguntas' }).click();
  check(new URL(page.url()).hash === '#faq', 'mobile navigation reaches the FAQ');
  const question = page.locator('.faq-list summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  check(await page.locator('.faq-list details[open]').first().locator('p').isVisible(), 'FAQ answers open from the keyboard');
  check(await page.locator('#services .service-card').first().isVisible(), 'services render in reduced motion');
  await page.locator('#benefit-slides').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('#benefit-slides').scrollLeft > 0);
  check(await page.locator('[data-playing]').count() === 0, 'keyboard works on the static carousel');

  await page.goto(base + '/es/privacidad/');
  const footer = page.getByRole('contentinfo');
  check(await footer.getByRole('link', { name: 'Trabajos' }).getAttribute('href') === '/es/#work', 'legal page footer links to the localized portfolio');
  check(await footer.getByRole('link', { name: 'Pedir una propuesta' }).getAttribute('href') === '/es/#contact', 'legal page footer links to the localized form');

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
