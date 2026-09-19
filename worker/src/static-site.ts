/**
 * Servir la web (dist/ de Astro) desde el binding ASSETS del Worker.
 */

type StaticEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ENVIRONMENT?: string;
};

// Cabeceras de seguridad de la web. Son las mismas que ponía la zona con GitHub
// Pages; la Transform Rule de Cloudflare sigue añadiendo CSP frame-ancestors y
// Referrer-Policy también a las respuestas del Worker.
export const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Sin payment=(): Stripe.js puede necesitar la Payment Request API.
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Política de caché de la web:
 * - /_astro/* lleva hash en el nombre → inmutable un año.
 * - HTML, sw.js y registerSW.js → siempre revalidar. Un HTML viejo en caché pide
 *   CSS/JS con hashes que ya no existen y la web sale sin estilos.
 * - Resto (imágenes, manifest…) → 1 hora.
 */
export const cacheControlFor = (pathname: string): string => {
  if (pathname.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  const isHtml = pathname.endsWith('/') || pathname.endsWith('.html') || !pathname.includes('.');
  if (isHtml || pathname === '/sw.js' || pathname === '/registerSW.js') return 'no-cache';
  return 'public, max-age=3600';
};

const withSecurityHeaders = (response: Response, env: StaticEnv): Response => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  // El entorno de pruebas no debe aparecer en buscadores.
  if (env.ENVIRONMENT === 'staging') response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
};

export const serveStatic = async (
  request: Request,
  env: StaticEnv,
  url: URL
): Promise<Response> => {
  const asset = await env.ASSETS.fetch(request);

  // Cloudflare añade la barra final con un 307; GitHub Pages usaba 301 y es lo
  // que conviene para SEO (trailingSlash: 'always').
  const location = asset.headers.get('Location');
  if (asset.status === 307 && location) {
    return withSecurityHeaders(
      new Response(null, { status: 301, headers: { Location: location } }),
      env
    );
  }

  const response = withSecurityHeaders(new Response(asset.body, asset), env);
  if (asset.ok || asset.status === 304) {
    response.headers.set('Cache-Control', cacheControlFor(url.pathname));
  }
  return response;
};
