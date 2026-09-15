/**
 * Enlaces de un solo uso para el portal de facturación de Stripe.
 *
 * Antes bastaba con enviar el email de un cliente para abrirle el portal, donde
 * se ven facturas y método de pago y se puede cancelar la suscripción. Conocer
 * un email no demuestra ser su titular, así que ahora el acceso exige recibir
 * un enlace en esa misma dirección.
 *
 * En KV solo se guarda el SHA-256 del token: quien pudiese leer el almacén no
 * obtendría un enlace utilizable.
 */

/** Ventana de validez del enlace. Corta porque llega por email y se usa al momento. */
export const PORTAL_TOKEN_TTL_SECONDS = 900;

const TOKEN_BYTES = 32;

/** Token aleatorio en base64url, apto para viajar en una query string. */
export const createPortalToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_BYTES));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const hashPortalToken = async (token: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/** Clave en KV. Recibe el hash, nunca el token en claro. */
export const portalTokenKey = (hash: string): string => `portal:token:${hash}`;

/** Rechaza pronto lo que no puede ser un token nuestro, sin tocar KV. */
export const isWellFormedPortalToken = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{40,64}$/.test(value);
