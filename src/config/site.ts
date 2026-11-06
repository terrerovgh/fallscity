export const site = {
  name: 'Falls City Dev Studio',
  shortName: 'Falls City',
  url: 'https://fallscity.dev',
  location: 'Louisville, Kentucky',
  description:
    'Professional website design, development, SEO foundations, and ongoing care for Louisville small businesses.',
  navigation: [
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/services/' },
    { label: 'Process', href: '/process/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
} as const;

export const isFormConfigured = site.turnstileSiteKey.length > 0;

/**
 * The privacy notice is an unreviewed draft. While true, /privacy/ is noindex
 * and left out of the sitemap. Set to false only after owner/legal review.
 */
export const privacyIsDraft = true;
