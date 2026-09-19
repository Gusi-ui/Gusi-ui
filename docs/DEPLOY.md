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

## Cabeceras de seguridad

El sitio se sirve desde **GitHub Pages**, que no permite definir cabeceras
propias. `public/_headers` es un fichero de Cloudflare Pages / Netlify y **nunca
llegó a aplicarse**: durante meses declaró `X-Frame-Options`, `Referrer-Policy`
y `Cache-Control: immutable` sin que ninguna llegase al navegador. Se eliminó
para no seguir dando una falsa sensación de protección.

Lo que sí llega hoy lo pone GitHub Pages por su cuenta:
`Strict-Transport-Security` y `X-Content-Type-Options`.

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

Los navegadores **ignoran** estas directivas en `<meta>`, así que las pone una
Transform Rule de respuesta en el panel de Cloudflare (zona `alamia.es` →
Reglas → Regla de transformación de encabezado de respuesta), con
*Establecer estático*. Aplicada y verificada el 2026-09-16:

| Cabecera | Valor |
| --- | --- |
| `Content-Security-Policy` | `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` (equivalente para navegadores antiguos) |

Esta CSP convive con la del `<meta>`: el navegador aplica ambas, y esta solo
restringe quién puede incrustar la web en un iframe. Si cambias la regla, no
hay nada en el repo que lo refleje; actualiza esta tabla. Para comprobarla:

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
  aunque se apague Bot Fight Mode (comprobado el 2026-09-16), y la única
  solución que da Cloudflare es un `nonce` en cabecera HTTP, que GitHub Pages no
  permite. Se acepta el error en consola; no relajar la CSP con
  `'unsafe-inline'` por esto. Bot Fight Mode se deja activado.

## Cookies y analítica

Google Analytics **no se carga hasta que el visitante acepta** en el aviso de
`src/components/ui/CookieConsent.astro`. La decisión se guarda en
`localStorage` bajo `cookie-consent`. Para volver a ver el aviso:

```js
localStorage.removeItem('cookie-consent');
```
