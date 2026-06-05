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
- `GITHUB_TOKEN` — automático para GitHub Pages

## Post-deploy checklist

- [ ] Formulario de contacto responde en `/api/contacto`
- [ ] Reseñas cargan en `#testimonios`
- [ ] `sitemap-index.xml` accesible
- [ ] PWA service worker registrado
