export type Lang = 'en' | 'es';

export interface Faq {
  question: string;
  answer: string;
}

export type FaqKey =
  | 'anywhere'
  | 'instagram'
  | 'panel'
  | 'monthly'
  | 'leave'
  | 'photos'
  | 'rankings'
  | 'booking'
  | 'spanish';

export const faqs: Record<Lang, Record<FaqKey, Faq>> = {
  en: {
    anywhere: {
      question: 'I’m not in Kentucky. Can you still build my site?',
      answer: 'Yes. We work remotely anywhere in the United States by video call, phone, and email. You review the working site online as it takes shape.',
    },
    instagram: {
      question: 'Do I have to stop using Instagram or my booking app?',
      answer: 'No. Keep posting and using the booking or payment tools you already have. Your site links to them and gives clients an official place to learn about your work and take the next step.',
    },
    panel: {
      question: 'Do I need to be good with computers to use the panel?',
      answer: 'No technical background is needed. You can add gallery photos, organize work by style, edit text and announcements, and review changes before publishing. We walk you through the panel during handover. Custom design and development changes are separate from content editing.',
    },
    monthly: {
      question: 'What does the recurring fee cover?',
      answer: 'Hosting, SSL, renewal of the domain in your name, the admin panel, updates, backups, uptime monitoring, and local SEO maintenance. It does not include unlimited development; custom design or functionality changes are scoped separately.',
    },
    leave: {
      question: 'What happens if I want to leave?',
      answer: 'The domain remains yours. You keep your content and a copy of the site that you can host elsewhere. The admin panel runs on our infrastructure, so the hosted panel service is not transferred.',
    },
    photos: {
      question: 'Who owns the photos of my work?',
      answer: 'You do. We only publish photos you send or approve, and we do not alter your tattoos. Previews remain private and out of search engines until you approve publication.',
    },
    rankings: {
      question: 'Will my site rank first on Google?',
      answer: 'No one can honestly promise a search position. We build local SEO foundations: fast pages, clear content about your work and city, relevant structured data, and consistent public business information.',
    },
    booking: {
      question: 'Can you add online booking, deposits, or reminders?',
      answer: 'Your site can link to the booking and deposit tools you already use. Custom booking and deposit implementation, reminders, a client database, consent forms, and automations are extras. We discuss how your business works and quote only the scope you need.',
    },
    spanish: {
      question: 'Can my site be in English and Spanish?',
      answer: 'Yes. A second language is an extra. When it is included in your project, you can edit both language versions from the panel.',
    },
  },
  es: {
    anywhere: {
      question: 'No estoy en Kentucky. ¿Pueden hacer mi página igual?',
      answer: 'Sí. Trabajamos a distancia en cualquier parte de Estados Unidos por videollamada, teléfono y correo electrónico. Usted revisa la página en línea mientras toma forma.',
    },
    instagram: {
      question: '¿Tengo que dejar Instagram o mi aplicación de reservas?',
      answer: 'No. Siga publicando y usando las herramientas de reservas o pagos que ya tiene. Su página enlaza a ellas y ofrece a sus clientes un lugar oficial para conocer su trabajo y dar el siguiente paso.',
    },
    panel: {
      question: '¿Necesito conocimientos técnicos para usar el panel?',
      answer: 'No. Puede añadir fotos a la galería, organizar su trabajo por estilo, editar textos y anuncios, y revisar los cambios antes de publicarlos. Le explicamos el panel durante la entrega. Los cambios de diseño y desarrollo a medida se gestionan aparte de la edición de contenido.',
    },
    monthly: {
      question: '¿Qué cubre la cuota recurrente?',
      answer: 'Alojamiento web, SSL, renovación del dominio a su nombre, panel de administración, actualizaciones, copias de seguridad, monitoreo del sitio y mantenimiento del SEO local. No incluye desarrollo ilimitado; los cambios de diseño o funcionalidad a medida se definen por separado.',
    },
    leave: {
      question: '¿Qué pasa si quiero dejar el servicio?',
      answer: 'El dominio sigue siendo suyo. Conserva su contenido y una copia de la página que puede alojar en otro servicio. El panel funciona en nuestra infraestructura, por lo que el servicio alojado del panel no se transfiere.',
    },
    photos: {
      question: '¿De quién son las fotos de mi trabajo?',
      answer: 'Suyas. Solo publicamos fotos que usted envía o aprueba, y no alteramos sus tatuajes. Las vistas previas permanecen privadas y fuera de los buscadores hasta que usted apruebe la publicación.',
    },
    rankings: {
      question: '¿Mi página aparecerá en primer lugar en Google?',
      answer: 'Nadie puede prometer con honestidad una posición en los buscadores. Construimos las bases del SEO local: páginas rápidas, contenido claro sobre su trabajo y su ciudad, datos estructurados pertinentes e información pública coherente de su negocio.',
    },
    booking: {
      question: '¿Pueden añadir reservas en línea, depósitos o recordatorios?',
      answer: 'Su página puede enlazar a las herramientas de reservas y depósitos que ya usa. Las reservas y los depósitos a medida, los recordatorios, la base de datos de clientes, los formularios de consentimiento y las automatizaciones son extras. Hablamos sobre el funcionamiento de su negocio y cotizamos solo el alcance que necesita.',
    },
    spanish: {
      question: '¿Mi página puede estar en inglés y en español?',
      answer: 'Sí. Un segundo idioma es un extra. Cuando se incluye en su proyecto, puede editar las dos versiones desde el panel.',
    },
  },
};

export const homeFaqKeys: FaqKey[] = [
  'anywhere',
  'panel',
  'monthly',
  'leave',
  'instagram',
  'rankings',
  'photos',
];

export const pricingFaqKeys: FaqKey[] = [
  'monthly',
  'leave',
  'booking',
  'spanish',
  'anywhere',
];

export const panelFaqKeys: FaqKey[] = ['panel', 'photos', 'leave', 'spanish'];

export const pickFaqs = (lang: Lang, keys: FaqKey[]): Faq[] =>
  keys.map((key) => faqs[lang][key]);
