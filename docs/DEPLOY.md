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
pnpm run build && pnpm preview
```

y revisar la consola del navegador: cualquier recurso bloqueado aparece como
`Refused to load...`. Si añades un servicio externo (un chat, un mapa, otra
pasarela), hay que declarar su origen en `construirCsp` o dejará de cargar.

### Pendiente en Cloudflare

Los navegadores **ignoran** estas directivas en `<meta>`, así que requieren una
Transform Rule de respuesta en el panel de Cloudflare (Rules → Transform Rules →
Modify Response Header), aplicada a `alamia.es/*`:

| Cabecera | Valor |
| --- | --- |
| `Content-Security-Policy` | `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

`X-Frame-Options: DENY` es equivalente a `frame-ancestors 'none'` y puede
añadirse también para navegadores antiguos.

## Cookies y analítica

Google Analytics **no se carga hasta que el visitante acepta** en el aviso de
`src/components/ui/CookieConsent.astro`. La decisión se guarda en
`localStorage` bajo `cookie-consent`. Para volver a ver el aviso:

```js
localStorage.removeItem('cookie-consent');
```
