# Setup — alamia.es

## Requisitos

- Node.js 20+ (recomendado 22)
- pnpm 10+ (ver sección de instalación abajo)
- Cuenta Cloudflare (Worker + KV)
- Cuenta Resend (emails)

## Instalar pnpm en macOS (si `corepack enable` falla con EACCES)

Node instalado en `/usr/local` suele requerir permisos de administrador. Tienes **3 opciones**:

### Opción A — Una sola vez con contraseña de admin (más simple)

```bash
sudo corepack enable
sudo corepack prepare pnpm@10.12.1 --activate
pnpm --version
```

### Opción B — Sin sudo (recomendada): prefijo npm en tu carpeta de usuario

```bash
mkdir -p ~/.npm-global/bin
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
npm install -g pnpm@10.12.1
pnpm --version
```

### Opción C — Sin instalar pnpm globalmente

```bash
npx pnpm@10.12.1 install
npx pnpm@10.12.1 dev
```

Usa siempre la misma variante (`pnpm` o `npx pnpm@10.12.1`) en todos los comandos del proyecto.

## Instalación

```bash
pnpm install
```

## Desarrollo local

```bash
# Frontend Astro (puerto 4321)
pnpm dev

# Backend Worker (puerto 8787)
# Requiere worker/.dev.vars con RESEND_API_KEY (ver abajo)
pnpm worker:dev
```

### Secrets en desarrollo local (`worker/.dev.vars`)

`wrangler dev` **no** usa los secrets de producción automáticamente. Crea el archivo local:

```bash
cd worker
cp .dev.vars.example .dev.vars
# Edita .dev.vars con tu RESEND_API_KEY real
cd ..
pnpm worker:dev
```

El archivo `.dev.vars` está en `.gitignore` y no se sube a GitHub.

## Variables y secrets del Worker

```bash
cd worker
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler secret put ADMIN_TOKEN
pnpm exec wrangler secret put GOOGLE_API_KEY    # opcional
pnpm exec wrangler secret put GOOGLE_PLACE_ID   # opcional
```

## Build

```bash
pnpm build    # genera dist/
pnpm preview  # previsualizar build
pnpm test     # ejecutar tests
```
