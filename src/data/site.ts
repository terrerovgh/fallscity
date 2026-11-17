// Single source of content for the site. Every visible string is { en, es }.
// Rule: describe only what exists. No invented clients, numbers, reviews or prices.
// Voice: first person singular ("I build"), talking to the owner ("you", "tú").
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

// ---- Who it's for --------------------------------------------------------
export const niches: { id: string; title: L; body: L }[] = [
  {
    id: 'tattoo',
    title: { en: 'Tattoo artists and studios', es: 'Tatuadores y estudios de tatuaje' },
    body: {
      en: 'Your portfolio sorted by style, and a booking form that asks for placement, size and idea, so you get real requests instead of “how much for a tattoo?”. Flash, aftercare and deposit details in one place.',
      es: 'Tu portafolio ordenado por estilo y un formulario de reserva que pide zona, tamaño e idea, para que recibas solicitudes reales y no “¿cuánto cuesta un tatuaje?”. Flash, cuidados y depósitos en un solo lugar.',
    },
  },
  {
    id: 'barber',
    title: { en: 'Barbershops', es: 'Barberías' },
    body: {
      en: 'Services and prices clear at a glance, your barbers and their cuts, and a “Book now” button connected to the app you already use. Hours, address and directions for people searching nearby.',
      es: 'Servicios y precios claros de un vistazo, tus barberos y sus cortes, y un botón de “Reservar” conectado a la app que ya usas. Horario, dirección y cómo llegar para quien te busca cerca.',
    },
  },
  {
    id: 'salon',
    title: { en: 'Hair, beauty and nail salons', es: 'Salones de belleza, peluquerías y uñas' },
    body: {
      en: 'Your service menu, a gallery of recent work you can update from your phone, and booking in one tap. Pages written to show up when someone searches for a salon in your area.',
      es: 'Tu menú de servicios, una galería de trabajos recientes que actualizas desde el teléfono y reservas en un toque. Páginas escritas para aparecer cuando alguien busca un salón en tu zona.',
    },
  },
];

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
    kind: { en: 'Fine line tattoo artist · Albuquerque, NM', es: 'Tatuadora de línea fina · Albuquerque, NM' },
    summary: {
      en: 'A bilingual portfolio with her work filtered by style and a direct path to booking. Nina changes her gallery, texts and announcements herself from a private panel, without calling anyone.',
      es: 'Un portafolio bilingüe con su trabajo filtrado por estilo y un camino directo para reservar. Nina cambia su galería, textos y anuncios ella misma desde un panel privado, sin llamar a nadie.',
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
    kind: { en: 'Realism tattoo artist · Montevideo, Uruguay', es: 'Tatuador de realismo · Montevideo, Uruguay' },
    summary: {
      en: 'The site of Antonio “Tony” Otero at Tempel Tattoo Studio: a portfolio filtered by style, a page for each specialty, and a booking form that opens WhatsApp with the request already written.',
      es: 'La web de Antonio «Tony» Otero en Tempel Tattoo Studio: portafolio filtrado por estilo, una página por especialidad y un formulario de turnos que abre WhatsApp con la consulta ya escrita.',
    },
    pages: [
      { id: 'home', label: { en: 'Home', es: 'Inicio' } },
      { id: 'portfolio', label: { en: 'Portfolio', es: 'Portafolio' } },
      { id: 'book', label: { en: 'Booking', es: 'Turnos' } },
    ],
  },
  {
    id: 'leey',
    name: 'Leey Hernandez',
    domain: 'leeyrealty.com',
    url: 'https://leeyrealty.com/',
    kind: { en: 'Realtor, Lock & Key Realty · South Georgia', es: 'Agente inmobiliaria, Lock & Key Realty · Sur de Georgia' },
    summary: {
      en: 'A bilingual realtor site whose listings refresh from her inventory, with a page for each town she serves and a blog that brings in search traffic.',
      es: 'Una web inmobiliaria bilingüe cuyas propiedades se actualizan desde su inventario, con una página por cada ciudad donde trabaja y un blog que atrae visitas desde los buscadores.',
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
    kind: { en: 'Metal fence company · South Georgia', es: 'Cercas metálicas · Sur de Georgia' },
    summary: {
      en: 'Fences, gates and parts with an online estimator that itemizes materials and draws the fence, a quote request form, and a private invoicing tool for the owner.',
      es: 'Cercas, portones y piezas con un estimador en línea que desglosa materiales y dibuja la cerca, un formulario de cotización y una herramienta privada de facturación para el dueño.',
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
  /** Short name, used in structured data. */
  name: L;
  title: L;
  body: L;
  /** Screenshot that shows the service in a real project. */
  example?: { site: string; page: string; caption: L };
}

export const services: Service[] = [
  {
    id: 'design',
    name: { en: 'Custom web design', es: 'Diseño web a medida' },
    title: { en: 'A website that sells your work', es: 'Una web que vende tu trabajo' },
    body: {
      en: 'Designed around your style, your services and the way your clients book. It loads fast on any phone and speaks to your clients in English, Spanish or both.',
      es: 'Diseñada alrededor de tu estilo, tus servicios y la forma en que tus clientes reservan. Carga rápido en cualquier teléfono y les habla a tus clientes en inglés, español o ambos.',
    },
    example: { site: 'nina', page: 'gallery', caption: { en: 'goodnina.com: gallery filtered by style', es: 'goodnina.com: galería filtrada por estilo' } },
  },
  {
    id: 'seo',
    name: { en: 'Local SEO', es: 'SEO local' },
    title: { en: 'Local SEO: be the one they find', es: 'SEO local: que te encuentren a ti' },
    body: {
      en: 'Pages written for what people really search, like “fine line tattoo in Albuquerque” or “barbershop near me”, a page for each area you serve, and a site Google can read without effort.',
      es: 'Páginas escritas para lo que la gente busca de verdad, como “tatuaje de línea fina en Albuquerque” o “barbería cerca de mí”, una página por cada zona que atiendes y una web que Google lee sin esfuerzo.',
    },
    example: { site: 'leey', page: 'area', caption: { en: 'leeyrealty.com: one page for each town she serves', es: 'leeyrealty.com: una página por cada ciudad donde trabaja' } },
  },
  {
    id: 'content',
    name: { en: 'Content management and automatic updates', es: 'Gestión de contenido y actualización automática' },
    title: { en: 'Update it yourself, or let it update itself', es: 'Actualízala tú, o deja que se actualice sola' },
    body: {
      en: 'A simple private panel to change photos, prices and announcements without a developer. Or automatic updates from the tools you already use, like a listings feed or a product catalog.',
      es: 'Un panel privado y sencillo para cambiar fotos, precios y anuncios sin depender de un programador. O actualizaciones automáticas desde las herramientas que ya usas, como un inventario o un catálogo.',
    },
    example: { site: 'leey', page: 'properties', caption: { en: 'leeyrealty.com: listings that refresh from her inventory', es: 'leeyrealty.com: propiedades que se actualizan desde su inventario' } },
  },
  {
    id: 'hosting',
    name: { en: 'Domain, SSL and hosting', es: 'Dominio, SSL y hosting' },
    title: { en: 'Domain, SSL and hosting, handled', es: 'Dominio, SSL y hosting, resueltos' },
    body: {
      en: 'Your own .com, the secure padlock in the browser, and fast, reliable hosting. The domain is registered in your name, so your address online is always yours.',
      es: 'Tu propio .com, el candado de conexión segura en el navegador y un hosting rápido y estable. El dominio queda a tu nombre: tu dirección en internet siempre es tuya.',
    },
    example: { site: 'dura', page: 'home', caption: { en: 'durafencemetal.com', es: 'durafencemetal.com' } },
  },
  {
    id: 'automation',
    name: { en: 'Business automation', es: 'Automatización de negocios' },
    title: { en: 'Automations that give you hours back', es: 'Automatizaciones que te devuelven horas' },
    body: {
      en: 'Estimates, quotes, invoices and the repetitive steps between them happen on their own, so your time goes to clients, not paperwork.',
      es: 'Estimados, cotizaciones, facturas y los pasos repetitivos entre ellos ocurren solos, para que tu tiempo sea para tus clientes y no para el papeleo.',
    },
    example: { site: 'dura', page: 'estimate', caption: { en: 'durafencemetal.com: online cost estimator', es: 'durafencemetal.com: estimador de costos en línea' } },
  },
  {
    id: 'clients',
    name: { en: 'Client management and follow-up', es: 'Gestión y seguimiento de clientes' },
    title: { en: 'Every client, organized', es: 'Cada cliente, en orden' },
    body: {
      en: 'Inquiries arrive complete: who they are, what they want and how to reach them. Follow each client from the first message to the next visit, instead of losing them in scattered chats.',
      es: 'Las consultas llegan completas: quién es, qué quiere y cómo contactarle. Sigue a cada cliente desde el primer mensaje hasta la próxima visita, en vez de perderlo entre chats sueltos.',
    },
    example: { site: 'tony', page: 'book', caption: { en: 'tonypixeltattoo.com: booking form that opens WhatsApp', es: 'tonypixeltattoo.com: formulario de turnos que abre WhatsApp' } },
  },
];

/** Services shown as compact cards (no screenshot). */
export const tools: Service[] = [
  {
    id: 'messaging',
    name: { en: 'Automated client messaging', es: 'Mensajería automática con clientes' },
    title: { en: 'Automatic messages', es: 'Mensajes automáticos' },
    body: {
      en: 'Confirmations, reminders and follow-ups by email, text or WhatsApp, sent at the right moment without you typing them.',
      es: 'Confirmaciones, recordatorios y seguimientos por correo, SMS o WhatsApp, enviados en el momento justo sin que los escribas tú.',
    },
  },
  {
    id: 'control',
    name: { en: 'Internal business tools', es: 'Herramientas de control interno' },
    title: { en: 'Internal control', es: 'Control interno' },
    body: {
      en: 'Appointments, jobs, payments and records in one private place, for you and your team only.',
      es: 'Citas, trabajos, pagos y registros en un solo lugar privado, solo para ti y tu equipo.',
    },
  },
  {
    id: 'care',
    name: { en: 'Website maintenance', es: 'Mantenimiento web' },
    title: { en: 'Ongoing care', es: 'Mantenimiento continuo' },
    body: {
      en: 'Updates, backups, security and quick changes when you need them. Your site keeps working while you do.',
      es: 'Actualizaciones, copias de seguridad, seguridad y cambios rápidos cuando los necesites. Tu web sigue trabajando mientras tú trabajas.',
    },
  },
];

// ---- Process -------------------------------------------------------------
export const steps: { title: L; body: L }[] = [
  {
    title: { en: 'Tell me about your business', es: 'Cuéntame de tu negocio' },
    body: {
      en: 'Write me what you do, where you are and what you need. We talk it through and agree on the services and the price before any work starts.',
      es: 'Escríbeme qué haces, dónde estás y qué necesitas. Lo conversamos y acordamos los servicios y el precio antes de empezar.',
    },
  },
  {
    title: { en: 'I design and build it', es: 'La diseño y la construyo' },
    body: {
      en: 'With your photos, your services and your brand. You see the site and ask for changes before anything is published.',
      es: 'Con tus fotos, tus servicios y tu marca. Ves la web y pides cambios antes de que se publique nada.',
    },
  },
  {
    title: { en: 'We launch, and I stay with you', es: 'La publicamos, y sigo contigo' },
    body: {
      en: 'I take care of the domain, hosting and launch. Then I keep your site running, up to date and growing with your business.',
      es: 'Me encargo del dominio, el hosting y la publicación. Después mantengo tu web funcionando, al día y creciendo con tu negocio.',
    },
  },
];

// ---- FAQ -----------------------------------------------------------------
export const faqs: { q: L; a: L }[] = [
  {
    q: { en: 'How much does a website cost?', es: '¿Cuánto cuesta una web?' },
    a: {
      en: 'It depends on what your business needs: a portfolio is not the same as a site with booking, a private panel and automations. After a short conversation you get a written quote for exactly what we agreed on.',
      es: 'Depende de lo que necesite tu negocio: un portafolio no es lo mismo que una web con reservas, panel privado y automatizaciones. Después de una conversación corta recibes una cotización por escrito con exactamente lo que acordamos.',
    },
  },
  {
    q: {
      en: 'Can I keep using Booksy, Square, Vagaro or my current booking app?',
      es: '¿Puedo seguir usando Booksy, Square, Vagaro o mi app de reservas actual?',
    },
    a: {
      en: 'Yes. Your site can send clients straight to the booking app you already use, or I can build a booking request form made for your business.',
      es: 'Sí. Tu web puede llevar a tus clientes directo a la app de reservas que ya usas, o puedo crear un formulario de solicitud de cita hecho para tu negocio.',
    },
  },
  {
    q: { en: 'Can I update the site myself?', es: '¿Puedo actualizar la web yo mismo?' },
    a: {
      en: 'Yes, if you want to. Nina Romero, a tattoo artist in Albuquerque, changes her gallery, texts and announcements from a private panel, without calling anyone.',
      es: 'Sí, si quieres. Nina Romero, tatuadora en Albuquerque, cambia su galería, textos y anuncios desde un panel privado, sin llamar a nadie.',
    },
  },
  {
    q: { en: 'Do you work with businesses outside Louisville?', es: '¿Trabajas con negocios fuera de Louisville?' },
    a: {
      en: 'Yes. I’m based in Louisville, Kentucky, and work remotely with businesses anywhere in the United States, in English or Spanish.',
      es: 'Sí. Estoy en Louisville, Kentucky, y trabajo a distancia con negocios de cualquier parte de Estados Unidos, en inglés o en español.',
    },
  },
  {
    q: { en: 'What do I need to get started?', es: '¿Qué necesito para empezar?' },
    a: {
      en: 'Your logo if you have one, photos of your work, your list of services and your Instagram or Google Maps link. If something is missing, we sort it out together.',
      es: 'Tu logo si lo tienes, fotos de tu trabajo, tu lista de servicios y tu enlace de Instagram o Google Maps. Si falta algo, lo resolvemos juntos.',
    },
  },
  {
    q: { en: 'Who owns the domain and the content?', es: '¿De quién son el dominio y el contenido?' },
    a: {
      en: 'You do. The domain is registered in your name, and your photos and texts are always yours.',
      es: 'Tuyos. El dominio queda registrado a tu nombre, y tus fotos y textos siempre son tuyos.',
    },
  },
];

// ---- Interface copy ------------------------------------------------------
export const ui = {
  meta: {
    title: {
      en: 'Websites for Tattoo Artists, Barbers & Salons | Falls City',
      es: 'Webs para tatuadores, barberías y salones | Falls City',
    },
    description: {
      en: 'Websites for tattoo artists, barbershops and salons: portfolio, online booking, local SEO and automations. English & Spanish, from Louisville, KY.',
      es: 'Webs para tatuadores, barberías y salones de belleza: portafolio, reservas, SEO local y automatizaciones. En español e inglés, desde Louisville, KY.',
    },
    ogAlt: {
      en: 'Falls City Dev Studio: websites for tattoo artists, barbershops and salons, shown on three phones',
      es: 'Falls City Dev Studio: webs para tatuadores, barberías y salones, en tres teléfonos',
    },
  },
  skip: { en: 'Skip to content', es: 'Saltar al contenido' },
  nav: {
    label: { en: 'Main', es: 'Principal' },
    work: { en: 'Work', es: 'Trabajos' },
    services: { en: 'Services', es: 'Servicios' },
    faq: { en: 'FAQ', es: 'Preguntas' },
    cta: { en: 'Get a quote', es: 'Pedir cotización' },
    langLabel: { en: 'Language', es: 'Idioma' },
  },
  hero: {
    title: {
      en: 'Websites for tattoo artists, barbershops and beauty salons',
      es: 'Webs para tatuadores, barberías y salones de belleza',
    },
    lead: {
      en: 'Show your best work, get found on Google and take bookings directly, without living in your DMs. Designed and built for your business, in English and Spanish.',
      es: 'Muestra tu mejor trabajo, aparece en Google y recibe reservas directas, sin vivir pegado a los mensajes de Instagram. Diseñada y construida para tu negocio, en español e inglés.',
    },
    cta: { en: 'Get a quote', es: 'Pedir cotización' },
    secondary: { en: 'See live sites', es: 'Ver webs publicadas' },
    where: {
      en: 'Louisville, KY · Clients across the US · English & Español',
      es: 'Louisville, KY · Clientes en todo EE. UU. · Español & English',
    },
  },
  niches: {
    title: { en: 'Built around how your business works', es: 'Hecha según cómo funciona tu negocio' },
    lead: {
      en: 'A tattoo studio, a barbershop and a salon don’t win clients the same way. Your website shouldn’t work the same either.',
      es: 'Un estudio de tatuajes, una barbería y un salón no consiguen clientes de la misma forma. Tu web tampoco debería funcionar igual.',
    },
  },
  work: {
    title: { en: 'Sites already working for real businesses', es: 'Webs que ya trabajan para negocios reales' },
    lead: {
      en: 'Switch pages and see each one on a computer and on a phone, the way your clients will.',
      es: 'Cambia de página y mira cada una en una computadora y en un teléfono, como la verán tus clientes.',
    },
    pageLegend: { en: 'Page shown', es: 'Página mostrada' },
    visit: { en: 'Visit', es: 'Visitar' },
    newTab: { en: '(opens in a new tab)', es: '(se abre en una pestaña nueva)' },
    desktopAlt: { en: 'on a computer screen', es: 'en la pantalla de una computadora' },
    mobileAlt: { en: 'on a phone', es: 'en un teléfono' },
  },
  services: {
    title: { en: 'What I can do for your business', es: 'Lo que puedo hacer por tu negocio' },
    lead: {
      en: 'Pick what you need today and add more as you grow. Every service is quoted for your business; there are no fixed packages.',
      es: 'Elige lo que necesitas hoy y suma más a medida que creces. Cada servicio se cotiza para tu negocio; no hay paquetes fijos.',
    },
    toolsTitle: { en: 'Behind the scenes', es: 'Detrás de escena' },
  },
  process: {
    title: { en: 'From first message to launch', es: 'Del primer mensaje a la publicación' },
  },
  faq: {
    title: { en: 'Questions business owners ask', es: 'Preguntas que hacen los dueños de negocios' },
  },
  contact: {
    title: { en: 'Let’s talk about your website.', es: 'Hablemos de tu web.' },
    lead: {
      en: 'Send me your business name, city and what you need. I’ll reply personally with ideas and next steps.',
      es: 'Envíame el nombre de tu negocio, tu ciudad y lo que necesitas. Te respondo personalmente con ideas y los próximos pasos.',
    },
    subject: { en: 'Website quote', es: 'Cotización de web' },
    body: {
      en: 'Business name:\nCity:\nType of business (tattoo, barbershop, salon, other):\nWhat I need:\nInstagram or current website:\n',
      es: 'Nombre del negocio:\nCiudad:\nTipo de negocio (tatuajes, barbería, salón, otro):\nQué necesito:\nInstagram o web actual:\n',
    },
    where: {
      en: 'Louisville, KY · Remote across the US · English & Español',
      es: 'Louisville, KY · A distancia en todo EE. UU. · Español & English',
    },
  },
  footer: {
    tagline: {
      en: 'Websites for tattoo artists, barbershops and beauty salons.',
      es: 'Webs para tatuadores, barberías y salones de belleza.',
    },
    privacy: { en: 'Privacy', es: 'Privacidad' },
  },
} as const;
