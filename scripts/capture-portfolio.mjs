import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = process.cwd();
const researchDir = path.join(root, 'artifacts/research');
const workDir = path.join(root, 'src/assets/work');
const manifestPath = path.join(root, 'assets/sources.json');
const only = process.argv.find((arg) => arg.startsWith('--only='))?.split('=')[1];
const skipReferences = process.argv.includes('--portfolio-only');
const viewports = [
  { id: 'mobile', width: 390, height: 844 },
  { id: 'desktop', width: 1440, height: 900 },
];

const shot = (id, description, options = {}) => ({ id, description, ...options });
const portfolio = [
  {
    slug: '01-goodnina',
    name: 'Nina Romero',
    url: 'https://goodnina.com/',
    shots: [
      shot('home', 'Inicio con identidad de Nina Romero, fotografía floral, localización y especialidad en línea fina; la navegación móvil permanece plegada.'),
      shot('about', 'Presentación pública de la artista y descripción de su trabajo floral, ornamental y de línea fina.', { selector: '#sobre' }),
      shot('booking-link', 'Sección pública de reserva con enlace a la herramienta externa Venue.ink; no se abrió ni envió una reserva.', { selector: '#agendar' }),
      shot('gallery', 'Galería pública con controles para filtrar por floral, ornamental, lettering y línea fina.', { url: 'https://goodnina.com/galeria/', selector: 'main', optimize: true }),
      shot('gallery-floral', 'Filtro FLORAL activado con su botón público; muestra la selección resultante sin alterar el DOM.', { url: 'https://goodnina.com/galeria/', selector: 'main', action: { role: 'button', name: 'FLORAL', exact: false } }),
    ],
  },
  {
    slug: '02-tonypixel',
    name: 'Pixel Tattoo',
    url: 'https://tonypixeltattoo.com/',
    shots: [
      shot('home', 'Inicio de Pixel Tattoo con realismo, ubicación en Montevideo, enlace al portfolio y contacto por WhatsApp.'),
      shot('gallery', 'Portfolio público con filtros por estilo y tarjetas identificadas por motivo, estilo y zona del cuerpo.', { selector: '#portfolio' }),
      shot('gallery-realismo', 'Filtro Realismo activado con su botón público y resultados visibles; no se inyectaron estilos ni contenido.', { selector: '#portfolio', action: { role: 'tab', name: 'Realismo', exact: true } }),
      shot('artist', 'Información pública de Antonio «Tony» Otero, especialidades y estudio Tempel Tattoo Studio.', { selector: '#artista' }),
      shot('inquiry', 'Formulario visible de consulta con nombre, estilo, zona, tamaño y detalles; acciones de WhatsApp y copiar consulta no ejecutadas.', { selector: '#turnos' }),
    ],
  },
  {
    slug: '03-catandcobra',
    name: 'Cat & Cobra',
    url: 'https://www.terrerov.com/catandcobra/',
    shots: [
      shot('home', 'Inicio de Cat & Cobra con identidad del estudio, localización y enlace público para reservar.'),
      shot('recent-gallery', 'Muestra de trabajos recientes etiquetados por estilo y artista, con enlace a la galería completa.', { selector: 'h2:has-text("Recent ink")' }),
      shot('gallery', 'Galería completa con grupos de filtros visibles por estilo, artista y tipo de diseño.', { url: 'https://www.terrerov.com/catandcobra/gallery', selector: 'main' }),
      shot('gallery-horror', 'Filtro Horror activado mediante el botón público de estilo; resultados y etiquetas visibles.', { url: 'https://www.terrerov.com/catandcobra/gallery', selector: 'main', action: { role: 'button', name: 'Horror', exact: true } }),
      shot('artists', 'Directorio público de cinco artistas con especialidades, enlaces de seguimiento y reserva individual.', { url: 'https://www.terrerov.com/catandcobra/artists', selector: 'main' }),
      shot('booking', 'Página pública de reserva con tres pasos, depósito mencionado en el paso tres y selección de artista; no se envió ninguna consulta.', { url: 'https://www.terrerov.com/catandcobra/booking', selector: 'main' }),
    ],
  },
  {
    slug: '04-leeyrealty',
    name: 'Leey Hernandez',
    url: 'https://leeyrealty.com/',
    shots: [shot('home', 'Inicio solicitado del sitio inmobiliario; pendiente de evidencia visual por bloqueo de origen.')],
  },
  {
    slug: '05-durafence',
    name: 'Dura Fence Metal',
    url: 'https://durafencemetal.com/',
    shots: [shot('home', 'Inicio solicitado del catálogo de cercas; pendiente de evidencia visual por bloqueo de origen.')],
  },
  {
    slug: '06-allneeds',
    name: 'All Needs Discount',
    url: 'https://allneedsdiscount.com/',
    shots: [shot('home', 'Inicio solicitado del sitio de remodelación; pendiente de evidencia visual por bloqueo de origen.')],
  },
];

const references = [
  {
    slug: 'reference-scroll-landing',
    name: 'Scroll-driven Animations — índice',
    category: 'scroll-reference',
    url: 'https://scroll-driven-animations.style/',
    shots: [
      shot('start', 'Estado inicial de la portada y explicación de animaciones vinculadas al desplazamiento.', { fraction: 0 }),
      shot('demos', 'Catálogo de demostraciones, con relación visible entre título, descripción y enlaces CSS/JS.', { selector: '#card-progress-bar' }),
      shot('tools-transition', 'Transición del catálogo de demos hacia herramientas y curso, útil para estudiar ritmo editorial.', { selector: '#card-scroll-timeline-progress' }),
    ],
  },
  {
    slug: 'reference-scroll-progress',
    name: 'Scroll-driven Animations — progress bar',
    category: 'scroll-demo',
    url: 'https://scroll-driven-animations.style/demos/progress-bar/css/',
    shots: [
      shot('start', 'Demo CSS de progreso de lectura al inicio del documento.', { fraction: 0 }),
      shot('middle', 'Demo CSS de progreso de lectura en la mitad del recorrido.', { fraction: 0.5 }),
      shot('end', 'Demo CSS de progreso de lectura al final del recorrido.', { fraction: 1 }),
    ],
  },
  {
    slug: 'reference-scroll-cover-header',
    name: 'Scroll-driven Animations — cover to fixed header',
    category: 'scroll-demo',
    url: 'https://scroll-driven-animations.style/demos/cover-to-fixed-header/css/',
    shots: [
      shot('start', 'Portada expandida al inicio de la demo de transformación a cabecera fija.', { fraction: 0 }),
      shot('middle', 'Estado intermedio de la transformación entre portada y cabecera.', { fraction: 0.5 }),
      shot('end', 'Estado avanzado con cabecera compacta y contenido desplazado.', { fraction: 1 }),
    ],
  },
  {
    slug: 'reference-scroll-image-reveal',
    name: 'Scroll-driven Animations — image reveal',
    category: 'scroll-demo',
    url: 'https://scroll-driven-animations.style/demos/image-reveal/css/',
    shots: [
      shot('start', 'Inicio de la demo CSS de revelado de imágenes.', { fraction: 0 }),
      shot('middle', 'Estado intermedio del revelado vinculado a la posición de las imágenes.', { fraction: 0.5 }),
      shot('end', 'Estado final del recorrido de revelado de imágenes.', { fraction: 1 }),
    ],
  },
  {
    slug: 'reference-scroll-stacking-cards',
    name: 'Scroll-driven Animations — stacking cards',
    category: 'scroll-demo',
    url: 'https://scroll-driven-animations.style/demos/stacking-cards/css/',
    shots: [
      shot('start', 'Inicio de la demo de tarjetas apiladas.', { fraction: 0 }),
      shot('middle', 'Estado intermedio del apilado durante scroll vertical.', { fraction: 0.5 }),
      shot('end', 'Estado avanzado del apilado y continuidad del contenido.', { fraction: 1 }),
    ],
  },
  {
    slug: 'reference-itsnicethat',
    name: 'It’s Nice That',
    category: 'editorial',
    url: 'https://www.itsnicethat.com/',
    shots: [shot('home', 'Portada editorial de referencia para jerarquía, escala tipográfica y ritmo entre piezas.')],
  },
  {
    slug: 'reference-designboom',
    name: 'designboom',
    category: 'editorial',
    url: 'https://www.designboom.com/',
    shots: [shot('home', 'Portada editorial de referencia para densidad de imágenes y priorización de historias.')],
  },
  {
    slug: 'reference-arena',
    name: 'Are.na',
    category: 'interaction',
    url: 'https://www.are.na/',
    shots: [shot('home', 'Referencia de interacción y organización de contenido mediante conexiones y colecciones.')],
  },
  {
    slug: 'reference-readymag',
    name: 'Readymag',
    category: 'interaction',
    url: 'https://readymag.com/',
    shots: [shot('home', 'Referencia de interacción editorial y composición responsive de un producto de publicación visual.')],
  },
  {
    slug: 'reference-pentagram',
    name: 'Pentagram',
    category: 'identity',
    url: 'https://www.pentagram.com/',
    shots: [shot('home', 'Referencia de identidad: presentación pública de trabajos y consistencia de una marca de estudio.')],
  },
];

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const relative = (file) => path.relative(root, file).split(path.sep).join('/');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function dismissOverlays(page) {
  const dismissed = [];
  const patterns = [
    { role: 'button', name: /^(i accept|accept all|accept cookies|accept|agree|allow all|aceptar todas|aceptar)$/i },
    { role: 'button', name: /^(close|dismiss|cerrar)$/i },
  ];
  for (const pattern of patterns) {
    const controls = page.getByRole(pattern.role, { name: pattern.name });
    const count = Math.min(await controls.count(), 3);
    for (let index = 0; index < count; index += 1) {
      const control = controls.nth(index);
      try {
        if (await control.isVisible()) {
          const label = (await control.innerText()).trim();
          await control.click({ timeout: 2500 });
          dismissed.push(label || String(pattern.name));
          await page.waitForTimeout(300);
        }
      } catch {
        // A control disappearing while iterating needs no further action.
      }
    }
  }
  return dismissed;
}

async function gradualLoad(page, maxY = 30000) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const limit = Math.min(Math.max(height - 1, 0), maxY);
  const step = Math.max(Math.floor((await page.viewportSize()).height * 0.7), 420);
  for (let y = 0; y <= limit; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  try {
    await page.evaluate(async () => {
      const ready = (async () => {
        await document.fonts.ready;
        const images = [...document.images].filter((image) => image.getBoundingClientRect().width > 0);
        await Promise.allSettled(images.map((image) => image.decode()));
      })();
      await Promise.race([ready, new Promise((resolve) => setTimeout(resolve, 8000))]);
    });
  } catch {
    // Individual broken images are recorded separately; they do not invalidate the whole page.
  }
  await page.waitForTimeout(700);
}

async function animationStates(page) {
  return page.evaluate(() => document.getAnimations().slice(0, 16).map((animation) => {
    const target = animation.effect && 'target' in animation.effect ? animation.effect.target : null;
    const style = target ? getComputedStyle(target) : null;
    return {
      target: target ? `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}${target.classList.length ? `.${[...target.classList].slice(0, 3).join('.')}` : ''}` : null,
      playState: animation.playState,
      currentTime: animation.currentTime === null ? null : String(animation.currentTime),
      transform: style?.transform ?? null,
      opacity: style?.opacity ?? null,
    };
  }));
}

async function positionShot(page, spec, viewport) {
  if (spec.selector) {
    const target = page.locator(spec.selector).first();
    await target.waitFor({ state: 'attached', timeout: 12000 });
    await target.evaluate((element, offset) => {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    }, viewport.id === 'mobile' ? 64 : 80);
  } else {
    const fraction = spec.fraction ?? 0;
    await page.evaluate((value) => {
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: max * value, behavior: 'instant' });
    }, fraction);
  }
  await page.waitForTimeout(650);
  return page.evaluate(() => ({ scrollY: Math.round(window.scrollY), scrollHeight: document.documentElement.scrollHeight }));
}

async function optimizeOriginal(file, site, spec, viewport) {
  const widths = viewport.id === 'mobile' ? [390] : [480, 960, 1440];
  const source = sharp(file);
  const metadata = await source.metadata();
  const derivatives = [];
  for (const width of widths.filter((value) => value <= (metadata.width ?? viewport.width))) {
    for (const format of ['webp', 'avif']) {
      const output = path.join(workDir, `${site.slug}-${spec.id}-${viewport.id}-${width}.${format}`);
      let pipeline = sharp(file).resize({ width, withoutEnlargement: true });
      pipeline = format === 'webp' ? pipeline.webp({ quality: 82 }) : pipeline.avif({ quality: 50, effort: 4 });
      const buffer = await pipeline.toBuffer();
      await writeFile(output, buffer);
      const outputMetadata = await sharp(buffer).metadata();
      derivatives.push({
        file: relative(output),
        format,
        width: outputMetadata.width,
        height: outputMetadata.height,
        bytes: buffer.length,
        sha256: sha256(buffer),
      });
    }
  }
  return derivatives;
}

async function captureSite(browser, site, viewport, category) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    locale: 'en-US',
  });
  console.log(`loading ${site.slug}/${viewport.id}`);
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const entries = [];
  const requestFailures = [];
  page.on('requestfailed', (request) => {
    requestFailures.push({ url: request.url(), error: request.failure()?.errorText ?? 'unknown' });
  });
  let currentUrl = null;
  let preparedUrl = null;
  let dismissed = [];
  let navigationStatus = null;
  let pageTitle = null;
  for (const spec of site.shots) {
    const targetUrl = spec.url ?? site.url;
    const capturedAt = new Date().toISOString();
    const base = {
      project: site.name,
      slug: site.slug,
      category,
      shot: spec.id,
      originalUrl: targetUrl,
      requestedSiteUrl: site.url,
      viewport: { id: viewport.id, width: viewport.width, height: viewport.height },
      capturedAt,
      selector: spec.selector ?? null,
      scrollFraction: spec.fraction ?? (spec.selector ? null : 0),
      description: spec.description,
    };
    try {
      if (currentUrl !== targetUrl) {
        const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        navigationStatus = response?.status() ?? null;
        currentUrl = targetUrl;
        preparedUrl = null;
        pageTitle = await page.title();
      }
      const bodyText = (await page.locator('body').innerText()).slice(0, 2500);
      const blocking = /Error 1000|DNS points to prohibited IP|Just a moment|Access denied|403 Forbidden/i.test(`${pageTitle}\n${bodyText}`);
      if (blocking || (navigationStatus !== null && navigationStatus >= 400)) {
        entries.push({
          ...base,
          finalUrl: page.url(),
          httpStatus: navigationStatus,
          pageTitle,
          status: 'blocked',
          file: null,
          sha256: null,
          position: null,
          blocker: `La página devolvió HTTP ${navigationStatus ?? 'desconocido'} y un bloqueo/error visible: ${pageTitle}. No se guardó la pantalla de error como evidencia de portfolio.`,
        });
        continue;
      }
      if (preparedUrl !== targetUrl) {
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        dismissed = await dismissOverlays(page);
        await gradualLoad(page, category === 'portfolio' ? 50000 : 16000);
        dismissed.push(...await dismissOverlays(page));
        dismissed = [...new Set(dismissed)];
        preparedUrl = targetUrl;
      }
      if (spec.action) {
        const control = page.getByRole(spec.action.role, { name: spec.action.name, exact: spec.action.exact ?? false }).first();
        await control.click({ timeout: 5000 });
        await page.waitForTimeout(500);
      }
      const position = await positionShot(page, spec, viewport);
      const output = path.join(researchDir, site.slug, `${spec.id}-${viewport.id}.png`);
      await mkdir(path.dirname(output), { recursive: true });
      await page.screenshot({ path: output, fullPage: false, animations: 'allow' });
      const buffer = await readFile(output);
      const imageMetadata = await sharp(buffer).metadata();
      const images = await page.locator('img').evaluateAll((elements) => ({
        total: elements.length,
        loaded: elements.filter((image) => image.complete && image.naturalWidth > 0).length,
        failed: elements.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src).slice(0, 20),
      }));
      const entry = {
        ...base,
        finalUrl: page.url(),
        httpStatus: navigationStatus,
        pageTitle,
        status: 'captured-awaiting-visual-review',
        file: relative(output),
        sha256: sha256(buffer),
        bytes: buffer.length,
        pixelSize: { width: imageMetadata.width, height: imageMetadata.height },
        position,
        action: spec.action ?? null,
        overlaysDismissed: dismissed,
        images,
        animationStates: category.startsWith('scroll') ? await animationStates(page) : [],
        requestFailures: requestFailures.slice(-12),
      };
      if (category === 'portfolio') entry.derivatives = await optimizeOriginal(output, site, spec, viewport);
      entries.push(entry);
      console.log(`captured ${site.slug}/${spec.id}/${viewport.id}`);
    } catch (error) {
      entries.push({
        ...base,
        finalUrl: page.url(),
        httpStatus: navigationStatus,
        pageTitle,
        status: 'blocked',
        file: null,
        sha256: null,
        position: null,
        blocker: error instanceof Error ? error.message : String(error),
      });
      console.error(`blocked ${site.slug}/${spec.id}/${viewport.id}: ${error instanceof Error ? error.message : error}`);
    }
  }
  await context.close();
  return entries;
}

await mkdir(researchDir, { recursive: true });
await mkdir(workDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const sites = [...portfolio, ...(skipReferences ? [] : references)].filter((site) => !only || site.slug.includes(only));
const captures = [];
try {
  for (const site of sites) {
    for (const viewport of viewports) {
      captures.push(...await captureSite(browser, site, viewport, site.category ?? 'portfolio'));
    }
  }
} finally {
  await browser.close();
}

let outputCaptures = captures;
if (only) {
  try {
    const previous = JSON.parse(await readFile(manifestPath, 'utf8'));
    const selectedSlugs = new Set(sites.map((site) => site.slug));
    outputCaptures = [...previous.captures.filter((entry) => !selectedSlugs.has(entry.slug)), ...captures];
  } catch {
    console.log('No previous manifest available to merge; writing the selected captures only.');
  }
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  tool: { playwright: '1.65.1', browser: 'Chromium', sharp: '0.35.5' },
  capturePolicy: {
    viewports,
    originals: 'PNG sin recolorear ni modificar el DOM para inventar apariencia; desplazamiento gradual y espera de fuentes/imágenes.',
    interactions: 'Solo controles públicos normales. No se enviaron formularios, correos, reservas ni mensajes.',
    review: 'El estado inicial awaiting-visual-review debe cambiarse a verified únicamente después de abrir y revisar el PNG.',
    rights: 'Uso interno de investigación y demostración local autorizada. La disponibilidad pública no equivale a licencia publicitaria; revisar derechos antes del lanzamiento.',
  },
  captures: outputCaptures,
  blocked: outputCaptures.filter((entry) => entry.status === 'blocked').map((entry) => ({
    slug: entry.slug,
    shot: entry.shot,
    viewport: entry.viewport.id,
    url: entry.finalUrl ?? entry.originalUrl,
    capturedAt: entry.capturedAt,
    reason: entry.blocker,
  })),
};
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifest: ${relative(manifestPath)} (${outputCaptures.length} entries; ${manifest.blocked.length} blocked)`);
