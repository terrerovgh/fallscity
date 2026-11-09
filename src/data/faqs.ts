import type { Lang } from '../i18n';

export interface Faq {
  question: string;
  answer: string;
}

// FAQs are keyed so pages can pick them by name; keep keys identical in both languages.
type FaqKey =
  | 'businesses'
  | 'outsideLouisville'
  | 'spanish'
  | 'phones'
  | 'hosting'
  | 'rankings'
  | 'afterLaunch'
  | 'custom'
  | 'ongoingSeo'
  | 'maintenanceCovers'
  | 'cost'
  | 'redesign'
  | 'otherBuilder';

export const faqs: Record<Lang, Record<FaqKey, Faq>> = {
  en: {
    businesses: {
      question: 'What kinds of businesses does Falls City Dev Studio work with?',
      answer:
        'The studio is focused on Louisville-area small businesses, independent professionals, and service-based businesses that need a clear, professional website. That includes businesses launching their first site and those replacing an outdated one.',
    },
    outsideLouisville: {
      question: 'Do you work with businesses outside Louisville?',
      answer:
        'Yes. The studio is based in Louisville and also works remotely with small businesses anywhere in Kentucky. Conversations, reviews, and launch happen by phone, video call, and email, so the process is the same wherever you are.',
    },
    spanish: {
      question: 'Can we work together in Spanish?',
      answer:
        'Yes. We can run the project in English or Spanish, and a Spanish version of your website can be part of the scope if your customers need it.',
    },
    phones: {
      question: 'Will my website work well on phones?',
      answer:
        'Yes. Responsive behavior is part of the design and development process. Layouts, navigation, content, and inquiry paths are built for small screens first and then adapted for larger devices.',
    },
    hosting: {
      question: 'Can you help with my domain and hosting?',
      answer:
        'Yes. Domain connection, static hosting configuration, deployment, and HTTPS/SSL setup are available as part of the agreed project scope. The specific services and account arrangements are documented before launch.',
    },
    rankings: {
      question: 'Do you guarantee first-page Google rankings?',
      answer:
        'No. Rankings depend on many things outside anyone’s control, so no one can honestly guarantee them. What we do is set up solid on-page and technical SEO so search engines can find and understand your website.',
    },
    afterLaunch: {
      question: 'Can you update the website after it launches?',
      answer:
        'Yes. Ongoing maintenance can cover agreed updates, fixes, and basic technical support. The scope is established in advance so you know what is included and how additional work is handled.',
    },
    custom: {
      question: 'Is this a template or a custom website?',
      answer:
        'Custom. We don’t drop your logo into a generic theme. Some technical building blocks get reused between projects where it makes sense, but the page structure, design, and build are made for your project.',
    },
    ongoingSeo: {
      question: 'Is ongoing SEO included?',
      answer:
        'SEO Foundations covers the on-page and technical groundwork described on this page. Ongoing content strategy, link acquisition, paid search, and broad marketing campaigns are separate from that foundation and are not implied by it.',
    },
    maintenanceCovers: {
      question: 'What does maintenance cover?',
      answer:
        'The agreed maintenance scope can include relevant updates, troubleshooting, fixes, and basic technical support. Exact limits and any work outside that scope should be set out in your service agreement.',
    },
    cost: {
      question: 'How much does a small business website cost?',
      answer:
        'It depends on the scope: how many pages the site needs, features such as inquiry forms or booking links, how much content has to be prepared, and whether you want ongoing maintenance. After a first conversation, the scope is written up as a proposal with agreed deliverables, so the work is defined before it starts.',
    },
    redesign: {
      question: 'Can you redesign the website I already have?',
      answer:
        'Yes. A redesign starts by reviewing what the current site does well, what is missing, and which pages and addresses already exist, so useful content and links are carried forward or redirected rather than lost.',
    },
    otherBuilder: {
      question: 'Can you maintain a website someone else built?',
      answer:
        'Describe the site in your inquiry: what it is built with, where it is hosted, and what needs attention. Whether ongoing maintenance is a good fit depends on the platform and its current condition, and that is discussed before any agreement.',
    },
  },
  es: {
    businesses: {
      question: '¿Con qué tipo de negocios trabaja Falls City Dev Studio?',
      answer:
        'El estudio se enfoca en pequeños negocios del área de Louisville, profesionales independientes y negocios de servicios que necesitan una página web clara y profesional. Eso incluye a quienes lanzan su primera página y a quienes reemplazan una anticuada.',
    },
    outsideLouisville: {
      question: '¿Trabajan con negocios fuera de Louisville?',
      answer:
        'Sí. El estudio está en Louisville y también trabaja a distancia con pequeños negocios de cualquier parte de Kentucky. Las conversaciones, las revisiones y la publicación se hacen por teléfono, videollamada y correo, así que el proceso es el mismo esté donde esté.',
    },
    spanish: {
      question: '¿Podemos trabajar en español?',
      answer:
        'Sí. Podemos llevar el proyecto en inglés o en español, y una versión en español de su página puede formar parte del alcance si sus clientes la necesitan.',
    },
    phones: {
      question: '¿Mi página se verá bien en el teléfono?',
      answer:
        'Sí. La adaptación a pantallas es parte del diseño y del desarrollo. El diseño, la navegación, el contenido y las formas de contacto se construyen primero para pantallas pequeñas y luego se adaptan a pantallas más grandes.',
    },
    hosting: {
      question: '¿Me pueden ayudar con el dominio y el hosting?',
      answer:
        'Sí. La conexión del dominio, la configuración del hosting, la publicación y el HTTPS/SSL pueden formar parte del alcance acordado. Los servicios y las cuentas que se usan quedan documentados antes de publicar.',
    },
    rankings: {
      question: '¿Garantizan la primera página de Google?',
      answer:
        'No. El posicionamiento depende de muchas cosas que nadie controla, así que nadie puede garantizarlo con honestidad. Lo que sí hacemos es dejar bien hecho el SEO técnico y del contenido para que los buscadores puedan encontrar y entender su página.',
    },
    afterLaunch: {
      question: '¿Pueden actualizar la página después de publicarla?',
      answer:
        'Sí. El mantenimiento puede cubrir actualizaciones, arreglos y soporte técnico básico acordados. El alcance se define antes, para que sepa qué está incluido y cómo se maneja el trabajo adicional.',
    },
    custom: {
      question: '¿Es una plantilla o una página a la medida?',
      answer:
        'A la medida. No ponemos su logo en un tema genérico. Algunas piezas técnicas se reutilizan entre proyectos cuando tiene sentido, pero la estructura, el diseño y la construcción se hacen para su proyecto.',
    },
    ongoingSeo: {
      question: '¿Incluye SEO continuo?',
      answer:
        'Las bases de SEO cubren el trabajo técnico y de contenido descrito en esta página. La estrategia de contenido continua, la obtención de enlaces, los anuncios pagados y las campañas de marketing son trabajos aparte y no están incluidos.',
    },
    maintenanceCovers: {
      question: '¿Qué cubre el mantenimiento?',
      answer:
        'El mantenimiento acordado puede incluir actualizaciones, solución de problemas, arreglos y soporte técnico básico. Los límites exactos y el trabajo fuera de ese alcance deben quedar por escrito en su acuerdo de servicio.',
    },
    cost: {
      question: '¿Cuánto cuesta una página web para un pequeño negocio?',
      answer:
        'Depende del alcance: cuántas páginas necesita, funciones como formularios de contacto o enlaces de reservas, cuánto contenido hay que preparar y si quiere mantenimiento. Después de una primera conversación, el alcance se escribe en una propuesta con entregables acordados, para que el trabajo quede definido antes de empezar.',
    },
    redesign: {
      question: '¿Pueden rediseñar la página que ya tengo?',
      answer:
        'Sí. Un rediseño empieza revisando qué hace bien la página actual, qué le falta y qué páginas y direcciones ya existen, para que el contenido y los enlaces útiles se conserven o se redirijan en lugar de perderse.',
    },
    otherBuilder: {
      question: '¿Pueden mantener una página que hizo otra persona?',
      answer:
        'Describa la página en su consulta: con qué está hecha, dónde está alojada y qué necesita atención. Si el mantenimiento es una buena opción depende de la plataforma y de su estado actual, y eso se conversa antes de cualquier acuerdo.',
    },
  },
};

/** FAQs shown on the homepage, in order. */
export const homeFaqKeys: FaqKey[] = ['businesses', 'outsideLouisville', 'spanish', 'phones', 'hosting', 'rankings', 'afterLaunch'];

/** FAQs shown on /services/, in order. */
export const serviceFaqKeys: FaqKey[] = ['custom', 'ongoingSeo', 'maintenanceCovers'];

/** Pick FAQs by key in one language. */
export const pickFaqs = (lang: Lang, keys: FaqKey[]) => keys.map((key) => faqs[lang][key]);
