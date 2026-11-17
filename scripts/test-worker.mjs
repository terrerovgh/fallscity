// Worker tests: routing, language, redirects and /api/inquiry with mocked providers.
// Then a smoke test through `wrangler dev` against the built site (skipped if workerd can't start;
// set REQUIRE_WRANGLER=1 to make that a failure).
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
  const errors = output.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error) ?? [];
  assert.equal(errors.length, 0, errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
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
    city: 'Louisville',
    links: 'instagram.com/inkandco',
    message: 'A portfolio website with a gallery and an online booking request.',
    language: 'en',
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

function mockProviders(resendResult = Response.json({ id: 'mock-email-id' })) {
  const calls = [];
  return {
    calls,
    fetch: async (input, init) => {
      calls.push({ input, init });
      if (input === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') return Response.json({ success: true });
      if (input === 'https://api.resend.com/emails') return resendResult.clone();
      throw new Error(`Unexpected test URL: ${input}`);
    },
  };
}

test('canonicalizes HTTP and www, preserving path and query', async () => {
  const http = await invoke(request('http://fallscity.dev/es/privacidad/?x=1'));
  assert.equal(http.status, 308);
  assert.equal(http.headers.get('Location'), 'https://fallscity.dev/es/privacidad/?x=1');
  const www = await invoke(request('https://www.fallscity.dev/?x=1'));
  assert.equal(www.status, 308);
  assert.equal(www.headers.get('Location'), 'https://fallscity.dev/?x=1');
  assert.equal(www.headers.get('X-Robots-Tag'), 'noindex');
});

test('never canonicalizes localhost; non-production responses are noindex', async () => {
  const local = await invoke(request('http://localhost:8787/?x=1'));
  assert.equal(local.status, 200);
  assert.equal(local.headers.get('X-Robots-Tag'), 'noindex');
  const production = await invoke(request('https://fallscity.dev/'));
  assert.equal(production.headers.get('X-Robots-Tag'), null);
});

test('old URLs redirect 301 to the matching section, keeping the query before the fragment', async () => {
  const redirects = [
    ['/sitemap.xml', '/sitemap-index.xml'], ['/tattoo/', '/'], ['/tattoo', '/'], ['/es/tatuajes/', '/es/'],
    ['/about/', '/'], ['/barbershops/', '/'], ['/es/piercing', '/es/'],
    ['/work/', '/#work'], ['/es/work/', '/es/#work'], ['/process/', '/#process'], ['/contact/', '/#contact'],
    ['/es/contact', '/es/#contact'], ['/pricing/', '/#services'], ['/panel/', '/#services'], ['/local-seo/', '/#services'],
    ['/services/', '/#services'], ['/services/seo-foundations/', '/#services'], ['/es/privacy/', '/es/privacidad/'],
  ];
  for (const [from, to] of redirects) {
    const response = await invoke(request(`https://fallscity.dev${from}?utm=old`));
    assert.equal(response.status, 301, from);
    const [path, hash] = to.split('#');
    assert.equal(response.headers.get('Location'), `${path}?utm=old${hash ? `#${hash}` : ''}`, from);
  }
  for (const path of ['/', '/es/', '/privacy/', '/es/privacidad/', '/sitemap-index.xml']) {
    const response = await invoke(request(`https://fallscity.dev${path}`));
    assert.equal(response.status, 200, `${path} is served, not redirected`);
  }
});

test('language selector sets the cookie and drops only the lang parameter', async () => {
  const response = await invoke(request('https://fallscity.dev/es/?lang=es&x=1'));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/es/?x=1');
  assert.equal(response.headers.get('Set-Cookie'), 'lang=es; Path=/; Max-Age=31536000; SameSite=Lax; Secure');
  const local = await invoke(request('http://localhost:8787/?lang=en'));
  assert.doesNotMatch(local.headers.get('Set-Cookie'), /Secure/);
  for (const suffix of ['?lang=fr', '?lang=en&lang=es']) {
    const ignored = await invoke(request(`https://fallscity.dev/${suffix}`));
    assert.equal(ignored.headers.get('Set-Cookie'), null, suffix);
  }
});

test('cookie, then Accept-Language, picks the language; privacy maps to /es/privacidad/', async () => {
  const spanish = await invoke(request('https://fallscity.dev/?c=1', { headers: { 'Accept-Language': 'es-US,es;q=0.9,en;q=0.8' } }));
  assert.equal(spanish.status, 302);
  assert.equal(spanish.headers.get('Location'), '/es/?c=1');
  assert.equal(spanish.headers.get('Vary'), 'Accept-Language, Cookie');
  const cookie = await invoke(request('https://fallscity.dev/es/', { headers: { Cookie: 'lang=en', 'Accept-Language': 'es' } }));
  assert.equal(cookie.headers.get('Location'), '/');
  const privacyEs = await invoke(request('https://fallscity.dev/privacy/', { headers: { Cookie: 'lang=es' } }));
  assert.equal(privacyEs.headers.get('Location'), '/es/privacidad/');
  const privacyEn = await invoke(request('https://fallscity.dev/es/privacidad/', { headers: { Cookie: 'lang=en' } }));
  assert.equal(privacyEn.headers.get('Location'), '/privacy/');
  const same = await invoke(request('https://fallscity.dev/es/privacidad/', { headers: { Cookie: 'lang=es' } }));
  assert.equal(same.status, 200);
  const weighted = await invoke(request('https://fallscity.dev/es/', { headers: { 'Accept-Language': 'es;q=0, en;q=0.8' } }));
  assert.equal(weighted.headers.get('Location'), '/');
});

test('crawlers, non-page paths and non-GET methods are not language-redirected', async () => {
  const crawler = await invoke(request('https://fallscity.dev/', { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)', 'Accept-Language': 'es' } }));
  assert.equal(crawler.status, 200);
  for (const path of ['/robots.txt', '/og.jpg', '/fonts/x.woff2']) {
    const response = await invoke(request(`https://fallscity.dev${path}`, { headers: { 'Accept-Language': 'es' } }));
    assert.equal(response.status, 200, path);
  }
  const post = await invoke(request('https://fallscity.dev/', { method: 'POST', headers: { 'Accept-Language': 'es' } }));
  assert.equal(post.status, 200);
});

test('inquiry: method, origin, size, media type and JSON checks', async () => {
  const get = await invoke(request('https://fallscity.dev/api/inquiry'));
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('Allow'), 'POST');
  for (const origin of ['https://attacker.example', 'null', 'https://www.fallscity.dev', '']) {
    const response = await invoke(jsonRequest(payload(), { headers: { Origin: origin } }));
    assert.equal(response.status, 403, origin);
  }
  const local = await invoke(jsonRequest(payload(), { url: 'http://localhost:8787/api/inquiry', headers: { Origin: 'http://localhost:8787' } }));
  assert.equal(local.status, 503);
  assert.equal((await invoke(jsonRequest('x'.repeat(32 * 1024 + 1)))).status, 413);
  assert.equal((await invoke(jsonRequest('name=Ada', { headers: { 'Content-Type': 'text/plain' } }))).status, 415);
  const malformed = await invoke(jsonRequest('{broken'));
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, 'invalid_json');
});

test('inquiry without secrets answers 503 not_configured without calling providers (JSON, urlencoded, multipart)', async () => {
  const json = await invoke(jsonRequest(payload()));
  assert.equal(json.status, 503);
  assert.deepEqual(await json.json(), { ok: false, code: 'not_configured' });
  const encoded = new URLSearchParams(Object.entries(payload()).map(([k, v]) => [k, String(v)]));
  const urlEncoded = await invoke(request('https://fallscity.dev/api/inquiry', { method: 'POST', headers: { Origin: 'https://fallscity.dev', 'Content-Type': 'application/x-www-form-urlencoded' }, body: encoded }));
  assert.equal(urlEncoded.status, 503);
  const form = new FormData();
  for (const [k, v] of Object.entries(payload())) form.set(k, String(v));
  const multipart = await invoke(request('https://fallscity.dev/api/inquiry', { method: 'POST', headers: { Origin: 'https://fallscity.dev' }, body: form }));
  assert.equal(multipart.status, 503);
});

test('inquiry fields are validated on the server', async () => {
  const cases = [
    [{ name: 'A' }, 'name'], [{ name: 'A'.repeat(81) }, 'name'],
    [{ email: 'not-an-email' }, 'email'], [{ business: 'B'.repeat(121) }, 'business'],
    [{ city: 'C'.repeat(81) }, 'city'], [{ links: 'L'.repeat(201) }, 'links'],
    [{ message: 'Too short' }, 'message'], [{ message: 'M'.repeat(3001) }, 'message'],
    [{ language: 'fr' }, 'language'], [{ privacy: false }, 'privacy'],
    [{ 'cf-turnstile-response': '' }, 'cf-turnstile-response'], [{ website: 'https://spam.example' }, 'website'],
    [{ startedAt: NOW - 1_000 }, 'startedAt'], [{ startedAt: NOW - 25 * 60 * 60 * 1000 }, 'startedAt'],
    [{ startedAt: NOW + 5 * 60 * 1000 }, 'startedAt'], [{ startedAt: 'not-a-time' }, 'startedAt'],
  ];
  for (const [override, fieldName] of cases) {
    const response = await invoke(jsonRequest(payload(override)), { env: CONFIGURED_ENV });
    assert.equal(response.status, 422, fieldName);
    const body = await response.json();
    assert.equal(body.code, 'validation_error');
    assert.ok(body.fields[fieldName], fieldName);
  }
  const optional = payload();
  for (const key of ['business', 'city', 'links', 'language']) delete optional[key];
  assert.equal((await invoke(jsonRequest(optional))).status, 503, 'optional fields may be missing');
});

test('Turnstile failure or outage never reaches Resend', async () => {
  let calls = 0;
  const rejected = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV,
    fetch: async (input) => { calls += 1; assert.match(input, /turnstile/); return Response.json({ success: false }); },
  });
  assert.equal(rejected.status, 403);
  assert.equal((await rejected.json()).code, 'turnstile_failed');
  assert.equal(calls, 1);
  const down = await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: async () => new Response(null, { status: 503 }) });
  assert.equal(down.status, 502);
  const timeout = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV, turnstileTimeoutMs: 5,
    fetch: async (_input, init) => new Promise((_r, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))),
  });
  assert.equal(timeout.status, 502);
});

test('Resend errors, missing id, network failure and timeout never report success', async () => {
  const failed = mockProviders(new Response('mock failure', { status: 429 }));
  assert.equal((await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: failed.fetch })).status, 502);
  const missingId = mockProviders(Response.json({}));
  const missing = await invoke(jsonRequest(payload()), { env: CONFIGURED_ENV, fetch: missingId.fetch });
  assert.equal((await missing.json()).code, 'email_provider_invalid_response');
  const network = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV,
    fetch: async (input) => { if (input.includes('turnstile')) return Response.json({ success: true }); throw new Error('mock network error'); },
  });
  assert.equal(network.status, 502);
  const timeout = await invoke(jsonRequest(payload()), {
    env: CONFIGURED_ENV, resendTimeoutMs: 5,
    fetch: async (input, init) => {
      if (input.includes('turnstile')) return Response.json({ success: true });
      return new Promise((_r, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
    },
  });
  assert.equal(timeout.status, 502);
});

test('a valid inquiry is sent through Resend with escaped HTML and reply-to set', async () => {
  const providers = mockProviders(Response.json({ id: 'mock-accepted-id' }, { status: 201 }));
  const malicious = payload({ name: '<img src=x onerror=alert(1)>', message: '<script>alert(1)</script>\nA sufficiently detailed project description.', language: 'es' });
  const response = await invoke(jsonRequest(malicious), { env: CONFIGURED_ENV, fetch: providers.fetch });
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { ok: true, code: 'accepted', id: 'mock-accepted-id' });
  assert.equal(providers.calls.length, 2);
  const turnstileBody = new URLSearchParams(providers.calls[0].init.body);
  assert.equal(turnstileBody.get('secret'), 'test-turnstile-secret');
  assert.equal(turnstileBody.get('response'), 'test-token');
  const resend = providers.calls[1];
  assert.equal(resend.init.headers.Authorization, 'Bearer test-resend-key');
  const email = JSON.parse(resend.init.body);
  assert.deepEqual(email.to, ['inquiries@example.com']);
  assert.equal(email.from, 'Falls City <website@example.com>');
  assert.equal(email.reply_to, 'ada@example.com');
  assert.equal(email.subject, 'New website inquiry: Ink & Co');
  assert.ok(!email.html.includes('<img src=x') && !email.html.includes('<script>'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.html.includes('Louisville') && email.html.includes('Spanish'));
  assert.ok(email.text.includes('instagram.com/inkandco'));
});

// ---- Through wrangler dev (real Workers runtime + built assets) ----
async function freePort() {
  const { createServer } = await import('node:net');
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  server.close();
  await once(server, 'close');
  return port;
}

async function startWrangler() {
  assert.ok(existsSync(join(root, 'dist/index.html')), 'dist/ is missing; run npm run build first');
  const port = await freePort();
  const require = createRequire(import.meta.url);
  const cli = join(dirname(require.resolve('wrangler/package.json')), 'wrangler-dist/cli.js');
  const environment = { ...process.env, WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1' };
  for (const key of ['RESEND_API_KEY', 'INQUIRY_TO_EMAIL', 'INQUIRY_FROM_EMAIL', 'TURNSTILE_SECRET_KEY']) delete environment[key];
  wranglerChild = spawn(process.execPath, [cli, 'dev', '--config', join(root, 'wrangler.jsonc'), '--local', '--ip', '127.0.0.1', '--port', String(port), '--log-level', 'error', '--persist-to', join(temporaryDirectory, 'wrangler-state')], {
    cwd: temporaryDirectory, env: environment, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let diagnostics = '';
  wranglerChild.stdout.on('data', (chunk) => { diagnostics += chunk; });
  wranglerChild.stderr.on('data', (chunk) => { diagnostics += chunk; });
  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 40_000;
  while (Date.now() < deadline) {
    if (wranglerChild.exitCode !== null) throw new Error(`Wrangler exited:\n${diagnostics}`);
    try {
      if ((await fetch(`${base}/`, { redirect: 'manual' })).status === 200) return base;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`Wrangler did not become ready:\n${diagnostics}`);
}

async function stopWrangler() {
  if (!wranglerChild || wranglerChild.exitCode !== null) return;
  const exited = once(wranglerChild, 'exit');
  wranglerChild.kill('SIGTERM');
  await Promise.race([exited, new Promise((r) => setTimeout(r, 3000))]);
  if (wranglerChild.exitCode === null) wranglerChild.kill('SIGKILL');
}

let failed = 0;
async function run(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${name}\n${error.stack}`);
  }
}

for (const { name, run: fn } of tests) await run(name, fn);

let base;
try {
  base = await startWrangler();
} catch (error) {
  if (process.env.REQUIRE_WRANGLER) {
    failed += 1;
    console.log(`FAIL wrangler dev\n${error.message}`);
  } else console.log(`SKIP wrangler dev smoke test (${error.message.split('\n')[0]})`);
}
if (base) {
  await run('wrangler: serves the built home page, noindexed on localhost', async () => {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Falls City/);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  });
  await run('wrangler: serves the Spanish privacy page and the 404 page', async () => {
    assert.equal((await fetch(`${base}/es/privacidad/`)).status, 200);
    const missing = await fetch(`${base}/no-such-page/`);
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /<html/);
  });
  await run('wrangler: redirects an old URL and sets the language cookie', async () => {
    const old = await fetch(`${base}/pricing/?x=1`, { redirect: 'manual' });
    assert.equal(old.status, 301);
    assert.equal(old.headers.get('Location'), '/?x=1#services');
    const lang = await fetch(`${base}/es/?lang=es`, { redirect: 'manual' });
    assert.equal(lang.status, 303);
    assert.match(lang.headers.get('Set-Cookie'), /^lang=es;/);
  });
  await run('wrangler: inquiry API without secrets answers not_configured', async () => {
    const response = await fetch(`${base}/api/inquiry`, {
      method: 'POST',
      headers: { Origin: base, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload({ startedAt: Date.now() - 10_000 })),
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'not_configured');
  });
}
await stopWrangler();
await rm(temporaryDirectory, { recursive: true, force: true });
console.log(failed ? `\n${failed} worker check(s) failed` : `\nAll ${passed} worker checks passed`);
process.exit(failed ? 1 : 0);
