# Deploy — alamia.es

## Frontend (GitHub Pages)

El CI despliega automáticamente `dist/` a GitHub Pages con dominio `alamia.es` (CNAME en `public/CNAME`).

Manual:

```bash
pnpm build
# Subir contenido de dist/ a gh-pages
```

## Backend (Cloudflare Worker)

```bash
pnpm deploy:worker
```

Rutas configuradas: `*alamia.es/api/*`

## Secrets requeridos en GitHub Actions

- `CLOUDFLARE_API_TOKEN` — para deploy del Worker
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` — clave publicable Stripe (`pk_test_` o `pk_live_`)
- `GITHUB_TOKEN` — automático para GitHub Pages

## Post-deploy checklist

- [ ] Formulario de contacto responde en `/api/contacto`
- [ ] Reseñas cargan en `#testimonios`
- [ ] Checkout Stripe funciona en `#servicios`
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
  lo bloquea. Solo alimenta la detección de bots de Cloudflare; si se quiere,
  se desactiva en Seguridad → Bots.

## Cookies y analítica

Google Analytics **no se carga hasta que el visitante acepta** en el aviso de
`src/components/ui/CookieConsent.astro`. La decisión se guarda en
`localStorage` bajo `cookie-consent`. Para volver a ver el aviso:

```js
localStorage.removeItem('cookie-consent');
```
