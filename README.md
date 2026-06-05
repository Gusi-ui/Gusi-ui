# alamia.es — Portfolio Freelance

Sitio portfolio de Jose Martínez (Gusi), migrado a **Astro 6** con backend en **Cloudflare Workers**.

## Quick start

```bash
pnpm install
pnpm dev          # Frontend → http://localhost:4321
pnpm worker:dev   # API → http://localhost:8787
pnpm build        # Build estático → dist/
```

## Documentación

- [Setup](docs/SETUP.md)
- [Deploy](docs/DEPLOY.md)
- [Arquitectura](docs/ARCHITECTURE.md)

## Stack

- **Frontend:** Astro 6, React islands, Tailwind CSS v4
- **Backend:** Cloudflare Worker + KV + Resend
- **Package manager:** pnpm 10
- **Deploy:** GitHub Pages (frontend) + Wrangler (API)
