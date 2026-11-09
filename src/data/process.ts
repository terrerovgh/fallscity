import type { Lang } from '../i18n';

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
      title: 'Start with a conversation',
      summary: 'Talk through the business, the website you need, and what is not working today.',
      description:
        'The first step is a practical discussion about your business, customers, services, and goals. You do not need to arrive with a technical specification or have every detail figured out.',
      clientRole: 'Bring your questions, examples of what you like, and any existing website or brand materials.',
    },
    {
      number: '02',
      title: 'Define the scope',
      summary: 'Turn the conversation into a clear proposal with agreed deliverables and responsibilities.',
      description:
        'The project scope sets out the pages, features, content needs, and technical work involved. It also identifies anything outside the project so expectations are clear before design and development begin.',
      clientRole: 'Review the proposal, ask questions, and approve the scope before work starts.',
    },
    {
      number: '03',
      title: 'Design and build',
      summary: 'Shape the content and visual direction, then implement the website with care.',
      description:
        'The studio develops the page structure, design, and working website around the agreed scope. Decisions about layout, mobile behavior, accessibility, and performance are made during the build instead of being left for the end.',
      clientRole: 'Provide the agreed business information, copy input, images, and timely feedback needed for the project.',
    },
    {
      number: '04',
      title: 'Review and refine',
      summary: 'Check the real website, gather feedback, and resolve the agreed revisions.',
      description:
        'You review the working site rather than trying to imagine the result from a static picture. The studio checks content, links, responsive layouts, forms, and technical details while incorporating the revisions defined in the project scope.',
      clientRole: 'Review the agreed pages and features, then provide clear, consolidated feedback.',
    },
    {
      number: '05',
      title: 'Launch and look after it',
      summary: 'Complete launch checks, connect the production setup, and decide what support you need next.',
      description:
        'After approval, the website is deployed and the domain, HTTPS, metadata, and key user paths are checked. If ongoing maintenance is part of your engagement, its scope is already clear; if not, you receive the agreed handoff.',
      clientRole: 'Approve the finished website and coordinate any account or domain access needed for launch.',
    },
  ],
  es: [
    {
      number: '01',
      title: 'Empezamos con una conversación',
      summary: 'Hablamos de su negocio, de la página que necesita y de lo que hoy no está funcionando.',
      description:
        'El primer paso es una conversación práctica sobre su negocio, sus clientes, sus servicios y sus metas. No necesita llegar con una especificación técnica ni tener todos los detalles resueltos.',
      clientRole: 'Traiga sus preguntas, ejemplos de lo que le gusta y cualquier página o material de marca que ya tenga.',
    },
    {
      number: '02',
      title: 'Definimos el alcance',
      summary: 'Convertimos la conversación en una propuesta clara, con entregables y responsabilidades acordados.',
      description:
        'El alcance del proyecto detalla las páginas, funciones, contenido y trabajo técnico. También deja claro lo que queda fuera del proyecto, para que las expectativas estén definidas antes de empezar el diseño y el desarrollo.',
      clientRole: 'Revise la propuesta, haga sus preguntas y apruebe el alcance antes de que empiece el trabajo.',
    },
    {
      number: '03',
      title: 'Diseñamos y construimos',
      summary: 'Damos forma al contenido y al estilo visual, y construimos la página con cuidado.',
      description:
        'El estudio desarrolla la estructura de las páginas, el diseño y la página funcionando, según el alcance acordado. Las decisiones sobre diseño, comportamiento en el teléfono, accesibilidad y velocidad se toman durante la construcción, no al final.',
      clientRole: 'Entregue la información del negocio acordada, sus aportes para los textos, las imágenes y sus comentarios a tiempo.',
    },
    {
      number: '04',
      title: 'Revisamos y ajustamos',
      summary: 'Revisamos la página real, recogemos sus comentarios y hacemos los cambios acordados.',
      description:
        'Usted revisa la página funcionando, en lugar de imaginar el resultado a partir de una imagen. El estudio revisa el contenido, los enlaces, la adaptación a pantallas, los formularios y los detalles técnicos, e incorpora los cambios definidos en el alcance.',
      clientRole: 'Revise las páginas y funciones acordadas, y envíe sus comentarios de forma clara y en un solo grupo.',
    },
    {
      number: '05',
      title: 'Publicamos y la cuidamos',
      summary: 'Hacemos las revisiones finales, publicamos y decidimos qué soporte necesita después.',
      description:
        'Tras su aprobación, se publica la página y se revisan el dominio, el HTTPS, los metadatos y los recorridos principales de los visitantes. Si el mantenimiento forma parte del acuerdo, su alcance ya está claro; si no, recibe la entrega acordada.',
      clientRole: 'Apruebe la página terminada y coordine el acceso a las cuentas o al dominio necesarios para publicarla.',
    },
  ],
};
