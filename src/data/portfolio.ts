import type { ImageMetadata } from 'astro';
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
  category: string;
  description: string;
  desktop: ImageMetadata;
  mobile: ImageMetadata;
}

export const projects: Project[] = [
  {
    slug: 'goodnina',
    name: 'Nina Romero',
    url: 'https://goodnina.com/',
    domain: 'goodnina.com',
    category: 'Tattoo artist · Albuquerque, NM',
    description: 'A portfolio for a fine line tattoo artist, with her floral and ornamental work, a gallery, and session booking, in English and Spanish.',
    desktop: goodninaDesktop,
    mobile: goodninaMobile,
  },
  {
    slug: 'leeyrealty',
    name: 'Leey Hernandez',
    url: 'https://leeyrealty.com/',
    domain: 'leeyrealty.com',
    category: 'Realtor · South Georgia & North Florida',
    description: 'A bilingual site for a realtor licensed in Georgia and Florida, with homes for sale, a blog, services, and the areas she covers.',
    desktop: leeyrealtyDesktop,
    mobile: leeyrealtyMobile,
  },
  {
    slug: 'catandcobra',
    name: 'Cat & Cobra',
    url: 'https://www.terrerov.com/catandcobra/',
    domain: 'terrerov.com/catandcobra',
    category: 'Tattoo studio · Albuquerque, NM',
    description: 'An app-style site for a custom tattoo studio, with artists, a gallery, aftercare guidance, and booking, in English and Spanish.',
    desktop: catandcobraDesktop,
    mobile: catandcobraMobile,
  },
  {
    slug: 'allneedsdiscount',
    name: 'All Needs Discount',
    url: 'https://allneedsdiscount.com/',
    domain: 'allneedsdiscount.com',
    category: 'Remodeling & construction · South Georgia',
    description: 'A site for a licensed residential remodeling and construction company, with its services, rentals, service area, and free estimate requests.',
    desktop: allneedsdiscountDesktop,
    mobile: allneedsdiscountMobile,
  },
  {
    slug: 'durafence',
    name: 'Dura Fence Metal',
    url: 'https://durafencemetal.com/',
    domain: 'durafencemetal.com',
    category: 'Metal fences & gates · South Georgia',
    description: 'A catalog of metal privacy fences, gates, planks, and parts, with an estimate builder for Standard or Premium options.',
    desktop: durafenceDesktop,
    mobile: durafenceMobile,
  },
  {
    slug: 'sagwa',
    name: 'Sagwa',
    url: 'https://sagwa.dev/',
    domain: 'sagwa.dev',
    category: 'Open-source project · Documentation',
    description: 'Documentation for Sagwa, an open-source Siamese cat that lives on an M5Stack CoreS3, with an interactive 3D model of the hardware.',
    desktop: sagwaDesktop,
    mobile: sagwaMobile,
  },
  {
    slug: 'terrerov',
    name: 'terrerov.com',
    url: 'https://www.terrerov.com/',
    domain: 'terrerov.com',
    category: 'Résumé · Personal site',
    description: 'An illustrated, scroll-driven résumé for a computer engineer and Linux systems and network administrator.',
    desktop: terrerovDesktop,
    mobile: terrerovMobile,
  },
  {
    slug: 'character',
    name: 'Who are you?',
    url: 'https://character.terrerov.com/',
    domain: 'character.terrerov.com',
    category: 'Interactive experiment',
    description: 'Type a username and get a hand-drawn creature: seeded procedural characters drawn with Canvas 2D brush strokes on a Three.js rig.',
    desktop: characterDesktop,
    mobile: characterMobile,
  },
];

export const getProject = (slug: string) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Unknown portfolio project: ${slug}`);
  return project;
};
