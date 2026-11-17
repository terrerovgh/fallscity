export type Lang = 'en' | 'es';

export type TradeId = 'barbershops' | 'salons' | 'nails' | 'piercing';

export interface TradeSummary {
  id: TradeId;
  href: string;
  name: string;
  summary: string;
}

export const tradeSummaries: Record<Lang, TradeSummary[]> = {
  en: [
    {
      id: 'barbershops',
      href: '/barbershops/',
      name: 'Barbershops',
      summary: 'Your services, prices, and barbers, with a booking link to the app you already use.',
    },
    {
      id: 'salons',
      href: '/salons/',
      name: 'Hair salons',
      summary: 'Your service menu, stylists, and a gallery you can update yourself.',
    },
    {
      id: 'nails',
      href: '/nails/',
      name: 'Nail salons',
      summary: 'Show your latest designs and direct clients to your existing booking method.',
    },
    {
      id: 'piercing',
      href: '/piercing/',
      name: 'Piercing studios',
      summary: 'Present your jewelry, aftercare, and studio policies before a client visits.',
    },
  ],
  es: [
    {
      id: 'barbershops',
      href: '/barbershops/',
      name: 'Barberías',
      summary: 'Sus servicios, precios y barberos, con un enlace de reserva a la aplicación que ya usa.',
    },
    {
      id: 'salons',
      href: '/salons/',
      name: 'Salones de belleza',
      summary: 'Su menú de servicios, estilistas y una galería que usted puede actualizar.',
    },
    {
      id: 'nails',
      href: '/nails/',
      name: 'Salones de uñas',
      summary: 'Muestre sus últimos diseños y dirija a sus clientes a su método de reservas actual.',
    },
    {
      id: 'piercing',
      href: '/piercing/',
      name: 'Estudios de piercing',
      summary: 'Presente su joyería, cuidados y políticas del estudio antes de la visita del cliente.',
    },
  ],
};

export interface TradeProblem {
  title: string;
  copy: string;
}

export interface TradeFaq {
  question: string;
  answer: string;
}

export interface TradeCopy {
  title: string;
  description: string;
  crumb: string;
  eyebrow: string;
  heroTitle: string;
  heroCopy: string;
  problems: TradeProblem[];
  sections: string[];
  faqs: TradeFaq[];
}

export const trades: Record<TradeId, Record<Lang, TradeCopy>> = {
  barbershops: {
    en: {
      title: 'Websites for Barbershops You Can Update | Falls City',
      description: 'A barbershop website with your services, prices, barbers, hours, and a link to your current booking app. Hosting, domain, SSL, and local SEO care are available through the plans.',
      crumb: 'Barbershops',
      eyebrow: 'Websites for barbershops',
      heroTitle: 'A barbershop website <em>that keeps up with the chair.</em>',
      heroCopy: 'Your services and prices, your barbers, your hours, and one clear booking link. When a price or schedule changes, you can update it from your phone.',
      problems: [
        {
          title: 'Clients ask the same three things',
          copy: 'Price, hours, and whether you take walk-ins. Put those answers where clients look first, with tools to keep them current yourself.',
        },
        {
          title: 'Booking lives in an app',
          copy: 'Keep the app you use. Your site links directly to it and presents your name and work instead of relying on a generic listing.',
        },
        {
          title: 'Each barber has their own following',
          copy: 'A section for each barber can show their cuts and their own booking link, helping regulars find the right chair.',
        },
      ],
      sections: [
        'Service menu with prices',
        'A section for each barber',
        'Booking link to your existing app or phone',
        'Hours, walk-in policy, and location',
        'Gallery of recent cuts',
        'Announcements for holidays and closures',
      ],
      faqs: [
        {
          question: 'Can I keep Booksy, Square, or the app I use now?',
          answer: 'Yes. The site links to your existing booking app; you do not have to switch.',
        },
        {
          question: 'Can each barber update their own photos?',
          answer: 'The Studio plan includes panel access for the business, and the gallery can be organized by barber. The access arrangement for your team is defined in your written scope.',
        },
        {
          question: 'Do I pay the same as a tattoo studio?',
          answer: 'The same two plans apply. A shop with three or more barbers usually fits the Studio plan; an individual barber usually fits Artist.',
        },
      ],
    },
    es: {
      title: 'Páginas web para barberías que usted puede actualizar | Falls City',
      description: 'Una página para su barbería con servicios, precios, barberos, horarios y un enlace a su aplicación de reservas. Los planes ofrecen alojamiento, dominio, SSL y cuidado del SEO local.',
      crumb: 'Barberías',
      eyebrow: 'Páginas web para barberías',
      heroTitle: 'Una página para su barbería <em>al ritmo de la silla.</em>',
      heroCopy: 'Sus servicios y precios, sus barberos, su horario y un enlace claro para reservar. Cuando cambie un precio o un horario, puede actualizarlo desde su teléfono.',
      problems: [
        {
          title: 'Los clientes preguntan lo mismo',
          copy: 'Precio, horario y si atiende sin cita. Ponga las respuestas donde los clientes miran primero y utilice el panel para mantenerlas al día.',
        },
        {
          title: 'Las reservas están en una aplicación',
          copy: 'Siga con la aplicación que usa. Su página enlaza directamente a ella y presenta su nombre y su trabajo, sin depender únicamente de un listado genérico.',
        },
        {
          title: 'Cada barbero tiene su clientela',
          copy: 'Una sección por barbero puede mostrar sus cortes y su propio enlace de reserva para que cada cliente encuentre a su profesional.',
        },
      ],
      sections: [
        'Menú de servicios con precios',
        'Una sección para cada barbero',
        'Enlace de reserva a su aplicación actual o a su teléfono',
        'Horario, política de atención sin cita y ubicación',
        'Galería de cortes recientes',
        'Anuncios de días festivos y cierres',
      ],
      faqs: [
        {
          question: '¿Puedo seguir con Booksy, Square o la aplicación que uso?',
          answer: 'Sí. La página enlaza a su aplicación de reservas actual; no tiene que cambiarla.',
        },
        {
          question: '¿Cada barbero puede actualizar sus fotos?',
          answer: 'El plan Estudio incluye acceso al panel para el negocio, y la galería puede organizarse por barbero. La forma de acceso para su equipo se define en el alcance escrito.',
        },
        {
          question: '¿Pago lo mismo que un estudio de tatuajes?',
          answer: 'Se aplican los mismos dos planes. Una barbería con tres o más barberos suele encajar en el plan Estudio; un barbero independiente, en Artista.',
        },
      ],
    },
  },
  salons: {
    en: {
      title: 'Websites for Hair Salons You Can Update | Falls City',
      description: 'A hair salon website with your service menu, stylists, specialties, gallery, policies, and a link to your current booking app. Update your content through the admin panel.',
      crumb: 'Hair salons',
      eyebrow: 'Websites for hair salons',
      heroTitle: 'A salon website <em>as current as your latest work.</em>',
      heroCopy: 'Your service menu, your stylists, and a gallery you can update yourself. Clients can browse current work and follow the booking link for the stylist they want.',
      problems: [
        {
          title: 'Price questions take up your day',
          copy: 'A clear menu with starting prices and what each service includes gives clients useful information before they contact you.',
        },
        {
          title: 'Your best work is buried in a feed',
          copy: 'Organize a gallery by color, cuts, and treatments, and update it from your phone through the panel.',
        },
        {
          title: 'New clients do not know who to book',
          copy: 'Stylist sections can present each person’s specialties and link to their existing booking method.',
        },
      ],
      sections: [
        'Service menu with starting prices',
        'A section for each stylist',
        'Gallery organized by service',
        'Booking link to your current app',
        'Your deposit, cancellation, and consultation policies',
        'Announcements for openings and promotions',
      ],
      faqs: [
        {
          question: 'Can I keep Vagaro, GlossGenius, or the app I use now?',
          answer: 'Yes. The site links to your existing booking app; you do not have to switch.',
        },
        {
          question: 'Can I change prices myself?',
          answer: 'Yes. You can edit text and prices in the panel, review the changes, and publish them.',
        },
        {
          question: 'Which plan fits a salon?',
          answer: 'An individual stylist usually fits the Artist plan; a salon with three or more stylists usually fits Studio.',
        },
      ],
    },
    es: {
      title: 'Páginas web para salones de belleza que usted puede actualizar | Falls City',
      description: 'Una página para su salón con servicios, estilistas, especialidades, galería, políticas y un enlace a su aplicación de reservas. Actualice el contenido desde el panel.',
      crumb: 'Salones de belleza',
      eyebrow: 'Páginas web para salones de belleza',
      heroTitle: 'Una página para su salón <em>tan al día como su último trabajo.</em>',
      heroCopy: 'Su menú de servicios, sus estilistas y una galería que usted puede actualizar. Sus clientes pueden ver trabajo reciente y seguir el enlace de reserva del estilista que prefieran.',
      problems: [
        {
          title: 'Las preguntas de precio ocupan su día',
          copy: 'Un menú claro con precios de inicio y lo que incluye cada servicio ofrece información útil antes de que el cliente le contacte.',
        },
        {
          title: 'Su mejor trabajo se pierde entre publicaciones',
          copy: 'Organice una galería por color, cortes y tratamientos, y actualícela desde su teléfono mediante el panel.',
        },
        {
          title: 'Los clientes nuevos no saben con quién reservar',
          copy: 'Las secciones de estilistas pueden presentar las especialidades de cada persona y enlazar a su método de reservas actual.',
        },
      ],
      sections: [
        'Menú de servicios con precios de inicio',
        'Una sección para cada estilista',
        'Galería organizada por servicio',
        'Enlace de reserva a su aplicación actual',
        'Sus políticas de depósitos, cancelaciones y consultas',
        'Anuncios de disponibilidad y promociones',
      ],
      faqs: [
        {
          question: '¿Puedo seguir con Vagaro, GlossGenius o la aplicación que uso?',
          answer: 'Sí. La página enlaza a su aplicación de reservas actual; no tiene que cambiarla.',
        },
        {
          question: '¿Puedo cambiar los precios?',
          answer: 'Sí. Puede editar textos y precios desde el panel, revisar los cambios y publicarlos.',
        },
        {
          question: '¿Qué plan le conviene a un salón?',
          answer: 'Un estilista independiente suele encajar en el plan Artista; un salón con tres o más estilistas, en Estudio.',
        },
      ],
    },
  },
  nails: {
    en: {
      title: 'Websites for Nail Salons and Nail Artists | Falls City',
      description: 'A website for your nail salon with recent designs by style, services, add-ons, policies, and a link to your existing booking method. Update the gallery and prices yourself.',
      crumb: 'Nail salons',
      eyebrow: 'Websites for nail salons',
      heroTitle: 'Your latest designs, <em>on a page that’s yours.</em>',
      heroCopy: 'A gallery of your recent work, a clear price list, and a link to your booking method. Add new designs from your phone and organize them by style.',
      problems: [
        {
          title: 'Designs change every week',
          copy: 'Add new designs from your phone and tag them by style, so clients can browse the work you choose to feature.',
        },
        {
          title: '“How much for this set?”',
          copy: 'A price list by service and add-on can explain the starting price and the details that change it.',
        },
        {
          title: 'Booking is scattered',
          copy: 'Bring your booking link, contact method, and studio policies together on one official page.',
        },
      ],
      sections: [
        'Gallery of recent designs by style',
        'Price list with add-ons',
        'Booking link to your existing app or phone',
        'Your deposit, late-arrival, and fill policies',
        'Artist sections for salons with multiple technicians',
        'Announcements for promotions and holiday hours',
      ],
      faqs: [
        {
          question: 'Can I post new designs myself?',
          answer: 'Yes. Upload photos from your phone, organize them by style, review the changes, and publish them.',
        },
        {
          question: 'Can I keep my booking app?',
          answer: 'Yes. The site links to your existing app; you do not have to switch.',
        },
        {
          question: 'Which plan fits a nail salon?',
          answer: 'An individual nail artist usually fits the Artist plan; a salon with three or more technicians usually fits Studio.',
        },
      ],
    },
    es: {
      title: 'Páginas web para salones de uñas y manicuristas | Falls City',
      description: 'Una página para su salón de uñas con diseños por estilo, servicios, adicionales, políticas y un enlace a su método de reservas. Actualice la galería y los precios desde el panel.',
      crumb: 'Salones de uñas',
      eyebrow: 'Páginas web para salones de uñas',
      heroTitle: 'Sus últimos diseños, <em>en una página propia.</em>',
      heroCopy: 'Una galería de su trabajo reciente, una lista de precios clara y un enlace a su método de reservas. Añada diseños nuevos desde su teléfono y organícelos por estilo.',
      problems: [
        {
          title: 'Los diseños cambian cada semana',
          copy: 'Añada diseños nuevos desde su teléfono y clasifíquelos por estilo, para que sus clientes puedan ver el trabajo que usted decida destacar.',
        },
        {
          title: '«¿Cuánto cuesta este diseño?»',
          copy: 'Una lista de precios por servicio y adicional puede explicar el precio de inicio y los detalles que lo modifican.',
        },
        {
          title: 'Las reservas están dispersas',
          copy: 'Reúna su enlace de reservas, método de contacto y políticas del salón en una página oficial.',
        },
      ],
      sections: [
        'Galería de diseños recientes por estilo',
        'Lista de precios con adicionales',
        'Enlace de reserva a su aplicación actual o a su teléfono',
        'Sus políticas de depósitos, retrasos y retoques',
        'Secciones por profesional en salones con varios técnicos',
        'Anuncios de promociones y horarios festivos',
      ],
      faqs: [
        {
          question: '¿Puedo publicar diseños nuevos?',
          answer: 'Sí. Suba fotos desde su teléfono, organícelas por estilo, revise los cambios y publíquelos.',
        },
        {
          question: '¿Puedo seguir con mi aplicación de reservas?',
          answer: 'Sí. La página enlaza a su aplicación actual; no tiene que cambiarla.',
        },
        {
          question: '¿Qué plan le conviene a un salón de uñas?',
          answer: 'Un manicurista independiente suele encajar en el plan Artista; un salón con tres o más técnicos, en Estudio.',
        },
      ],
    },
  },
  piercing: {
    en: {
      title: 'Websites for Piercing Studios and Piercers | Falls City',
      description: 'A piercing studio website for your services, jewelry, aftercare, and your own age and ID policies. Present booking or walk-in information and update content through the panel.',
      crumb: 'Piercing studios',
      eyebrow: 'Websites for piercing studios',
      heroTitle: 'A piercing studio website <em>that answers before they ask.</em>',
      heroCopy: 'Services, jewelry, prices, aftercare, and your studio’s age and ID policies, all in one place clients can read before they visit. You can update the content from your phone.',
      problems: [
        {
          title: 'The same questions at the counter',
          copy: 'Present your studio’s policies on age, ID, and consent, along with pricing with or without jewelry. Your studio supplies and approves this information.',
        },
        {
          title: 'Aftercare gets forgotten',
          copy: 'Create an aftercare page based on your studio’s own instructions, with a link you can share after each visit.',
        },
        {
          title: 'Jewelry deserves to be seen',
          copy: 'Organize a gallery of piercings and jewelry by placement, and update it yourself through the panel.',
        },
      ],
      sections: [
        'Services and prices by placement',
        'Your studio’s age, ID, and consent policies',
        'Aftercare page based on your studio’s instructions',
        'Gallery organized by placement and jewelry',
        'Booking or walk-in information',
        'Announcements for new jewelry and events',
      ],
      faqs: [
        {
          question: 'Can I add new jewelry photos myself?',
          answer: 'Yes. Upload photos from your phone, review the changes, and publish them through the panel.',
        },
        {
          question: 'Can piercing and tattoo be on the same site?',
          answer: 'Yes. Studios that offer both can have a section for each service, with separate galleries.',
        },
        {
          question: 'Which plan fits a piercing studio?',
          answer: 'An individual piercer usually fits the Artist plan; a studio with three or more artists usually fits Studio.',
        },
      ],
    },
    es: {
      title: 'Páginas web para estudios de piercing | Falls City',
      description: 'Una página para su estudio de piercing con servicios, joyería, cuidados y sus propias políticas de edad e identificación. Presente reservas o atención sin cita y actualice el contenido desde el panel.',
      crumb: 'Estudios de piercing',
      eyebrow: 'Páginas web para estudios de piercing',
      heroTitle: 'Una página de piercing <em>que responde antes de la pregunta.</em>',
      heroCopy: 'Servicios, joyería, precios, cuidados y las políticas de edad e identificación de su estudio, en un solo lugar que el cliente puede consultar antes de visitarle. Actualice el contenido desde su teléfono.',
      problems: [
        {
          title: 'Las mismas preguntas en el mostrador',
          copy: 'Presente las políticas de su estudio sobre edad, identificación y consentimiento, además de los precios con o sin joya. Su estudio proporciona y aprueba esta información.',
        },
        {
          title: 'Los cuidados se olvidan',
          copy: 'Cree una página de cuidados basada en las instrucciones de su estudio, con un enlace que pueda compartir después de cada visita.',
        },
        {
          title: 'La joyería merece verse',
          copy: 'Organice una galería de piercings y joyería por zona, y actualícela desde el panel.',
        },
      ],
      sections: [
        'Servicios y precios por zona',
        'Las políticas de edad, identificación y consentimiento de su estudio',
        'Página de cuidados basada en las instrucciones de su estudio',
        'Galería organizada por zona y joyería',
        'Información de reservas o atención sin cita',
        'Anuncios de joyería nueva y eventos',
      ],
      faqs: [
        {
          question: '¿Puedo añadir fotos de joyería nueva?',
          answer: 'Sí. Suba fotos desde su teléfono, revise los cambios y publíquelos desde el panel.',
        },
        {
          question: '¿Piercing y tatuaje pueden ir en la misma página?',
          answer: 'Sí. Los estudios que ofrecen ambos servicios pueden tener una sección para cada uno, con galerías independientes.',
        },
        {
          question: '¿Qué plan le conviene a un estudio de piercing?',
          answer: 'Un profesional independiente suele encajar en el plan Artista; un estudio con tres o más artistas, en Estudio.',
        },
      ],
    },
  },
};
