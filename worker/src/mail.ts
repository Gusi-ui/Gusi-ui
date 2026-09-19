/**
 * Envío de correo por SMTP del buzón de IONOS (info@alamia.es) con TCP sockets
 * de Cloudflare. Sustituye a Resend: envía a cualquier destinatario (clientes
 * incluidos), sin coste y sin tocar el DNS (el SPF ya incluye IONOS).
 *
 * IONOS solo acepta como remitente el buzón autenticado, así que el `from`
 * siempre es SMTP_USER; el nombre visible sí cambia según el correo.
 */

import { WorkerMailer } from 'worker-mailer';

export type MailEnv = {
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  ENVIRONMENT?: string;
};

export type Mail = {
  to: string;
  subject: string;
  html: string;
  fromName: string;
  replyTo?: string;
};

export const isMailConfigured = (env: MailEnv): boolean => Boolean(env.SMTP_USER && env.SMTP_PASS);

/**
 * Envía uno o varios correos por una sola conexión SMTP. Lanza si no hay
 * configuración o si el servidor rechaza alguno.
 */
export const sendMail = async (env: MailEnv, mails: Mail | Mail[]): Promise<void> => {
  if (!env.SMTP_USER || !env.SMTP_PASS) throw new Error('SMTP no configurado');

  const port = Number(env.SMTP_PORT) || 465;
  const mailer = await WorkerMailer.connect({
    host: env.SMTP_HOST || 'smtp.ionos.es',
    port,
    // 465 = TLS directo; 587 = STARTTLS.
    secure: port === 465,
    startTls: port !== 465,
    credentials: { username: env.SMTP_USER, password: env.SMTP_PASS },
    authType: ['plain', 'login'],
    socketTimeoutMs: 15_000,
    responseTimeoutMs: 15_000,
  });

  // Los correos de staging se distinguen en la bandeja de entrada.
  const prefijo = env.ENVIRONMENT === 'staging' ? '[staging] ' : '';

  try {
    for (const mail of Array.isArray(mails) ? mails : [mails]) {
      await mailer.send({
        from: { name: mail.fromName, email: env.SMTP_USER },
        to: mail.to,
        reply: mail.replyTo,
        subject: `${prefijo}${mail.subject}`,
        html: mail.html,
      });
    }
  } finally {
    await mailer.close();
  }
};
