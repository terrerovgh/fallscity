export interface Service {
  number: string;
  /** Stable fragment id for this service's section on /services/. */
  anchor: string;
  /** Where to learn more: a dedicated service page, or the /services/ section. */
  href: string;
  /** Descriptive anchor text for links to the dedicated page, if there is one. */
  linkLabel?: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  outcomes: string[];
  details: string[];
}

export const services: Service[] = [
  {
    number: '01',
    anchor: 'website-design-development',
    href: '/services/web-design/',
    linkLabel: 'Small business website design, in detail',
    title: 'Website Design & Development',
    shortTitle: 'Design & Development',
    summary: 'A polished, responsive website built around what your customers need to know and do.',
    description:
      'Your website should make your business easy to understand and easy to contact. Falls City Dev Studio designs and builds custom business websites with clear content, thoughtful layouts, and a dependable technical foundation.',
    outcomes: [
      'Present your business professionally on every screen',
      'Guide visitors toward a call, booking, or project inquiry',
      'Give your business a website shaped around its actual services',
    ],
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
      'Good search visibility starts with a website that is useful, understandable, and technically sound. SEO foundations are built into the project rather than added as an afterthought. No responsible studio can promise a particular ranking, but the fundamentals should be done properly.',
    outcomes: [
      'Help search engines discover and interpret your pages',
      'Align page content with the services customers are looking for',
      'Launch with the essential technical pieces in place',
    ],
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
    summary: 'Practical setup and launch support for the technical pieces behind your website.',
    description:
      'Getting a website online involves more than uploading files. The studio can coordinate the domain, hosting, deployment, and HTTPS setup so the pieces work together and you understand what is being managed.',
    outcomes: [
      'Connect your chosen domain to a reliable hosting setup',
      'Serve your website securely over HTTPS',
      'Reduce the technical friction of launching and maintaining your site',
    ],
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
    summary: 'Ongoing technical care for relevant updates, fixes, and the health of your website.',
    description:
      'A website should not be left to drift after launch. Maintenance support keeps the technical foundation in good shape and provides a clear place to turn when something needs attention. The exact scope of ongoing support is agreed before work begins.',
    outcomes: [
      'Keep your website current and working as intended',
      'Address routine issues without finding a new provider each time',
      'Maintain a clear, dependable technical baseline',
    ],
    details: [
      'Agreed content and technical updates',
      'Troubleshooting and relevant fixes',
      'Performance and reliability checks',
      'Dependency and platform maintenance as applicable',
      'Basic technical support within the agreed scope',
    ],
  },
];
