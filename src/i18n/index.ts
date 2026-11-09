// Every page exists in English (at the root) and Spanish (under /es/), with the
// same content. Pages live in src/pages/[...lang]/ and are generated once per
// language by `langPaths`. Shared interface strings live in `ui` below; page
// copy lives next to its markup as `{ en, es }` objects.

export type Lang = 'en' | 'es';
export const langs: readonly Lang[] = ['en', 'es'];
export const defaultLang: Lang = 'en';

/** BCP 47 tag used for <html lang>, hreflang, and JSON-LD inLanguage. */
export const langTag: Record<Lang, string> = { en: 'en-US', es: 'es-US' };

/** getStaticPaths for src/pages/[...lang]/: English at the root, Spanish under /es/. */
export const langPaths = () =>
  langs.map((lang) => ({ params: { lang: lang === defaultLang ? undefined : lang }, props: { lang } }));

/** The language a URL path belongs to. */
export const langFromPath = (pathname: string): Lang => (/^\/es(\/|$)/.test(pathname) ? 'es' : 'en');

/** Remove the language prefix: "/es/about/" -> "/about/". */
export const unlocalizePath = (pathname: string) => pathname.replace(/^\/es(?=\/|$)/, '') || '/';

/** Site-relative path (with an optional #fragment) in the given language. */
export const localizePath = (path: string, lang: Lang) => {
  const base = unlocalizePath(path);
  return lang === defaultLang ? base : `/es${base}`;
};

/** hreflang alternates for a page: every language plus x-default (English). */
export const alternatesFor = (pathname: string) => {
  const base = unlocalizePath(pathname);
  return [
    ...langs.map((lang) => ({ hreflang: langTag[lang], path: localizePath(base, lang) })),
    { hreflang: 'x-default', path: base },
  ];
};

/**
 * The same page in another language. The 404 page has no counterpart, so it
 * points at that language's home.
 */
export const counterpartPath = (pathname: string, lang: Lang) =>
  /^\/(es\/)?404(\.html|\/)?$/.test(pathname) ? localizePath('/', lang) : localizePath(pathname, lang);

/** Interface strings shared by layout and components. */
export const ui = {
  en: {
    skipLink: 'Skip to main content',
    homeLabel: 'Falls City Dev Studio, home',
    mainNav: 'Main navigation',
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
    breadcrumb: 'Breadcrumb',
    nav: [
      { label: 'Work', href: '/#work' },
      { label: 'Services', href: '/services/' },
      { label: 'Process', href: '/process/' },
      { label: 'About', href: '/about/' },
      { label: 'Contact', href: '/contact/' },
    ],
    quoteButton: 'Get a Website Quote',
    switchLabel: 'ES',
    switchAria: 'Ver esta página en español',
    footerStatement: 'Websites for Louisville small businesses, from design and development to hosting and maintenance.',
    footerExplore: 'Explore',
    footerServices: 'Services',
    footerStudio: 'Studio',
    footerQuote: 'Get a Website Quote',
    footerPrivacy: 'Privacy Notice',
    footerSitemap: 'Sitemap',
    footerSwitch: 'En español',
    footerPlace: 'Louisville, Kentucky · Serving businesses statewide',
    ctaEyebrow: 'Start a project',
    ctaTitle: 'Have a website project in mind?',
    ctaCopy: 'Tell us about your business and what you need from your website, and we’ll take it from there.',
    ctaButton: 'Let’s Discuss Your Project',
    exploreService: 'Explore this service',
    opensNewTab: '(opens in a new tab)',
    swipeHint: (count: number) => `Swipe to see all ${count} sites`,
    heroLogoLabel: 'Falls City Dev Studio logo mark in 3D: three city buildings with waterfalls pouring from them',
    socialImageAlt: 'Falls City Dev Studio: websites for the businesses that make Louisville work',
  },
  es: {
    skipLink: 'Saltar al contenido principal',
    homeLabel: 'Falls City Dev Studio, inicio',
    mainNav: 'Navegación principal',
    openNav: 'Abrir menú',
    closeNav: 'Cerrar menú',
    breadcrumb: 'Ruta de navegación',
    nav: [
      { label: 'Trabajos', href: '/#work' },
      { label: 'Servicios', href: '/services/' },
      { label: 'Proceso', href: '/process/' },
      { label: 'Nosotros', href: '/about/' },
      { label: 'Contacto', href: '/contact/' },
    ],
    quoteButton: 'Pida una cotización',
    switchLabel: 'EN',
    switchAria: 'View this page in English',
    footerStatement: 'Páginas web para pequeños negocios de Louisville, del diseño y desarrollo al hosting y mantenimiento.',
    footerExplore: 'Explorar',
    footerServices: 'Servicios',
    footerStudio: 'Estudio',
    footerQuote: 'Pida una cotización',
    footerPrivacy: 'Aviso de privacidad',
    footerSitemap: 'Mapa del sitio',
    footerSwitch: 'In English',
    footerPlace: 'Louisville, Kentucky · Atendemos negocios en todo el estado',
    ctaEyebrow: 'Empiece un proyecto',
    ctaTitle: '¿Tiene un proyecto de página web en mente?',
    ctaCopy: 'Cuéntenos de su negocio y qué necesita de su página web, y nosotros nos encargamos del resto.',
    ctaButton: 'Hablemos de su proyecto',
    exploreService: 'Ver este servicio',
    opensNewTab: '(se abre en una pestaña nueva)',
    swipeHint: (count: number) => `Deslice para ver los ${count} sitios`,
    heroLogoLabel: 'Logo de Falls City Dev Studio en 3D: tres edificios con cascadas que caen de ellos',
    socialImageAlt: 'Falls City Dev Studio: páginas web para los negocios que mueven Louisville',
  },
} satisfies Record<Lang, unknown>;
