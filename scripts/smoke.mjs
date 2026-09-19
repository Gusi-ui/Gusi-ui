/**
 * Pruebas de humo contra una URL desplegada (o `wrangler dev`):
 *   node scripts/smoke.mjs https://dev.alamia.es
 *
 * Comprueba web, caché, redirecciones, 404 y la API de solo lectura. No envía
 * formularios ni crea pagos.
 */

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.error('Uso: node scripts/smoke.mjs <url base>');
  process.exit(2);
}

const { hostname } = new URL(base);
const isProduction = hostname === 'alamia.es';
const isStaging = hostname === 'dev.alamia.es';
const fallos = [];

const get = (path, init = {}) =>
  fetch(`${base}${path}`, {
    redirect: 'manual',
    ...init,
    headers: { 'User-Agent': 'alamia-smoke', ...init.headers },
  });

const comprobar = (nombre, ok, detalle = '') => {
  console.log(`${ok ? '✔' : '✘'} ${nombre}${detalle ? ` — ${detalle}` : ''}`);
  if (!ok) fallos.push(nombre);
};

const home = await get('/');
const html = await home.text();
comprobar(
  'portada 200 HTML',
  home.status === 200 && /text\/html/.test(home.headers.get('content-type') ?? ''),
  `${home.status}`
);
comprobar(
  'portada sin caché',
  home.headers.get('cache-control') === 'no-cache',
  home.headers.get('cache-control') ?? ''
);

const css = html.match(/\/_astro\/[^"']+\.css/)?.[0];
if (css) {
  const res = await get(css);
  comprobar(
    'CSS de la portada existe e inmutable',
    res.status === 200 && /immutable/.test(res.headers.get('cache-control') ?? ''),
    `${css} ${res.status}`
  );
} else {
  comprobar('la portada enlaza su CSS', false);
}

const sw = await get('/sw.js');
comprobar(
  'sw.js sin caché',
  sw.status === 200 && sw.headers.get('cache-control') === 'no-cache',
  `${sw.status}`
);

for (const [desde, hasta] of [
  ['/servicios', '/servicios/'],
  ['/gracias.html', '/gracias/'],
]) {
  const res = await get(desde);
  const location = res.headers.get('location') ?? '';
  comprobar(
    `${desde} → 301 ${hasta}`,
    res.status === 301 && location.endsWith(hasta),
    `${res.status} ${location}`
  );
}

const noExiste = await get('/esta-pagina-no-existe/');
comprobar(
  '404 con página propia',
  noExiste.status === 404 && /text\/html/.test(noExiste.headers.get('content-type') ?? ''),
  `${noExiste.status}`
);

const resenas = await get('/api/resenas', { headers: { Origin: base } });
const challenge = resenas.headers.get('cf-mitigated') === 'challenge';
comprobar(
  '/api/resenas 200 JSON',
  resenas.status === 200 && /json/.test(resenas.headers.get('content-type') ?? ''),
  challenge ? `${resenas.status} (desafío de Cloudflare: ¿Bot Fight Mode?)` : `${resenas.status}`
);
comprobar(
  'CORS del entorno',
  resenas.headers.get('access-control-allow-origin') === base,
  resenas.headers.get('access-control-allow-origin') ?? ''
);

const robots = home.headers.get('x-robots-tag');
if (isStaging) comprobar('staging con noindex', robots === 'noindex, nofollow', robots ?? '');
if (isProduction) {
  comprobar('producción indexable', robots === null, robots ?? '');
  const www = await fetch('https://www.alamia.es/servicios/?a=1', { redirect: 'manual' });
  comprobar(
    'www → 301 sin www',
    www.status === 301 && www.headers.get('location') === 'https://alamia.es/servicios/?a=1',
    `${www.status} ${www.headers.get('location')}`
  );
}

if (fallos.length) {
  console.error(`\n${fallos.length} comprobación(es) fallida(s)`);
  process.exit(1);
}
console.log('\nTodo OK');
