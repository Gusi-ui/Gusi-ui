# Guía Rápida: Crear KV Namespace en Cloudflare

## 🎯 Objetivo
Crear un KV namespace llamado `REVIEWS_KV` para almacenar las reseñas.

## 📍 Ubicación en el Dashboard

La interfaz de Cloudflare puede variar, pero el KV namespace generalmente está en uno de estos lugares:

### Opción 1: Menú Principal
1. **Cloudflare Dashboard** (página principal)
2. En el menú lateral izquierdo, busca:
   - **"Workers & Pages"** → **"KV"**
   - O directamente **"Storage"** → **"KV"**

### Opción 2: Desde el Worker
1. Ve a **Workers & Pages**
2. Selecciona tu Worker: **formulario-contacto**
3. Pestaña **Settings**
4. Busca **"Variables"** o **"Bindings"**
5. Dentro, busca **"KV Namespace Bindings"**
6. Haz clic en **"Create namespace"** o **"Add binding"**

### Opción 3: Búsqueda Directa
1. En el dashboard de Cloudflare, usa la barra de búsqueda (arriba)
2. Busca: **"KV"** o **"Workers KV"**
3. Selecciona la opción que aparezca

## 🔧 Pasos Detallados

### Si encuentras la sección KV:

1. **Clic en "Create a namespace"** o **"Add namespace"**
2. **Nombre:** `REVIEWS_KV`
3. **Clic en "Add"** o **"Create"**
4. **Copia el ID** que aparece (ejemplo: `abc123def456ghi789`)

### Si NO encuentras la sección KV:

**Usa Wrangler CLI** (más confiable):

```bash
# Asegúrate de estar en el directorio del proyecto
cd /Volumes/Almacen/ProyectosIA/alamia

# Crear el namespace
wrangler kv:namespace create "REVIEWS_KV"
```

Esto te dará una salida como:
```
🌀  Creating namespace with title "REVIEWS_KV"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "REVIEWS_KV", id = "abc123def456ghi789" }
```

**Copia el ID** y úsalo en el siguiente paso.

## ✅ Verificar que se Creó

1. Ve a **Workers & Pages** → **KV** (o Storage → KV)
2. Deberías ver `REVIEWS_KV` en la lista
3. Haz clic en él para ver el ID

## 🔗 Vincular al Worker

Una vez creado el namespace:

1. Ve a tu Worker: **formulario-contacto**
2. **Settings** → **Variables**
3. **KV Namespace Bindings** → **Add binding**
4. **Variable name:** `REVIEWS_KV`
5. **KV namespace:** Selecciona `REVIEWS_KV` del dropdown
6. **Save**

## 📝 Actualizar wrangler.toml

Edita `wrangler.toml` y agrega/actualiza:

```toml
kv_namespaces = [
  { binding = "REVIEWS_KV", id = "TU_ID_AQUI" }
]
```

Reemplaza `TU_ID_AQUI` con el ID que copiaste.

## 🚀 Desplegar

```bash
wrangler deploy
```

O desde el dashboard:
1. Worker → **Edit Code**
2. Copia el código de `cloudflare-worker.js`
3. **Save and Deploy**

## ❓ ¿Aún no encuentras KV?

1. **Verifica tu plan de Cloudflare:**
   - KV está disponible en el plan **Free** y superiores
   - Si estás en un plan muy básico, puede no estar disponible

2. **Busca en diferentes lugares:**
   - **Workers** → **KV**
   - **Storage** → **KV**
   - **R2** (a veces está junto con otros servicios de almacenamiento)

3. **Usa Wrangler CLI:**
   - Es la forma más confiable y funciona siempre
   - No depende de la interfaz web

4. **Contacta soporte:**
   - Si nada funciona, puede ser un problema de permisos de cuenta
   - Verifica que tengas permisos de administrador

## 🎓 Recursos

- Documentación oficial: https://developers.cloudflare.com/kv/
- Guía de Wrangler: https://developers.cloudflare.com/workers/wrangler/commands/#kv
