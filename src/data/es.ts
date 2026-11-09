// Spanish copy for /es/. Keep it a faithful translation of the English
// services, process, and FAQs: same scope, no prices, no promises.
import { services } from './services';

export interface ServiceEs {
  /** Matches Service.number in ./services so the English link stays in sync. */
  number: string;
  title: string;
  summary: string;
  details: string[];
}

const servicesEsCopy: ServiceEs[] = [
  {
    number: '01',
    title: 'Diseño y desarrollo web',
    summary: 'Una página web hecha a la medida de lo que sus clientes necesitan saber y hacer.',
    details: [
      'Diseño y estructura propios para su negocio, sin plantillas genéricas',
      'Pensada primero para el teléfono y adaptable a cualquier pantalla',
      'Navegación accesible y textos fáciles de leer',
      'Carga rápida',
      'Formas claras de contactarle o pedir una cotización',
    ],
  },
  {
    number: '02',
    title: 'Bases de SEO',
    summary: 'Una estructura técnica y de contenido que ayuda a Google a entender su negocio.',
    details: [
      'HTML semántico y encabezados ordenados',
      'Títulos y descripciones únicos en cada página',
      'URLs canónicas, mapa del sitio (sitemap) y robots.txt',
      'Datos estructurados con información verificada de su negocio',
      'Página lista para que Google la encuentre e indexe',
    ],
  },
  {
    number: '03',
    title: 'Dominio, hosting y SSL',
    summary: 'Nos ocupamos de la parte técnica para poner su página en línea.',
    details: [
      'Conexión del dominio y configuración de DNS',
      'Configuración del hosting y publicación',
      'Certificado SSL (HTTPS, el candado del navegador)',
      'Revisión final antes y después de publicar',
      'Documentación clara de los servicios que se usan',
    ],
  },
  {
    number: '04',
    title: 'Mantenimiento web',
    summary: 'Cambios, arreglos y revisiones para que su página siga funcionando.',
    details: [
      'Actualizaciones de contenido y técnicas acordadas',
      'Solución de problemas',
      'Revisiones de velocidad y funcionamiento',
      'Mantenimiento de la plataforma cuando aplique',
      'Soporte técnico básico dentro de lo acordado',
    ],
  },
];

/** Spanish services, each paired with the English page that covers it in detail. */
export const servicesEs = servicesEsCopy.map((service) => {
  const english = services.find((s) => s.number === service.number);
  if (!english) throw new Error(`No English service ${service.number} for /es/`);
  return { ...service, href: english.href };
});

export const processStepsEs = [
  { number: '01', title: 'Una conversación', summary: 'Hablamos de su negocio, de la página que necesita y de lo que hoy no funciona.' },
  { number: '02', title: 'El alcance, por escrito', summary: 'Una propuesta clara con lo que se entrega y lo que le toca a cada parte.' },
  { number: '03', title: 'Diseño y construcción', summary: 'Definimos el contenido y el estilo, y construimos la página con cuidado.' },
  { number: '04', title: 'Revisión', summary: 'Usted revisa la página real, no un dibujo, y hacemos los cambios acordados.' },
  { number: '05', title: 'Publicación y cuidado', summary: 'Publicamos, revisamos que todo funcione y acordamos el soporte que necesita.' },
];

export const faqsEs = [
  {
    question: '¿Puedo hacer todo el proyecto en español?',
    answer:
      'Sí. Las conversaciones, la propuesta, las revisiones y el soporte pueden ser en español. Su página puede estar en inglés, en español o en los dos idiomas, según sus clientes.',
  },
  {
    question: '¿Trabajan solo en Louisville?',
    answer:
      'El estudio está en Louisville y también trabaja a distancia con pequeños negocios de cualquier parte de Kentucky, por teléfono, videollamada y correo.',
  },
  {
    question: '¿Mi página se verá bien en el teléfono?',
    answer:
      'Sí. La mayoría de sus clientes la van a ver en el teléfono, así que la diseñamos primero para pantallas pequeñas y luego la adaptamos a computadoras.',
  },
  {
    question: '¿Me pueden ayudar con el dominio y el hosting?',
    answer:
      'Sí. Podemos conectar el dominio, configurar el hosting, publicar la página y activar el SSL (HTTPS). Antes de publicar, le dejamos por escrito qué servicios se usan y a nombre de quién están.',
  },
  {
    question: '¿Me garantizan el primer lugar en Google?',
    answer:
      'No. Nadie puede garantizarlo con honestidad, porque depende de muchas cosas fuera de nuestro control. Lo que sí hacemos es dejar bien hechas las bases técnicas y de contenido para que Google pueda encontrar y entender su página.',
  },
  {
    question: '¿Pueden actualizar la página después de publicarla?',
    answer:
      'Sí. El mantenimiento cubre cambios, arreglos y soporte técnico básico. Lo que incluye se acuerda antes, para que sepa qué está cubierto.',
  },
];
