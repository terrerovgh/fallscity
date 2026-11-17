import type { APIRoute } from 'astro';
import { business } from '../config/business';
import { indexableRoutes, localizePath } from '../i18n';

export const GET: APIRoute = () => {
  const urls = indexableRoutes.flatMap((route) => (['en', 'es'] as const).map((lang) => {
    const url = `${business.url}${localizePath(lang, route)}`;
    return `<url><loc>${url}</loc><xhtml:link rel="alternate" hreflang="en-US" href="${business.url}${localizePath('en', route)}"/><xhtml:link rel="alternate" hreflang="es-US" href="${business.url}${localizePath('es', route)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${business.url}${localizePath('en', route)}"/></url>`;
  })).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
