import type { Lang } from '../i18n';

export interface Project {
  id: string;
  name: string;
  url: string;
  domain: string;
  imageBase: string;
  kind: Record<Lang, string>;
  description: Record<Lang, string>;
  evidence: Record<Lang, string>;
  captureStatus: 'verified' | 'blocked';
}

export const projects: Project[] = [
  { id: 'nina', name: 'Nina Romero', url: 'https://goodnina.com/', domain: 'goodnina.com', imageBase: '01-goodnina-home', kind: { en: 'Fine line tattoo · Albuquerque', es: 'Línea fina · Albuquerque' }, description: { en: 'A bilingual artist site with floral and ornamental work, an artist story, and a clear route to booking.', es: 'Una página bilingüe con trabajo floral y ornamental, historia de la artista y una ruta clara para reservar.' }, evidence: { en: 'Public gallery with style filters and a visible link to Venue.', es: 'Galería pública con filtros por estilo y enlace visible a Venue.' }, captureStatus: 'verified' },
  { id: 'pixel', name: 'Pixel Tattoo', url: 'https://tonypixeltattoo.com/', domain: 'tonypixeltattoo.com', imageBase: '02-tonypixel-home', kind: { en: 'Realism · Montevideo', es: 'Realismo · Montevideo' }, description: { en: 'A portfolio-led site for a realism artist, with specialties and a direct inquiry path.', es: 'Una página centrada en el portafolio de un artista de realismo, con especialidades y una consulta directa.' }, evidence: { en: 'Portfolio filters, artist information, and an inquiry form with a WhatsApp action.', es: 'Filtros de portafolio, información del artista y formulario de consulta con acción de WhatsApp.' }, captureStatus: 'verified' },
  { id: 'cat-cobra', name: 'Cat & Cobra', url: 'https://www.terrerov.com/catandcobra/', domain: 'terrerov.com/catandcobra', imageBase: '03-catandcobra-home', kind: { en: 'Tattoo studio · Albuquerque', es: 'Estudio de tatuaje · Albuquerque' }, description: { en: 'A bilingual studio presence that brings artists, work, and practical client information together.', es: 'Una presencia bilingüe que reúne artistas, trabajos e información práctica para clientes.' }, evidence: { en: 'Artist directory, gallery filters by style and artist, and public booking information.', es: 'Directorio de artistas, filtros de galería por estilo y artista, e información pública de reservas.' }, captureStatus: 'verified' },
  { id: 'leey', name: 'Leey Hernandez', url: 'https://leeyrealty.com/', domain: 'leeyrealty.com', imageBase: '04-leeyrealty-home', kind: { en: 'Project website', es: 'Proyecto web' }, description: { en: 'Visit the public project website.', es: 'Visite la página pública del proyecto.' }, evidence: { en: 'No screenshot is shown: capture returned a Cloudflare origin error during review.', es: 'No se muestra captura: la revisión devolvió un error de origen de Cloudflare.' }, captureStatus: 'blocked' },
  { id: 'dura', name: 'Dura Fence Metal', url: 'https://durafencemetal.com/', domain: 'durafencemetal.com', imageBase: '05-durafence-home', kind: { en: 'Project website', es: 'Proyecto web' }, description: { en: 'Visit the public project website.', es: 'Visite la página pública del proyecto.' }, evidence: { en: 'No screenshot is shown: capture returned a Cloudflare origin error during review.', es: 'No se muestra captura: la revisión devolvió un error de origen de Cloudflare.' }, captureStatus: 'blocked' },
  { id: 'all-needs', name: 'All Needs Discount', url: 'https://allneedsdiscount.com/', domain: 'allneedsdiscount.com', imageBase: '06-allneeds-home', kind: { en: 'Project website', es: 'Proyecto web' }, description: { en: 'Visit the public project website.', es: 'Visite la página pública del proyecto.' }, evidence: { en: 'No screenshot is shown: capture returned a Cloudflare origin error during review.', es: 'No se muestra captura: la revisión devolvió un error de origen de Cloudflare.' }, captureStatus: 'blocked' },
];
