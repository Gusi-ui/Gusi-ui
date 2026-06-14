import Stripe from 'stripe';
import {
  isValidBillingPlan,
  isValidProductSlug,
  isBillingPlanAllowed,
  resolveCheckoutConfig,
  type BillingPlan,
} from './catalog';

const SITE_URL = 'https://alamia.es';

const isPlaceholderSecret = (value?: string): boolean =>
  !value ||
  value.includes('xxx') ||
  value.includes('tu_clave') ||
  value.includes('tu_api') ||
  value.includes('placeholder') ||
  value.includes('price_...');

const getSiteUrl = (request: Request | null): string => {
  const origin = request?.headers.get('Origin');
  if (origin?.startsWith('http://localhost') || origin?.startsWith('http://127.0.0.1')) {
    return origin;
  }
  return SITE_URL;
};

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
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?product=${productSlug}`,
      locale: 'es',
      metadata: {
        productSlug,
        billingPlan,
        productTitle: config.productTitle,
      },
      ...(config.mode === 'subscription' && {
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
    console.error('[checkout]', error);
    const stripeMessage = error instanceof Error ? error.message : 'Error al iniciar el pago';
    return jsonError(stripeMessage, 500, corsRequest);
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
      },
      200,
      corsRequest
    );
  } catch {
    return jsonError('No se pudo verificar el pago', 500, corsRequest);
  }
};

const getCORSOrigin = (request: Request | null) => {
  const origin = request?.headers.get('Origin');
  if (origin?.startsWith('http://localhost') || origin?.startsWith('http://127.0.0.1')) {
    return origin;
  }
  return SITE_URL;
};

const jsonSuccess = (data: Record<string, unknown>, status = 200, request: Request | null = null) =>
  new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getCORSOrigin(request),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

const jsonError = (message: string, status = 400, request: Request | null = null) =>
  new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getCORSOrigin(request),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
