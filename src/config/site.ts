export const site = {
  name: 'Falls City Dev Studio',
  shortName: 'Falls City',
  url: 'https://fallscity.dev',
  location: 'Louisville, Kentucky',
  /** Public contact address. Keep identical on Google Business Profile and directory listings. */
  email: 'info@fallscity.dev',
  description:
    'Professional website design, development, SEO foundations, and ongoing care for Louisville small businesses.',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
  /** Bing Webmaster Tools ownership code; also in public/BingSiteAuth.xml. Public by design. */
  bingSiteVerification: 'CEA9010A7EE9ED39FF47824909791585',
} as const;

export const isFormConfigured = site.turnstileSiteKey.length > 0;

/**
 * The privacy notice is an unreviewed draft. While true, /privacy/ is noindex
 * and left out of the sitemap. Set to false only after owner/legal review.
 */
export const privacyIsDraft = true;
