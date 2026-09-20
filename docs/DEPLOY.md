# Deploy — alamia.es

La web (`dist/` de Astro) y la API (`/api/*`) las sirve un único Cloudflare Worker
(`worker/`, static assets con `run_worker_first`). El DNS no cambia: las rutas del
Worker tienen prioridad sobre el origen.

| Rama      | Entorno    | URL                     | Worker                        |
| --------- | ---------- | ----------------------- | ----------------------------- |
| `develop` | staging    | https://dev.alamia.es   | `formulario-contacto-staging` |
| `main`    | producción | https://alamia.es       | `formulario-contacto`         |

## Flujo de trabajo

1. Rama `feat/*` desde `develop` → PR a `develop`. El CI (`ci.yml`) pasa lint, build y tests.
2. Merge a `develop` → `deploy.yml` despliega staging y pasa las pruebas de humo.
3. Probar en https://dev.alamia.es (pagos con tarjetas de prueba de Stripe).
4. PR `develop → main` con **merge commit** → `deploy.yml` despliega producción.

`deploy.yml` compila la web con las variables del entorno, despliega con
`wrangler deploy --env staging` (develop) o `--env=""` (main) y lanza
`scripts/smoke.mjs` contra la URL desplegada. También en local:

```bash
pnpm build && pnpm worker:dev   # web + API en http://localhost:8787
pnpm smoke http://localhost:8787
```

## Volver atrás (producción)

GitHub Pages sigue publicándose desde `main` (`ci.yml`, job `deploy-frontend`)
como respaldo temporal. Para volver a servir la web desde Pages, dejar en
`worker/wrangler.toml` solo la ruta `*alamia.es/api/*` y desplegar (o cambiarla
en el panel: Workers → formulario-contacto → Settings → Domains & Routes).

## Entornos y datos

- Cada entorno tiene su propio KV `REVIEWS_KV`: nunca compartir el de producción.
- `SITE_ORIGIN` (vars de `wrangler.toml`) fija el origen permitido en CORS y las
  URLs de retorno de Stripe.
- Staging responde con `X-Robots-Tag: noindex, nofollow`.
- Stripe: staging usa **modo prueba** (`sk_test_`/`pk_test_`, precios y webhook de
  prueba hacia `https://dev.alamia.es/api/payments/webhook`). Nunca claves `live` en staging.

## Secretos

GitHub Actions:

- `CLOUDFLARE_API_TOKEN` — deploy del Worker (repositorio).
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` — `pk_live_` en el repositorio; el entorno de
  GitHub `staging` tiene la suya `pk_test_`. El deploy falla si no corresponden.

Worker (con el wrangler global, en tu terminal; el valor se escribe allí):

```bash
wrangler secret put NOMBRE --config worker/wrangler.toml               # producción
wrangler secret put NOMBRE --config worker/wrangler.toml --env staging # staging
```

`ADMIN_TOKEN, GOOGLE_API_KEY, GOOGLE_PLACE_ID, SMTP_USER, SMTP_PASS,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_DESARROLLO_WEB_ONETIME,
STRIPE_PRICE_OPTIMIZACION_WEB_ONETIME, STRIPE_PRICE_BACKEND_APIS_ONETIME,
STRIPE_PRICE_MANTENIMIENTO_MONTHLY`

## Correo

Sale por SMTP del buzón de IONOS `info@alamia.es` (`worker/src/mail.ts`,
`smtp.ionos.es:465`), con `SMTP_USER` (la dirección completa) y `SMTP_PASS`.
Opcionales como vars: `SMTP_HOST`, `SMTP_PORT` (587 usa STARTTLS). En staging el
asunto lleva el prefijo `[staging]`. Si falta la configuración, el formulario
responde «Servicio de email no disponible» y el webhook de Stripe no envía nada.

## Post-deploy checklist

- [ ] `pnpm smoke <url>` en verde
- [ ] Formulario de contacto responde en `/api/contacto`
- [ ] Reseñas cargan en `#testimonios`
- [ ] Checkout Stripe carga (en staging: pago completo con tarjeta de prueba)
- [ ] `sitemap-index.xml` accesible
- [ ] PWA service worker registrado
- [ ] Sin excepciones nuevas en los logs del Worker (ver abajo)

## Logs y errores del Worker

`[observability]` está activo en los dos entornos (`worker/wrangler.toml`), así
que hay **histórico**: Workers → el Worker → Observability, con 3 días de
retención en el plan Free. Sin esto solo quedaba `wrangler tail`, que es en
directo y no sirve para saber qué pasó ayer.

Qué mirar: excepciones (`outcome` distinto de `ok`) y **1101**, que es una
excepción sin capturar del Worker. Un 1101 esporádico no se nota desde fuera —
la web parece funcionar — pero significa que alguna petición está fallando.

```sh
# En directo, para una prueba concreta
pnpm exec wrangler tail --config worker/wrangler.toml            # producción
pnpm exec wrangler tail --config worker/wrangler.toml --env staging
```

## Cabeceras de seguridad

Desde el 2026-09-19 la web la sirve el Worker, así que las cabeceras vienen de
dos sitios:

- **El Worker** (`worker/src/static-site.ts`, `SECURITY_HEADERS`), solo en las
  páginas y ficheros de la web: `Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` y `Cache-Control`. En staging, además,
  `X-Robots-Tag: noindex, nofollow`.
- **La Transform Rule de Cloudflare** (ver abajo), que se aplica a todo lo que
  sale de la zona, incluidas las respuestas de la API.

Política de caché (`cacheControlFor`): HTML, `sw.js` y `registerSW.js` en
`no-cache`; `/_astro/*` inmutable un año; el resto, una hora. El HTML nunca
debe cachearse: uno viejo pediría CSS/JS con hashes que ya no existen.

### Content-Security-Policy

Se inyecta como `<meta http-equiv>` en cada página desde
`scripts/apply-csp.mjs`, que corre automáticamente tras `astro build`. Los
hashes de los scripts inline se calculan a partir del HTML generado, así que no
hay que mantenerlos a mano.

Para comprobarla tras un cambio:

```bash
pnpm run preview:csp
```

y revisar la consola del navegador: cualquier recurso bloqueado aparece como
`Refused to load...`.

`preview:csp` añade `http://localhost:8787` a `connect-src`, porque en local la
web llama al worker de desarrollo mientras que en producción la API está en el
mismo origen. Sin eso la consola se llenaría de errores que no ocurren en
producción y las reseñas no cargarían. **Ese build no debe publicarse**; el
`pnpm run build` normal genera la política estricta. Si añades un servicio externo (un chat, un mapa, otra
pasarela), hay que declarar su origen en `construirCsp` o dejará de cargar.

### Cabeceras desde Cloudflare

Los navegadores **ignoran** `frame-ancestors` en `<meta>`, así que la pone una
Transform Rule de respuesta en el panel de Cloudflare (zona `alamia.es` →
Reglas → Regla de transformación de encabezado de respuesta), con
*Establecer estático*. Aplicada el 2026-09-16 y verificada de nuevo con el
Worker el 2026-09-19 (llega tanto a la web como a `/api/*`):

| Cabecera | Valor |
| --- | --- |
| `Content-Security-Policy` | `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` (equivalente para navegadores antiguos) |

Esta CSP convive con la del `<meta>`: el navegador aplica ambas, y esta solo
restringe quién puede incrustar la web en un iframe. `Referrer-Policy`,
`Permissions-Policy` y `X-Frame-Options` coinciden con las del Worker; la regla
se aplica después y, al ser *Establecer*, gana si alguna vez difieren. **Si el
Worker llegara a enviar su propia `Content-Security-Policy` en cabecera, esta
regla la sustituiría**: habría que añadir `frame-ancestors` a la del Worker y
quitarla de aquí. Si cambias la regla, no hay nada en el repo que lo refleje;
actualiza esta tabla. Para comprobarla:

```bash
curl -sI https://alamia.es/ | grep -iE 'content-security|referrer|permissions|x-frame'
```

### Scripts que inyecta Cloudflare

Cloudflare añade al HTML scripts que no salen del build, así que la CSP no los
conoce:

- **Web Analytics** (`static.cloudflareinsights.com`): permitido en
  `construirCsp`.
- **JavaScript Detections** (`/cdn-cgi/challenge-platform/...`): un script
  inline cuyo contenido cambia en cada petición, así que no admite hash. La CSP
  lo bloquea. Solo alimenta la detección de bots de Cloudflare y no afecta a
  los visitantes. **En el plan Free no se puede desactivar**: sigue inyectándose
  aunque se apague Bot Fight Mode (comprobado el 2026-09-16). La solución de
  Cloudflare es un `nonce` en una CSP enviada como **cabecera** HTTP: Cloudflare
  lo copia a su script. Con GitHub Pages era imposible; con el Worker ya se
  puede (mover la CSP del `<meta>` a cabecera con nonce por petición y
  ajustar la Transform Rule, ver arriba). Mientras tanto se acepta el error en
  consola; no relajar la CSP con `'unsafe-inline'` por esto.

### Bot Fight Mode

Está **activado** en la zona. En el plan Free desafía (403 con
`cf-mitigated: challenge`) a peticiones desde IPs de centros de datos, como
los runners de GitHub Actions, y no admite excepciones con reglas WAF. Por eso
`scripts/smoke.mjs` trata el desafío como aviso y prueba otra página. No afecta
a los visitantes, y el webhook de Stripe sí llega: comprobado el 2026-09-19 con
un pago de prueba en staging (misma zona). Si algún día fallaran las entregas
del webhook con 403, este sería el primer sospechoso.

## Cookies y analítica

Google Analytics **no se carga hasta que el visitante acepta** en el aviso de
`src/components/ui/CookieConsent.astro`. La decisión se guarda en
`localStorage` bajo `cookie-consent`. Para volver a ver el aviso:

```js
localStorage.removeItem('cookie-consent');
```
