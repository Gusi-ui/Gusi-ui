# Arquitectura — alamia.es

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Astro 6 + React islands + Tailwind CSS v4 (`@tailwindcss/vite`) |
| Estilos legacy | `src/styles/legacy.css` (migrado desde styles.css) |
| Backend | Cloudflare Worker (`worker/src/index.ts`) |
| Email | Resend |
| Storage | Cloudflare KV (`REVIEWS_KV`) |
| Package manager | pnpm 10 |
| Deploy FE | GitHub Pages → alamia.es |
| Deploy BE | Wrangler → Cloudflare |

## Estructura

```
src/
  components/   # Astro (sections, ui, seo)
  islands/      # React (ContactForm, ReviewsSection, ThemeToggle, etc.)
  layouts/      # BaseLayout, SimplePageLayout
  pages/        # Rutas Astro
  data/         # services, projects, gracias
  lib/          # utils, constants, reviews, notifications
worker/
  src/index.ts  # API: /api/contacto, /api/resenas, /api/admin/resenas
public/         # Assets estáticos, demos, CNAME
```

## APIs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/contacto` | POST | Formulario → Resend |
| `/api/resenas` | GET/POST | Reseñas públicas + Google Places |
| `/api/admin/resenas` | GET/POST | Moderación (Bearer token) |
