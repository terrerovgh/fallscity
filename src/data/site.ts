// Single source of content for the site. Every visible string is { en, es }.
// Rule: describe only what exists. No invented clients, numbers, reviews or prices.
import type { ImageMetadata } from 'astro';

export type Lang = 'en' | 'es';
export type L = Record<Lang, string>;

export const langs: Lang[] = ['en', 'es'];
export const homePath: Record<Lang, string> = { en: '/', es: '/es/' };
export const privacyPath: Record<Lang, string> = { en: '/privacy/', es: '/es/privacidad/' };

export const studio = {
  name: 'Falls City Dev Studio',
  short: 'Falls City',
  url: 'https://fallscity.dev',
  email: 'info@fallscity.dev',
  locality: 'Louisville',
  region: 'KY',
};

// ---- Screenshots ---------------------------------------------------------
// Files are src/assets/work/<site>-<page>-<desktop|mobile>.jpg, made by scripts/capture.mjs.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/work/*.jpg', { eager: true });

export function shot(site: string, page: string, device: 'desktop' | 'mobile'): ImageMetadata {
  const key = `../assets/work/${site}-${page}-${device}.jpg`;
  const mod = files[key];
  if (!mod) throw new Error(`Missing screenshot ${key}. Run npm run capture.`);
  return mod.default;
}

// ---- Work ----------------------------------------------------------------
export interface ProjectPage {
  id: string;
  label: L;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  url: string;
  kind: L;
  summary: L;
  pages: ProjectPage[];
}

export const projects: Project[] = [
  {
    id: 'nina',
    name: 'Nina Romero',
    domain: 'goodnina.com',
    url: 'https://goodnina.com/',
    kind: { en: 'Tattoo artist · Albuquerque, NM', es: 'Tatuadora · Albuquerque, NM' },
    summary: {
      en: 'A bilingual portfolio with a gallery filtered by style and a direct route to booking. Nina updates her gallery, texts and announcements herself from a private panel.',
      es: 'Un portafolio bilingüe con galería filtrada por estilo y un camino directo para reservar. Nina actualiza su galería, textos y anuncios ella misma desde un panel privado.',
    },
    pages: [
      { id: 'home', label: { en: 'Home', es: 'Inicio' } },
      { id: 'gallery', label: { en: 'Gallery', es: 'Galería' } },
      { id: 'book', label: { en: 'Booking', es: 'Reservas' } },
    ],
  },
  {
    id: 'tony',
    name: 'Tony Pixel Tattoo',
    domain: 'tonypixeltattoo.com',
    url: 'https://tonypixeltattoo.com/',
    kind: { en: 'Tattoo artist · Montevideo, Uruguay', es: 'Tatuador · Montevideo, Uruguay' },
    summary: {
      en: 'The site of Antonio “Tony” Otero, a realism artist at Tempel Tattoo Studio: a portfolio filtered by style, artist and studio details, a page for each specialty, and a booking form that opens WhatsApp with the request already written.',
      es: 'La web de Antonio «Tony» Otero, tatuador de realismo en Tempel Tattoo Studio: portafolio filtrado por estilo, datos del artista y del estudio, una página por especialidad y un formulario de turnos que abre WhatsApp con la consulta ya escrita.',
    },
    pages: [
      { id: 'home', label: { en: 'Home', es: 'Inicio' } },
      { id: 'portfolio', label: { en: 'Portfolio', es: 'Portafolio' } },
      { id: 'book', label: { en: 'Booking', es: 'Reservas' } },
    ],
  },
  {
    id: 'leey',
    name: 'Leey Hernandez',
    domain: 'leeyrealty.com',
    url: 'https://leeyrealty.com/',
    kind: { en: 'Lock & Key Realty · South Georgia & North Florida', es: 'Lock & Key Realty · Sur de Georgia y norte de Florida' },
    summary: {
      en: 'A bilingual realtor site with listings that refresh from her inventory, a page for each town she serves, and a blog.',
      es: 'Una web inmobiliaria bilingüe con propiedades que se actualizan desde su inventario, una página para cada ciudad donde trabaja y un blog.',
    },
    pages: [
      { id: 'home', label: { en: 'Home', es: 'Inicio' } },
      { id: 'properties', label: { en: 'Listings', es: 'Propiedades' } },
      { id: 'blog', label: { en: 'Blog', es: 'Blog' } },
    ],
  },
  {
    id: 'dura',
    name: 'Dura Fence Metal',
    domain: 'durafencemetal.com',
    url: 'https://durafencemetal.com/',
    kind: { en: 'Fence company · South Georgia', es: 'Cercas metálicas · Sur de Georgia' },
    summary: {
      en: 'A catalog of fences, gates and parts with a cost estimator that itemizes materials and draws the fence, a quote request form, and a private invoicing tool for the owner.',
      es: 'Un catálogo de cercas, portones y piezas con un estimador de costos que desglosa materiales y dibuja la cerca, un formulario de cotización y una herramienta privada de facturación para el dueño.',
    },
    pages: [
      { id: 'home', label: { en: 'Home', es: 'Inicio' } },
      { id: 'estimate', label: { en: 'Estimator', es: 'Estimador' } },
      { id: 'quote', label: { en: 'Quote', es: 'Cotización' } },
    ],
  },
];

// ---- Services ------------------------------------------------------------
export interface Service {
  id: string;
  title: L;
  body: L;
  /** Screenshot that shows the service in a real project. */
  example?: { site: string; page: string; caption: L };
}

export const services: Service[] = [
  {
    id: 'design',
    title: { en: 'A website made for your business', es: 'Una web hecha para tu negocio' },
    body: {
      en: 'Designed around your work, your clients and the way you book: tattoo portfolio, service menu, prices or gallery. Fast on any phone, in English, Spanish or both.',
      es: 'Diseñada alrededor de tu trabajo, tus clientes y tu forma de agendar: portafolio de tatuajes, menú de servicios, precios o galería. Rápida en cualquier teléfono, en inglés, español o ambos.',
    },
    example: { site: 'nina', page: 'gallery', caption: { en: 'goodnina.com, gallery filtered by style', es: 'goodnina.com, galería filtrada por estilo' } },
  },
  {
    id: 'seo',
    title: { en: 'SEO: get found nearby', es: 'SEO: que te encuentren cerca' },
    body: {
      en: 'Clean structure, fast pages, search-ready text and a page for each area you serve, so people searching for your trade near them find you, not a directory.',
      es: 'Estructura limpia, páginas rápidas, textos pensados para buscadores y una página por cada zona que atiendes, para que quien busca tu oficio cerca te encuentre a ti y no a un directorio.',
    },
    example: { site: 'leey', page: 'area', caption: { en: 'leeyrealty.com, one page per town', es: 'leeyrealty.com, una página por ciudad' } },
  },
  {
    id: 'content',
    title: { en: 'Content that keeps itself current', es: 'Contenido que se mantiene al día' },
    body: {
      en: 'Change your photos, services and announcements yourself from a simple private panel, or let them update automatically from the tools you already use.',
      es: 'Cambia tus fotos, servicios y anuncios tú mismo desde un panel privado sencillo, o deja que se actualicen solos desde las herramientas que ya usas.',
    },
    example: { site: 'leey', page: 'properties', caption: { en: 'leeyrealty.com, listings updated from her inventory', es: 'leeyrealty.com, propiedades actualizadas desde su inventario' } },
  },
  {
    id: 'hosting',
    title: { en: 'Domain, SSL and hosting', es: 'Dominio, SSL y hosting' },
    body: {
      en: 'Your own domain, a secure HTTPS connection and fast hosting, set up and looked after. The domain is registered in your name.',
      es: 'Tu propio dominio, conexión segura HTTPS y hosting rápido, configurados y atendidos. El dominio queda registrado a tu nombre.',
    },
    example: { site: 'dura', page: 'home', caption: { en: 'durafencemetal.com', es: 'durafencemetal.com' } },
  },
  {
    id: 'automation',
    title: { en: 'Automations and business solutions', es: 'Automatizaciones y soluciones para tu negocio' },
    body: {
      en: 'Estimators, quote forms, invoices and the repetitive steps in between, built into your site so the work does itself.',
      es: 'Estimadores, formularios de cotización, facturas y los pasos repetitivos entre ellos, integrados en tu web para que el trabajo se haga solo.',
    },
    example: { site: 'dura', page: 'estimate', caption: { en: 'durafencemetal.com, cost estimator', es: 'durafencemetal.com, estimador de costos' } },
  },
  {
    id: 'clients',
    title: { en: 'Client management and follow-up', es: 'Gestión y seguimiento de clientes' },
    body: {
      en: 'Every inquiry arrives complete and organized: who they are, what they want and how to reach them. Keep track of each client from first message to return visit.',
      es: 'Cada consulta llega completa y ordenada: quién es, qué quiere y cómo contactarle. Sigue a cada cliente desde el primer mensaje hasta la próxima visita.',
    },
    example: { site: 'tony', page: 'book', caption: { en: 'tonypixeltattoo.com, booking form that opens WhatsApp', es: 'tonypixeltattoo.com, formulario de turnos que abre WhatsApp' } },
  },
];

/** Services shown as compact tiles (no screenshot). */
export const tools: Service[] = [
  {
    id: 'messaging',
    title: { en: 'Automatic messaging', es: 'Mensajería automática' },
    body: {
      en: 'Confirmations, reminders and replies by email, text or WhatsApp, sent at the right moment without you typing them.',
      es: 'Confirmaciones, recordatorios y respuestas por correo, SMS o WhatsApp, enviados en el momento justo sin que tengas que escribirlos.',
    },
  },
  {
    id: 'control',
    title: { en: 'Internal control', es: 'Control interno' },
    body: {
      en: 'Private tools for the back office: appointments, jobs, invoices and records in one place, only for you and your team.',
      es: 'Herramientas privadas para la parte interna: citas, trabajos, facturas y registros en un solo lugar, solo para ti y tu equipo.',
    },
  },
  {
    id: 'care',
    title: { en: 'Ongoing care', es: 'Mantenimiento continuo' },
    body: {
      en: 'Updates, backups, security and small changes when you need them, so the site keeps working while you work.',
      es: 'Actualizaciones, copias de seguridad, seguridad y cambios pequeños cuando los necesites, para que la web siga funcionando mientras tú trabajas.',
    },
  },
];

// ---- Process -------------------------------------------------------------
export const steps: { title: L; body: L }[] = [
  {
    title: { en: 'We talk', es: 'Conversamos' },
    body: {
      en: 'You tell me about your business, your clients and what you need. We agree on the services and the price together.',
      es: 'Me cuentas de tu negocio, tus clientes y lo que necesitas. Acordamos juntos los servicios y el precio.',
    },
  },
  {
    title: { en: 'I build it', es: 'Lo construyo' },
    body: {
      en: 'I design and build the site with your photos, texts and brand, and you review it before anything goes live.',
      es: 'Diseño y construyo la web con tus fotos, textos y marca, y la revisas antes de que salga publicada.',
    },
  },
  {
    title: { en: 'It goes live, and I stay', es: 'Se publica, y sigo contigo' },
    body: {
      en: 'Domain, hosting and launch are handled. After that I keep it running and growing with your business.',
      es: 'Me ocupo del dominio, el hosting y la publicación. Después la mantengo funcionando y creciendo con tu negocio.',
    },
  },
];

// ---- Interface copy ------------------------------------------------------
export const ui = {
  meta: {
    title: {
      en: 'Falls City Dev Studio · Websites for tattoo artists, barbershops and salons',
      es: 'Falls City Dev Studio · Webs para tatuadores, barberías y salones',
    },
    description: {
      en: 'Custom websites, SEO, hosting and business automations for tattoo artists, barbershops and beauty salons. Based in Louisville, KY, working across the US in English and Spanish.',
      es: 'Webs a medida, SEO, hosting y automatizaciones para tatuadores, barberías y salones de belleza. Desde Louisville, KY, para todo EE. UU., en inglés y español.',
    },
  },
  skip: { en: 'Skip to content', es: 'Saltar al contenido' },
  nav: {
    label: { en: 'Main', es: 'Principal' },
    work: { en: 'Work', es: 'Trabajos' },
    services: { en: 'Services', es: 'Servicios' },
    process: { en: 'Process', es: 'Proceso' },
    contact: { en: 'Contact', es: 'Contacto' },
    langLabel: { en: 'Language', es: 'Idioma' },
  },
  hero: {
    eyebrow: { en: 'Web studio · Louisville, KY', es: 'Estudio web · Louisville, KY' },
    title: {
      en: 'Websites and business tools for tattoo artists, barbershops and salons.',
      es: 'Webs y herramientas para tatuadores, barberías y salones de belleza.',
    },
    lead: {
      en: 'A fast site that shows your work, brings in clients and runs part of your business for you. Built to fit you, in English and Spanish.',
      es: 'Una web rápida que muestra tu trabajo, atrae clientes y lleva parte de tu negocio por ti. Hecha a tu medida, en inglés y español.',
    },
    cta: { en: 'Start a project', es: 'Empezar un proyecto' },
    secondary: { en: 'See the work', es: 'Ver trabajos' },
  },
  work: {
    eyebrow: { en: 'Work', es: 'Trabajos' },
    title: { en: 'Sites already online', es: 'Webs ya publicadas' },
    lead: {
      en: 'Real projects, shown as they look on a computer and on a phone.',
      es: 'Proyectos reales, tal como se ven en una computadora y en un teléfono.',
    },
    pageLegend: { en: 'Page shown', es: 'Página mostrada' },
    visit: { en: 'Visit site', es: 'Visitar la web' },
    newTab: { en: '(opens in a new tab)', es: '(se abre en una pestaña nueva)' },
    desktopAlt: { en: 'on a computer screen', es: 'en la pantalla de una computadora' },
    mobileAlt: { en: 'on a phone', es: 'en un teléfono' },
  },
  services: {
    eyebrow: { en: 'Services', es: 'Servicios' },
    title: { en: 'Everything your business needs online', es: 'Todo lo que tu negocio necesita en internet' },
    lead: {
      en: 'Take one service or several. Each one is shaped and priced together with you, for your business.',
      es: 'Elige un servicio o varios. Cada uno se ajusta y se cotiza contigo, para tu negocio.',
    },
    exampleLabel: { en: 'In a real project:', es: 'En un proyecto real:' },
    toolsTitle: { en: 'And behind the scenes', es: 'Y detrás de escena' },
    note: {
      en: 'There are no fixed packages: every service is negotiated with each client.',
      es: 'No hay paquetes fijos: cada servicio se negocia con cada cliente.',
    },
  },
  process: {
    eyebrow: { en: 'Process', es: 'Proceso' },
    title: { en: 'How we work together', es: 'Cómo trabajamos juntos' },
  },
  contact: {
    eyebrow: { en: 'Contact', es: 'Contacto' },
    title: { en: 'Tell me about your business.', es: 'Cuéntame de tu negocio.' },
    lead: {
      en: 'Write me what you do, where you are and what you need. I reply personally with ideas and a quote.',
      es: 'Escríbeme qué haces, dónde estás y qué necesitas. Te respondo personalmente con ideas y una cotización.',
    },
    subject: { en: 'New project', es: 'Proyecto nuevo' },
    where: {
      en: 'Louisville, KY · Remote across the US · English / Español',
      es: 'Louisville, KY · Remoto en todo EE. UU. · English / Español',
    },
  },
  footer: {
    privacy: { en: 'Privacy', es: 'Privacidad' },
  },
} as const;
