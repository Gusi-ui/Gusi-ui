/**
 * Validación de orígenes para CORS y para cualquier URL que el worker
 * construya a partir de la petición.
 *
 * La comparación es por host exacto, nunca por prefijo: `startsWith('http://localhost')`
 * acepta `http://localhost.dominio-atacante.com`, que es un origen registrable por
 * cualquiera. Ese origen se reflejaba en Access-Control-Allow-Origin y, peor, acababa
 * en la success_url de Stripe Checkout, filtrando el session_id a un tercero.
 */

export const PRODUCTION_ORIGIN = 'https://alamia.es';

/**
 * Origen público del entorno (variable SITE_ORIGIN de wrangler.toml):
 * https://alamia.es en producción y https://dev.alamia.es en staging.
 * Solo se acepta un origen https exacto; cualquier otra cosa cae a producción.
 */
export const siteOriginFrom = (env: { SITE_ORIGIN?: string } | null | undefined): string => {
  const value = env?.SITE_ORIGIN;
  if (!value) return PRODUCTION_ORIGIN;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && url.origin === value) return url.origin;
  } catch {
    // Valor mal escrito: se ignora.
  }
  return PRODUCTION_ORIGIN;
};

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

/**
 * Devuelve el origen normalizado si está permitido, o null si no lo está.
 * Acepta el origen del entorno por coincidencia exacta y localhost/127.0.0.1 por HTTP
 * en cualquier puerto, para que `pnpm dev` siga funcionando.
 */
export const matchAllowedOrigin = (
  value: string | null | undefined,
  siteOrigin: string = PRODUCTION_ORIGIN
): string | null => {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.origin === siteOrigin) return url.origin;
  if (url.protocol === 'http:' && LOCAL_HOSTNAMES.has(url.hostname)) return url.origin;

  return null;
};

/** Origen a devolver en Access-Control-Allow-Origin. Cae al del entorno si no hay match. */
export const resolveCorsOrigin = (
  request: Request | null,
  siteOrigin: string = PRODUCTION_ORIGIN
): string => matchAllowedOrigin(request?.headers.get('Origin'), siteOrigin) ?? siteOrigin;
