import Stripe from 'stripe';
import { PRODUCTION_ORIGIN, matchAllowedOrigin, resolveCorsOrigin } from './origins';
import {
  isValidBillingPlan,
  isValidProductSlug,
  isBillingPlanAllowed,
  resolveCheckoutConfig,
  type BillingPlan,
} from './catalog';

const SITE_URL = PRODUCTION_ORIGIN;

const isPlaceholderSecret = (value?: string): boolean =>
  !value ||
  value.includes('xxx') ||
  value.includes('tu_clave') ||
  value.includes('tu_api') ||
  value.includes('placeholder') ||
  value.includes('price_...');

// Las URLs de retorno de Stripe (success_url, cancel_url, return_url del portal)
// solo pueden apuntar a un origen de la allowlist. Derivarlas del Origin sin
// validar convertía el checkout en una redirección abierta que filtraba el
// session_id al dominio del atacante.
const getSiteUrl = (request: Request | null): string =>
  matchAllowedOrigin(request?.headers.get('Origin')) ?? SITE_URL;

const getStripe = (secretKey: string) =>
  new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

export const handleCreateCheckout = async (
  request: Request,
  env: Record<string, string | undefined>,
  corsRequest: Request
) => {
  if (request.method !== 'POST') {
    return jsonError('Método no permitido', 405, corsRequest);
  }

  if (!env.STRIPE_SECRET_KEY || isPlaceholderSecret(env.STRIPE_SECRET_KEY)) {
    return jsonError(
      'Configura STRIPE_SECRET_KEY real en worker/.dev.vars (modo test: sk_test_...)',
      503,
      corsRequest
    );
  }

  try {
    const body = (await request.json()) as {
      productSlug?: string;
      billingPlan?: string;
      quantity?: number;
    };

    const { productSlug, billingPlan } = body;
    const quantity = Math.min(Math.max(Number(body.quantity) || 1, 1), 10);

    if (!productSlug || !isValidProductSlug(productSlug)) {
      return jsonError('Producto no válido', 400, corsRequest);
    }

    if (!billingPlan || !isValidBillingPlan(billingPlan)) {
      return jsonError('Plan de facturación no válido', 400, corsRequest);
    }

    if (!isBillingPlanAllowed(productSlug, billingPlan as BillingPlan)) {
      return jsonError('Este producto no admite el plan seleccionado', 400, corsRequest);
    }

    const config = resolveCheckoutConfig(env, productSlug, billingPlan as BillingPlan);
    if (!config || isPlaceholderSecret(config.priceId)) {
      return jsonError(
        'Configura los STRIPE_PRICE_* reales en worker/.dev.vars (Dashboard → Productos → Price ID)',
        503,
        corsRequest
      );
    }

    const siteUrl = getSiteUrl(corsRequest);
    const stripe = getStripe(env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: config.mode,
      line_items: [{ price: config.priceId, quantity }],
      success_url: `${siteUrl}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel/?product=${productSlug}`,
      locale: 'es',
      metadata: {
        productSlug,
        billingPlan,
        productTitle: config.productTitle,
      },
      // Pagos únicos: métodos definidos en Stripe Dashboard (tarjeta, Bizum, etc.)
      // Suscripciones: solo tarjeta
      ...(config.mode === 'subscription' && {
        payment_method_types: ['card'],
        subscription_data: {
          metadata: { productSlug, billingPlan },
        },
      }),
    });

    if (!session.id) {
      return jsonError('No se pudo crear la sesión de pago', 500, corsRequest);
    }

    return jsonSuccess(
      {
        sessionId: session.id,
        url: session.url,
      },
      200,
      corsRequest
    );
  } catch (error) {
    // El detalle queda en los logs del worker; al cliente solo un mensaje genérico,
    // porque los errores de Stripe pueden incluir información de configuración.
    console.error('[checkout]', error);
    return jsonError('No se pudo iniciar el pago. Inténtalo de nuevo.', 500, corsRequest);
  }
};

export const handleVerifySession = async (
  request: Request,
  env: Record<string, string | undefined>,
  corsRequest: Request
) => {
  if (request.method !== 'GET') {
    return jsonError('Método no permitido', 405, corsRequest);
  }

  if (!env.STRIPE_SECRET_KEY) {
    return jsonError('Pasarela de pago no configurada', 503, corsRequest);
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return jsonError('Sesión no válida', 400, corsRequest);
  }

  try {
    const stripe = getStripe(env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid = session.payment_status === 'paid' || session.status === 'complete';

    return jsonSuccess(
      {
        paid,
        productSlug: session.metadata?.productSlug,
        billingPlan: session.metadata?.billingPlan,
        productTitle: session.metadata?.productTitle,
        amountTotal: session.amount_total,
        currency: session.currency,
        mode: session.mode,
        customerId:
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id ?? null,
      },
      200,
      corsRequest
    );
  } catch {
    return jsonError('No se pudo verificar el pago', 500, corsRequest);
  }
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isPortalRateLimited = async (
  env: Record<string, string | undefined>,
  email: string
): Promise<boolean> => {
  if (!env.REVIEWS_KV) return false;
  const hourKey = new Date().toISOString().slice(0, 13);
  const key = `portal:rate:${normalizeEmail(email)}:${hourKey}`;
  const count = Number((await env.REVIEWS_KV.get(key)) || '0');
  if (count >= 5) return true;
  await env.REVIEWS_KV.put(key, String(count + 1), { expirationTtl: 3600 });
  return false;
};

const resolvePortalCustomerId = async (
  stripe: Stripe,
  sessionId?: string,
  email?: string
): Promise<string | null> => {
  if (sessionId?.startsWith('cs_')) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId =
      typeof session.customer === 'string' ? session.customer : session.customer?.id;
    if (customerId) return customerId;
  }

  if (!email) return null;

  const customers = await stripe.customers.list({ email: normalizeEmail(email), limit: 10 });

  for (const customer of customers.data) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 20,
    });

    const hasManageableSubscription = subscriptions.data.some((subscription) =>
      ['active', 'trialing', 'past_due', 'unpaid'].includes(subscription.status)
    );

    if (hasManageableSubscription) return customer.id;
  }

  return null;
};

export const handleCustomerPortal = async (
  request: Request,
  env: Record<string, string | undefined>,
  corsRequest: Request
) => {
  if (request.method !== 'POST') {
    return jsonError('Método no permitido', 405, corsRequest);
  }

  if (!env.STRIPE_SECRET_KEY || isPlaceholderSecret(env.STRIPE_SECRET_KEY)) {
    return jsonError('Pasarela de pago no configurada', 503, corsRequest);
  }

  try {
    const body = (await request.json()) as { email?: string; sessionId?: string };
    const email = body.email?.trim();
    const sessionId = body.sessionId?.trim();

    if (!email && !sessionId) {
      return jsonError('Indica el email de tu suscripción o abre esta página desde tu confirmación de pago', 400, corsRequest);
    }

    if (email && (await isPortalRateLimited(env, email))) {
      return jsonError('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.', 429, corsRequest);
    }

    const stripe = getStripe(env.STRIPE_SECRET_KEY);
    const customerId = await resolvePortalCustomerId(stripe, sessionId, email);

    if (!customerId) {
      return jsonError(
        'No encontramos una suscripción activa con esos datos. Usa el mismo email del pago.',
        404,
        corsRequest
      );
    }

    const siteUrl = getSiteUrl(corsRequest);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/mantenimiento/gestionar/`,
    });

    if (!portalSession.url) {
      return jsonError('No se pudo abrir el portal de gestión', 500, corsRequest);
    }

    return jsonSuccess({ url: portalSession.url }, 200, corsRequest);
  } catch (error) {
    console.error('[customer-portal]', error);
    return jsonError('No se pudo abrir el portal de gestión. Inténtalo de nuevo.', 500, corsRequest);
  }
};

const jsonSuccess = (data: Record<string, unknown>, status = 200, request: Request | null = null) =>
  new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': resolveCorsOrigin(request),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

const jsonError = (message: string, status = 400, request: Request | null = null) =>
  new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': resolveCorsOrigin(request),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
