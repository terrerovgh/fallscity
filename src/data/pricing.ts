export type Lang = 'en' | 'es';

export interface PageMetadata {
  title: string;
  description: string;
}

export interface Plan {
  id: 'artist' | 'studio';
  name: string;
  audience: string;
  build: string;
  buildLabel: string;
  monthly: string;
  monthlyLabel: string;
  annual?: string;
  includes: string[];
}

export const plans: Record<Lang, Plan[]> = {
  en: [
    {
      id: 'artist',
      name: 'Artist',
      audience: 'Independent tattoo artists and individual professionals.',
      build: '$650',
      buildLabel: 'starting price for the build',
      monthly: '$49',
      monthlyLabel: '/month for hosting, the panel, and ongoing care',
      includes: [
        'Portfolio organized by style',
        'Panel to update your gallery, text, and announcements',
        'Inquiry form with size, placement, references, and budget',
        'Links to the booking and deposit tools you already use',
        'Aftercare page',
        'Local SEO foundations',
        'Domain in your name, hosting, and SSL',
      ],
    },
    {
      id: 'studio',
      name: 'Studio',
      audience: 'Tattoo studios with three or more artists, and established salons.',
      build: '$1,400',
      buildLabel: 'starting price for the build',
      monthly: '$99',
      monthlyLabel: '/month for hosting, the panel, and ongoing care',
      annual: 'or $990/year',
      includes: [
        'Everything in Artist',
        'A page for each artist',
        'A studio gallery filterable by artist and style',
        'Panel access for the studio',
        'Relevant structured data on each artist page',
      ],
    },
  ],
  es: [
    {
      id: 'artist',
      name: 'Artista',
      audience: 'Tatuadores independientes y profesionales individuales.',
      build: '$650',
      buildLabel: 'precio inicial de desarrollo',
      monthly: '$49',
      monthlyLabel: 'al mes por alojamiento, panel y cuidado continuo',
      includes: [
        'Portafolio organizado por estilo',
        'Panel para actualizar su galería, textos y anuncios',
        'Formulario de consulta con tamaño, zona, referencias y presupuesto',
        'Enlaces a las herramientas de reservas y depósitos que ya usa',
        'Página de cuidados',
        'Bases de SEO local',
        'Dominio a su nombre, alojamiento web y SSL',
      ],
    },
    {
      id: 'studio',
      name: 'Estudio',
      audience: 'Estudios de tatuaje con tres o más artistas y salones establecidos.',
      build: '$1,400',
      buildLabel: 'precio inicial de desarrollo',
      monthly: '$99',
      monthlyLabel: 'al mes por alojamiento, panel y cuidado continuo',
      annual: 'o $990/año',
      includes: [
        'Todo lo incluido en Artista',
        'Una página para cada artista',
        'Una galería del estudio con filtros por artista y estilo',
        'Acceso al panel para el estudio',
        'Datos estructurados pertinentes en cada página de artista',
      ],
    },
  ],
};

export const careIncludes: Record<Lang, string[]> = {
  en: [
    'Hosting and SSL',
    'Domain renewal, with the domain kept in your name',
    'The admin panel',
    'Updates and backups',
    'Uptime monitoring',
    'Local SEO maintenance',
  ],
  es: [
    'Alojamiento web y SSL',
    'Renovación del dominio, siempre a su nombre',
    'El panel de administración',
    'Actualizaciones y copias de seguridad',
    'Monitoreo para comprobar que el sitio esté en línea',
    'Mantenimiento del SEO local',
  ],
};

export const careScopeNote: Record<Lang, string> = {
  en: 'Ongoing care does not include unlimited development. Custom design, layout, or functionality changes are scoped and quoted separately.',
  es: 'El cuidado continuo no incluye desarrollo ilimitado. Los cambios de diseño, estructura o funcionalidad a medida se definen y cotizan por separado.',
};

export const pricingNote: Record<Lang, string> = {
  en: 'Starting prices. Your exact quote is provided in writing before any work begins: 50% to start, 50% before launch, with two rounds of changes included. Kentucky sales tax is added where applicable.',
  es: 'Precios de inicio. Su cotización exacta se entrega por escrito antes de empezar: 50% al inicio y 50% antes de publicar, con dos rondas de cambios incluidas. Se añade el impuesto de ventas de Kentucky cuando corresponda.',
};

export const extraIds = [
  'booking',
  'reminders',
  'client-database',
  'consent-forms',
  'automations',
  'second-language',
  'business-profile',
] as const;

export type ExtraId = (typeof extraIds)[number];

export interface Extra {
  id: ExtraId;
  label: string;
}

export const extras: Record<Lang, Extra[]> = {
  en: [
    { id: 'booking', label: 'Custom online booking and deposits' },
    { id: 'reminders', label: 'Appointment reminders for clients' },
    { id: 'client-database', label: 'Client database and history' },
    { id: 'consent-forms', label: 'Digital consent forms' },
    { id: 'automations', label: 'Automated aftercare and follow-up messages' },
    { id: 'second-language', label: 'A second language (English or Spanish)' },
    { id: 'business-profile', label: 'Google Business Profile setup' },
  ],
  es: [
    { id: 'booking', label: 'Reservas y depósitos en línea a medida' },
    { id: 'reminders', label: 'Recordatorios de citas para sus clientes' },
    { id: 'client-database', label: 'Base de datos e historial de clientes' },
    { id: 'consent-forms', label: 'Formularios de consentimiento digitales' },
    { id: 'automations', label: 'Mensajes automáticos de cuidados y seguimiento' },
    { id: 'second-language', label: 'Un segundo idioma (inglés o español)' },
    { id: 'business-profile', label: 'Configuración de Google Business Profile' },
  ],
};

export const extrasNote: Record<Lang, string> = {
  en: 'Extras have no public price and are quoted after discussing your needs. Linking to a booking app you already use is not the same as building a custom booking system.',
  es: 'Los extras no tienen precio público y se cotizan después de conocer sus necesidades. Enlazar la aplicación de reservas que ya usa no equivale a construir un sistema de reservas a medida.',
};

export const pricingMetadata: Record<Lang, PageMetadata> = {
  en: {
    title: 'Tattoo Website Pricing and Plans | Falls City',
    description: 'Artist websites from $650 plus $49/month. Studio websites from $1,400 plus $99/month or $990/year. See what the build and ongoing care include.',
  },
  es: {
    title: 'Precios de páginas web para tatuadores | Falls City',
    description: 'Plan Artista desde $650 más $49/mes. Plan Estudio desde $1,400 más $99/mes o $990/año. Conozca qué incluyen el desarrollo y el cuidado continuo.',
  },
};
