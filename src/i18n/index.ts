export type Lang = 'en' | 'es';
export type RouteKey = 'home' | 'panel' | 'pricing' | 'local-seo' | 'work' | 'barbershops' | 'salons' | 'nails' | 'piercing' | 'process' | 'about' | 'contact' | 'privacy' | 'brand-preview';

export const indexableRoutes = ['home', 'panel', 'pricing', 'local-seo', 'work', 'barbershops', 'salons', 'nails', 'piercing', 'process', 'about', 'contact'] as const;

export function localizePath(lang: Lang, route: RouteKey): string {
  const base = route === 'home' ? '/' : `/${route}/`;
  return lang === 'es' ? `/es${base}` : base;
}

export function oppositeLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

export function htmlLang(lang: Lang): string {
  return lang === 'en' ? 'en-US' : 'es-US';
}
