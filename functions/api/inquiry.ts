interface InquiryEnvironment {
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

function respond(request: Request, status: number, message: string, errors?: Record<string, string>) {
  if (request.headers.get('accept')?.includes('application/json')) {
    return jsonResponse(status, message, errors);
  }

  const result = status < 400 ? 'success' : 'error';
  return new Response(null, {
    status: 303,
    headers: {
      Location: `/contact/?inquiry=${result}#inquiry-form`,
      'Cache-Control': 'no-store',
    },
  });
}

function validateInquiry(data: FormData) {
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
    errors.name = 'Enter your name using 2 to 80 characters.';
  }
  if (inquiry.email.length > 254 || !emailPattern.test(inquiry.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (inquiry.business.length > 120) {
    errors.business = 'Keep the business name under 120 characters.';
  }
  if (!allowedServices.has(inquiry.service)) {
    errors.service = 'Choose a valid service.';
  }
  if (inquiry.details.length < 30 || inquiry.details.length > 3000) {
    errors.details = 'Enter between 30 and 3,000 characters about your project.';
  }
  if (inquiry.privacyConsent !== 'yes') {
    errors.privacyConsent = 'Please agree to the privacy notice before sending.';
  }
  if (inquiry.companyWebsite) {
    errors.companyWebsite = 'Automated submission detected.';
  }
  if (!inquiry.turnstileToken) {
    errors.turnstileToken = 'Complete the spam-protection check.';
  }

  const elapsed = Date.now() - Number(inquiry.startedAt);
  if (inquiry.startedAt && (!Number.isFinite(elapsed) || elapsed < 1500 || elapsed > 86_400_000)) {
    errors.startedAt = 'The form session was not valid. Please review your entries and try again.';
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

async function sendInquiry(inquiry: ReturnType<typeof validateInquiry>['inquiry'], env: Required<InquiryEnvironment>) {
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

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 65_536) return respond(request, 413, 'The inquiry is too large to process.');

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return respond(request, 400, 'The inquiry could not be read. Please use the project inquiry form.');
  }

  const { inquiry, errors } = validateInquiry(data);
  if (Object.keys(errors).length > 0) {
    return respond(request, 400, 'Please review the highlighted fields and try again.', errors);
  }

  const configuration = [
    env.TURNSTILE_SECRET_KEY,
    env.RESEND_API_KEY,
    env.INQUIRY_TO_EMAIL,
    env.INQUIRY_FROM_EMAIL,
  ];
  if (configuration.some((item) => !item)) {
    return respond(request, 503, 'Online inquiries are not configured yet. Please try again after setup is complete.');
  }

  const configuredEnv = env as Required<InquiryEnvironment>;
  const fromAddress = configuredEnv.INQUIRY_FROM_EMAIL.match(/<([^>]+)>/)?.[1] ?? configuredEnv.INQUIRY_FROM_EMAIL;
  if (
    !emailPattern.test(configuredEnv.INQUIRY_TO_EMAIL)
    || !emailPattern.test(fromAddress)
    || /[\r\n]/.test(configuredEnv.INQUIRY_FROM_EMAIL)
  ) {
    console.error('Inquiry email environment variables are invalid.');
    return respond(request, 503, 'Online inquiries are not configured correctly. Please try again later.');
  }

  try {
    const human = await verifyTurnstile(inquiry.turnstileToken, configuredEnv.TURNSTILE_SECRET_KEY, request);
    if (!human) return respond(request, 400, 'Spam protection could not verify this submission. Please try again.');

    const delivered = await sendInquiry(inquiry, configuredEnv);
    if (!delivered) return respond(request, 502, 'Your inquiry could not be delivered. Please try again later.');
  } catch {
    console.error('A form provider request failed.');
    return respond(request, 502, 'A form service is temporarily unavailable. Please try again later.');
  }

  return respond(request, 200, 'Thank you. Your project inquiry has been sent to Falls City Dev Studio.');
}
