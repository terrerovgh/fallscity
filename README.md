# Falls City Dev Studio

Sitio comercial bilingüe para tatuadores y estudios, construido con Astro estático, TypeScript, CSS propio y un Cloudflare Worker. La entrega es local; no se ha desplegado ni se ha enviado correo externo.

## Arranque

Requisitos: Node 22.12 o superior (verificado con Node 26.12.0).

```bash
npm install
npm run dev
```

Desarrollo: `http://localhost:4321/`.

```bash
npm run check
npm run build
npm run preview
```

Preview de producción estática: `http://localhost:4321/`. Astro preview no ejecuta el Worker. Para probar routing e inquiry con Workers, use `npm run test:worker`, que inicia Wrangler después de construir.

## Verificación

```bash
npm test
npm run audit:lighthouse
```

`npm test` incluye tipos, build, auditoría SEO, 32 grupos de Worker, rutas EN/ES en varios tamaños, Axe, interacciones, CTA móvil sin superposición, no-JS, reduced-motion y posiciones/reversa de scroll. Playwright puede requerir `npx playwright install chromium firefox webkit` en una máquina nueva.

- Capturas: `artifacts/screenshots/`.
- Recorrido móvil: `artifacts/video/falls-city-mobile-tour.webm`.
- Evidencia de movimiento: `artifacts/motion/`.
- Resultados UI/Axe/motores: `artifacts/qa/ui-results.json`.
- Lighthouse y traza: `artifacts/lighthouse/`, `artifacts/performance/`.
- Informe interpretado: `docs/qa-report.md`.

## Marca

```bash
npm run brand
```

Regenera SVG/PNG desde `src/config/brand-geometry.json`. No edite exportaciones manualmente. Para cambiar las letras, los scripts Python `derive-wordmark.py` y `derive-social.py` reconstruyen la geometría desde las fuentes originales en `assets/fonts/`; requieren FontTools y Brotli en un entorno local. Las fuentes finales autoalojadas y licencias OFL están en `public/fonts/`.

Vista noindex: `/brand-preview/` y `/es/brand-preview/`.

## Capturas de proyectos

```bash
npm run capture:portfolio
node scripts/capture-portfolio.mjs --only=01-goodnina
node scripts/capture-portfolio.mjs --portfolio-only
```

Las nuevas capturas quedan como `captured-awaiting-visual-review` hasta que se abran y revisen. El manifest incluye origen, fecha, viewport, posición, hash y derivados. Tres sitios presentaron bloqueo Cloudflare durante esta entrega; consulte `docs/research.md`. Derechos de uso público pendientes de revisión antes del lanzamiento.

## Formulario opcional

La versión local se muestra como **no configurada** y deshabilita el envío. `info@fallscity.dev` sigue disponible.

Para una configuración real, después de revisión y autorización:

1. Configure el Worker con `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `INQUIRY_TO_EMAIL` e `INQUIRY_FROM_EMAIL` en `.dev.vars` para local o como secretos de Cloudflare para producción.
2. Use un remitente Resend efectivamente verificado y una cuenta Turnstile autorizada.
3. En el build de Astro, defina `PUBLIC_TURNSTILE_SITE_KEY` y `PUBLIC_INQUIRY_ENABLED=true`. Esta última variable solo habilita la UI; no sustituye los secretos del Worker.
4. Pruebe con mocks y Wrangler. Nunca exponga secretos en variables `PUBLIC_*`.

Una respuesta `202 accepted` significa que Resend aceptó el mensaje para entrega, **no** que llegó al buzón. No hay base de datos de consultas en la web. No se activó analítica ni publicidad.

## Publicación pendiente de autorización

No se han ejecutado despliegue, DNS, compras ni configuración de proveedores. Antes de publicar:

- Revisión del propietario/legal de `/privacy/` y retención real.
- Revisión de derechos de las capturas.
- Configuración y verificación de Turnstile/Resend y remitente.
- `npm test`, Lighthouse y revisión visual final sobre el build.
- Después, con autorización expresa: `npm run build`, `npx wrangler deploy`, dominio `fallscity.dev` y comprobaciones en producción.

La configuración está en `wrangler.jsonc`: assets `dist`, Worker primero para páginas/API, exclusiones para `/_astro/*` y `/brand/*`. No hay carpeta Pages `functions/`.

## Contenido y mantenimiento

Precios y extras: `src/data/pricing.ts`. Proceso, FAQ, oficios y páginas: `src/data/`. Rutas: `src/i18n/index.ts`. No duplique importes ni prefijos `/es/` en páginas. La geometría de marca, datos comerciales y evidencia tienen una sola fuente de verdad.

Más detalles: `docs/handoff.md`, `docs/brand-guide.md`, `docs/motion-spec.md`, `docs/decisions.md` y `docs/progress.md`.
