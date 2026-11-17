export type Lang = 'en' | 'es';

export type PageId = 'panel' | 'local-seo' | 'work' | 'about' | 'contact' | 'privacy';

export interface PageMetadata {
  title: string;
  description: string;
  noindex?: boolean;
}

export interface PageCta {
  label: string;
  href: string;
}

export interface PageSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PageContent {
  id: PageId;
  path: `/${string}/`;
  metadata: PageMetadata;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: PageSection[];
  cta: PageCta;
  secondaryCta?: PageCta;
}

export interface PublishingStep {
  id: 'upload' | 'review' | 'publish';
  title: string;
  description: string;
}

export interface PanelPage extends PageContent {
  id: 'panel';
  diagram: {
    label: string;
    disclaimer: string;
    steps: [PublishingStep, PublishingStep, PublishingStep];
  };
}

export const panelPage: Record<Lang, PanelPage> = {
  en: {
    id: 'panel',
    path: '/panel/',
    metadata: {
      title: 'Update Your Tattoo Website Yourself | Falls City',
      description: 'Update your gallery, text, and announcements through your own admin panel. Learn what you can edit, what Falls City maintains, and what happens if you leave.',
    },
    eyebrow: 'Your admin panel',
    h1: 'Keep your site up to date, on your terms.',
    intro: 'Your website can change as your work changes. The panel gives you a place to manage your gallery, text, featured content, and announcements while Falls City handles the ongoing technical care.',
    sections: [
      {
        id: 'editable-content',
        title: 'The content you can manage',
        paragraphs: [
          'Add photos of recent work, arrange the gallery, and organize pieces with style tags. You can also edit the text areas included in your site, choose featured content, and publish announcements without asking for a developer to make each content update.',
        ],
        bullets: [
          'Upload and organize gallery photos',
          'Change gallery order and style tags',
          'Edit included text areas and featured content',
          'Create or update announcements',
        ],
      },
      {
        id: 'publishing',
        title: 'Review before you publish',
        paragraphs: [
          'The content workflow follows three clear steps: upload or edit, review, and publish. Reviewing first gives you a chance to check the selected photos, wording, and arrangement before making the changes public.',
          'The diagram below explains the workflow. It is a conceptual diagram, not a screenshot of a client’s private panel, and this page does not provide a fake login or working admin controls.',
        ],
      },
      {
        id: 'technical-care',
        title: 'The technical care behind your site',
        paragraphs: [
          'The recurring fee covers the infrastructure and maintenance included in your plan. Your domain remains registered in your name while Falls City handles the listed technical services.',
        ],
        bullets: [
          'Hosting and SSL',
          'Domain renewal in your name',
          'Updates and backups',
          'Uptime monitoring',
          'Local SEO maintenance',
        ],
      },
      {
        id: 'editing-limits',
        title: 'Content editing is not unlimited development',
        paragraphs: [
          'The panel is for managing content within your site’s established design. Custom layouts, design changes, and new functionality are development work, not unlimited changes included in the recurring fee. We define and quote that scope separately before starting it.',
        ],
      },
      {
        id: 'ownership',
        title: 'Your domain and content remain yours',
        paragraphs: [
          'If you leave, you keep your domain, your content, and a copy of the site that you can host elsewhere. The admin panel runs on Falls City’s infrastructure, so the hosted panel service is not transferred.',
        ],
      },
    ],
    diagram: {
      label: 'How it works — concept diagram',
      disclaimer: 'A conceptual explanation of the publishing workflow, not an image of a real admin interface.',
      steps: [
        {
          id: 'upload',
          title: 'Upload or edit',
          description: 'Choose gallery photos or update an included text area.',
        },
        {
          id: 'review',
          title: 'Review',
          description: 'Check the content, wording, and arrangement before publishing.',
        },
        {
          id: 'publish',
          title: 'Publish',
          description: 'Make the reviewed content changes public on your website.',
        },
      ],
    },
    cta: {
      label: 'See plans and ongoing care',
      href: '/pricing/',
    },
    secondaryCta: {
      label: 'See how projects work',
      href: '/process/',
    },
  },
  es: {
    id: 'panel',
    path: '/panel/',
    metadata: {
      title: 'Actualice su página de tatuajes desde su propio panel | Falls City',
      description: 'Actualice su galería, textos y anuncios desde su propio panel. Conozca qué puede editar, qué mantiene Falls City y qué sucede si deja el servicio.',
    },
    eyebrow: 'Su panel de administración',
    h1: 'Mantenga su web al día, a su ritmo.',
    intro: 'Su página puede cambiar al mismo ritmo que su trabajo. El panel le permite gestionar su galería, textos, contenido destacado y anuncios, mientras Falls City se encarga del cuidado técnico continuo.',
    sections: [
      {
        id: 'editable-content',
        title: 'El contenido que usted puede gestionar',
        paragraphs: [
          'Añada fotos de trabajos recientes, ordene la galería y organice las piezas con etiquetas de estilo. También puede editar las áreas de texto incluidas en su página, elegir contenido destacado y publicar anuncios sin solicitar a un desarrollador cada actualización de contenido.',
        ],
        bullets: [
          'Subir y organizar fotos de la galería',
          'Cambiar el orden y las etiquetas de estilo',
          'Editar las áreas de texto y el contenido destacado incluidos',
          'Crear o actualizar anuncios',
        ],
      },
      {
        id: 'publishing',
        title: 'Revise antes de publicar',
        paragraphs: [
          'El flujo de contenido sigue tres pasos claros: subir o editar, revisar y publicar. La revisión previa le permite comprobar las fotos seleccionadas, la redacción y el orden antes de hacer públicos los cambios.',
          'El siguiente esquema explica este flujo. Es un esquema conceptual, no una captura del panel privado de un cliente, y esta página no ofrece un acceso falso ni controles que simulen un panel real.',
        ],
      },
      {
        id: 'technical-care',
        title: 'El cuidado técnico de su página',
        paragraphs: [
          'La cuota recurrente cubre la infraestructura y el mantenimiento incluidos en su plan. Su dominio permanece registrado a su nombre mientras Falls City gestiona los servicios técnicos enumerados.',
        ],
        bullets: [
          'Alojamiento web y SSL',
          'Renovación del dominio a su nombre',
          'Actualizaciones y copias de seguridad',
          'Monitoreo para comprobar que el sitio esté en línea',
          'Mantenimiento del SEO local',
        ],
      },
      {
        id: 'editing-limits',
        title: 'Editar contenido no significa desarrollo ilimitado',
        paragraphs: [
          'El panel sirve para gestionar contenido dentro del diseño establecido de su página. Las estructuras a medida, los cambios de diseño y las funciones nuevas son trabajos de desarrollo, no cambios ilimitados incluidos en la cuota recurrente. Definimos y cotizamos ese alcance por separado antes de empezar.',
        ],
      },
      {
        id: 'ownership',
        title: 'Su dominio y su contenido siguen siendo suyos',
        paragraphs: [
          'Si deja el servicio, conserva su dominio, su contenido y una copia de la página que puede alojar en otro servicio. El panel funciona en la infraestructura de Falls City, por lo que el servicio alojado del panel no se transfiere.',
        ],
      },
    ],
    diagram: {
      label: 'Esquema del funcionamiento',
      disclaimer: 'Explicación conceptual del flujo de publicación, no una imagen de una interfaz de administración real.',
      steps: [
        {
          id: 'upload',
          title: 'Subir o editar',
          description: 'Elija fotos para la galería o actualice un área de texto incluida.',
        },
        {
          id: 'review',
          title: 'Revisar',
          description: 'Compruebe el contenido, la redacción y el orden antes de publicar.',
        },
        {
          id: 'publish',
          title: 'Publicar',
          description: 'Haga públicos en su página los cambios de contenido revisados.',
        },
      ],
    },
    cta: {
      label: 'Consulte los planes y el cuidado continuo',
      href: '/pricing/',
    },
    secondaryCta: {
      label: 'Conozca el proceso de trabajo',
      href: '/process/',
    },
  },
};

export const localSeoPage: Record<Lang, PageContent> = {
  en: {
    id: 'local-seo',
    path: '/local-seo/',
    metadata: {
      title: 'Local SEO for Tattoo Artists and Studios | Falls City',
      description: 'Local SEO foundations for tattoo websites: clear services and portfolios, mobile performance, descriptive metadata, structured data, crawlability, and consistent business information.',
    },
    eyebrow: 'Local SEO foundations',
    h1: 'Help local clients understand what you do.',
    intro: 'A local search foundation starts with a useful website: clear services, a well-organized portfolio, accurate public business information, and pages that work well on mobile devices.',
    sections: [
      {
        id: 'foundations',
        title: 'The foundations included in your site',
        paragraphs: [
          'Falls City builds the technical and editorial basics into the website rather than treating local SEO as a separate promise of placement. The exact structured data used must be appropriate to the verified content on each page.',
        ],
        bullets: [
          'Pages designed to load efficiently on mobile devices',
          'Clear services, artist information, and portfolio content',
          'Descriptive page titles and metadata',
          'Semantic page structure and relevant structured data',
          'Crawlable pages and coherent internal links',
          'Consistent public business information supplied by you',
        ],
      },
      {
        id: 'relevant-content',
        title: 'Content grounded in your actual work',
        paragraphs: [
          'Your services, portfolio, location, and business details come from information you supply and approve. The site explains what you do and where you work in plain language, giving visitors and search engines consistent information.',
          'We do not create artificial city, state, or ZIP-code landing pages. A page should exist because it serves a real business purpose, not to manufacture geographic coverage.',
        ],
      },
      {
        id: 'maintenance',
        title: 'Maintenance without ranking promises',
        paragraphs: [
          'Ongoing local SEO maintenance keeps the included technical foundations and public business information aligned as your site changes. Search positions depend on factors outside any web studio’s control, so Falls City does not promise a position on Google or another search engine.',
        ],
      },
      {
        id: 'business-profile',
        title: 'Google Business Profile is separately scoped',
        paragraphs: [
          'Setting up Google Business Profile is an optional extra, quoted separately after discussing your business. It is not implied by the local SEO foundations included in a website plan.',
        ],
      },
    ],
    cta: {
      label: 'Talk about your local SEO needs',
      href: '/contact/',
    },
    secondaryCta: {
      label: 'Compare website plans',
      href: '/pricing/',
    },
  },
  es: {
    id: 'local-seo',
    path: '/local-seo/',
    metadata: {
      title: 'SEO local para tatuadores y estudios | Falls City',
      description: 'Bases de SEO local para páginas de tatuajes: servicios y portafolio claros, rendimiento móvil, metadata descriptiva, datos estructurados, indexación e información comercial coherente.',
    },
    eyebrow: 'Bases de SEO local',
    h1: 'Ayude a sus clientes locales a entender lo que hace.',
    intro: 'Una buena base para la búsqueda local empieza con una página útil: servicios claros, un portafolio bien organizado, información pública precisa del negocio y páginas que funcionen bien en dispositivos móviles.',
    sections: [
      {
        id: 'foundations',
        title: 'Las bases incluidas en su página',
        paragraphs: [
          'Falls City incorpora las bases técnicas y editoriales a la página, en lugar de tratar el SEO local como una promesa de posicionamiento. Los datos estructurados utilizados deben corresponder al contenido verificado de cada página.',
        ],
        bullets: [
          'Páginas diseñadas para cargar de forma eficiente en dispositivos móviles',
          'Servicios, información de artistas y portafolio claros',
          'Títulos de página y metadata descriptiva',
          'Estructura semántica y datos estructurados pertinentes',
          'Páginas rastreables y enlaces internos coherentes',
          'Información pública coherente del negocio proporcionada por usted',
        ],
      },
      {
        id: 'relevant-content',
        title: 'Contenido basado en su trabajo real',
        paragraphs: [
          'Sus servicios, portafolio, ubicación y datos comerciales proceden de la información que usted proporciona y aprueba. La página explica qué hace y dónde trabaja con un lenguaje claro, ofreciendo información coherente a visitantes y buscadores.',
          'No creamos páginas artificiales por ciudad, estado o código postal. Cada página debe responder a una finalidad comercial real, no fabricar una cobertura geográfica.',
        ],
      },
      {
        id: 'maintenance',
        title: 'Mantenimiento sin promesas de posición',
        paragraphs: [
          'El mantenimiento continuo del SEO local conserva alineadas las bases técnicas incluidas y la información pública del negocio a medida que su página cambia. Las posiciones dependen de factores fuera del control de cualquier estudio web, por lo que Falls City no promete una posición en Google ni en otros buscadores.',
        ],
      },
      {
        id: 'business-profile',
        title: 'Google Business Profile se define por separado',
        paragraphs: [
          'La configuración de Google Business Profile es un extra opcional que se cotiza por separado después de conocer su negocio. No se da por incluida entre las bases de SEO local de un plan web.',
        ],
      },
    ],
    cta: {
      label: 'Hablemos de sus necesidades de SEO local',
      href: '/contact/',
    },
    secondaryCta: {
      label: 'Compare los planes web',
      href: '/pricing/',
    },
  },
};

export type WorkProjectId =
  | 'nina-romero'
  | 'pixel-tattoo'
  | 'cat-cobra'
  | 'leey-hernandez'
  | 'dura-fence-metal'
  | 'all-needs-discount';

export interface WorkProject {
  id: WorkProjectId;
  name: string;
  href: string;
  context: string;
  copyStatus: 'context-pending-verification';
}

export interface WorkPage extends PageContent {
  id: 'work';
  evidenceNotice: string;
  projects: WorkProject[];
}

export const workPage: Record<Lang, WorkPage> = {
  en: {
    id: 'work',
    path: '/work/',
    metadata: {
      title: 'Selected Web Design Projects | Falls City',
      description: 'Explore selected Falls City projects for tattoo artists, studios, and other businesses, with links to the public websites and clearly identified project details.',
    },
    eyebrow: 'Selected work',
    h1: 'Websites shaped around each business.',
    intro: 'Explore selected Falls City projects for tattoo artists, studios, and other businesses. Each entry links to the public website and identifies only what the captured view shows.',
    sections: [
      {
        id: 'project-context',
        title: 'Context before claims',
        paragraphs: [
          'The supplied project context identifies the kind of business and the content initially associated with each site. It is not evidence that every feature remains available today. Final public copy must be limited to what the current public website and captured evidence actually show.',
        ],
      },
      {
        id: 'visual-evidence',
        title: 'Images and captions need evidence',
        paragraphs: [
          'Project images should come from verified public pages and retain their source, capture details, and an accurate caption. A screenshot can show a visible gallery, inquiry path, or booking link, but it cannot establish a business result or demonstrate a private admin panel.',
        ],
      },
      {
        id: 'different-structures',
        title: 'Different businesses need different structures',
        paragraphs: [
          'A tattoo portfolio, a real estate site, and a fence catalog organize information differently. The work is presented by project so visitors can examine the public websites directly rather than treating them as interchangeable templates.',
        ],
      },
    ],
    evidenceNotice: 'Owner-supplied context only. Final public descriptions, screenshots, captions, and feature claims depend on verification of the current public websites. No results or private functionality are asserted here.',
    projects: [
      {
        id: 'nina-romero',
        name: 'Nina Romero',
        href: 'https://goodnina.com/',
        context: 'Fine-line tattoo artist in Albuquerque; floral and ornamental work, gallery and booking, English and Spanish.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'pixel-tattoo',
        name: 'Pixel Tattoo',
        href: 'https://tonypixeltattoo.com/',
        context: 'Realism in Montevideo; portfolio by style, specialties, and an inquiry path that opens WhatsApp.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'cat-cobra',
        name: 'Cat & Cobra',
        href: 'https://www.terrerov.com/catandcobra/',
        context: 'Tattoo studio in Albuquerque; artists, gallery, aftercare and booking, English and Spanish.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'leey-hernandez',
        name: 'Leey Hernandez',
        href: 'https://leeyrealty.com/',
        context: 'Real estate agent; bilingual website with homes, blog, services, and areas of Georgia and Florida.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'dura-fence-metal',
        name: 'Dura Fence Metal',
        href: 'https://durafencemetal.com/',
        context: 'Catalog of fences, gates, and parts, with Standard and Premium quote options.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'all-needs-discount',
        name: 'All Needs Discount',
        href: 'https://allneedsdiscount.com/',
        context: 'Remodeling and construction; services, rentals, service area, and estimate inquiries.',
        copyStatus: 'context-pending-verification',
      },
    ],
    cta: {
      label: 'Talk about your website',
      href: '/contact/',
    },
    secondaryCta: {
      label: 'See the working process',
      href: '/process/',
    },
  },
  es: {
    id: 'work',
    path: '/work/',
    metadata: {
      title: 'Proyectos web seleccionados | Falls City',
      description: 'Conozca proyectos seleccionados de Falls City para tatuadores, estudios y otros negocios, con enlaces a las páginas públicas y detalles claramente identificados.',
    },
    eyebrow: 'Proyectos seleccionados',
    h1: 'Páginas web diseñadas para cada negocio.',
    intro: 'Conozca proyectos seleccionados de Falls City para tatuadores, estudios y otros negocios. Cada entrada enlaza a la página pública e identifica únicamente lo que muestra la vista capturada.',
    sections: [
      {
        id: 'project-context',
        title: 'Contexto antes que afirmaciones',
        paragraphs: [
          'El contexto suministrado identifica el tipo de negocio y el contenido asociado inicialmente a cada página. No demuestra que todas las funciones sigan disponibles actualmente. El copy público final debe limitarse a lo que muestren la página pública vigente y la evidencia capturada.',
        ],
      },
      {
        id: 'visual-evidence',
        title: 'Las imágenes y los pies necesitan evidencia',
        paragraphs: [
          'Las imágenes de los proyectos deben proceder de páginas públicas verificadas y conservar su origen, los datos de captura y un pie preciso. Una captura puede mostrar una galería visible, una vía de consulta o un enlace de reserva, pero no demuestra un resultado comercial ni el funcionamiento de un panel privado.',
        ],
      },
      {
        id: 'different-structures',
        title: 'Cada negocio necesita una estructura distinta',
        paragraphs: [
          'Un portafolio de tatuajes, una página inmobiliaria y un catálogo de cercas organizan la información de forma diferente. Los proyectos se presentan individualmente para que usted pueda examinar directamente las páginas públicas, en lugar de tratarlos como plantillas intercambiables.',
        ],
      },
    ],
    evidenceNotice: 'Únicamente contexto suministrado por el propietario. Las descripciones públicas finales, capturas, pies y afirmaciones sobre funciones dependen de la verificación de las páginas públicas actuales. Aquí no se afirman resultados ni funciones privadas.',
    projects: [
      {
        id: 'nina-romero',
        name: 'Nina Romero',
        href: 'https://goodnina.com/',
        context: 'Tatuadora de línea fina en Albuquerque; trabajo floral y ornamental, galería y reservas, inglés y español.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'pixel-tattoo',
        name: 'Pixel Tattoo',
        href: 'https://tonypixeltattoo.com/',
        context: 'Realismo en Montevideo; portafolio por estilo, especialidades y una consulta que abre WhatsApp.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'cat-cobra',
        name: 'Cat & Cobra',
        href: 'https://www.terrerov.com/catandcobra/',
        context: 'Estudio de tatuajes en Albuquerque; artistas, galería, cuidados y reservas, inglés y español.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'leey-hernandez',
        name: 'Leey Hernandez',
        href: 'https://leeyrealty.com/',
        context: 'Agente inmobiliaria; página bilingüe con viviendas, blog, servicios y áreas de Georgia y Florida.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'dura-fence-metal',
        name: 'Dura Fence Metal',
        href: 'https://durafencemetal.com/',
        context: 'Catálogo de cercas, portones y piezas, con opciones de cotización Standard y Premium.',
        copyStatus: 'context-pending-verification',
      },
      {
        id: 'all-needs-discount',
        name: 'All Needs Discount',
        href: 'https://allneedsdiscount.com/',
        context: 'Remodelación y construcción; servicios, alquileres, zona de servicio y consultas de presupuesto.',
        copyStatus: 'context-pending-verification',
      },
    ],
    cta: {
      label: 'Hablemos de su página web',
      href: '/contact/',
    },
    secondaryCta: {
      label: 'Conozca el proceso de trabajo',
      href: '/process/',
    },
  },
};

export const aboutPage: Record<Lang, PageContent> = {
  en: {
    id: 'about',
    path: '/about/',
    metadata: {
      title: 'About Falls City Dev Studio | Falls City',
      description: 'Falls City Dev Studio is based in Louisville, Kentucky, and works remotely across the US in English and Spanish, building websites for artists and hands-on businesses.',
    },
    eyebrow: 'About Falls City',
    h1: 'A web studio for people with a craft.',
    intro: 'Falls City Dev Studio is based in Louisville, Kentucky, and works remotely across the United States in English and Spanish. The focus is websites for tattoo artists, studios, and other businesses whose work needs to be seen and understood.',
    sections: [
      {
        id: 'craft',
        title: 'The work sets the direction',
        paragraphs: [
          'A website should make room for the character of the business rather than flatten it into a generic template. Falls City focuses on organizing portfolios, services, business information, and inquiry paths around the way each client works.',
        ],
      },
      {
        id: 'ownership',
        title: 'A place of your own',
        paragraphs: [
          'Your website is built around your own domain, with content you can update through the admin panel included in your plan. If you leave, you retain your domain, content, and a copy of the site; the hosted panel service remains on Falls City’s infrastructure.',
        ],
      },
      {
        id: 'remote-bilingual',
        title: 'Remote and bilingual',
        paragraphs: [
          'Projects are handled remotely anywhere in the United States. You can discuss the work, review the site, and provide your content in English or Spanish. A second language for a client’s website is scoped as an optional extra.',
        ],
      },
      {
        id: 'ongoing-care',
        title: 'Ongoing care with a defined scope',
        paragraphs: [
          'The recurring fee covers the hosting, SSL, domain renewal, panel, updates, backups, uptime monitoring, and local SEO maintenance included in your plan. It does not include unlimited development; custom design and functionality changes are quoted separately.',
        ],
      },
    ],
    cta: {
      label: 'Explore selected work',
      href: '/work/',
    },
    secondaryCta: {
      label: 'See the process',
      href: '/process/',
    },
  },
  es: {
    id: 'about',
    path: '/about/',
    metadata: {
      title: 'Acerca de Falls City Dev Studio | Falls City',
      description: 'Falls City Dev Studio tiene su base en Louisville, Kentucky, y trabaja a distancia en Estados Unidos, en inglés y español, creando páginas web para artistas y negocios con oficio.',
    },
    eyebrow: 'Acerca de Falls City',
    h1: 'Un estudio web para quienes tienen un oficio.',
    intro: 'Falls City Dev Studio tiene su base en Louisville, Kentucky, y trabaja a distancia en todo Estados Unidos, en inglés y español. Su enfoque son las páginas web para tatuadores, estudios y otros negocios cuyo trabajo necesita mostrarse y entenderse.',
    sections: [
      {
        id: 'craft',
        title: 'El trabajo marca la dirección',
        paragraphs: [
          'Una página web debe dar espacio al carácter del negocio en lugar de convertirlo en una plantilla genérica. Falls City se centra en organizar portafolios, servicios, información comercial y vías de consulta según la forma de trabajar de cada cliente.',
        ],
      },
      {
        id: 'ownership',
        title: 'Un espacio propio',
        paragraphs: [
          'Su página se construye alrededor de su propio dominio, con contenido que usted puede actualizar mediante el panel incluido en su plan. Si deja el servicio, conserva su dominio, contenido y una copia de la página; el servicio alojado del panel permanece en la infraestructura de Falls City.',
        ],
      },
      {
        id: 'remote-bilingual',
        title: 'A distancia y en dos idiomas',
        paragraphs: [
          'Los proyectos se gestionan a distancia en cualquier parte de Estados Unidos. Puede hablar sobre el trabajo, revisar la página y proporcionar su contenido en inglés o español. Un segundo idioma para la página de un cliente se define como un extra opcional.',
        ],
      },
      {
        id: 'ongoing-care',
        title: 'Cuidado continuo con un alcance definido',
        paragraphs: [
          'La cuota recurrente cubre el alojamiento, SSL, renovación del dominio, panel, actualizaciones, copias de seguridad, monitoreo del sitio y mantenimiento del SEO local incluidos en su plan. No incluye desarrollo ilimitado; los cambios de diseño y funcionalidad a medida se cotizan por separado.',
        ],
      },
    ],
    cta: {
      label: 'Conozca los proyectos seleccionados',
      href: '/work/',
    },
    secondaryCta: {
      label: 'Vea el proceso',
      href: '/process/',
    },
  },
};

export interface ContactPage extends PageContent {
  id: 'contact';
  email: 'info@fallscity.dev';
}

export const contactPage: Record<Lang, ContactPage> = {
  en: {
    id: 'contact',
    path: '/contact/',
    metadata: {
      title: 'Tell Us About Your Website Project | Falls City',
      description: 'Share your work, how clients book today, and what you want your website to make easier. Contact Falls City Dev Studio in English or Spanish.',
    },
    eyebrow: 'Start a conversation',
    h1: 'Tell us about your work.',
    intro: 'Share your Instagram, how clients book today, and what you want your website to make easier. We will review your inquiry and discuss the scope before providing a written quote.',
    sections: [
      {
        id: 'what-to-share',
        title: 'What to share',
        paragraphs: [
          'Start with the work you want people to see and the way they currently contact or book with you. You do not need to prepare technical specifications or know which plan fits before getting in touch.',
        ],
        bullets: [
          'Your name and email address',
          'Your business name and Instagram, if you want to share them',
          'Your trade and current booking method',
          'Any extras you want to discuss',
          'What you want the website to make easier',
        ],
      },
      {
        id: 'next-step',
        title: 'What happens after your inquiry',
        paragraphs: [
          'Falls City reviews the information and discusses the appropriate plan, content, and any extras with you. The exact scope and price are then provided in writing before work begins. No response time is promised.',
        ],
      },
      {
        id: 'form-availability',
        title: 'An honest form and an email alternative',
        paragraphs: [
          'The form only reports a successful submission when the configured delivery provider accepts it. If form delivery is not configured or is unavailable, the page will say so rather than display a false success message.',
          'You can email info@fallscity.dev instead. Do not send medical information, payment card details, or other sensitive information through the inquiry form or by email.',
        ],
      },
      {
        id: 'language-and-location',
        title: 'English or Spanish, anywhere in the US',
        paragraphs: [
          'You can write in English or Spanish. Falls City is based in Louisville, Kentucky, and handles projects remotely across the United States. Conversations and reviews can take place without in-person meetings.',
        ],
      },
    ],
    email: 'info@fallscity.dev',
    cta: {
      label: 'Email info@fallscity.dev',
      href: 'mailto:info@fallscity.dev',
    },
    secondaryCta: {
      label: 'Review the project process',
      href: '/process/',
    },
  },
  es: {
    id: 'contact',
    path: '/contact/',
    metadata: {
      title: 'Cuéntenos sobre su proyecto web | Falls City',
      description: 'Comparta su trabajo, cómo reservan sus clientes y qué quiere que su página facilite. Contacte con Falls City Dev Studio en inglés o español.',
    },
    eyebrow: 'Inicie una conversación',
    h1: 'Cuéntenos de su trabajo.',
    intro: 'Comparta su Instagram, cómo reservan sus clientes hoy y qué quiere que su web facilite. Revisaremos su consulta y hablaremos del alcance antes de entregar una cotización escrita.',
    sections: [
      {
        id: 'what-to-share',
        title: 'Qué puede compartir',
        paragraphs: [
          'Empiece por el trabajo que quiere mostrar y la forma en que sus clientes le contactan o reservan actualmente. No necesita preparar especificaciones técnicas ni saber qué plan le conviene antes de escribir.',
        ],
        bullets: [
          'Su nombre y correo electrónico',
          'El nombre de su negocio y su Instagram, si desea compartirlos',
          'Su oficio y método actual de reservas',
          'Los extras que quiera comentar',
          'Qué quiere que la página facilite',
        ],
      },
      {
        id: 'next-step',
        title: 'Qué sucede después de su consulta',
        paragraphs: [
          'Falls City revisa la información y conversa con usted sobre el plan, el contenido y los extras adecuados. Después recibe el alcance y el precio exactos por escrito antes de empezar. No se promete un tiempo de respuesta.',
        ],
      },
      {
        id: 'form-availability',
        title: 'Un formulario honesto y una alternativa por correo',
        paragraphs: [
          'El formulario solo informa de un envío correcto cuando el proveedor configurado acepta la entrega. Si el envío no está configurado o no está disponible, la página lo indicará en lugar de mostrar un mensaje de éxito falso.',
          'También puede escribir a info@fallscity.dev. No envíe información médica, datos de tarjetas de pago ni otra información sensible mediante el formulario o el correo electrónico.',
        ],
      },
      {
        id: 'language-and-location',
        title: 'Inglés o español, en cualquier parte de EE. UU.',
        paragraphs: [
          'Puede escribir en inglés o español. Falls City tiene su base en Louisville, Kentucky, y gestiona proyectos a distancia en todo Estados Unidos. Las conversaciones y revisiones pueden realizarse sin reuniones presenciales.',
        ],
      },
    ],
    email: 'info@fallscity.dev',
    cta: {
      label: 'Escriba a info@fallscity.dev',
      href: 'mailto:info@fallscity.dev',
    },
    secondaryCta: {
      label: 'Revise el proceso del proyecto',
      href: '/process/',
    },
  },
};

export interface PrivacyPage extends PageContent {
  id: 'privacy';
  metadata: PageMetadata & { noindex: true };
  draftNotice: string;
  effectiveDate: string;
}

export const privacyPage: Record<Lang, PrivacyPage> = {
  en: {
    id: 'privacy',
    path: '/privacy/',
    metadata: {
      title: 'Privacy Notice — Draft | Falls City',
      description: 'Draft privacy notice for Falls City Dev Studio, pending owner and legal review before launch.',
      noindex: true,
    },
    eyebrow: 'Privacy',
    h1: 'Privacy notice',
    intro: 'This draft describes the intended handling of information sent through the Falls City website. It is not a final legal notice and must be reviewed before launch.',
    draftNotice: 'Draft — owner/legal review required before launch. Provider configuration, retention practices, and the effective date remain pending review.',
    effectiveDate: 'Effective date: pending owner/legal review.',
    sections: [
      {
        id: 'information',
        title: 'Information you choose to send',
        paragraphs: [
          'The inquiry form asks for your name, email address, trade, and a description of your project. Business name, Instagram, current booking method, and possible extras are optional. It also requires acknowledgment of this privacy notice.',
          'Do not submit medical information, payment card details, or other sensitive information. The form is intended for discussing a website project, not for collecting client records.',
        ],
      },
      {
        id: 'purpose-and-storage',
        title: 'Purpose and website storage',
        paragraphs: [
          'The information is intended to be used to review and respond to your inquiry and to discuss the requested website scope. The website does not store inquiry submissions in a website database.',
        ],
      },
      {
        id: 'providers',
        title: 'Service providers, only when configured',
        paragraphs: [
          'Where configured, Cloudflare provides website hosting and Turnstile processing for the form’s anti-spam check. Where configured, Resend processes inquiry messages for email delivery. This draft does not assert that Turnstile or Resend is currently active.',
          'The actual provider configuration and any provider processing or logs require owner/legal review before this notice is finalized.',
        ],
      },
      {
        id: 'language-cookie',
        title: 'Necessary language-preference cookie',
        paragraphs: [
          'The website uses a necessary cookie named lang to remember an explicit English or Spanish preference when you use the language selector. It stores that language choice; it is not described here as an advertising or analytics cookie.',
        ],
      },
      {
        id: 'analytics',
        title: 'Analytics is not activated',
        paragraphs: [
          'Analytics is not activated on this website. No analytics or advertising tracking is described as active in this draft. Any future tracking would require approval and configuration, followed by an update to this notice.',
        ],
      },
      {
        id: 'retention',
        title: 'Retention remains pending review',
        paragraphs: [
          'Actual retention periods for inquiry emails and any provider logs have not been established in this draft. No deletion deadline is claimed. Retention practices, provider configuration, and any related request process remain pending owner/legal review.',
        ],
      },
      {
        id: 'privacy-contact',
        title: 'Privacy questions',
        paragraphs: [
          'For questions about this draft or information you have sent, contact info@fallscity.dev. This draft does not claim legal compliance or establish a response or deletion deadline.',
        ],
      },
    ],
    cta: {
      label: 'Email a privacy question',
      href: 'mailto:info@fallscity.dev',
    },
  },
  es: {
    id: 'privacy',
    path: '/privacy/',
    metadata: {
      title: 'Aviso de privacidad — Borrador | Falls City',
      description: 'Borrador del aviso de privacidad de Falls City Dev Studio, pendiente de revisión del propietario y legal antes de publicar.',
      noindex: true,
    },
    eyebrow: 'Privacidad',
    h1: 'Aviso de privacidad',
    intro: 'Este borrador describe el tratamiento previsto de la información enviada mediante la página de Falls City. No es un aviso legal definitivo y debe revisarse antes de publicar.',
    draftNotice: 'Borrador — requiere revisión del propietario/legal antes del lanzamiento. La configuración de proveedores, las prácticas de conservación y la fecha de vigencia están pendientes de revisión.',
    effectiveDate: 'Fecha de vigencia: pendiente de revisión del propietario/legal.',
    sections: [
      {
        id: 'information',
        title: 'Información que usted decide enviar',
        paragraphs: [
          'El formulario de consulta solicita su nombre, correo electrónico, oficio y una descripción de su proyecto. El nombre del negocio, Instagram, método actual de reservas y posibles extras son opcionales. También requiere la aceptación de este aviso de privacidad.',
          'No envíe información médica, datos de tarjetas de pago ni otra información sensible. El formulario está destinado a conversar sobre un proyecto web, no a recopilar historiales de clientes.',
        ],
      },
      {
        id: 'purpose-and-storage',
        title: 'Finalidad y almacenamiento en la página',
        paragraphs: [
          'La información se utilizaría para revisar y responder a su consulta y para conversar sobre el alcance de la página solicitada. La página no almacena las consultas enviadas en una base de datos del sitio web.',
        ],
      },
      {
        id: 'providers',
        title: 'Proveedores, solo cuando estén configurados',
        paragraphs: [
          'Cuando esté configurado, Cloudflare proporcionará alojamiento web y el procesamiento de Turnstile para la comprobación contra spam del formulario. Cuando esté configurado, Resend procesará las consultas para su entrega por correo electrónico. Este borrador no afirma que Turnstile o Resend estén activos actualmente.',
          'La configuración real de proveedores y cualquier procesamiento o registro realizado por ellos requieren revisión del propietario/legal antes de finalizar este aviso.',
        ],
      },
      {
        id: 'language-cookie',
        title: 'Cookie necesaria de preferencia de idioma',
        paragraphs: [
          'La página utiliza una cookie necesaria llamada lang para recordar una preferencia explícita de inglés o español cuando usted usa el selector de idioma. Almacena esa elección de idioma; en este aviso no se describe como una cookie publicitaria o de analítica.',
        ],
      },
      {
        id: 'analytics',
        title: 'La analítica no está activada',
        paragraphs: [
          'La analítica no está activada en esta página. Este borrador no describe como activo ningún seguimiento de analítica o publicidad. Cualquier seguimiento futuro requeriría aprobación y configuración, seguidos de una actualización de este aviso.',
        ],
      },
      {
        id: 'retention',
        title: 'La conservación está pendiente de revisión',
        paragraphs: [
          'Los plazos reales de conservación de los correos de consulta y de cualquier registro de proveedores no se han establecido en este borrador. No se afirma ningún plazo de eliminación. Las prácticas de conservación, la configuración de proveedores y cualquier proceso de solicitud relacionado están pendientes de revisión del propietario/legal.',
        ],
      },
      {
        id: 'privacy-contact',
        title: 'Consultas sobre privacidad',
        paragraphs: [
          'Si tiene preguntas sobre este borrador o sobre la información que ha enviado, escriba a info@fallscity.dev. Este borrador no afirma cumplimiento legal ni establece plazos de respuesta o eliminación.',
        ],
      },
    ],
    cta: {
      label: 'Envíe una consulta de privacidad por correo',
      href: 'mailto:info@fallscity.dev',
    },
  },
};

export const pages = {
  panel: panelPage,
  'local-seo': localSeoPage,
  work: workPage,
  about: aboutPage,
  contact: contactPage,
  privacy: privacyPage,
} satisfies Record<PageId, Record<Lang, PageContent>>;
