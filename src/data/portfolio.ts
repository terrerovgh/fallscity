import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import goodninaDesktop from '../assets/portfolio/goodnina-desktop.webp';
import goodninaMobile from '../assets/portfolio/goodnina-mobile.webp';
import leeyrealtyDesktop from '../assets/portfolio/leeyrealty-desktop.webp';
import leeyrealtyMobile from '../assets/portfolio/leeyrealty-mobile.webp';
import catandcobraDesktop from '../assets/portfolio/catandcobra-desktop.webp';
import catandcobraMobile from '../assets/portfolio/catandcobra-mobile.webp';
import terrerovDesktop from '../assets/portfolio/terrerov-desktop.webp';
import terrerovMobile from '../assets/portfolio/terrerov-mobile.webp';
import sagwaDesktop from '../assets/portfolio/sagwa-desktop.webp';
import sagwaMobile from '../assets/portfolio/sagwa-mobile.webp';
import allneedsdiscountDesktop from '../assets/portfolio/allneedsdiscount-desktop.webp';
import allneedsdiscountMobile from '../assets/portfolio/allneedsdiscount-mobile.webp';
import durafenceDesktop from '../assets/portfolio/durafence-desktop.webp';
import durafenceMobile from '../assets/portfolio/durafence-mobile.webp';
import characterDesktop from '../assets/portfolio/character-desktop.webp';
import characterMobile from '../assets/portfolio/character-mobile.webp';

/**
 * Live sites supplied by the owner (November 2026). Descriptions summarize each
 * site's own title, meta description, and visible navigation — no outcomes or
 * client claims. Screenshots are real captures of each homepage
 * (desktop 1440×900, mobile 390×844); recapture them when a site changes.
 */
export interface Project {
  slug: string;
  name: string;
  url: string;
  /** The address as shown to visitors. */
  domain: string;
  category: Record<Lang, string>;
  description: Record<Lang, string>;
  desktop: ImageMetadata;
  mobile: ImageMetadata;
}

export const projects: Project[] = [
  {
    slug: 'goodnina',
    name: 'Nina Romero',
    url: 'https://goodnina.com/',
    domain: 'goodnina.com',
    category: {
      en: 'Tattoo artist in Albuquerque, NM',
      es: 'Tatuadora en Albuquerque, NM',
    },
    description: {
      en: 'A portfolio for a fine line tattoo artist, with her floral and ornamental work, a gallery, and session booking, in English and Spanish.',
      es: 'Un portafolio para una tatuadora de línea fina, con su trabajo floral y ornamental, una galería y reserva de sesiones, en inglés y español.',
    },
    desktop: goodninaDesktop,
    mobile: goodninaMobile,
  },
  {
    slug: 'leeyrealty',
    name: 'Leey Hernandez',
    url: 'https://leeyrealty.com/',
    domain: 'leeyrealty.com',
    category: {
      en: 'Realtor in South Georgia & North Florida',
      es: 'Agente inmobiliaria en el sur de Georgia y el norte de Florida',
    },
    description: {
      en: 'A bilingual site for a realtor licensed in Georgia and Florida, with homes for sale, a blog, services, and the areas she covers.',
      es: 'Un sitio bilingüe para una agente inmobiliaria con licencia en Georgia y Florida, con casas en venta, un blog, servicios y las zonas que cubre.',
    },
    desktop: leeyrealtyDesktop,
    mobile: leeyrealtyMobile,
  },
  {
    slug: 'catandcobra',
    name: 'Cat & Cobra',
    url: 'https://www.terrerov.com/catandcobra/',
    domain: 'terrerov.com/catandcobra',
    category: {
      en: 'Tattoo studio in Albuquerque, NM',
      es: 'Estudio de tatuajes en Albuquerque, NM',
    },
    description: {
      en: 'An app-style site for a custom tattoo studio, with artists, a gallery, aftercare guidance, and booking, in English and Spanish.',
      es: 'Un sitio con estilo de app para un estudio de tatuajes personalizados, con artistas, galería, guía de cuidados y reservas, en inglés y español.',
    },
    desktop: catandcobraDesktop,
    mobile: catandcobraMobile,
  },
  {
    slug: 'allneedsdiscount',
    name: 'All Needs Discount',
    url: 'https://allneedsdiscount.com/',
    domain: 'allneedsdiscount.com',
    category: {
      en: 'Remodeling & construction in South Georgia',
      es: 'Remodelación y construcción en el sur de Georgia',
    },
    description: {
      en: 'A site for a licensed residential remodeling and construction company, with its services, rentals, service area, and free estimate requests.',
      es: 'Un sitio para una empresa con licencia de remodelación y construcción residencial, con sus servicios, alquileres, zona de servicio y solicitudes de presupuesto gratis.',
    },
    desktop: allneedsdiscountDesktop,
    mobile: allneedsdiscountMobile,
  },
  {
    slug: 'durafence',
    name: 'Dura Fence Metal',
    url: 'https://durafencemetal.com/',
    domain: 'durafencemetal.com',
    category: {
      en: 'Metal fences & gates in South Georgia',
      es: 'Cercas y portones de metal en el sur de Georgia',
    },
    description: {
      en: 'A catalog of metal privacy fences, gates, planks, and parts, with an estimate builder for Standard or Premium options.',
      es: 'Un catálogo de cercas de privacidad de metal, portones, tablas y piezas, con un cotizador para opciones Standard o Premium.',
    },
    desktop: durafenceDesktop,
    mobile: durafenceMobile,
  },
  {
    slug: 'sagwa',
    name: 'Sagwa',
    url: 'https://sagwa.dev/',
    domain: 'sagwa.dev',
    category: {
      en: 'Open-source documentation',
      es: 'Documentación de código abierto',
    },
    description: {
      en: 'Documentation for Sagwa, an open-source Siamese cat that lives on an M5Stack CoreS3, with an interactive 3D model of the hardware.',
      es: 'Documentación de Sagwa, un gato siamés de código abierto que vive en un M5Stack CoreS3, con un modelo 3D interactivo del hardware.',
    },
    desktop: sagwaDesktop,
    mobile: sagwaMobile,
  },
  {
    slug: 'terrerov',
    name: 'terrerov.com',
    url: 'https://www.terrerov.com/',
    domain: 'terrerov.com',
    category: {
      en: 'Personal résumé site',
      es: 'Sitio de currículum personal',
    },
    description: {
      en: 'An illustrated, scroll-driven résumé for a computer engineer and Linux systems and network administrator.',
      es: 'Un currículum ilustrado que avanza con el scroll, para un ingeniero en computación y administrador de sistemas Linux y redes.',
    },
    desktop: terrerovDesktop,
    mobile: terrerovMobile,
  },
  {
    slug: 'character',
    name: 'Who are you?',
    url: 'https://character.terrerov.com/',
    domain: 'character.terrerov.com',
    category: {
      en: 'Interactive experiment',
      es: 'Experimento interactivo',
    },
    description: {
      en: 'Type a username and get a hand-drawn creature: seeded procedural characters drawn with Canvas 2D brush strokes on a Three.js rig.',
      es: 'Escriba un nombre de usuario y obtenga una criatura dibujada a mano: personajes procedurales generados a partir de una semilla, con trazos de pincel en Canvas 2D sobre un esqueleto de Three.js.',
    },
    desktop: characterDesktop,
    mobile: characterMobile,
  },
];

export const getProject = (slug: string) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Unknown portfolio project: ${slug}`);
  return project;
};
