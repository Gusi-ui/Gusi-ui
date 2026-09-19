import { describe, it, expect } from 'vitest';
import { cacheControlFor, serveStatic } from '../worker/src/static-site';

const assetsReturning = (response: Response) => ({
  ASSETS: { fetch: async () => response },
});

const serve = (path: string, response: Response, environment = 'production') => {
  const url = new URL(`https://alamia.es${path}`);
  return serveStatic(
    new Request(url),
    { ...assetsReturning(response), ENVIRONMENT: environment },
    url
  );
};

describe('cacheControlFor', () => {
  it('HTML y service worker siempre se revalidan', () => {
    for (const path of ['/', '/servicios/', '/gracias', '/404.html', '/sw.js', '/registerSW.js']) {
      expect(cacheControlFor(path)).toBe('no-cache');
    }
  });

  it('los assets con hash son inmutables', () => {
    expect(cacheControlFor('/_astro/index.Ab12Cd.css')).toBe('public, max-age=31536000, immutable');
  });

  it('el resto se cachea una hora', () => {
    expect(cacheControlFor('/favicon.ico')).toBe('public, max-age=3600');
    expect(cacheControlFor('/manifest.webmanifest')).toBe('public, max-age=3600');
  });
});

describe('serveStatic', () => {
  it('convierte el 307 de la barra final en 301', async () => {
    const res = await serve(
      '/servicios',
      new Response(null, { status: 307, headers: { Location: '/servicios/' } })
    );
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('/servicios/');
  });

  it('pone cabeceras de seguridad y caché, y noindex solo en staging', async () => {
    const prod = await serve('/', new Response('<html></html>', { status: 200 }));
    expect(prod.headers.get('Cache-Control')).toBe('no-cache');
    expect(prod.headers.get('X-Frame-Options')).toBe('DENY');
    expect(prod.headers.get('X-Robots-Tag')).toBeNull();

    const staging = await serve('/', new Response('<html></html>', { status: 200 }), 'staging');
    expect(staging.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('no marca como cacheable una página 404', async () => {
    const res = await serve('/no-existe/', new Response('404', { status: 404 }));
    expect(res.status).toBe(404);
    expect(res.headers.get('Cache-Control')).toBeNull();
  });
});
