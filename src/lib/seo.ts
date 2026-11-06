import { site } from '../config/site';

/** One step in a breadcrumb trail. `path` is site-relative with a trailing slash. */
export interface Crumb {
  name: string;
  path: string;
}

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

/** Stable JSON-LD identifiers, so pages can reference entities instead of repeating them. */
export const ids = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
};

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

export const louisville = {
  '@type': 'City',
  name: 'Louisville',
  containedInPlace: { '@type': 'State', name: 'Kentucky' },
};

/** A Service entity for a page that describes one service in full. */
export const serviceNode = (options: { name: string; description: string; path: string; serviceType: string }) => ({
  '@type': 'Service',
  '@id': `${absoluteUrl(options.path)}#service`,
  name: options.name,
  serviceType: options.serviceType,
  description: options.description,
  url: absoluteUrl(options.path),
  provider: { '@id': ids.organization },
  areaServed: louisville,
});
