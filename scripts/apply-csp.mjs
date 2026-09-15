/**
 * Inserta una Content-Security-Policy en cada página generada.
 *
 * Va por <meta http-equiv> y no por cabecera porque el sitio se sirve desde
 * GitHub Pages, que no permite definir cabeceras propias. Eso deja fuera
 * frame-ancestors, report-uri y sandbox, que los navegadores ignoran en <meta>;
 * para esas hace falta una Transform Rule en Cloudflare (ver docs/DEPLOY.md).
 *
 * Los hashes se calculan después del build porque Astro emite scripts inline de
 * hidratación que cambian según las islas de cada página. Escribirlos a mano
 * significaría romper la CSP en el siguiente cambio sin enterarse.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

/** Scripts inline ejecutables: sin src y sin type de datos como application/ld+json. */
const SCRIPT_INLINE = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const TIPO_DE_DATOS = /type\s*=\s*["'][^"']*(?:json|template)[^"']*["']/i;

export const hashesDeScriptsInline = (html) => {
  const hashes = new Set();

  for (const [, atributos, cuerpo] of html.matchAll(SCRIPT_INLINE)) {
    if (TIPO_DE_DATOS.test(atributos) || cuerpo.trim() === '') continue;
    hashes.add(`'sha256-${createHash('sha256').update(cuerpo, 'utf8').digest('base64')}'`);
  }

  return [...hashes];
};

export const construirCsp = (hashes) =>
  [
    "default-src 'self'",
    // googletagmanager solo se descarga si el visitante acepta cookies.
    `script-src 'self' ${hashes.join(' ')} https://www.googletagmanager.com https://js.stripe.com`,
    // React y Astro escriben atributos style; sin 'unsafe-inline' no pintan.
    "style-src 'self' 'unsafe-inline'",
    // googleusercontent sirve las fotos de autor de las reseñas de Google.
    "img-src 'self' data: https://*.googleusercontent.com https://*.google-analytics.com https://www.googletagmanager.com",
    "font-src 'self'",
    // GA4 reparte la recogida entre varios subdominios regionales.
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://api.stripe.com",
    'frame-src https://js.stripe.com https://hooks.stripe.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

const META_EXISTENTE = /<meta http-equiv="Content-Security-Policy"[^>]*>\s*/i;

export const insertarCsp = (html) => {
  const csp = construirCsp(hashesDeScriptsInline(html));
  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;

  const limpio = html.replace(META_EXISTENTE, '');
  if (!limpio.includes('<head>')) {
    throw new Error('La página no tiene <head>, no se puede insertar la CSP');
  }
  return limpio.replace('<head>', `<head>${meta}`);
};

const ficherosHtml = async (directorio) => {
  const entradas = await readdir(directorio, { withFileTypes: true });
  const rutas = await Promise.all(
    entradas.map((entrada) => {
      const ruta = join(directorio, entrada.name);
      if (entrada.isDirectory()) return ficherosHtml(ruta);
      return entrada.name.endsWith('.html') ? [ruta] : [];
    })
  );
  return rutas.flat();
};

const main = async () => {
  const paginas = await ficherosHtml(DIST);

  if (paginas.length === 0) {
    throw new Error('No se encontró ningún HTML en dist/; ¿se ha ejecutado el build?');
  }

  await Promise.all(
    paginas.map(async (pagina) => {
      const html = await readFile(pagina, 'utf8');
      await writeFile(pagina, insertarCsp(html), 'utf8');
    })
  );

  console.log(`CSP aplicada a ${paginas.length} páginas`);
};

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
