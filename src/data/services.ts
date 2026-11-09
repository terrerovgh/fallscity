import type { Lang } from '../i18n';

export interface Service {
  number: string;
  /** Stable fragment id for this service's section on /services/. */
  anchor: string;
  /** Where to learn more (English path; localize with localizePath). */
  href: string;
  /** Descriptive anchor text for links to the dedicated page, if there is one. */
  linkLabel?: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  details: string[];
}

// Keep both languages in the same order and with the same anchors and hrefs.
export const services: Record<Lang, Service[]> = {
  en: [
    {
      number: '01',
      anchor: 'website-design-development',
      href: '/services/web-design/',
      linkLabel: 'Small business website design, in detail',
      title: 'Website Design & Development',
      shortTitle: 'Design & Development',
      summary: 'A custom website built around what your customers need to know and do.',
      description:
        'Your website should make your business easy to understand and easy to contact. Falls City Dev Studio designs and builds custom business websites with clear content, well-planned layouts, and solid code.',
      details: [
        'Custom page layouts and visual direction',
        'Mobile-first, responsive implementation',
        'Accessible navigation and readable content',
        'Performance-conscious development',
        'Contact and inquiry paths',
      ],
    },
    {
      number: '02',
      anchor: 'seo-foundations',
      href: '/services/seo-foundations/',
      linkLabel: 'What SEO foundations include',
      title: 'SEO Foundations',
      shortTitle: 'SEO Foundations',
      summary: 'A clear technical and content structure that helps search engines understand your business.',
      description:
        'Good search visibility starts with a website that is useful, understandable, and technically sound. SEO foundations are part of the project from the start. Nobody can honestly promise a specific ranking, but the fundamentals can be done right.',
      details: [
        'Semantic HTML and logical heading structure',
        'Unique page titles and meta descriptions',
        'Canonical URLs, XML sitemap, and robots.txt',
        'Relevant structured data using verified business information',
        'Indexing readiness and descriptive internal links',
      ],
    },
    {
      number: '03',
      anchor: 'domains-hosting-ssl',
      href: '/services/#domains-hosting-ssl',
      title: 'Domains, Hosting & SSL',
      shortTitle: 'Domains, Hosting & SSL',
      summary: 'Setup and launch help for the technical side of your website.',
      description:
        'Getting a website online involves more than uploading files. The studio can coordinate the domain, hosting, deployment, and HTTPS setup so the pieces work together and you understand what is being managed.',
      details: [
        'Domain connection and DNS configuration assistance',
        'Static hosting setup and deployment',
        'HTTPS/SSL configuration',
        'Launch checks and deployment support',
        'Clear documentation of the services in use',
      ],
    },
    {
      number: '04',
      anchor: 'website-maintenance',
      href: '/services/website-maintenance/',
      linkLabel: 'How website maintenance works',
      title: 'Website Maintenance',
      shortTitle: 'Website Maintenance',
      summary: 'Ongoing updates, fixes, and checks to keep your website working.',
      description:
        'Websites need regular care after launch. Maintenance keeps the technical side in good shape and gives you someone to call when something needs attention. The exact scope is agreed before work begins.',
      details: [
        'Agreed content and technical updates',
        'Troubleshooting and relevant fixes',
        'Performance and reliability checks',
        'Dependency and platform maintenance as applicable',
        'Basic technical support within the agreed scope',
      ],
    },
  ],
  es: [
    {
      number: '01',
      anchor: 'website-design-development',
      href: '/services/web-design/',
      linkLabel: 'Diseño web para pequeños negocios, en detalle',
      title: 'Diseño y desarrollo web',
      shortTitle: 'Diseño y desarrollo',
      summary: 'Una página web a la medida de lo que sus clientes necesitan saber y hacer.',
      description:
        'Su página web debe hacer que su negocio sea fácil de entender y fácil de contactar. Falls City Dev Studio diseña y construye páginas web a la medida para negocios, con contenido claro, una estructura bien pensada y código sólido.',
      details: [
        'Diseño y estructura de páginas propios para su negocio',
        'Pensada primero para el teléfono y adaptable a cualquier pantalla',
        'Navegación accesible y textos fáciles de leer',
        'Desarrollo cuidando la velocidad de carga',
        'Formas claras de contactarle o enviar una consulta',
      ],
    },
    {
      number: '02',
      anchor: 'seo-foundations',
      href: '/services/seo-foundations/',
      linkLabel: 'Qué incluyen las bases de SEO',
      title: 'Bases de SEO',
      shortTitle: 'Bases de SEO',
      summary: 'Una estructura técnica y de contenido clara que ayuda a los buscadores a entender su negocio.',
      description:
        'Una buena visibilidad en los buscadores empieza con una página útil, fácil de entender y técnicamente bien hecha. Las bases de SEO forman parte del proyecto desde el principio. Nadie puede prometer con honestidad un lugar concreto en Google, pero lo fundamental sí se puede hacer bien.',
      details: [
        'HTML semántico y encabezados ordenados',
        'Títulos y descripciones únicos en cada página',
        'URLs canónicas, mapa del sitio XML y robots.txt',
        'Datos estructurados con información verificada de su negocio',
        'Página lista para indexarse y enlaces internos descriptivos',
      ],
    },
    {
      number: '03',
      anchor: 'domains-hosting-ssl',
      href: '/services/#domains-hosting-ssl',
      title: 'Dominio, hosting y SSL',
      shortTitle: 'Dominio, hosting y SSL',
      summary: 'Ayuda con la configuración y la publicación de la parte técnica de su página.',
      description:
        'Poner una página web en línea es más que subir archivos. El estudio puede coordinar el dominio, el hosting, la publicación y el HTTPS para que todo funcione junto y usted entienda qué se está administrando.',
      details: [
        'Ayuda para conectar el dominio y configurar el DNS',
        'Configuración del hosting y publicación',
        'Configuración de HTTPS/SSL',
        'Revisiones y apoyo al publicar',
        'Documentación clara de los servicios que se usan',
      ],
    },
    {
      number: '04',
      anchor: 'website-maintenance',
      href: '/services/website-maintenance/',
      linkLabel: 'Cómo funciona el mantenimiento web',
      title: 'Mantenimiento web',
      shortTitle: 'Mantenimiento web',
      summary: 'Cambios, arreglos y revisiones continuas para que su página siga funcionando.',
      description:
        'Las páginas web necesitan cuidado después de publicarse. El mantenimiento mantiene la parte técnica en buen estado y le da a alguien a quien llamar cuando algo necesita atención. Lo que incluye se acuerda antes de empezar.',
      details: [
        'Actualizaciones de contenido y técnicas acordadas',
        'Solución de problemas y arreglos necesarios',
        'Revisiones de velocidad y funcionamiento',
        'Mantenimiento de dependencias y plataforma cuando aplique',
        'Soporte técnico básico dentro de lo acordado',
      ],
    },
  ],
};

/** One service by its anchor, in the given language. */
export const getService = (lang: Lang, anchor: string) => {
  const service = services[lang].find((item) => item.anchor === anchor);
  if (!service) throw new Error(`Unknown service: ${anchor}`);
  return service;
};
