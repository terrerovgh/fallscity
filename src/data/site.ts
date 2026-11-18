// Single source of content for the site. Every visible string is { en, es }.
// Rules: sell benefits (what the owner gains), never "who it's for".
// Describe only what exists: no invented clients, numbers, reviews or prices.
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
  /** Google Tag Manager container, loaded only on https://fallscity.dev (see Base.astro). */
  googleTagId: 'GTM-WFTPCFT4',
  /** Bing Webmaster Tools ownership code; also in public/BingSiteAuth.xml. Public by design. */
  bingSiteVerification: 'CEA9010A7EE9ED39FF47824909791585',
};

// ---- Contact form ----------------------------------------------------------
// The form is shown by its script only when the Worker says delivery works
// (GET /api/inquiry/config: runtime secrets present). The Turnstile site key comes from the
// Worker too; this build-time value is only a fallback.
export const inquiry = {
  siteKey: ((import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? '').trim(),
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

// ---- Benefits ------------------------------------------------------------
export type BenefitId = 'found' | 'convert' | 'trust' | 'time' | 'control' | 'one';

export const benefits: { id: BenefitId; title: L; body: L }[] = [
  {
    id: 'found',
    title: { en: 'Clients find you first', es: 'Los clientes te encuentran primero' },
    body: {
      en: 'Pages built for what people search on Google, fast and easy to read, so you show up when someone near you needs what you offer.',
      es: 'Páginas hechas para lo que la gente busca en Google, rápidas y fáciles de leer, para que aparezcas cuando alguien cerca necesita lo que ofreces.',
    },
  },
  {
    id: 'convert',
    title: { en: 'More visits become clients', es: 'Más visitas se convierten en clientes' },
    body: {
      en: 'Your work shown at its best and a clear path to book, call or ask for a quote. Nobody gets lost on the way to hiring you.',
      es: 'Tu trabajo mostrado en su mejor versión y un camino claro para reservar, llamar o pedir cotización. Nadie se pierde en el camino a contratarte.',
    },
  },
  {
    id: 'trust',
    title: { en: 'A brand that earns trust', es: 'Una marca que inspira confianza' },
    body: {
      en: 'Your own domain, a professional design and a secure connection tell clients you take your business seriously before you say a word.',
      es: 'Tu propio dominio, un diseño profesional y una conexión segura le dicen al cliente que tomas tu negocio en serio antes de que digas una palabra.',
    },
  },
  {
    id: 'time',
    title: { en: 'Hours back every week', es: 'Horas libres cada semana' },
    body: {
      en: 'Quotes, reminders, follow-ups and invoices go out on their own. Less time answering the same questions, more time for the work you get paid for.',
      es: 'Cotizaciones, recordatorios, seguimientos y facturas salen solos. Menos tiempo respondiendo lo mismo, más tiempo para el trabajo que te pagan.',
    },
  },
  {
    id: 'control',
    title: { en: 'You stay in control', es: 'Tú tienes el control' },
    body: {
      en: 'Change photos, prices and news yourself from a simple panel. Your domain and your content stay in your name.',
      es: 'Cambia fotos, precios y novedades tú mismo desde un panel sencillo. Tu dominio y tu contenido quedan a tu nombre.',
    },
  },
  {
    id: 'one',
    title: { en: 'One person responsible for everything', es: 'Una sola persona responsable de todo' },
    body: {
      en: 'Design, hosting, security and updates in the same hands. No agency, no middlemen, no passing your problem from one person to the next.',
      es: 'Diseño, hosting, seguridad y actualizaciones en las mismas manos. Sin agencia, sin intermediarios, sin que tu problema pase de una persona a otra.',
    },
  },
];

export const benefitVisuals = {
  en: {
    search: 'barbershop near me', business: 'Your business', book: 'Book now', booking: 'Booking',
    domain: 'yourbusiness.com', tasks: ['Quote', 'Reminder', 'Follow-up'], save: 'Save', published: 'Published',
    services: ['Design', 'Hosting', 'Security', 'Updates'],
  },
  es: {
    search: 'barbería cerca de mí', business: 'Tu negocio', book: 'Reservar', booking: 'Reserva',
    domain: 'tunegocio.com', tasks: ['Cotización', 'Recordatorio', 'Seguimiento'], save: 'Guardar', published: 'Publicado',
    services: ['Diseño', 'Hosting', 'Seguridad', 'Actualizaciones'],
  },
};

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
      en: 'Her work organized by style, booking requests through her own domain instead of DMs, and a private panel where she updates her gallery and announcements herself.',
      es: 'Su trabajo ordenado por estilo, solicitudes de reserva desde su propio dominio en vez de mensajes directos, y un panel privado donde ella misma actualiza su galería y anuncios.',
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
      en: 'A portfolio that sells his realism work, a page for each specialty to be found on Google, and a booking form that sends him a complete request by WhatsApp.',
      es: 'Un portafolio que vende su trabajo de realismo, una página por especialidad para aparecer en Google y un formulario de turnos que le envía la consulta completa por WhatsApp.',
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
      en: 'Listings that update themselves from her inventory, a page for every town she serves, and a blog that brings in visitors from search, in English and Spanish.',
      es: 'Propiedades que se actualizan solas desde su inventario, una página por cada ciudad donde trabaja y un blog que atrae visitas desde los buscadores, en español e inglés.',
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
      en: 'Clients price their own fence with an online estimator and request a quote from the site, and the business invoices from its own private tool.',
      es: 'Los clientes calculan el precio de su cerca con un estimador en línea y piden cotización desde la web, y el negocio factura desde su propia herramienta privada.',
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
    title: { en: 'Custom web design', es: 'Diseño web a medida' },
    body: {
      en: 'A site designed around your brand and your work, fast on any phone, in English, Spanish or both. Clients see the quality of what you do before they ever contact you.',
      es: 'Una web diseñada alrededor de tu marca y tu trabajo, rápida en cualquier teléfono, en español, inglés o ambos. El cliente ve la calidad de lo que haces antes de contactarte.',
    },
    example: { site: 'nina', page: 'gallery', caption: { en: 'goodnina.com: gallery filtered by style', es: 'goodnina.com: galería filtrada por estilo' } },
  },
  {
    id: 'seo',
    title: { en: 'SEO', es: 'SEO' },
    body: {
      en: 'Text, structure and speed tuned for Google, with a page for each service and area you cover. You show up when people search for what you offer, without paying for every click.',
      es: 'Textos, estructura y velocidad pensados para Google, con una página por cada servicio y zona que atiendes. Apareces cuando buscan lo que ofreces, sin pagar por cada clic.',
    },
    example: { site: 'leey', page: 'area', caption: { en: 'leeyrealty.com: a page for each town she serves', es: 'leeyrealty.com: una página por cada ciudad donde trabaja' } },
  },
  {
    id: 'content',
    title: { en: 'Content that stays current', es: 'Contenido siempre al día' },
    body: {
      en: 'A private panel to change photos, prices and news in minutes, or automatic updates from your inventory or catalog. Your site never looks abandoned, and you never wait on anyone.',
      es: 'Un panel privado para cambiar fotos, precios y novedades en minutos, o actualizaciones automáticas desde tu inventario o catálogo. Tu web nunca se ve abandonada y no esperas por nadie.',
    },
    example: { site: 'leey', page: 'properties', caption: { en: 'leeyrealty.com: listings that update from her inventory', es: 'leeyrealty.com: propiedades que se actualizan desde su inventario' } },
  },
  {
    id: 'hosting',
    title: { en: 'Domain, SSL and hosting', es: 'Dominio, SSL y hosting' },
    body: {
      en: 'Your own .com, the secure padlock in the browser, and fast, reliable hosting, set up and watched over. Your domain stays in your name, always.',
      es: 'Tu propio .com, el candado de conexión segura en el navegador y un hosting rápido y estable, configurados y vigilados. Tu dominio queda a tu nombre, siempre.',
    },
    example: { site: 'dura', page: 'home', caption: { en: 'durafencemetal.com', es: 'durafencemetal.com' } },
  },
  {
    id: 'automation',
    title: { en: 'Automations and business solutions', es: 'Automatizaciones y soluciones para tu negocio' },
    body: {
      en: 'Estimators, quotes, invoices and the repetitive steps between them, built into your site. Fewer hours on paperwork and fewer mistakes from copying data by hand.',
      es: 'Estimadores, cotizaciones, facturas y los pasos repetitivos entre ellos, integrados en tu web. Menos horas de papeleo y menos errores al copiar datos a mano.',
    },
    example: { site: 'dura', page: 'estimate', caption: { en: 'durafencemetal.com: online cost estimator', es: 'durafencemetal.com: estimador de costos en línea' } },
  },
  {
    id: 'clients',
    title: { en: 'Client management and follow-up', es: 'Gestión y seguimiento de clientes' },
    body: {
      en: 'Every inquiry arrives complete: who they are, what they want and how to reach them. Each client is followed from the first message to the next visit, so no opportunity gets lost in a chat.',
      es: 'Cada consulta llega completa: quién es, qué quiere y cómo contactarle. Cada cliente se sigue desde el primer mensaje hasta la próxima visita, para que ninguna oportunidad se pierda en un chat.',
    },
    example: { site: 'tony', page: 'book', caption: { en: 'tonypixeltattoo.com: booking form that sends the request by WhatsApp', es: 'tonypixeltattoo.com: formulario de turnos que envía la consulta por WhatsApp' } },
  },
];

/** Services shown as compact cards (no screenshot). */
export const tools: Service[] = [
  {
    id: 'messaging',
    title: { en: 'Automatic messaging', es: 'Mensajería automática' },
    body: {
      en: 'Confirmations, reminders and follow-ups by email, text or WhatsApp, sent at the right moment without you typing them. Fewer missed appointments, more clients who come back.',
      es: 'Confirmaciones, recordatorios y seguimientos por correo, SMS o WhatsApp, enviados en el momento justo sin que los escribas. Menos citas perdidas, más clientes que vuelven.',
    },
  },
  {
    id: 'control',
    title: { en: 'Internal control', es: 'Control interno' },
    body: {
      en: 'Appointments, jobs, payments and records in one private place for you and your team. Know where your business stands at a glance.',
      es: 'Citas, trabajos, pagos y registros en un solo lugar privado para ti y tu equipo. Sabes cómo va tu negocio de un vistazo.',
    },
  },
  {
    id: 'care',
    title: { en: 'Maintenance', es: 'Mantenimiento' },
    body: {
      en: 'Updates, backups, security and quick changes whenever you need them. Your site stays fast, safe and current while you focus on your work.',
      es: 'Actualizaciones, copias de seguridad, seguridad y cambios rápidos cuando los necesites. Tu web sigue rápida, segura y al día mientras tú te enfocas en tu trabajo.',
    },
  },
];

// ---- Process -------------------------------------------------------------
export const steps: { title: L; body: L }[] = [
  {
    title: { en: 'We talk', es: 'Conversamos' },
    body: {
      en: 'You tell me about your business and your goals. I propose what will help you most, and we agree on scope and price before any work starts.',
      es: 'Me cuentas de tu negocio y tus metas. Te propongo lo que más te va a ayudar y acordamos alcance y precio antes de empezar.',
    },
  },
  {
    title: { en: 'I design and build it', es: 'La diseño y la construyo' },
    body: {
      en: 'With your photos, your services and your brand. You review everything and ask for changes before anything is published.',
      es: 'Con tus fotos, tus servicios y tu marca. Revisas todo y pides cambios antes de que se publique nada.',
    },
  },
  {
    title: { en: 'Launch and ongoing care', es: 'Publicación y cuidado continuo' },
    body: {
      en: 'I handle the domain, hosting and launch, then keep your site running and improving as your business grows.',
      es: 'Me encargo del dominio, el hosting y la publicación, y después mantengo tu web funcionando y mejorando a medida que crece tu negocio.',
    },
  },
];

// ---- FAQ -----------------------------------------------------------------
export const faqs: { q: L; a: L }[] = [
  {
    q: { en: 'How much does a website cost?', es: '¿Cuánto cuesta una web?' },
    a: {
      en: 'It depends on what will help your business most: a showcase site is not the same as one with bookings, a private panel and automations. After a short conversation you get a written quote for exactly what we agreed on.',
      es: 'Depende de lo que más ayude a tu negocio: una web de presentación no es lo mismo que una con reservas, panel privado y automatizaciones. Después de una conversación corta recibes una cotización por escrito con exactamente lo que acordamos.',
    },
  },
  {
    q: { en: 'Can I keep the tools I already use?', es: '¿Puedo seguir usando las herramientas que ya tengo?' },
    a: {
      en: 'Yes. Your site can connect to the booking app, payment system or messaging you already use, or I can build a tool made for the way you work.',
      es: 'Sí. Tu web puede conectarse a la app de reservas, el sistema de pagos o la mensajería que ya usas, o puedo crear una herramienta hecha para tu forma de trabajar.',
    },
  },
  {
    q: { en: 'Can I update the site myself?', es: '¿Puedo actualizar la web yo mismo?' },
    a: {
      en: 'Yes, if you want to. Nina Romero changes her gallery, texts and announcements from a private panel without calling anyone.',
      es: 'Sí, si quieres. Nina Romero cambia su galería, textos y anuncios desde un panel privado sin llamar a nadie.',
    },
  },
  {
    q: { en: 'What do I need to get started?', es: '¿Qué necesito para empezar?' },
    a: {
      en: 'Your logo if you have one, photos of your work, your list of services and your social media or Google Maps link. If something is missing, we sort it out together.',
      es: 'Tu logo si lo tienes, fotos de tu trabajo, tu lista de servicios y tu enlace de redes sociales o Google Maps. Si falta algo, lo resolvemos juntos.',
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
      en: 'Web Design, SEO & Business Automation | Falls City Dev Studio',
      es: 'Diseño web, SEO y automatización | Falls City Dev Studio',
    },
    description: {
      en: 'Websites that bring you clients and save you time: custom design, SEO, hosting, automations and client management, in English and Spanish.',
      es: 'Webs que te traen clientes y te ahorran tiempo: diseño a medida, SEO, hosting, automatizaciones y gestión de clientes, en español e inglés.',
    },
    ogAlt: {
      en: 'Falls City Dev Studio: a blue ribbon inspired by the studio logo',
      es: 'Falls City Dev Studio: una cinta azul inspirada en el logotipo del estudio',
    },
  },
  skip: { en: 'Skip to content', es: 'Saltar al contenido' },
  nav: {
    label: { en: 'Main', es: 'Principal' },
    work: { en: 'Work', es: 'Trabajos' },
    services: { en: 'Services', es: 'Servicios' },
    faq: { en: 'FAQ', es: 'Preguntas' },
    cta: { en: 'Request a proposal', es: 'Pedir una propuesta' },
    menu: { en: 'Menu', es: 'Menú' },
    langLabel: { en: 'Language', es: 'Idioma' },
  },
  hero: {
    title: {
      en: 'A website built to win you',
      es: 'Una web para conseguir',
    },
    titleAccent: { en: 'more clients.', es: 'más clientes.' },
    lead: {
      en: 'I design custom websites for small businesses that turn visits into bookings, calls, and quote requests.',
      es: 'Diseño webs a medida para pequeños negocios que convierten las visitas en reservas, llamadas y solicitudes de presupuesto.',
    },
    cta: { en: 'Request a proposal', es: 'Pedir una propuesta' },
    secondary: { en: 'See the work', es: 'Ver proyectos' },
    pause: { en: 'Pause background animation', es: 'Pausar animación de fondo' },
    resume: { en: 'Resume background animation', es: 'Reanudar animación de fondo' },
  },
  benefits: {
    title: { en: 'What changes when your website works for you', es: 'Lo que cambia cuando tu web trabaja para ti' },
    lead: {
      en: 'A good website is not an expense. It is the employee that never closes.',
      es: 'Una buena web no es un gasto. Es el empleado que nunca cierra.',
    },
    previous: { en: 'Previous benefit', es: 'Beneficio anterior' },
    next: { en: 'Next benefit', es: 'Siguiente beneficio' },
    replay: { en: 'Replay illustration', es: 'Repetir ilustración' },
    pick: { en: 'Choose a benefit', es: 'Elegir un beneficio' },
  },
  work: {
    title: { en: 'Websites out in the world.', es: 'Webs para negocios reales.' },
    lead: {
      en: 'See how each site looks on desktop and mobile.',
      es: 'Mira cómo se ve cada web en computadora y en móvil.',
    },
    visit: { en: 'Visit', es: 'Visitar' },
    newTab: { en: '(opens in a new tab)', es: '(se abre en una pestaña nueva)' },
  },
  services: {
    title: { en: 'Everything your business needs online', es: 'Todo lo que tu negocio necesita en internet' },
    lead: {
      en: 'Start with what you need today and add more as you grow. Each service is quoted for your business.',
      es: 'Empieza con lo que necesitas hoy y suma más a medida que creces. Cada servicio se cotiza para tu negocio.',
    },
    toolsTitle: { en: 'Working behind the scenes', es: 'Trabajando detrás de escena' },
  },
  process: {
    title: { en: 'Simple from start to launch', es: 'Simple de principio a fin' },
  },
  faq: {
    title: { en: 'Frequently asked questions', es: 'Preguntas frecuentes' },
  },
  contact: {
    title: { en: 'Let’s make your website work for you.', es: 'Hagamos que tu web trabaje para ti.' },
    lead: {
      en: 'Tell me about your business and what you need. I’ll reply personally with ideas and a quote.',
      es: 'Cuéntame de tu negocio y lo que necesitas. Te respondo personalmente con ideas y una cotización.',
    },
    subject: { en: 'Website quote', es: 'Cotización de web' },
    body: {
      en: 'Business name:\nCity:\nWhat my business does:\nWhat I need:\nCurrent website or social media:\n',
      es: 'Nombre del negocio:\nCiudad:\nA qué se dedica mi negocio:\nQué necesito:\nWeb o redes sociales actuales:\n',
    },
    where: {
      en: 'Louisville, KY · English & Español',
      es: 'Louisville, KY · Español & English',
    },
    form: {
      label: { en: 'Contact form', es: 'Formulario de contacto' },
      name: { en: 'Your name', es: 'Tu nombre' },
      email: { en: 'Email', es: 'Correo electrónico' },
      business: { en: 'Business name', es: 'Nombre del negocio' },
      city: { en: 'City', es: 'Ciudad' },
      links: { en: 'Current website or social media', es: 'Web o redes sociales actuales' },
      optional: { en: 'optional', es: 'opcional' },
      message: { en: 'What do you need?', es: '¿Qué necesitas?' },
      messageHint: {
        en: 'What your business does and what you want your website to do for you.',
        es: 'A qué se dedica tu negocio y qué quieres que tu web haga por ti.',
      },
      privacy: { en: 'I agree that my message is used to reply to my inquiry.', es: 'Acepto que mi mensaje se use para responder a mi consulta.' },
      privacyLink: { en: 'Privacy', es: 'Privacidad' },
      send: { en: 'Send message', es: 'Enviar mensaje' },
      orEmail: { en: 'Prefer email? Write to', es: '¿Prefieres el correo? Escribe a' },
      /** Messages used by the form script (src/scripts/inquiry.ts). */
      script: {
        sending: { en: 'Sending…', es: 'Enviando…' },
        verifying: { en: 'Checking that you’re not a robot…', es: 'Comprobando que no eres un robot…' },
        count: { en: '{n} / 3000 characters', es: '{n} / 3000 caracteres' },
        countShort: { en: '{n} / 3000 characters (at least 20)', es: '{n} / 3000 caracteres (mínimo 20)' },
        errName: { en: 'Enter your name.', es: 'Escribe tu nombre.' },
        errEmail: { en: 'Enter your email address.', es: 'Escribe tu correo electrónico.' },
        errEmailFormat: { en: 'Check the email address (for example, name@business.com).', es: 'Revisa el correo (por ejemplo, nombre@negocio.com).' },
        errMessage: { en: 'Tell me a little about what you need.', es: 'Cuéntame un poco de lo que necesitas.' },
        errMessageShort: { en: 'Write at least 20 characters.', es: 'Escribe al menos 20 caracteres.' },
        errPrivacy: { en: 'Check this box so I can use your message to reply.', es: 'Marca esta casilla para que pueda usar tu mensaje para responderte.' },
        errTooLong: { en: 'This is too long.', es: 'Es demasiado largo.' },
        errSummary: { en: 'Please fix the highlighted fields.', es: 'Revisa los campos marcados.' },
        errVerify: { en: 'The anti-spam check failed. Please try again.', es: 'Falló la comprobación anti-spam. Inténtalo de nuevo.' },
        errSend: { en: 'Your message couldn’t be sent. Your text is still here.', es: 'No se pudo enviar tu mensaje. Tu texto sigue aquí.' },
        emailInstead: { en: 'Send it by email instead', es: 'Enviarlo por correo' },
        sentTitle: { en: 'Message sent', es: 'Mensaje enviado' },
        sentBody: {
          en: 'Thanks, {name}. I’ll reply personally to {email}.',
          es: 'Gracias, {name}. Te respondo personalmente a {email}.',
        },
        another: { en: 'Send another message', es: 'Enviar otro mensaje' },
      },
    },
  },
  footer: {
    tagline: {
      en: 'Websites that win you clients and give you your time back.',
      es: 'Webs que te consiguen clientes y te devuelven tu tiempo.',
    },
    privacy: { en: 'Privacy', es: 'Privacidad' },
  },
} as const;
