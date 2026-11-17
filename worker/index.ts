// Cloudflare Worker in front of the static Astro build (wrangler.jsonc).
// - canonical host (https://fallscity.dev) and redirects from the previous site's URLs;
// - language routing: ?lang= sets a cookie, otherwise cookie or Accept-Language picks EN/ES;
// - POST /api/inquiry: validates the contact form, checks Turnstile, sends it by email via Resend.
// Secrets (TURNSTILE_SECRET_KEY, RESEND_API_KEY, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL) live in Cloudflare.
const CANONICAL_ORIGIN = 'https://fallscity.dev';
const BODY_LIMIT = 32 * 1024;
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const MIN_INQUIRY_AGE_MS = 3_000;
const MAX_INQUIRY_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_FUTURE_SKEW_MS = 60_000;

// URLs of earlier versions of fallscity.dev, now sections of the one-page site.
const LEGACY_REDIRECTS = new Map<string, string>([
  ['/sitemap.xml', '/sitemap-index.xml'],
  ['/tattoo/', '/'],
  ['/es/tattoo/', '/es/'],
  ['/es/tatuajes/', '/es/'],
  ['/about/', '/'],
  ['/es/about/', '/es/'],
  ['/brand-preview/', '/'],
  ['/es/brand-preview/', '/es/'],
  ['/barbershops/', '/'],
  ['/es/barbershops/', '/es/'],
  ['/salons/', '/'],
  ['/es/salons/', '/es/'],
  ['/nails/', '/'],
  ['/es/nails/', '/es/'],
  ['/piercing/', '/'],
  ['/es/piercing/', '/es/'],
  ['/work/', '/#work'],
  ['/es/work/', '/es/#work'],
  ['/process/', '/#process'],
  ['/es/process/', '/es/#process'],
  ['/contact/', '/#contact'],
  ['/es/contact/', '/es/#contact'],
  ['/pricing/', '/#services'],
  ['/es/pricing/', '/es/#services'],
  ['/panel/', '/#services'],
  ['/es/panel/', '/es/#services'],
  ['/local-seo/', '/#services'],
  ['/es/local-seo/', '/es/#services'],
  ['/services/', '/#services'],
  ['/es/services/', '/es/#services'],
  ['/services/web-design/', '/#services'],
  ['/es/services/web-design/', '/es/#services'],
  ['/services/website-maintenance/', '/#services'],
  ['/es/services/website-maintenance/', '/es/#services'],
  ['/services/seo-foundations/', '/#services'],
  ['/es/services/seo-foundations/', '/es/#services'],
  ['/es/privacy/', '/es/privacidad/'],
]);

// Pages whose Spanish path is not just /es + the English path.
const TRANSLATED_PATHS: [en: string, es: string][] = [['/privacy/', '/es/privacidad/']];

function legacyTarget(pathname: string): string | undefined {
  return LEGACY_REDIRECTS.get(pathname) ?? (pathname.endsWith('/') ? undefined : LEGACY_REDIRECTS.get(`${pathname}/`));
}

export interface WorkerEnv {
  ASSETS: Fetcher;
  RESEND_API_KEY?: string;
  INQUIRY_TO_EMAIL?: string;
  INQUIRY_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export interface WorkerDependencies {
  fetch?: typeof fetch;
  now?: () => number;
  turnstileTimeoutMs?: number;
  resendTimeoutMs?: number;
}

type Language = 'en' | 'es';
type ParsedBody = { data: Record<string, unknown> | FormData };

interface Inquiry {
  name: string;
  email: string;
  business: string;
  city: string;
  links: string;
  message: string;
  language: Language;
  turnstileToken: string;
}

function isLocalHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname === '::1';
}

function isProductionHost(url: URL): boolean {
  return url.hostname === 'fallscity.dev';
}

function withResponseHeaders(response: Response, url: URL, noStore = false): Response {
  const headers = new Headers(response.headers);
  if (!isProductionHost(url)) headers.set('X-Robots-Tag', 'noindex');
  if (noStore) headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function redirect(url: URL, location: string, status: 301 | 302 | 303 | 308): Response {
  return withResponseHeaders(new Response(null, { status, headers: { Location: location } }), url, true);
}

function jsonResponse(url: URL, status: number, body: Record<string, unknown>, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(extraHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Robots-Tag', 'noindex');
  return withResponseHeaders(new Response(JSON.stringify(body), { status, headers }), url, true);
}

function cookieLanguage(request: Request): Language | undefined {
  const cookies = request.headers.get('Cookie');
  if (!cookies) return undefined;
  for (const part of cookies.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== 'lang') continue;
    const value = part.slice(separator + 1).trim();
    return value === 'en' || value === 'es' ? value : undefined;
  }
  return undefined;
}

function acceptedLanguage(request: Request): Language | undefined {
  const header = request.headers.get('Accept-Language');
  if (!header) return undefined;
  const preferences = header.split(',').map((entry, index) => {
    const [rawTag = '', ...parameters] = entry.trim().split(';');
    const tag = rawTag.toLowerCase();
    const qParameter = parameters.find((parameter) => parameter.trim().toLowerCase().startsWith('q='));
    const q = qParameter ? Number(qParameter.trim().slice(2)) : 1;
    const language: Language | undefined = tag === 'es' || tag.startsWith('es-') ? 'es' : tag === 'en' || tag.startsWith('en-') ? 'en' : undefined;
    return { language, q: Number.isFinite(q) ? q : 0, index };
  }).filter((preference) => preference.language !== undefined && preference.q > 0);
  preferences.sort((a, b) => b.q - a.q || a.index - b.index);
  return preferences[0]?.language;
}

function isCrawler(request: Request): boolean {
  const userAgent = request.headers.get('User-Agent');
  if (!userAgent) return true;
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|ia_archiver/i.test(userAgent);
}

function localizedPath(pathname: string, language: Language): string {
  for (const [en, es] of TRANSLATED_PATHS) {
    if (pathname === en || pathname === es) return language === 'es' ? es : en;
  }
  const spanish = pathname === '/es' || pathname.startsWith('/es/');
  if (language === 'es') {
    if (spanish) return pathname;
    return pathname === '/' ? '/es/' : `/es${pathname}`;
  }
  if (!spanish) return pathname;
  const english = pathname.slice(3);
  return english || '/';
}

function isPageRequest(request: Request, pathname: string): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  if (pathname.startsWith('/api/') || pathname.startsWith('/_astro/') || pathname.startsWith('/fonts/')) return false;
  const segment = pathname.split('/').filter(Boolean).at(-1);
  return segment === undefined || !segment.includes('.');
}

function languageSelector(url: URL): Language | undefined {
  const values = url.searchParams.getAll('lang');
  const value = values[0];
  return values.length === 1 && (value === 'en' || value === 'es') ? value : undefined;
}

async function readLimitedBody(request: Request): Promise<Uint8Array> {
  const declaredLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declaredLength) && declaredLength > BODY_LIMIT) throw new Error('body_too_large');
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > BODY_LIMIT) {
      await reader.cancel();
      throw new Error('body_too_large');
    }
    chunks.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function parseInquiryBody(request: Request): Promise<ParsedBody> {
  const contentType = request.headers.get('Content-Type')?.toLowerCase().split(';')[0]?.trim() ?? '';
  if (contentType !== 'application/json' && contentType !== 'application/x-www-form-urlencoded' && contentType !== 'multipart/form-data') {
    throw new Error('unsupported_media_type');
  }
  const body = await readLimitedBody(request);
  if (contentType === 'application/json') {
    let value: unknown;
    try {
      value = JSON.parse(new TextDecoder().decode(body));
    } catch {
      throw new Error('invalid_json');
    }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('invalid_json');
    return { data: value as Record<string, unknown> };
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    const data = new FormData();
    for (const [key, value] of new URLSearchParams(new TextDecoder().decode(body))) data.append(key, value);
    return { data };
  }
  try {
    const formRequest = new Request(request.url, { method: 'POST', headers: request.headers, body: body.buffer as ArrayBuffer });
    return { data: await formRequest.formData() };
  } catch {
    throw new Error('invalid_form');
  }
}

function field(body: ParsedBody, name: string): unknown {
  if (body.data instanceof FormData) return body.data.get(name) ?? undefined;
  return body.data[name];
}

function sanitizeText(value: string, multiline = false): string {
  const normalized = value.normalize('NFC');
  const cleaned = multiline
    ? normalized.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    : normalized.replace(/[\u0000-\u001f\u007f]/g, '');
  return cleaned.trim();
}

function validEmail(value: string): boolean {
  if (value.length > 254 || /[\s<>\[\](),;:\\"]/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local = '', domain = ''] = parts;
  return local.length > 0 && local.length <= 64 && /^[^\s@]+$/.test(local) && /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(domain);
}

function validateInquiry(body: ParsedBody, now: number): { inquiry?: Inquiry; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const stringField = (name: string): string => {
    const value = field(body, name);
    if (value === undefined) return '';
    if (typeof value !== 'string') {
      errors[name] = 'invalid';
      return '';
    }
    return sanitizeText(value, name === 'message');
  };

  const name = stringField('name');
  const email = stringField('email').toLowerCase();
  const business = stringField('business');
  const city = stringField('city');
  const links = stringField('links');
  const message = stringField('message');
  const language = stringField('language');
  const turnstileToken = stringField('cf-turnstile-response');
  const privacy = field(body, 'privacy');
  const honeypot = stringField('website');
  const rawTimestamp = field(body, 'startedAt') ?? field(body, 'timestamp');

  if (name.length < 2 || name.length > 80) errors.name = 'invalid';
  if (!validEmail(email)) errors.email = 'invalid';
  if (business.length > 120) errors.business = 'invalid';
  if (city.length > 80) errors.city = 'invalid';
  if (links.length > 200) errors.links = 'invalid';
  if (message.length < 20 || message.length > 3000) errors.message = 'invalid';
  if (language && language !== 'en' && language !== 'es') errors.language = 'invalid';
  if (privacy !== true && privacy !== 'true' && privacy !== 'on') errors.privacy = 'required';
  if (honeypot) errors.website = 'invalid';
  if (!turnstileToken || turnstileToken.length > 2048) errors['cf-turnstile-response'] = 'required';

  let timestamp = Number.NaN;
  if (typeof rawTimestamp === 'number' || typeof rawTimestamp === 'string') timestamp = Number(rawTimestamp);
  if (!Number.isFinite(timestamp)) {
    errors.startedAt = 'required';
  } else {
    const age = now - timestamp;
    if (age < MIN_INQUIRY_AGE_MS || age > MAX_INQUIRY_AGE_MS || timestamp - now > MAX_FUTURE_SKEW_MS) errors.startedAt = 'invalid';
  }

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    inquiry: { name, email, business, city, links, message, language: language === 'es' ? 'es' : 'en', turnstileToken },
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

function emailContent(inquiry: Inquiry): { html: string; text: string } {
  const rows: [string, string][] = [
    ['Name', inquiry.name],
    ['Email', inquiry.email],
    ['Business', inquiry.business || 'Not provided'],
    ['City', inquiry.city || 'Not provided'],
    ['Website or social media', inquiry.links || 'Not provided'],
    ['Site language', inquiry.language === 'es' ? 'Spanish' : 'English'],
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('');
  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  return {
    html: `<h1>New website inquiry</h1><table>${htmlRows}</table><h2>Message</h2><p>${escapeHtml(inquiry.message).replace(/\r?\n/g, '<br>')}</p>`,
    text: `New website inquiry\n\n${textRows}\n\nMessage:\n${inquiry.message}`,
  };
}

function validOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  if (origin === CANONICAL_ORIGIN) return true;
  try {
    const parsed = new URL(origin);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && isLocalHostname(parsed.hostname) && parsed.pathname === '/';
  } catch {
    return false;
  }
}

function providerConfiguration(env: WorkerEnv): { apiKey: string; to: string; from: string; turnstileSecret: string } | undefined {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.INQUIRY_TO_EMAIL?.trim();
  const from = env.INQUIRY_FROM_EMAIL?.trim();
  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!apiKey || !to || !from || !turnstileSecret) return undefined;
  if ([apiKey, to, from, turnstileSecret].some((value) => /[\r\n\u0000]/.test(value))) return undefined;
  if (!validEmail(to) || from.length > 320) return undefined;
  return { apiKey, to, from, turnstileSecret };
}

async function fetchWithTimeout(providerFetch: typeof fetch, input: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await providerFetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function handleInquiry(
  request: Request,
  url: URL,
  env: WorkerEnv,
  providerFetch: typeof fetch,
  now: number,
  turnstileTimeoutMs: number,
  resendTimeoutMs: number,
): Promise<Response> {
  if (request.method !== 'POST') return jsonResponse(url, 405, { ok: false, code: 'method_not_allowed' }, { Allow: 'POST' });
  if (!validOrigin(request)) return jsonResponse(url, 403, { ok: false, code: 'origin_not_allowed' });

  let body: ParsedBody;
  try {
    body = await parseInquiryBody(request);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'invalid_form';
    if (code === 'body_too_large') return jsonResponse(url, 413, { ok: false, code });
    if (code === 'unsupported_media_type') return jsonResponse(url, 415, { ok: false, code });
    return jsonResponse(url, 400, { ok: false, code: code === 'invalid_json' ? code : 'invalid_form' });
  }

  const validation = validateInquiry(body, now);
  if (!validation.inquiry) return jsonResponse(url, 422, { ok: false, code: 'validation_error', fields: validation.errors });
  const inquiry = validation.inquiry;
  const configuration = providerConfiguration(env);
  if (!configuration) return jsonResponse(url, 503, { ok: false, code: 'not_configured' });

  const verificationParameters = new URLSearchParams({ secret: configuration.turnstileSecret, response: inquiry.turnstileToken });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) verificationParameters.set('remoteip', remoteIp);
  let verification: unknown;
  try {
    const response = await fetchWithTimeout(providerFetch, 'https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationParameters.toString(),
    }, turnstileTimeoutMs);
    if (!response.ok) return jsonResponse(url, 502, { ok: false, code: 'turnstile_unavailable' });
    verification = await response.json();
  } catch {
    return jsonResponse(url, 502, { ok: false, code: 'turnstile_unavailable' });
  }
  if (typeof verification !== 'object' || verification === null || !('success' in verification) || verification.success !== true) {
    return jsonResponse(url, 403, { ok: false, code: 'turnstile_failed' });
  }

  const content = emailContent(inquiry);
  let accepted: unknown;
  try {
    const response = await fetchWithTimeout(providerFetch, 'https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${configuration.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: configuration.from,
        to: [configuration.to],
        reply_to: inquiry.email,
        subject: `New website inquiry: ${inquiry.business || inquiry.name}`,
        html: content.html,
        text: content.text,
      }),
    }, resendTimeoutMs);
    if (!response.ok) return jsonResponse(url, 502, { ok: false, code: 'email_provider_error' });
    accepted = await response.json();
  } catch {
    return jsonResponse(url, 502, { ok: false, code: 'email_provider_error' });
  }
  if (typeof accepted !== 'object' || accepted === null || !('id' in accepted) || typeof accepted.id !== 'string' || !accepted.id) {
    return jsonResponse(url, 502, { ok: false, code: 'email_provider_invalid_response' });
  }
  return jsonResponse(url, 202, { ok: true, code: 'accepted', id: accepted.id });
}

export function createWorkerHandler(dependencies: WorkerDependencies = {}): (request: Request, env: WorkerEnv) => Promise<Response> {
  const providerFetch = dependencies.fetch ?? fetch;
  const now = dependencies.now ?? Date.now;
  const turnstileTimeoutMs = dependencies.turnstileTimeoutMs ?? 5_000;
  const resendTimeoutMs = dependencies.resendTimeoutMs ?? 8_000;

  return async (request: Request, env: WorkerEnv): Promise<Response> => {
    const url = new URL(request.url);
    const local = isLocalHostname(url.hostname);
    if (!local && (url.protocol === 'http:' || url.hostname === 'www.fallscity.dev')) {
      const canonical = new URL(url);
      canonical.protocol = 'https:';
      canonical.hostname = 'fallscity.dev';
      canonical.port = '';
      return redirect(url, canonical.toString(), 308);
    }

    const legacy = legacyTarget(url.pathname);
    if (legacy) {
      const [path = '/', hash] = legacy.split('#');
      return redirect(url, `${path}${url.search}${hash ? `#${hash}` : ''}`, 301);
    }

    const selectedLanguage = languageSelector(url);
    if (selectedLanguage && (request.method === 'GET' || request.method === 'HEAD')) {
      url.searchParams.delete('lang');
      const response = redirect(url, `${url.pathname}${url.search}`, 303);
      const cookie = [`lang=${selectedLanguage}`, 'Path=/', `Max-Age=${LANGUAGE_COOKIE_MAX_AGE}`, 'SameSite=Lax'];
      if (url.protocol === 'https:') cookie.push('Secure');
      response.headers.set('Set-Cookie', cookie.join('; '));
      return response;
    }

    if (url.pathname === '/api/inquiry') {
      return handleInquiry(request, url, env, providerFetch, now(), turnstileTimeoutMs, resendTimeoutMs);
    }

    if (isPageRequest(request, url.pathname) && !isCrawler(request)) {
      const preferredLanguage = cookieLanguage(request) ?? acceptedLanguage(request);
      if (preferredLanguage) {
        const target = localizedPath(url.pathname, preferredLanguage);
        if (target !== url.pathname) {
          const response = redirect(url, `${target}${url.search}`, 302);
          response.headers.set('Vary', 'Accept-Language, Cookie');
          return response;
        }
      }
    }

    return withResponseHeaders(await env.ASSETS.fetch(request), url);
  };
}

const handler = createWorkerHandler();
export default { fetch: handler } satisfies ExportedHandler<WorkerEnv>;
