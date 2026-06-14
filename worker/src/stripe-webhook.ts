import Stripe from 'stripe';
import { Resend } from 'resend';

const EMAIL_DESTINO = 'info@alamia.es';
const EMAIL_REMITENTE = 'info@alamia.es';
const NOMBRE_REMITENTE = 'Pagos alamia.es';

const getStripe = (secretKey: string) =>
  new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

const formatAmount = (amountTotal: number | null, currency: string | null): string => {
  if (amountTotal == null) return '—';
  const value = (amountTotal / 100).toFixed(2);
  return `${value} ${(currency || 'eur').toUpperCase()}`;
};

const generarEmailPagoHTML = (
  productTitle: string,
  billingLabel: string,
  amount: string,
  customerEmail: string,
  sessionId: string
): string => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;line-height:1.6;color:#1e293b;background:#f8fafc;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:22px;">✅ Pago confirmado</h1>
    </div>
    <div style="padding:24px;">
      <p><strong>Servicio:</strong> ${productTitle}</p>
      <p><strong>Modalidad:</strong> ${billingLabel}</p>
      <p><strong>Importe:</strong> ${amount}</p>
      <p><strong>Cliente:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
      <p style="font-size:12px;color:#64748b;margin-top:24px;">Sesión: ${sessionId}</p>
    </div>
  </div>
</body>
</html>`.trim();

const generarEmailClienteHTML = (productTitle: string, billingLabel: string, amount: string): string => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;line-height:1.6;color:#1e293b;background:#f8fafc;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:22px;">¡Gracias por tu compra!</h1>
    </div>
    <div style="padding:24px;">
      <p>Hemos recibido tu pago correctamente.</p>
      <p><strong>${productTitle}</strong> — ${billingLabel}</p>
      <p><strong>Total:</strong> ${amount}</p>
      <p>Te contactaremos en breve para los siguientes pasos.</p>
      <p style="margin-top:24px;">— Jose Martínez · <a href="https://alamia.es">alamia.es</a></p>
    </div>
  </div>
</body>
</html>`.trim();

const sendPaymentEmails = async (
  env: Record<string, string | undefined>,
  session: Stripe.Checkout.Session
): Promise<void> => {
  if (!env.RESEND_API_KEY) return;

  const customerEmail = session.customer_details?.email;
  if (!customerEmail) return;

  const productTitle = session.metadata?.productTitle || 'Servicio alamia.es';
  const billingPlan = session.metadata?.billingPlan;
  const billingLabel = billingPlan === 'monthly' ? 'Suscripción mensual' : 'Pago único';
  const amount = formatAmount(session.amount_total, session.currency);
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: `${NOMBRE_REMITENTE} <${EMAIL_REMITENTE}>`,
    to: [EMAIL_DESTINO],
    reply_to: customerEmail,
    subject: `Nuevo pago — ${productTitle}`,
    html: generarEmailPagoHTML(productTitle, billingLabel, amount, customerEmail, session.id),
  });

  await resend.emails.send({
    from: `${NOMBRE_REMITENTE} <${EMAIL_REMITENTE}>`,
    to: [customerEmail],
    subject: `Confirmación de pago — ${productTitle}`,
    html: generarEmailClienteHTML(productTitle, billingLabel, amount),
  });
};

const isEventProcessed = async (
  env: Record<string, string | undefined>,
  eventId: string
): Promise<boolean> => {
  if (!env.REVIEWS_KV) return false;
  const key = `stripe:event:${eventId}`;
  return (await env.REVIEWS_KV.get(key)) !== null;
};

const markEventProcessed = async (
  env: Record<string, string | undefined>,
  eventId: string
): Promise<void> => {
  if (!env.REVIEWS_KV) return;
  await env.REVIEWS_KV.put(`stripe:event:${eventId}`, '1', { expirationTtl: 604800 });
};

const handleCheckoutCompleted = async (
  env: Record<string, string | undefined>,
  session: Stripe.Checkout.Session
): Promise<void> => {
  if (session.payment_status !== 'paid' && session.status !== 'complete') return;
  await sendPaymentEmails(env, session);
};

export const handleStripeWebhook = async (
  request: Request,
  env: Record<string, string | undefined>
): Promise<Response> => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Webhook not configured', { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe(env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('[webhook] signature verification failed', error);
    return new Response('Invalid signature', { status: 400 });
  }

  if (await isEventProcessed(env, event.id)) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(env, event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_failed':
        console.warn('[webhook] invoice payment failed', event.id);
        break;
      case 'customer.subscription.deleted':
        console.warn('[webhook] subscription cancelled', event.id);
        break;
      default:
        break;
    }

    await markEventProcessed(env, event.id);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[webhook] handler error', error);
    return new Response('Webhook handler error', { status: 500 });
  }
};
