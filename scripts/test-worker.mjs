import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'falls-city-worker-test-'));
const tests = [];
let wranglerChild;
let passed = 0;

function test(name, run) {
  tests.push({ name, run });
}

async function loadWorker() {
  const source = await readFile(join(root, 'worker/index.ts'), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  const errors = output.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error) ?? [];
  assert.equal(errors.length, 0, errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'));
  const modulePath = join(temporaryDirectory, 'worker.mjs');
  await writeFile(modulePath, output.outputText);
  return import(pathToFileURL(modulePath).href);
}

const { createWorkerHandler } = await loadWorker();
const NOW = Date.parse('2026-11-16T12:00:00.000Z');
const CONFIGURED_ENV = {
  RESEND_API_KEY: 'test-resend-key',
  INQUIRY_TO_EMAIL: 'inquiries@example.com',
  INQUIRY_FROM_EMAIL: 'Falls City <website@example.com>',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
};

function assets(body = 'asset response', init) {
  return { fetch: async () => new Response(body, init) };
}

function payload(overrides = {}) {
  return {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    business: 'Ink & Co',
    instagram: '@ada',
    trade: 'tattoo-artist',
    bookingMethod: 'instagram-dm',
    extras: ['booking', 'second-language'],
    description: 'A portfolio website with a gallery and inquiry form.',
    privacy: true,
    website: '',
    startedAt: NOW - 10_000,
    'cf-turnstile-response': 'test-token',
    ...overrides,
  };
}

function request(url, options = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has('User-Agent')) headers.set('User-Agent', 'Mozilla/5.0 test browser');
  return new Request(url, { ...options, headers });
}

function jsonRequest(data, options = {}) {
  return request(options.url ?? 'https://fallscity.dev/api/inquiry', {
    method: 'POST',
    ...options,
    headers: {
      Origin: 'https://fallscity.dev',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });
}

async function invoke(req, options = {}) {
  const providerFetch = options.fetch ?? (async () => { throw new Error('Unexpected external fetch'); });
  const handler = createWorkerHandler({
    fetch: providerFetch,
    now: options.now ?? (() => NOW),
    turnstileTimeoutMs: options.turnstileTimeoutMs ?? 30,
    resendTimeoutMs: options.resendTimeoutMs ?? 30,
  });
  return handler(req, { ASSETS: options.ASSETS ?? assets(), ...options.env });
}

function mockProviders(resendResult = new Response(JSON.stringify({ id: 'mock-email-id' }), { status: 200, headers: { 'Content-Type': 'application/json' } })) {
  const calls = [];
  return {
    calls,
    fetch: async (input, init) => {
      calls.push({ input, init });
      if (input === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (input === 'https://api.resend.com/emails') return resendResult.clone();
      throw new Error(`Unexpected test URL: ${input}`);
    },
  };
}

test('canonicalizes HTTP and preserves path/query', async () => {
  const response = await invoke(request('http://fallscity.dev/pricing/?plan=studio'));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://fallscity.dev/pricing/?plan=studio');
  assert.equal(response.headers.get('X-Robots-Tag'), null);
});

test('canonicalizes www and marks the non-production redirect noindex', async () => {
  const response = await invoke(request('https://www.fallscity.dev/es/contact/?x=1'));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://fallscity.dev/es/contact/?x=1');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
});

test('never canonicalizes localhost or loopback', async () => {
  for (const origin of ['http://localhost:8787', 'http://127.0.0.1:8787']) {
    const response = await invoke(request(`${origin}/?x=1`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Location'), null);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  }
});

test('implements every inherited redirect exactly and preserves query strings', async () => {
  const redirects = [
    ['/sitemap-index.xml', '/sitemap.xml'], ['/sitemap-0.xml', '/sitemap.xml'],
    ['/tattoo/', '/'], ['/tattoo', '/'], ['/es/tattoo/', '/es/'], ['/es/tattoo', '/es/'],
    ['/es/tatuajes/', '/es/'], ['/es/tatuajes', '/es/'], ['/services/', '/pricing/'],
    ['/services', '/pricing/'], ['/es/services/', '/es/pricing/'], ['/es/services', '/es/pricing/'],
    ['/services/web-design/', '/'], ['/es/services/web-design/', '/es/'],
    ['/services/website-maintenance/', '/panel/'], ['/es/services/website-maintenance/', '/es/panel/'],
    ['/services/seo-foundations/', '/local-seo/'], ['/es/services/seo-foundations/', '/es/local-seo/'],
  ];
  assert.equal(redirects.length, 18);
  for (const [from, to] of redirects) {
    const response = await invoke(request(`https://fallscity.dev${from}?lang=es&campaign=old`));
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('Location'), `${to}?lang=es&campaign=old`, from);
    assert.equal(response.headers.get('Set-Cookie'), null);
  }
});

test('language selector redirects 303, preserves other query and sets a Secure cookie on HTTPS', async () => {
  const response = await invoke(request('https://fallscity.dev/contact/?lang=es&utm_source=test&x=1'));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/contact/?utm_source=test&x=1');
  assert.equal(response.headers.get('Set-Cookie'), 'lang=es; Path=/; Max-Age=31536000; SameSite=Lax; Secure');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('language selector on localhost omits Secure and adds noindex', async () => {
  const response = await invoke(request('http://localhost:8787/es/?lang=en&x=1'));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/es/?x=1');
  assert.match(response.headers.get('Set-Cookie'), /^lang=en;/);
  assert.doesNotMatch(response.headers.get('Set-Cookie'), /Secure/);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
});

test('invalid or repeated lang query does not set a preference', async () => {
  for (const suffix of ['?lang=fr', '?lang=en&lang=es']) {
    const response = await invoke(request(`https://fallscity.dev/${suffix}`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Set-Cookie'), null);
  }
});

test('Accept-Language redirects pages without caching the preference globally', async () => {
  const response = await invoke(request('https://fallscity.dev/?campaign=1', { headers: { 'Accept-Language': 'es-US,es;q=0.9,en;q=0.8' } }));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), '/es/?campaign=1');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Vary'), 'Accept-Language, Cookie');
});

test('explicit cookie wins over Accept-Language in both directions', async () => {
  const spanish = await invoke(request('https://fallscity.dev/', { headers: { Cookie: 'lang=es', 'Accept-Language': 'en-US,en;q=0.9' } }));
  assert.equal(spanish.headers.get('Location'), '/es/');
  const english = await invoke(request('https://fallscity.dev/es/contact/', { headers: { Cookie: 'lang=en', 'Accept-Language': 'es-US,es;q=0.9' } }));
  assert.equal(english.headers.get('Location'), '/contact/');
});

test('quality weights, q=0 and English-from-Spanish routing work', async () => {
  const english = await invoke(request('https://fallscity.dev/es/pricing/', { headers: { 'Accept-Language': 'es;q=0, en;q=0.8' } }));
  assert.equal(english.headers.get('Location'), '/pricing/');
  const weighted = await invoke(request('https://fallscity.dev/', { headers: { 'Accept-Language': 'en;q=0.4, es-MX;q=0.9' } }));
  assert.equal(weighted.headers.get('Location'), '/es/');
});

test('crawlers and absence of language preference are not redirected', async () => {
  const crawler = await invoke(request('https://fallscity.dev/', { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)', 'Accept-Language': 'es' } }));
  assert.equal(crawler.status, 200);
  assert.equal(crawler.headers.get('Location'), null);
  const noPreference = await invoke(request('https://fallscity.dev/'));
  assert.equal(noPreference.status, 200);
  assert.equal(noPreference.headers.get('Location'), null);
});

test('language routing skips non-page paths and non-GET methods', async () => {
  for (const path of ['/sitemap.xml', '/robots.txt', '/fonts/site.woff2']) {
    const response = await invoke(request(`https://fallscity.dev${path}`, { headers: { 'Accept-Language': 'es' } }));
    assert.equal(response.status, 200, path);
  }
  const post = await invoke(request('https://fallscity.dev/contact/', { method: 'POST', headers: { 'Accept-Language': 'es' } }));
  assert.equal(post.status, 200);
});

test('non-production asset responses are noindex and production responses are unchanged', async () => {
  const local = await invoke(request('http://localhost:8787/contact/'));
  assert.equal(local.headers.get('X-Robots-Tag'), 'noindex');
  const production = await invoke(request('https://fallscity.dev/contact/'));
  assert.equal(production.headers.get('X-Robots-Tag'), null);
});

test('inquiry rejects incorrect methods with Allow: POST', async () => {
  for (const method of ['GET', 'PUT', 'OPTIONS', 'DELETE']) {
    const response = await invoke(request('https://fallscity.dev/api/inquiry', { method }));
    assert.equal(response.status, 405, method);
    assert.equal(response.headers.get('Allow'), 'POST');
    assert.equal((await response.json()).code, 'method_not_allowed');
  }
});

test('inquiry requires an allowed same-origin or localhost development Origin', async () => {
  for (const origin of ['https://attacker.example', 'null', 'https://www.fallscity.dev']) {
    const response = await invoke(jsonRequest(payload(), { headers: { Origin: origin } }));
    assert.equal(response.status, 403, origin);
    assert.equal((await response.json()).code, 'origin_not_allowed');
  }
  const missing = await invoke(jsonRequest(payload(), { headers: { Origin: '' } }));
  assert.equal(missing.status, 403);
  const local = await invoke(jsonRequest(payload(), { url: 'http://localhost:8787/api/inquiry', headers: { Origin: 'http://localhost:8787' } }));
  assert.equal(local.status, 503);
});

test('inquiry rejects declared and streamed bodies over 32 KiB', async () => {
  const declared = await invoke(jsonRequest('x'.repeat(32 * 1024 + 1)));
  assert.equal(declared.status, 413);
  assert.equal((await declared.json()).code, 'body_too_large');

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(16 * 1024));
      controller.enqueue(new Uint8Array(16 * 1024));
      controller.enqueue(new Uint8Array(1));
      controller.close();
    },
  });
  const chunked = request('https://fallscity.dev/api/inquiry', {
    method: 'POST', headers: { Origin: 'https://fallscity.dev', 'Content-Type': 'application/json' }, body: stream, duplex: 'half',
  });
  const response = await invoke(chunked);
  assert.equal(response.status, 413);
});

test('inquiry rejects unsupported media and malformed JSON', async () => {
  const unsupported = await invoke(jsonRequest('name=Ada', { headers: { 'Content-Type': 'text/plain' } }));
  assert.equal(unsupported.status, 415);
  const malformed = await invoke(jsonRequest('{broken'));
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, 'invalid_json');
});

test('valid JSON without provider configuration returns 503 not_configured without fetching', async () => {
  const response = await invoke(jsonRequest(payload()));
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, code: 'not_configured' });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('valid URL-encoded and multipart forms reach the same not_configured result', async () => {
  const urlEncoded = new URLSearchParams();
  for (const [key, value] of Object.entries(payload())) {
    if (key === 'extras') for (const extra of value) urlEncoded.append('extras', extra);
    else urlEncoded.set(key, String(value));
  }
  const encodedResponse = await invoke(request('https://fallscity.dev/api/inquiry', {
    method: 'POST', headers: { Origin: 'https://fallscity.dev', 'Content-Type': 'application/x-www-form-urlencoded' }, body: urlEncoded,
  }));
  assert.equal(encodedResponse.status, 503);
  assert.equal((await encodedResponse.json()).code, 'not_configured');

  const form = new FormData();
  for (const [key, value] of Object.entries(payload())) {
    if (key === 'extras') for (const extra of value) form.append('extras', extra);
    else form.set(key, String(value));
  }
  const multipartResponse = await invoke(request('https://fallscity.dev/api/inquiry', {
    method: 'POST', headers: { Origin: 'https://fallscity.dev' }, body: form,
  }));
  assert.equal(multipartResponse.status, 503);
  assert.equal((await multipartResponse.json()).code, 'not_configured');
});

test('field lengths, email, enums, extras, privacy and token are server-validated', async () => {
  const cases = [
    [{ name: 'A' }, 'name'], [{ name: 'A'.repeat(81) }, 'name'],
    [{ email: 'not-an-email' }, 'email'], [{ email: `${'a'.repeat(250)}@x.com` }, 'email'],
    [{ business: 'B'.repeat(121) }, 'business'], [{ instagram: 'I'.repeat(61) }, 'instagram'],
    [{ trade: 'developer' }, 'trade'], [{ bookingMethod: 'fax' }, 'bookingMethod'],
    [{ extras: ['booking', 'crypto'] }, 'extras'],
    [{ description: 'Too short' }, 'description'], [{ description: 'D'.repeat(3001) }, 'description'],
    [{ privacy: false }, 'privacy'], [{ 'cf-turnstile-response': '' }, 'cf-turnstile-response'],
  ];
  for (const [override, fieldName] of cases) {
    const response = await invoke(jsonRequest(payload(override)));
    assert.equal(response.status, 422, fieldName);
    const body = await response.json();
    assert.equal(body.code, 'validation_error');
    assert.equal(body.fields[fieldName], fieldName === 'privacy' || fieldName === 'cf-turnstile-response' ? 'required' : 'invalid');
  }
});

test('honeypot and timestamp checks stop submissions before provider calls', async () => {
  for (const [override, fieldName] of [
    [{ website: 'https://spam.example' }, 'website'],
    [{ startedAt: NOW - 1_000 }, 'startedAt'],
    [{ startedAt: NOW - 25 * 60 * 60 * 1000 }, 'startedAt'],
    [{ startedAt: NOW + 5 * 60 * 1000 }, 'startedAt'],
    [{ startedAt: 'not-a-time' }, 'startedAt'],
  ]) {
    const response = await invoke(jsonRequest(payload(override)), { env: CONFIGURED_ENV });
    assert.equal(response.status, 422, fieldName);
    assert.ok((await response.json()).fields[fieldName]);
  }
});

test('timestamp alias is accepted as a secondary timing signal', async () => {
  const data = payload({ timestamp: NOW - 10_000 });
  delete data.startedAt;
  const response = await invoke(jsonRequest(data));
  assert.equal(response.status, 503);
});

test('Turnstile rejection never calls Resend', async () => {
  let calls = 0;
  const response = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV,
    fetch: async (input) => {
      calls += 1;
      assert.equal(input, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      return Response.json({ success: false });
    },
  });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, 'turnstile_failed');
  assert.equal(calls, 1);
});

test('Turnstile provider errors and timeout return safe 502 errors', async () => {
  const unavailable = await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: async () => new Response(null, { status: 503 }) });
  assert.equal(unavailable.status, 502);
  assert.equal((await unavailable.json()).code, 'turnstile_unavailable');

  const timeout = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV,
    turnstileTimeoutMs: 5,
    fetch: async (_input, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }),
  });
  assert.equal(timeout.status, 502);
});

test('Resend non-2xx and missing-id responses never produce success', async () => {
  const failed = mockProviders(new Response('mock failure', { status: 429 }));
  const failureResponse = await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: failed.fetch });
  assert.equal(failureResponse.status, 502);
  assert.equal((await failureResponse.json()).code, 'email_provider_error');

  const missingId = mockProviders(Response.json({}));
  const missingResponse = await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: missingId.fetch });
  assert.equal(missingResponse.status, 502);
  assert.equal((await missingResponse.json()).code, 'email_provider_invalid_response');
});

test('Resend network failure and timeout never produce success', async () => {
  const successfulTurnstile = async (input) => {
    if (input.includes('turnstile')) return Response.json({ success: true });
    throw new Error('mock network error');
  };
  const network = await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: successfulTurnstile });
  assert.equal(network.status, 502);

  const timeout = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV,
    resendTimeoutMs: 5,
    fetch: async (input, init) => {
      if (input.includes('turnstile')) return Response.json({ success: true });
      return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
    },
  });
  assert.equal(timeout.status, 502);
  assert.equal((await timeout.json()).code, 'email_provider_error');
});

test('success is accepted-only after a mocked 2xx Resend response with id; content is escaped', async () => {
  const providers = mockProviders(Response.json({ id: 'mock-accepted-id' }, { status: 201 }));
  const malicious = payload({ name: '<img src=x onerror=alert(1)>', description: '<script>alert(1)</script>\nA sufficiently detailed project description.' });
  const response = await invoke(jsonRequest(malicious), { env: CONFIGURED_ENV, fetch: providers.fetch });
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { ok: true, code: 'accepted', id: 'mock-accepted-id' });
  assert.equal(providers.calls.length, 2);
  const resendCall = providers.calls[1];
  assert.equal(resendCall.init.headers.Authorization, 'Bearer test-resend-key');
  const email = JSON.parse(resendCall.init.body);
  assert.equal(email.reply_to, 'ada@example.com');
  assert.ok(!email.html.includes('<img src=x'));
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.text.includes('<script>'));
});

async function freePort() {
  const { createServer } = await import('node:net');
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  const port = address.port;
  server.close();
  await once(server, 'close');
  return port;
}

async function startWrangler(localUpstream) {
  assert.ok(existsSync(join(root, 'dist/contact/index.html')), 'dist/contact/index.html is missing; run npm run build before Wrangler integration tests');
  const port = await freePort();
  const require = createRequire(import.meta.url);
  const cli = join(dirname(require.resolve('wrangler/package.json')), 'wrangler-dist/cli.js');
  const environment = { ...process.env, WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1' };
  for (const key of ['RESEND_API_KEY', 'INQUIRY_TO_EMAIL', 'INQUIRY_FROM_EMAIL', 'TURNSTILE_SECRET_KEY']) delete environment[key];
  const arguments_ = [cli, 'dev', '--config', join(root, 'wrangler.jsonc'), '--local', '--ip', '127.0.0.1', '--port', String(port), '--log-level', 'error', '--persist-to', join(temporaryDirectory, 'wrangler-state')];
  if (localUpstream) arguments_.push('--local-upstream', localUpstream);
  wranglerChild = spawn(process.execPath, arguments_, {
    cwd: temporaryDirectory,
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let diagnostics = '';
  wranglerChild.stdout.on('data', (chunk) => { diagnostics += chunk; });
  wranglerChild.stderr.on('data', (chunk) => { diagnostics += chunk; });
  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (wranglerChild.exitCode !== null) throw new Error(`Wrangler exited before readiness:\n${diagnostics}`);
    try {
      const response = await fetch(`${base}/contact/`, { redirect: 'manual' });
      if (response.status === (localUpstream ? 308 : 200)) return { base, port };
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 150));
  }
  throw new Error(`Wrangler did not become ready:\n${diagnostics}`);
}

async function stopWrangler() {
  if (!wranglerChild || wranglerChild.exitCode !== null) return;
  const exited = once(wranglerChild, 'exit');
  wranglerChild.kill('SIGTERM');
  await Promise.race([exited, new Promise((resolveWait) => setTimeout(resolveWait, 5_000))]);
  if (wranglerChild.exitCode === null) {
    wranglerChild.kill('SIGKILL');
    await exited;
  }
}

test('Wrangler serves Astro assets and noindexes the local host without canonical redirect', async () => {
  const { base } = await startWrangler();
  const response = await fetch(`${base}/contact/?x=1`, { redirect: 'manual' });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Content-Type'), /text\/html/);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  assert.equal(response.headers.get('Location'), null);
});

test('Wrangler preserves query on inherited redirects', async () => {
  const port = wranglerChild.spawnargs[wranglerChild.spawnargs.indexOf('--port') + 1];
  const response = await fetch(`http://127.0.0.1:${port}/es/services/seo-foundations/?campaign=old`, { redirect: 'manual' });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('Location'), '/es/local-seo/?campaign=old');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
});

test('Wrangler selector and explicit language cookie work on local HTTP', async () => {
  const port = wranglerChild.spawnargs[wranglerChild.spawnargs.indexOf('--port') + 1];
  const selector = await fetch(`http://127.0.0.1:${port}/contact/?lang=es&x=1`, { redirect: 'manual' });
  assert.equal(selector.status, 303);
  assert.equal(selector.headers.get('Location'), '/contact/?x=1');
  assert.equal(selector.headers.get('Set-Cookie'), 'lang=es; Path=/; Max-Age=31536000; SameSite=Lax');
  const preference = await fetch(`http://127.0.0.1:${port}/?x=1`, { headers: { Cookie: 'lang=es', 'Accept-Language': 'en', 'User-Agent': 'Mozilla/5.0 test browser' }, redirect: 'manual' });
  assert.equal(preference.status, 302);
  assert.equal(preference.headers.get('Location'), '/es/?x=1');
});

test('Wrangler returns real method, origin, body and not_configured errors without external fetch', async () => {
  const port = wranglerChild.spawnargs[wranglerChild.spawnargs.indexOf('--port') + 1];
  const endpoint = `http://127.0.0.1:${port}/api/inquiry`;
  const method = await fetch(endpoint, { method: 'GET', redirect: 'manual' });
  assert.equal(method.status, 405);
  const origin = await fetch(endpoint, { method: 'POST', headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(origin.status, 403);
  const body = await fetch(endpoint, { method: 'POST', headers: { Origin: `http://127.0.0.1:${port}`, 'Content-Type': 'application/json' }, body: 'x'.repeat(32 * 1024 + 1) });
  assert.equal(body.status, 413);
  const notConfigured = await fetch(endpoint, {
    method: 'POST',
    headers: { Origin: `http://127.0.0.1:${port}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload({ startedAt: Date.now() - 10_000 })),
  });
  assert.equal(notConfigured.status, 503);
  assert.deepEqual(await notConfigured.json(), { ok: false, code: 'not_configured' });
});

test('Wrangler canonicalizes a simulated www upstream before inherited routing', async () => {
  await stopWrangler();
  const { base } = await startWrangler('www.fallscity.dev');
  const response = await fetch(`${base}/services/?x=1`, { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://fallscity.dev/services/?x=1');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
});

try {
  for (const { name, run } of tests) {
    try {
      await run();
      passed += 1;
      console.log(`PASS ${name}`);
    } catch (error) {
      console.error(`FAIL ${name}`);
      throw error;
    }
  }
  console.log(`\n${passed} Worker test groups passed. All Turnstile/Resend success paths used explicit mocks; no external email was sent.`);
} finally {
  await stopWrangler();
  await rm(temporaryDirectory, { recursive: true, force: true });
}
