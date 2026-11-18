// Contact form: progressive enhancement over the email link in Contact.astro.
// 1. Ask the Worker whether delivery is configured (GET /api/inquiry/config); if not, stay hidden.
// 2. Render Turnstile explicitly (only shows a challenge when Cloudflare needs one).
// 3. Validate in place, keep a local draft, POST JSON to /api/inquiry and report the outcome.

type Strings = Record<
  | 'sending' | 'verifying' | 'count' | 'countShort'
  | 'errName' | 'errEmail' | 'errEmailFormat' | 'errMessage' | 'errMessageShort' | 'errPrivacy' | 'errTooLong'
  | 'errSummary' | 'errVerify' | 'errSend' | 'emailInstead' | 'sentTitle' | 'sentBody' | 'another',
  string
>;

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(id?: string): void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
    dataLayer?: unknown[];
  }
}

const DRAFT_KEY = 'fallscity-inquiry-draft';
const DRAFT_FIELDS = ['name', 'email', 'business', 'city', 'links', 'message'] as const;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    script.onerror = () => reject(new Error('turnstile'));
    document.head.append(script);
  });
}

function readDraft(): Partial<Record<(typeof DRAFT_FIELDS)[number], string>> {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}
function writeDraft(form: HTMLFormElement) {
  try {
    const draft = Object.fromEntries(DRAFT_FIELDS.map((k) => [k, (form.elements.namedItem(k) as HTMLInputElement).value]));
    if (Object.values(draft).some(Boolean)) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {}
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export async function initInquiry() {
  const form = document.querySelector<HTMLFormElement>('[data-inquiry]');
  const wrap = document.querySelector<HTMLElement>('[data-inquiry-wrap]');
  const section = form?.closest<HTMLElement>('.contact');
  if (!form || !wrap || !section) return;

  // 1. Is delivery configured? Without an answer, the email link stays the way in.
  let config: { enabled?: boolean; siteKey?: string | null } | undefined;
  try {
    const response = await fetch('/api/inquiry/config', { headers: { Accept: 'application/json' } });
    if (response.ok) config = await response.json();
  } catch {}
  const siteKey = config?.siteKey || form.dataset.sitekey || '';
  if (!config?.enabled || !siteKey) return;

  const t = JSON.parse(form.dataset.strings ?? '{}') as Strings;
  const lang = form.dataset.lang === 'es' ? 'es' : 'en';
  const field = <T extends HTMLElement = HTMLInputElement>(name: string) => form.elements.namedItem(name) as unknown as T;
  const q = <T extends HTMLElement>(selector: string) => wrap.querySelector<T>(selector)!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = q<HTMLElement>('[data-status]');
  const summary = q<HTMLElement>('[data-summary]');
  const errorBox = q<HTMLElement>('[data-error]');
  const sent = q<HTMLElement>('[data-sent]');
  const count = q<HTMLElement>('[data-count]');
  const message = field<HTMLTextAreaElement>('message');
  const buttonLabel = button.textContent ?? '';
  let startedAt = Date.now();

  section.classList.add('has-form');
  wrap.hidden = false;

  // Draft from an earlier visit.
  const draft = readDraft();
  for (const key of DRAFT_FIELDS) if (draft[key]) field(key).value = draft[key]!;

  // 2. Turnstile. The token is single use, so it is reset after every attempt.
  let token = '';
  let widgetId: string | undefined;
  let tokenWaiters: ((value: string) => void)[] = [];
  const setToken = (value: string) => {
    token = value;
    if (value) {
      tokenWaiters.forEach((resolve) => resolve(value));
      tokenWaiters = [];
    }
  };
  const turnstile = loadTurnstile().then((api) => {
    widgetId = api.render(q<HTMLElement>('[data-turnstile]'), {
      sitekey: siteKey,
      language: lang,
      theme: 'dark',
      appearance: 'interaction-only',
      callback: setToken,
      'expired-callback': () => setToken(''),
      'error-callback': () => setToken(''),
    });
    return api;
  });
  turnstile.catch(() => {});
  const resetTurnstile = () => {
    setToken('');
    turnstile.then((api) => api.reset(widgetId)).catch(() => {});
  };
  const waitForToken = (ms: number) =>
    token ? Promise.resolve(token) : new Promise<string>((resolve) => {
      tokenWaiters.push(resolve);
      setTimeout(() => resolve(token), ms);
    });

  // 3. Validation, shown next to each field.
  const messages: Record<string, (el: HTMLInputElement) => string> = {
    name: (el) => (el.validity.valid ? '' : t.errName),
    email: (el) => (el.validity.valueMissing ? t.errEmail : el.validity.valid ? '' : t.errEmailFormat),
    message: (el) => (el.validity.valueMissing ? t.errMessage : el.validity.tooShort || el.value.trim().length < 20 ? t.errMessageShort : el.validity.valid ? '' : t.errTooLong),
    privacy: (el) => (el.checked ? '' : t.errPrivacy),
  };
  const showError = (name: string, text: string) => {
    const el = field(name);
    const box = wrap.querySelector<HTMLElement>(`#e-${name}`);
    if (text) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    if (box) {
      box.textContent = text;
      box.hidden = !text;
    }
  };
  const validate = (name: string) => {
    const text = messages[name]!(field(name));
    showError(name, text);
    return !text;
  };
  for (const name of Object.keys(messages)) {
    const el = field(name);
    // On leaving a field, only add errors (fixing one clears it on input). Skip it when focus goes
    // to the submit button: a message appearing there would shift the button under the pointer.
    el.addEventListener('blur', (event) => {
      if (event.relatedTarget === button || el.hasAttribute('aria-invalid') || !el.value) return;
      validate(name);
    });
    el.addEventListener(name === 'privacy' ? 'change' : 'input', () => {
      if (el.hasAttribute('aria-invalid')) validate(name);
    });
  }

  const updateCount = () => {
    const n = message.value.length;
    count.textContent = (n < 20 ? t.countShort : t.count).replace('{n}', String(n));
  };
  updateCount();
  let draftTimer: ReturnType<typeof setTimeout> | undefined;
  form.addEventListener('input', () => {
    updateCount();
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => writeDraft(form), 400);
  });

  const mailtoWithText = () => {
    const value = (name: string) => field(name).value.trim();
    const about = [value('name'), [value('business'), value('city')].filter(Boolean).join(', '), value('links')].filter(Boolean);
    const body = [...about, '', message.value.trim()].join('\n').trim();
    return `mailto:${form.dataset.email}?subject=${encodeURIComponent(form.dataset.subject ?? '')}&body=${encodeURIComponent(body)}`;
  };
  const showSendError = (text: string) => {
    q<HTMLElement>('[data-error-text]').textContent = text;
    q<HTMLAnchorElement>('[data-error-mail]').href = mailtoWithText();
    errorBox.hidden = false;
    errorBox.focus();
  };
  const busy = (on: boolean, label = buttonLabel) => {
    button.disabled = on;
    button.textContent = label;
    form.setAttribute('aria-busy', String(on));
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    summary.hidden = true;
    const invalid = Object.keys(messages).filter((name) => !validate(name));
    if (invalid.length) {
      summary.textContent = t.errSummary;
      summary.hidden = false;
      field(invalid[0]!).focus();
      return;
    }

    if (!token) {
      busy(true, t.verifying);
      status.textContent = t.verifying;
    }
    const currentToken = await waitForToken(15_000);
    if (!currentToken) {
      busy(false);
      status.textContent = '';
      showSendError(t.errVerify);
      resetTurnstile();
      return;
    }

    busy(true, t.sending);
    status.textContent = t.sending;
    // The Worker rejects submissions made less than 3 s after the form appeared.
    const wait = startedAt + 3_200 - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

    const data = new FormData(form);
    const payload: Record<string, unknown> = Object.fromEntries(data.entries());
    payload.privacy = field('privacy').checked;
    payload.language = lang;
    payload.startedAt = startedAt;
    payload['cf-turnstile-response'] = currentToken;

    let response: Response | undefined;
    let result: { code?: string; fields?: Record<string, string> } = {};
    try {
      response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      result = (await response.json().catch(() => ({}))) as typeof result;
    } catch {}
    resetTurnstile();
    busy(false);
    status.textContent = '';

    if (response?.status === 202) {
      const name = field('name').value.trim().split(/\s+/)[0] ?? '';
      q<HTMLElement>('[data-sent-body]').textContent = t.sentBody.replace('{name}', name).replace('{email}', field('email').value.trim());
      form.hidden = true;
      sent.hidden = false;
      q<HTMLElement>('[data-sent-title]').focus();
      clearDraft();
      window.dataLayer?.push({ event: 'generate_lead', form_id: 'contact', language: lang });
      return;
    }

    const fieldErrors = Object.keys(result.fields ?? {}).filter((name) => name in messages);
    if (response?.status === 422 && fieldErrors.length) {
      fieldErrors.forEach((name) => showError(name, messages[name]!(field(name)) || t.errSummary));
      summary.textContent = t.errSummary;
      summary.hidden = false;
      field(fieldErrors[0]!).focus();
      return;
    }
    if (result.code === 'turnstile_failed') return showSendError(t.errVerify);
    showSendError(t.errSend);
  });

  q<HTMLButtonElement>('[data-another]').addEventListener('click', () => {
    form.reset();
    for (const name of Object.keys(messages)) showError(name, '');
    updateCount();
    startedAt = Date.now();
    sent.hidden = true;
    form.hidden = false;
    field('name').focus();
  });
}
