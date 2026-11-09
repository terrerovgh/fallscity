// Cloudflare Worker in front of the static site in dist/ (see wrangler.jsonc).
// Static assets under /_astro/ and /brand/ are served directly and never reach
// this script; everything else passes through here in this order:
//   1. Canonical host: http:// and www. go to https://fallscity.dev (301).
//   2. /api/inquiry: the project inquiry endpoint.
//   3. Language: visitors are sent to their language version (302).
//   4. Static assets from dist/, with noindex on any non-production host.

import { onRequest as handleInquiry, type InquiryEnvironment } from './inquiry';
import { languageResponse } from './language';

interface Env extends InquiryEnvironment {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const CANONICAL_HOST = 'fallscity.dev';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}` || (url.hostname === CANONICAL_HOST && url.protocol === 'http:')) {
      return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
    }

    if (url.pathname === '/api/inquiry') {
      return handleInquiry({ request, env });
    }

    const redirect = languageResponse(request);
    if (redirect) return redirect;

    const response = await env.ASSETS.fetch(request);
    // Only https://fallscity.dev should be indexed; keep workers.dev and
    // preview hostnames out of search results.
    if (url.hostname !== CANONICAL_HOST) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return response;
  },
};
