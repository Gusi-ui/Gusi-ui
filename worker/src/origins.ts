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

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

/**
 * Devuelve el origen normalizado si está permitido, o null si no lo está.
 * Acepta producción por coincidencia exacta y localhost/127.0.0.1 por HTTP
 * en cualquier puerto, para que `pnpm dev` siga funcionando.
 */
export const matchAllowedOrigin = (value: string | null | undefined): string | null => {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.origin === PRODUCTION_ORIGIN) return url.origin;
  if (url.protocol === 'http:' && LOCAL_HOSTNAMES.has(url.hostname)) return url.origin;

  return null;
};

/** Origen a devolver en Access-Control-Allow-Origin. Cae a producción si no hay match. */
export const resolveCorsOrigin = (request: Request | null): string =>
  matchAllowedOrigin(request?.headers.get('Origin')) ?? PRODUCTION_ORIGIN;
