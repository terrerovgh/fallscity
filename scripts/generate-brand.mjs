import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const geometry = JSON.parse(await readFile(new URL('../src/config/brand-geometry.json', import.meta.url), 'utf8'));
const out = new URL('../public/brand/', import.meta.url);
await mkdir(out, { recursive: true });
const cobalt = '#3155e7';
const ink = '#171814';
const paper = '#f2f2e9';

const symbolContent = (first = cobalt, second = ink) => `<path fill="${first}" d="${geometry.symbol.paths[0]}"/><path fill="${second}" d="${geometry.symbol.paths[1]}"/>`;
const wordmarkContent = (color = ink) => `<path fill="${color}" transform="${geometry.wordmark.transform}" d="${geometry.wordmark.path}"/>`;
const svg = (viewBox, content, title = 'Falls City Dev Studio') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title"><title id="title">${title}</title>${content}</svg>`;
const symbol = (first, second) => svg(geometry.symbol.viewBox, symbolContent(first, second), 'Falls City symbol');
const wordmark = (color) => {
  const { width, height } = geometry.wordmark;
  return svg(`0 0 ${width} ${height}`, wordmarkContent(color), 'Falls City');
};
const horizontal = (color, accent = color) => {
  const scale = 30 / geometry.wordmark.height;
  const width = 48 + geometry.wordmark.width * scale;
  return svg(`0 0 ${width} 40`, `<g>${symbolContent(accent, color)}</g><g transform="translate(48 5) scale(${scale})">${wordmarkContent(color)}</g>`);
};
const outlinedText = (line, x, y, height, color) => `<g transform="translate(${x} ${y}) scale(${height / line.height})"><path fill="${color}" transform="${line.transform}" d="${line.path}"/></g>`;
const social = (lang) => {
  const isEs = lang === 'es';
  const lines = geometry.social[lang];
  const logoScale = 38 / geometry.wordmark.height;
  const content = `<rect width="1200" height="630" fill="${paper}"/><rect x="930" width="270" height="630" fill="${cobalt}"/><path d="M0 530H930" stroke="#b9bbae"/><g transform="translate(64 54) scale(1.15)">${symbolContent(cobalt, ink)}</g><g transform="translate(126 61) scale(${logoScale})">${wordmarkContent(ink)}</g>${outlinedText(lines[0], 64, 220, 100, ink)}${outlinedText(lines[1], 64, 340, 100, cobalt)}<text x="64" y="574" fill="${ink}" font-family="sans-serif" font-size="20" letter-spacing="2">${isEs ? 'PÁGINAS WEB PARA TATUADORES Y ESTUDIOS' : 'WEBSITES FOR TATTOO ARTISTS &amp; STUDIOS'}</text><g transform="translate(1000 230) scale(4)">${symbolContent(paper, paper)}</g>`;
  return svg('0 0 1200 630', content, isEs ? 'Falls City — Una web a la altura de su trabajo' : 'Falls City — A website worthy of your work');
};

const files = {
  'symbol-cobalt.svg': symbol(cobalt, cobalt),
  'symbol-dark.svg': symbol(ink, ink),
  'symbol-light.svg': symbol(paper, paper),
  'symbol-color.svg': symbol(cobalt, ink),
  'wordmark-dark.svg': wordmark(ink),
  'wordmark-light.svg': wordmark(paper),
  'logo-horizontal-color.svg': horizontal(ink, cobalt),
  'logo-horizontal-dark.svg': horizontal(ink),
  'logo-horizontal-light.svg': horizontal(paper),
  'logo-compact-dark.svg': symbol(ink, ink),
  'logo-compact-light.svg': symbol(paper, paper),
  'favicon.svg': svg('0 0 40 40', `<rect width="40" height="40" rx="6" fill="${paper}"/><g transform="translate(5 5) scale(.75)">${symbolContent(cobalt, ink)}</g>`, 'Falls City'),
  'social-en.svg': social('en'),
  'social-es.svg': social('es')
};
for (const [name, content] of Object.entries(files)) await writeFile(new URL(name, out), content);

const raster = async (source, target, width, height) => {
  let image = sharp(Buffer.from(source));
  if (width || height) image = image.resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  await image.png().toFile(fileURLToPath(new URL(target, out)));
};
await raster(files['favicon.svg'], 'favicon-32.png', 32, 32);
await raster(files['favicon.svg'], 'apple-touch-icon.png', 180, 180);
await raster(files['symbol-cobalt.svg'], 'symbol-16.png', 16, 16);
await raster(files['symbol-cobalt.svg'], 'symbol-24.png', 24, 24);
await raster(files['symbol-cobalt.svg'], 'symbol-32.png', 32, 32);
await raster(files['logo-horizontal-color.svg'], 'logo-horizontal-color.png', 600);
await raster(files['logo-horizontal-light.svg'], 'logo-horizontal-light.png', 600);
await raster(files['social-en.svg'], 'social-en.png', 1200, 630);
await raster(files['social-es.svg'], 'social-es.png', 1200, 630);
console.log(`Generated ${Object.keys(files).length} SVG files and 9 PNG exports in public/brand/`);
