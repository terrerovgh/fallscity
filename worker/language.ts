// Language routing at the edge. Every page exists in English (/x/) and Spanish
// (/es/x/). A visitor is sent to the version that matches their explicit choice
// (the `lang` cookie set by the EN/ES switcher) or, failing that, their
// browser's Accept-Language. Crawlers and requests without a language
// preference are never redirected, so search engines can index both versions
// through hreflang.

type Lang = 'en' | 'es';

const CRAWLER = /bot|crawl|spider|slurp|preview|facebookexternalhit|inspectiontool|lighthouse|headless/i;

/** The first of English or Spanish in an Accept-Language header, by quality; null if neither. */
export function preferredLang(acceptLanguage: string | null): Lang | null {
  if (!acceptLanguage) return null;
  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { base: tag.trim().toLowerCase().split('-')[0], q: q ? Number(q.slice(2)) : 1, index };
    })
    .filter((entry) => entry.base && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { base } of ranked) {
    if (base === 'es' || base === 'en') return base;
  }
  return null;
}

function cookieLang(cookieHeader: string | null): Lang | null {
  const match = cookieHeader?.match(/(?:^|;\s*)lang=(en|es)(?:;|$)/);
  return (match?.[1] as Lang | undefined) ?? null;
}

/** Where to send this request, or null to serve it as is. */
export function languageRedirect(request: Request): string | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  const path = url.pathname;
  // Pages only: no API routes, no files with an extension.
  if (path.startsWith('/api/') || /\.[a-z0-9]+$/i.test(path)) return null;

  const pathLang: Lang = /^\/es(\/|$)/.test(path) ? 'es' : 'en';
  let wanted = cookieLang(request.headers.get('cookie'));
  if (!wanted) {
    if (CRAWLER.test(request.headers.get('user-agent') ?? '')) return null;
    wanted = preferredLang(request.headers.get('accept-language'));
  }
  if (!wanted || wanted === pathLang) return null;

  const basePath = path.replace(/^\/es(?=\/|$)/, '') || '/';
  return `${wanted === 'es' ? `/es${basePath}` : basePath}${url.search}`;
}

/** A 302 to the visitor's language version, or null to serve the request as is. */
export function languageResponse(request: Request): Response | null {
  const target = languageRedirect(request);
  if (!target) return null;
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'Cache-Control': 'private, no-store',
      Vary: 'Accept-Language, Cookie',
    },
  });
}
