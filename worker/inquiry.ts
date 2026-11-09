export interface InquiryEnvironment {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  INQUIRY_TO_EMAIL?: string;
  INQUIRY_FROM_EMAIL?: string;
}

interface InquiryContext {
  request: Request;
  env: InquiryEnvironment;
}

interface TurnstileResult {
  success: boolean;
}

const allowedServices = new Set([
  'new-website',
  'website-redesign',
  'seo-foundations',
  'domain-hosting-ssl',
  'maintenance',
  'not-sure',
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Lang = 'en' | 'es';

// Visitor-facing messages, in the language of the page the form was sent from.
const messages = {
  en: {
    name: 'Enter your name using 2 to 80 characters.',
    email: 'Enter a valid email address.',
    business: 'Keep the business name under 120 characters.',
    service: 'Choose a valid service.',
    details: 'Enter between 30 and 3,000 characters about your project.',
    privacyConsent: 'Please agree to the privacy notice before sending.',
    companyWebsite: 'Automated submission detected.',
    turnstileToken: 'Complete the spam-protection check.',
    startedAt: 'The form session was not valid. Please review your entries and try again.',
    tooLarge: 'The inquiry is too large to process.',
    unreadable: 'The inquiry could not be read. Please use the project inquiry form.',
    review: 'Please review the highlighted fields and try again.',
    notConfigured: 'Online inquiries are not configured yet. Please try again after setup is complete.',
    misconfigured: 'Online inquiries are not configured correctly. Please try again later.',
    notHuman: 'Spam protection could not verify this submission. Please try again.',
    notDelivered: 'Your inquiry could not be delivered. Please try again later.',
    providerDown: 'A form service is temporarily unavailable. Please try again later.',
    sent: 'Thank you. Your project inquiry has been sent to Falls City Dev Studio.',
  },
  es: {
    name: 'Escriba su nombre con 2 a 80 caracteres.',
    email: 'Escriba un correo electrónico válido.',
    business: 'El nombre del negocio debe tener menos de 120 caracteres.',
    service: 'Elija un servicio válido.',
    details: 'Escriba entre 30 y 3.000 caracteres sobre su proyecto.',
    privacyConsent: 'Acepte el aviso de privacidad antes de enviar.',
    companyWebsite: 'Se detectó un envío automático.',
    turnstileToken: 'Complete la verificación contra spam.',
    startedAt: 'La sesión del formulario no es válida. Revise sus datos e intente de nuevo.',
    tooLarge: 'La consulta es demasiado grande para procesarla.',
    unreadable: 'No se pudo leer la consulta. Use el formulario de consulta del sitio.',
    review: 'Revise los campos marcados e intente de nuevo.',
    notConfigured: 'Las consultas en línea todavía no están configuradas. Intente de nuevo cuando la configuración esté lista.',
    misconfigured: 'Las consultas en línea no están bien configuradas. Intente de nuevo más tarde.',
    notHuman: 'La protección contra spam no pudo verificar este envío. Intente de nuevo.',
    notDelivered: 'No se pudo entregar su consulta. Intente de nuevo más tarde.',
    providerDown: 'Un servicio del formulario no está disponible por ahora. Intente de nuevo más tarde.',
    sent: 'Gracias. Su consulta se envió a Falls City Dev Studio.',
  },
} satisfies Record<Lang, Record<string, string>>;

/** The form's hidden `lang` field, or else the language of the referring page. */
function inquiryLang(request: Request, data?: FormData): Lang {
  const field = data?.get('lang');
  if (field === 'es' || field === 'en') return field;
  try {
    return new URL(request.headers.get('referer') ?? '').pathname.startsWith('/es/') ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

function value(data: FormData, key: string): string {
  const entry = data.get(key);
  return typeof entry === 'string' ? entry.trim() : '';
}

function jsonResponse(status: number, message: string, errors?: Record<string, string>) {
  return Response.json({ message, ...(errors ? { errors } : {}) }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function respond(request: Request, lang: Lang, status: number, message: string, errors?: Record<string, string>) {
  if (request.headers.get('accept')?.includes('application/json')) {
    return jsonResponse(status, message, errors);
  }

  const result = status < 400 ? 'success' : 'error';
  const contactPath = lang === 'es' ? '/es/contact/' : '/contact/';
  return new Response(null, {
    status: 303,
    headers: {
      Location: `${contactPath}?inquiry=${result}#inquiry-form`,
      'Cache-Control': 'no-store',
    },
  });
}

function validateInquiry(data: FormData, lang: Lang) {
  const t = messages[lang];
  const inquiry = {
    name: value(data, 'name'),
    email: value(data, 'email'),
    business: value(data, 'business'),
    service: value(data, 'service'),
    details: value(data, 'details'),
    companyWebsite: value(data, 'companyWebsite'),
    startedAt: value(data, 'startedAt'),
    turnstileToken: value(data, 'cf-turnstile-response'),
    privacyConsent: value(data, 'privacyConsent'),
  };
  const errors: Record<string, string> = {};

  if (inquiry.name.length < 2 || inquiry.name.length > 80) {
    errors.name = t.name;
  }
  if (inquiry.email.length > 254 || !emailPattern.test(inquiry.email)) {
    errors.email = t.email;
  }
  if (inquiry.business.length > 120) {
    errors.business = t.business;
  }
  if (!allowedServices.has(inquiry.service)) {
    errors.service = t.service;
  }
  if (inquiry.details.length < 30 || inquiry.details.length > 3000) {
    errors.details = t.details;
  }
  if (inquiry.privacyConsent !== 'yes') {
    errors.privacyConsent = t.privacyConsent;
  }
  if (inquiry.companyWebsite) {
    errors.companyWebsite = t.companyWebsite;
  }
  if (!inquiry.turnstileToken) {
    errors.turnstileToken = t.turnstileToken;
  }

  const elapsed = Date.now() - Number(inquiry.startedAt);
  if (inquiry.startedAt && (!Number.isFinite(elapsed) || elapsed < 1500 || elapsed > 86_400_000)) {
    errors.startedAt = t.startedAt;
  }

  return { inquiry, errors };
}

async function verifyTurnstile(token: string, secret: string, request: Request) {
  const body = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.set('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/siteverify', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return false;
  const result = await response.json() as TurnstileResult;
  return result.success === true;
}

async function sendInquiry(inquiry: ReturnType<typeof validateInquiry>['inquiry'], lang: Lang, env: Required<InquiryEnvironment>) {
  const serviceLabels: Record<string, string> = {
    'new-website': 'A new business website',
    'website-redesign': 'An existing website redesign',
    'seo-foundations': 'SEO foundations',
    'domain-hosting-ssl': 'Domain, hosting, or SSL setup',
    maintenance: 'Website maintenance',
    'not-sure': 'Not sure yet',
  };
  const safeSubjectName = inquiry.name.replace(/[\r\n]/g, ' ');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.INQUIRY_FROM_EMAIL,
      to: [env.INQUIRY_TO_EMAIL],
      reply_to: inquiry.email,
      subject: `Website inquiry from ${safeSubjectName}`,
      text: [
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Business: ${inquiry.business || 'Not provided'}`,
        `Service: ${serviceLabels[inquiry.service]}`,
        `Language: ${lang === 'es' ? 'Spanish (sent from the Spanish site)' : 'English'}`,
        '',
        'Project details:',
        inquiry.details,
        '',
        'Privacy notice accepted: yes',
      ].join('\n'),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    console.error(`Inquiry email provider returned HTTP ${response.status}.`);
    return false;
  }
  return true;
}

export async function onRequest(context: InquiryContext): Promise<Response> {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  const refererLang = inquiryLang(request);
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 65_536) return respond(request, refererLang, 413, messages[refererLang].tooLarge);

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return respond(request, refererLang, 400, messages[refererLang].unreadable);
  }

  const lang = inquiryLang(request, data);
  const t = messages[lang];
  const { inquiry, errors } = validateInquiry(data, lang);
  if (Object.keys(errors).length > 0) {
    return respond(request, lang, 400, t.review, errors);
  }

  const configuration = [
    env.TURNSTILE_SECRET_KEY,
    env.RESEND_API_KEY,
    env.INQUIRY_TO_EMAIL,
    env.INQUIRY_FROM_EMAIL,
  ];
  if (configuration.some((item) => !item)) {
    return respond(request, lang, 503, t.notConfigured);
  }

  const configuredEnv = env as Required<InquiryEnvironment>;
  const fromAddress = configuredEnv.INQUIRY_FROM_EMAIL.match(/<([^>]+)>/)?.[1] ?? configuredEnv.INQUIRY_FROM_EMAIL;
  if (
    !emailPattern.test(configuredEnv.INQUIRY_TO_EMAIL)
    || !emailPattern.test(fromAddress)
    || /[\r\n]/.test(configuredEnv.INQUIRY_FROM_EMAIL)
  ) {
    console.error('Inquiry email environment variables are invalid.');
    return respond(request, lang, 503, t.misconfigured);
  }

  try {
    const human = await verifyTurnstile(inquiry.turnstileToken, configuredEnv.TURNSTILE_SECRET_KEY, request);
    if (!human) return respond(request, lang, 400, t.notHuman);

    const delivered = await sendInquiry(inquiry, lang, configuredEnv);
    if (!delivered) return respond(request, lang, 502, t.notDelivered);
  } catch {
    console.error('A form provider request failed.');
    return respond(request, lang, 502, t.providerDown);
  }

  return respond(request, lang, 200, t.sent);
}
