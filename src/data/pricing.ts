import type { Lang } from '../i18n';

/**
 * Starting prices approved by the owner on 2026-11-16 (private knowledge base,
 * politica/precios-y-paquetes.md). Change them only when that policy changes.
 * Exact quotes are confirmed in writing; Kentucky sales tax is added where it applies.
 */
export interface Tier {
  id: 'founding' | 'artist' | 'studio';
  name: string;
  audience: string;
  price: string;
  priceNote: string;
  includes: string[];
}

export const pricing: Record<Lang, Tier[]> = {
  en: [
    {
      id: 'founding',
      name: 'Founding Partner',
      audience: 'Louisville barbershops and salons without a website. Open to the first five businesses only.',
      price: '$350',
      priceNote: 'to build, then $59/month for hosting and care ($590 for the first year paid up front)',
      includes: ['1–3 mobile-first pages', 'Your service menu', 'A button to your booking app or phone', 'SEO foundations', 'Domain in your name'],
    },
    {
      id: 'artist',
      name: 'Independent Artist',
      audience: 'Tattoo artists and solo professionals anywhere in the US.',
      price: 'From $650',
      priceNote: 'one time. Optional care from $49/month, or own it outright with no monthly fee',
      includes: ['Portfolio organized by style', 'Inquiry form that asks size, placement, and budget', 'Deposit link to the tool you already use', 'Aftercare page', 'English and Spanish versions available'],
    },
    {
      id: 'studio',
      name: 'Studio or Multi-Artist Salon',
      audience: 'Tattoo studios with three or more chairs and established salons.',
      price: 'From $1,400',
      priceNote: 'plus care from $99/month, or $990 a year (two months free)',
      includes: ['A page for each artist or stylist', 'Filterable gallery', 'Booking with no new-client commission', 'Structured data for search', 'Everything in Independent Artist'],
    },
  ],
  es: [
    {
      id: 'founding',
      name: 'Socio Fundador',
      audience: 'Barberías y salones de Louisville sin página web. Solo para los primeros cinco negocios.',
      price: '$350',
      priceNote: 'de construcción y luego $59 al mes de hosting y cuidado ($590 si paga el primer año por adelantado)',
      includes: ['1 a 3 páginas pensadas para el teléfono', 'Su menú de servicios', 'Un botón a su app de reservas o a su teléfono', 'Bases de SEO', 'Dominio a su nombre'],
    },
    {
      id: 'artist',
      name: 'Artista Independiente',
      audience: 'Tatuadores y profesionales independientes de cualquier parte de EE. UU.',
      price: 'Desde $650',
      priceNote: 'en un solo pago. Cuidado opcional desde $49 al mes, o quédese con la página sin pagos mensuales',
      includes: ['Portafolio ordenado por estilo', 'Formulario de consulta que pide tamaño, zona y presupuesto', 'Enlace de depósito a la herramienta que ya usa', 'Página de cuidados', 'Versión en inglés y en español disponible'],
    },
    {
      id: 'studio',
      name: 'Estudio o Salón con varios artistas',
      audience: 'Estudios de tatuaje con tres o más sillas y salones establecidos.',
      price: 'Desde $1,400',
      priceNote: 'más cuidado desde $99 al mes, o $990 al año (dos meses gratis)',
      includes: ['Una página por artista o estilista', 'Galería con filtros', 'Reservas sin comisión por cliente nuevo', 'Datos estructurados para buscadores', 'Todo lo de Artista Independiente'],
    },
  ],
};

export const pricingNote: Record<Lang, string> = {
  en: 'Starting prices. Your exact quote comes in writing before any work starts: 50% to begin, 50% before launch, two rounds of changes. Kentucky sales tax is added where it applies.',
  es: 'Precios de inicio. Su cotización exacta llega por escrito antes de empezar: 50% al inicio y 50% antes de publicar, con dos rondas de cambios. Se añade el impuesto de ventas de Kentucky cuando aplica.',
};
