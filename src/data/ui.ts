import type { Lang, RouteKey } from '../i18n';

export const routeLabels: Record<Lang, Record<RouteKey, string>> = {
  en: {
    home: 'Home', panel: 'Your panel', pricing: 'Pricing', 'local-seo': 'Local SEO', work: 'Work', barbershops: 'Barbershops', salons: 'Hair salons', nails: 'Nail salons', piercing: 'Piercing', process: 'Process', about: 'About', contact: 'Contact', privacy: 'Privacy', 'brand-preview': 'Brand preview',
  },
  es: {
    home: 'Inicio', panel: 'Su panel', pricing: 'Precios', 'local-seo': 'SEO local', work: 'Proyectos', barbershops: 'Barberías', salons: 'Salones de belleza', nails: 'Salones de uñas', piercing: 'Piercing', process: 'Proceso', about: 'Estudio', contact: 'Contacto', privacy: 'Privacidad', 'brand-preview': 'Vista de marca',
  },
};

export const ui = {
  en: {
    skip: 'Skip to content', menu: 'Menu', close: 'Close menu', navigation: 'Main navigation', footerNavigation: 'Footer navigation', language: 'Español', languageLabel: 'View this page in Spanish', cta: 'Let’s talk about your site', secondaryCta: 'Explore the work', email: 'Email us', location: 'Louisville, Kentucky · Working remotely across the US', copyright: 'Falls City Dev Studio', back: 'Back to home', notFoundTitle: 'This page is not in the portfolio.', notFoundCopy: 'The address may have changed. Find your way through the selected work or start a conversation.', next: 'Next', previous: 'Previous',
  },
  es: {
    skip: 'Saltar al contenido', menu: 'Menú', close: 'Cerrar menú', navigation: 'Navegación principal', footerNavigation: 'Navegación de pie de página', language: 'English', languageLabel: 'Ver esta página en inglés', cta: 'Hablemos de su web', secondaryCta: 'Ver proyectos', email: 'Escríbanos', location: 'Louisville, Kentucky · Trabajo remoto en Estados Unidos', copyright: 'Falls City Dev Studio', back: 'Volver al inicio', notFoundTitle: 'Esta página no está en el portafolio.', notFoundCopy: 'Puede que la dirección haya cambiado. Consulte los proyectos seleccionados o inicie una conversación.', next: 'Siguiente', previous: 'Anterior',
  },
} as const;

export const mainRoutes: RouteKey[] = ['work', 'panel', 'pricing', 'contact'];
export const footerRoutes: RouteKey[] = ['process', 'local-seo', 'about', 'contact', 'privacy'];
export const tradeRoutes: RouteKey[] = ['barbershops', 'salons', 'nails', 'piercing'];
