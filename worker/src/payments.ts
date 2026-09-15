import Stripe from 'stripe';
import { Resend } from 'resend';
import { PRODUCTION_ORIGIN, matchAllowedOrigin, resolveCorsOrigin } from './origins';
import {
  PORTAL_TOKEN_TTL_SECONDS,
  createPortalToken,
  hashPortalToken,
  isWellFormedPortalToken,
  portalTokenKey,
} from './portal-tokens';
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

/** Cliente asociado a una sesión de checkout. El session_id solo lo conoce quien acaba de pagar. */
const customerIdFromSession = async (
  stripe: Stripe,
  sessionId: string
): Promise<string | null> => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null;
};

/** Cliente con suscripción gestionable para un email. Solo se usa al enviar el enlace, nunca para dar acceso. */
const customerIdFromEmail = async (stripe: Stripe, email: string): Promise<string | null> => {
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

const PORTAL_EMAIL_REMITENTE = 'Alamia <info@alamia.es>';

const esEmailValido = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const emailEnlacePortalHTML = (enlace: string): string => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;line-height:1.6;color:#1e293b;background:#f8fafc;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
    <h1 style="margin:0 0 16px;font-size:20px;">Gestiona tu mantenimiento</h1>
    <p>Abre este enlace para ver tus facturas, cambiar la tarjeta o cancelar la suscripción:</p>
    <p style="margin:24px 0;">
      <a href="${enlace}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Abrir portal de gestión</a>
    </p>
    <p style="font-size:14px;color:#64748b;">
      El enlace caduca en 15 minutos y solo funciona una vez.
      Si no lo has pedido tú, ignora este mensaje: no se ha tocado nada de tu cuenta.
    </p>
    <p style="margin-top:24px;">— Jose Martínez · <a href="https://alamia.es">alamia.es</a></p>
  </div>
</body>
</html>`.trim();

/**
 * Envía por email un enlace de un solo uso al portal de facturación.
 *
 * La respuesta es siempre la misma exista o no una suscripción con ese email:
 * si distinguiese ambos casos, el endpoint serviría para averiguar quién es
 * cliente.
 */
export const handlePortalRequest = async (
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

  if (!env.REVIEWS_KV || !env.RESEND_API_KEY) {
    return jsonError('El envío de enlaces no está disponible ahora mismo', 503, corsRequest);
  }

  const respuestaGenerica = jsonSuccess(
    {
      message:
        'Si hay una suscripción activa con ese email, recibirás un enlace de acceso en unos minutos.',
    },
    200,
    corsRequest
  );

  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim();

    if (!email || !esEmailValido(email)) {
      return jsonError('Introduce un email válido', 400, corsRequest);
    }

    if (await isPortalRateLimited(env, email)) {
      return jsonError(
        'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
        429,
        corsRequest
      );
    }

    const stripe = getStripe(env.STRIPE_SECRET_KEY);
    const customerId = await customerIdFromEmail(stripe, email);

    // Sin suscripción no se envía nada, pero la respuesta no lo delata.
    if (!customerId) return respuestaGenerica;

    const token = createPortalToken();
    await env.REVIEWS_KV.put(
      portalTokenKey(await hashPortalToken(token)),
      JSON.stringify({ customerId }),
      { expirationTtl: PORTAL_TOKEN_TTL_SECONDS }
    );

    const enlace = `${getSiteUrl(corsRequest)}/mantenimiento/gestionar/?token=${token}`;
    await new Resend(env.RESEND_API_KEY).emails.send({
      from: PORTAL_EMAIL_REMITENTE,
      to: [normalizeEmail(email)],
      subject: 'Tu enlace para gestionar el mantenimiento',
      html: emailEnlacePortalHTML(enlace),
    });

    return respuestaGenerica;
  } catch (error) {
    console.error('[portal-request]', error);
    return jsonError('No se pudo enviar el enlace. Inténtalo de nuevo.', 500, corsRequest);
  }
};

/** Canjea el token (un solo uso) o el session_id de una compra recién hecha. */
const resolvePortalCustomerId = async (
  stripe: Stripe,
  env: Record<string, string | undefined>,
  token?: string,
  sessionId?: string
): Promise<string | null> => {
  if (isWellFormedPortalToken(token) && env.REVIEWS_KV) {
    const key = portalTokenKey(await hashPortalToken(token));
    const guardado = await env.REVIEWS_KV.get(key, 'json');
    // Se invalida antes de usarlo: un enlace reenviado o reutilizado ya no sirve.
    await env.REVIEWS_KV.delete(key);
    const customerId = (guardado as { customerId?: string } | null)?.customerId;
    if (customerId) return customerId;
  }

  if (sessionId?.startsWith('cs_')) {
    return customerIdFromSession(stripe, sessionId);
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
    const body = (await request.json()) as { token?: string; sessionId?: string };
    const token = body.token?.trim();
    const sessionId = body.sessionId?.trim();

    if (!token && !sessionId) {
      return jsonError(
        'Pide un enlace de acceso o abre esta página desde tu confirmación de pago',
        400,
        corsRequest
      );
    }

    const stripe = getStripe(env.STRIPE_SECRET_KEY);
    const customerId = await resolvePortalCustomerId(stripe, env, token, sessionId);

    if (!customerId) {
      return jsonError(
        'El enlace ha caducado o ya se ha usado. Pide uno nuevo desde esta página.',
        401,
        corsRequest
      );
    }

    const siteUrl = getSiteUrl(corsRequest);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/mantenimiento/gestionar/?portal=return`,
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
