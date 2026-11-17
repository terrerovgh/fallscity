export type Lang = 'en' | 'es';

export interface PageMetadata {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  description: string;
  clientRole: string;
}

export const processSteps: Record<Lang, ProcessStep[]> = {
  en: [
    {
      number: '01',
      title: 'Talk',
      summary: 'Share your Instagram and tell us how clients book today.',
      description: 'We discuss your style, how clients reach you, and what you want the site to make easier. No technical knowledge is needed.',
      clientRole: 'You provide: your Instagram, how you take bookings and deposits, and what the site should improve.',
    },
    {
      number: '02',
      title: 'Quote',
      summary: 'Receive a written quote with the plan, scope, and any extras.',
      description: 'You receive the exact price in writing before any work begins. The build is paid 50% to start and 50% before launch.',
      clientRole: 'You provide: your approval, along with the photos and business details we request.',
    },
    {
      number: '03',
      title: 'Build and review',
      summary: 'We build the working site and you review it online.',
      description: 'You review a private preview of the working site, not a static mockup. Two rounds of changes are included.',
      clientRole: 'You provide: your requested changes, gathered into one list for each round.',
    },
    {
      number: '04',
      title: 'Launch and handover',
      summary: 'Your site is published on your domain, and you learn to use the panel.',
      description: 'We check the domain, SSL, and search setup on the live site. Then we walk you through the panel so you can add work, edit text, and publish announcements yourself.',
      clientRole: 'You provide: your final approval and a domain registered in your name. We can guide you through setting it up.',
    },
  ],
  es: [
    {
      number: '01',
      title: 'Hablamos',
      summary: 'Comparta su Instagram y cuéntenos cómo reservan sus clientes hoy.',
      description: 'Hablamos de su estilo, de cómo le contactan sus clientes y de qué quiere que la página facilite. No necesita conocimientos técnicos.',
      clientRole: 'Usted aporta: su Instagram, cómo recibe reservas y depósitos, y qué debería mejorar la página.',
    },
    {
      number: '02',
      title: 'Cotización',
      summary: 'Reciba una cotización por escrito con el plan, el alcance y los extras.',
      description: 'Recibe el precio exacto por escrito antes de empezar. La construcción se paga 50% al inicio y 50% antes de publicar.',
      clientRole: 'Usted aporta: su aprobación, además de las fotos y los datos de su negocio que le pidamos.',
    },
    {
      number: '03',
      title: 'Construcción y revisión',
      summary: 'Construimos la página y usted revisa cómo funciona en línea.',
      description: 'Revisa una vista previa privada de la página en funcionamiento, no una imagen estática. Incluimos dos rondas de cambios.',
      clientRole: 'Usted aporta: sus cambios, reunidos en una sola lista por ronda.',
    },
    {
      number: '04',
      title: 'Publicación y entrega',
      summary: 'Su página se publica en su dominio y usted aprende a usar el panel.',
      description: 'Revisamos el dominio, el SSL y la configuración para buscadores en la página publicada. Después le explicamos el panel para que pueda añadir trabajos, editar textos y publicar anuncios.',
      clientRole: 'Usted aporta: su aprobación final y un dominio registrado a su nombre. Podemos orientarle para configurarlo.',
    },
  ],
};

export const processMetadata: Record<Lang, PageMetadata> = {
  en: {
    title: 'Our Website Design Process | Falls City',
    description: 'From the first conversation to a written quote, two review rounds, and launch on your own domain. See the four steps and what we need from you.',
  },
  es: {
    title: 'Proceso de diseño web | Falls City',
    description: 'De la primera conversación a la cotización escrita, dos rondas de revisión y publicación en su propio dominio. Conozca las cuatro etapas y qué necesitamos de usted.',
  },
};
