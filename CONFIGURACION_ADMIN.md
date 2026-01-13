# Configuración del Panel de Administración

## 🔐 Configurar Token de Administrador

El panel de administración requiere un token de seguridad para acceder. Sigue estos pasos:

### Paso 1: Generar un Token Seguro

Puedes generar un token seguro de varias formas:

**Opción A: Usando Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Opción B: Usando OpenSSL**
```bash
openssl rand -hex 32
```

**Opción C: Generador Online**
- Ve a: https://www.random.org/strings/
- Genera una cadena de 64 caracteres alfanuméricos

### Paso 2: Configurar el Token en Cloudflare

**Método 1: Usando Wrangler CLI (Recomendado)**
```bash
cd /Volumes/Almacen/ProyectosIA/alamia
wrangler secret put ADMIN_TOKEN
```

Cuando te lo pida, pega el token que generaste.

**Método 2: Desde el Dashboard de Cloudflare**
1. Ve a **Workers & Pages** → **formulario-contacto**
2. Pestaña **Settings** → **Variables**
3. Scroll hasta **Environment Variables** o **Secrets**
4. Haz clic en **"Add variable"** o **"Add secret"**
5. **Variable name:** `ADMIN_TOKEN`
6. **Value:** Pega tu token
7. Marca como **"Encrypted"** o **"Secret"**
8. **Save**

### Paso 3: Acceder al Panel

1. Abre `admin-resenas.html` en tu navegador
   - O súbelo a tu servidor y accede vía: `https://alamia.es/admin-resenas.html`
2. Introduce el token que configuraste
3. Haz clic en **"Acceder"**

El token se guardará en `localStorage` para futuras sesiones.

## 🛡️ Seguridad

### Buenas Prácticas

1. **Token Fuerte:**
   - Usa al menos 32 caracteres
   - Combina letras, números y caracteres especiales
   - No uses palabras comunes o información personal

2. **No Compartir:**
   - El token es como una contraseña
   - No lo compartas públicamente
   - No lo subas a repositorios Git

3. **Rotación:**
   - Cambia el token periódicamente
   - Si sospechas que fue comprometido, cámbialo inmediatamente

4. **HTTPS:**
   - Asegúrate de que el panel solo sea accesible vía HTTPS
   - No uses el panel en conexiones públicas sin VPN

### Cambiar el Token

Si necesitas cambiar el token:

1. Genera un nuevo token
2. Configúralo en Cloudflare (reemplaza el anterior)
3. Despliega el Worker: `wrangler deploy`
4. Los usuarios del panel necesitarán volver a autenticarse

## 📋 Funcionalidades del Panel

### Ver Reseñas

- **Pendientes:** Reseñas que esperan aprobación
- **Aprobadas:** Reseñas publicadas
- **Todas:** Todas las reseñas (incluyendo rechazadas)

### Moderar Reseñas

1. Revisa la reseña pendiente
2. Haz clic en **"Aprobar"** para publicarla
3. O haz clic en **"Rechazar"** para eliminarla

### Buscar y Filtrar

- **Búsqueda:** Por nombre, email, empresa o mensaje
- **Filtro por rating:** Selecciona 1-5 estrellas
- **Filtro por estado:** Usa las pestañas (Pendientes/Aprobadas/Todas)

## 🔧 Solución de Problemas

### Error: "Token inválido"

- Verifica que el token esté configurado correctamente en Cloudflare
- Asegúrate de que el Worker esté desplegado después de configurar el token
- Intenta cerrar sesión y volver a autenticarte

### Error: "Panel de administración no configurado"

- El token `ADMIN_TOKEN` no está configurado en Cloudflare
- Configúralo siguiendo el Paso 2

### No puedo ver las reseñas

- Verifica que el KV namespace `REVIEWS_KV` esté vinculado
- Revisa los logs del Worker en Cloudflare Dashboard
- Verifica que la ruta `/api/admin/resenas` esté funcionando

### Las reseñas no se aprueban

- Verifica que el Worker tenga permisos de escritura en KV
- Revisa los logs del Worker para ver errores
- Asegúrate de que el token tenga los permisos correctos

## 📡 API de Administración

El panel usa estos endpoints:

### GET /api/admin/resenas

Obtiene todas las reseñas (requiere autenticación).

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta:**
```json
{
  "success": true,
  "all": [...],
  "approved": [...],
  "pending": [...],
  "stats": {
    "total": 10,
    "approved": 7,
    "pending": 3
  }
}
```

### POST /api/admin/resenas

Modera una reseña (aprobar o rechazar).

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```

**Body:**
```json
{
  "action": "approve",  // o "reject"
  "reviewId": "1234567890"
}
```

## 🚀 Despliegue

Después de configurar el token:

```bash
wrangler deploy
```

O desde el dashboard:
1. Edit Code
2. Save and Deploy

## 📝 Notas

- El panel es solo para administradores
- Las reseñas rechazadas no se eliminan, solo se marcan como rechazadas
- Puedes ver todas las reseñas (incluyendo rechazadas) en la pestaña "Todas"
- El token se almacena localmente en el navegador para comodidad
