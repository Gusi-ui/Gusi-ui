# Configuración del Sistema de Reseñas con Cloudflare Workers

## ✅ Cambios Realizados

El sistema de reseñas ha sido migrado de `localStorage` a un backend completo usando Cloudflare Workers y Cloudflare KV.

### Archivos Modificados

1. **`cloudflare-worker.js`**: Extendido para manejar reseñas (GET y POST)
2. **`script.js`**: Modificado para usar API en lugar de localStorage
3. **`wrangler.toml`**: Actualizado con nueva ruta y KV namespace

## 🚀 Configuración en Cloudflare

### Paso 1: Crear KV Namespace para Reseñas

Hay dos formas de crear un KV namespace:

#### Método A: Desde el Dashboard (Recomendado)

1. Ve a **Cloudflare Dashboard** → **Workers & Pages**
2. En el menú lateral izquierdo, busca **"Storage"** o **"KV"**
   - Si no lo ves directamente, puede estar dentro de **"Workers"** → **"KV"**
   - O busca en el menú superior: **"Storage"** → **"KV"**
3. Haz clic en **"Create a namespace"** o **"Add namespace"**
4. **Nombre del namespace:**
   ```
   REVIEWS_KV
   ```
5. Haz clic en **"Add"** o **"Create"**
6. **¡IMPORTANTE!** Copia el **ID del namespace** (aparece después de crearlo, algo como `abc123def456...`)

#### Método B: Desde el Worker directamente

1. Ve a tu Worker: **formulario-contacto**
2. Pestaña **Settings** → **Variables**
3. Scroll hasta **KV Namespace Bindings**
4. Haz clic en **"Add binding"** o **"Create namespace"**
5. Si aparece la opción de crear, crea el namespace desde ahí
6. **Nombre:** `REVIEWS_KV`
7. Copia el **ID** que se genera

#### Método C: Usando Wrangler CLI (Alternativa)

Si prefieres usar la línea de comandos:

```bash
wrangler kv:namespace create "REVIEWS_KV"
```

Esto te dará el ID que necesitas agregar a `wrangler.toml`.

### Paso 2: Vincular KV Namespace al Worker

1. Ve a tu Worker: **formulario-contacto**
2. Pestaña **Settings** (Configuración)
3. En el menú lateral o en la página, busca **"Variables"** o **"Bindings"**
4. Scroll hasta encontrar **"KV Namespace Bindings"** o **"KV Bindings"**
5. Haz clic en **"Add binding"** o **"Edit bindings"**
6. Configura:
   - **Variable name:** `REVIEWS_KV` (debe coincidir exactamente)
   - **KV namespace:** Selecciona `REVIEWS_KV` del dropdown
   - Si no aparece en el dropdown, pega el **ID del namespace** directamente
7. Haz clic en **"Save"** o **"Save and Deploy"**

**Nota:** Si no encuentras la opción "KV Namespace Bindings", busca:
- **"Resources"** → **"KV Namespaces"**
- **"Bindings"** → **"KV"**
- O simplemente **"KV"** en el menú de Settings

### Paso 3: Actualizar wrangler.toml

Edita el archivo `wrangler.toml` y descomenta/actualiza la sección de KV:

```toml
kv_namespaces = [
  { binding = "RATE_LIMIT", id = "TU_RATE_LIMIT_KV_ID" },
  { binding = "REVIEWS_KV", id = "TU_REVIEWS_KV_ID" }
]
```

**Reemplaza `TU_REVIEWS_KV_ID`** con el ID que copiaste en el Paso 1.

**Ejemplo:**
```toml
kv_namespaces = [
  { binding = "REVIEWS_KV", id = "abc123def456ghi789" }
]
```

**Nota:** Si ya tienes un `RATE_LIMIT` configurado, mantén ambas líneas. Si no, solo necesitas la línea de `REVIEWS_KV`.

### Paso 4: Agregar Ruta para Reseñas

1. Ve a tu Worker: **formulario-contacto**
2. Pestaña **Settings** → **Triggers** (o **"Routes"** directamente)
3. Busca la sección **"Routes"** o **"Custom Domains"**
4. Haz clic en **"Add route"** o **"Add custom domain"**
5. Configura:
   - **Route:** `alamia.es/api/resenas`
   - **Zone:** Selecciona `alamia.es` del dropdown
6. Haz clic en **"Add route"** o **"Save"**

**Alternativa:** Si ya tienes configurada la ruta `/api/contacto`, la misma configuración debería funcionar para `/api/resenas` ya que ambas están en el mismo Worker. Solo asegúrate de que el Worker esté desplegado.

### Paso 5: Desplegar el Worker

Si usas Wrangler CLI:

```bash
wrangler deploy
```

O desde el dashboard de Cloudflare:
1. Ve a tu Worker
2. Haz clic en **"Edit Code"**
3. Copia el contenido de `cloudflare-worker.js`
4. Haz clic en **"Save and Deploy"**

## 📡 Endpoints de la API

### GET /api/resenas

Obtiene todas las reseñas.

**Respuesta exitosa:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "1234567890",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "company": "Mi Empresa",
      "rating": 5,
      "message": "Excelente servicio...",
      "date": "2024-01-15T10:30:00.000Z",
      "verified": false
    }
  ],
  "total": 1
}
```

### POST /api/resenas

Crea una nueva reseña.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "company": "Mi Empresa",
  "rating": 5,
  "message": "Excelente servicio...",
  "consent": true
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Reseña publicada correctamente",
  "review": {
    "id": "1234567890",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "company": "Mi Empresa",
    "rating": 5,
    "message": "Excelente servicio...",
    "date": "2024-01-15T10:30:00.000Z",
    "verified": false
  }
}
```

**Errores posibles:**
- `400`: Datos inválidos
- `429`: Demasiadas reseñas (rate limit)
- `500`: Error del servidor

## 🔒 Seguridad y Rate Limiting

### Rate Limiting

- **Reseñas por hora por IP:** 3 (configurable en `CONFIG.maxResenasPorHora`)
- **Contactos por hora por IP:** 10 (configurable en `CONFIG.maxEnviosPorHora`)

### Validaciones

El sistema valida:
- ✅ Nombre (mínimo 2 caracteres)
- ✅ Email (formato válido)
- ✅ Valoración (1-5 estrellas)
- ✅ Mensaje (10-1000 caracteres)
- ✅ Consentimiento (requerido)

### Sanitización

Todos los campos de texto se sanitizan para prevenir:
- XSS (Cross-Site Scripting)
- Inyección de código
- Caracteres peligrosos

## 🧪 Pruebas

### Probar GET /api/resenas

```bash
curl https://alamia.es/api/resenas
```

### Probar POST /api/resenas

```bash
curl -X POST https://alamia.es/api/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "rating": 5,
    "message": "Esta es una reseña de prueba",
    "consent": true
  }'
```

## 🔄 Migración desde localStorage

Si tenías reseñas en localStorage y quieres migrarlas al backend:

1. Abre la consola del navegador (F12)
2. Ejecuta este código:

```javascript
// Obtener reseñas de localStorage
const localReviews = JSON.parse(localStorage.getItem('site-reviews') || '[]');

// Enviar cada reseña a la API
for (const review of localReviews) {
  try {
    await fetch('https://alamia.es/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: review.name,
        email: review.email,
        company: review.company,
        rating: review.rating,
        message: review.message,
        consent: true
      })
    });
    console.log(`✅ Reseña de ${review.name} migrada`);
  } catch (error) {
    console.error(`❌ Error migrando reseña de ${review.name}:`, error);
  }
}

console.log('✅ Migración completada');
```

## 📊 Almacenamiento

Las reseñas se almacenan en Cloudflare KV con la clave:
```
reviews:all
```

**Límites de KV:**
- Tamaño máximo por valor: 25 MB
- Tamaño máximo por clave: 512 bytes
- Operaciones de escritura: 1,000 por segundo
- Operaciones de lectura: Sin límite práctico

## 🛠️ Mantenimiento

### Ver reseñas almacenadas

Puedes ver las reseñas desde el dashboard de Cloudflare:
1. Workers & Pages → KV → Tu namespace
2. Busca la clave `reviews:all`

### Limpiar todas las reseñas

Desde el dashboard de Cloudflare KV, elimina la clave `reviews:all`.

### Backup de reseñas

Puedes hacer backup descargando el valor de la clave `reviews:all` desde el dashboard.

## ⚠️ Notas Importantes

1. **KV es eventualmente consistente**: Los cambios pueden tardar unos segundos en propagarse
2. **Sin base de datos relacional**: No hay relaciones entre datos
3. **Sin búsqueda avanzada**: Para búsquedas complejas, considera migrar a D1 (SQL) o Durable Objects
4. **Límites de tamaño**: Si tienes más de 10,000 reseñas, considera paginación

## 🚀 Próximos Pasos (Opcional)

1. **Moderación**: Agregar sistema de aprobación de reseñas
2. **Verificación de email**: Enviar email de confirmación antes de publicar
3. **Búsqueda y filtros**: Agregar búsqueda por nombre, rating, etc.
4. **Paginación**: Para sitios con muchas reseñas
5. **Analytics**: Tracking de reseñas más detallado

## 📝 Soporte

Si encuentras problemas:
1. Revisa los logs del Worker en Cloudflare Dashboard
2. Verifica que el KV namespace esté vinculado correctamente
3. Asegúrate de que las rutas estén configuradas
4. Verifica los CORS headers
