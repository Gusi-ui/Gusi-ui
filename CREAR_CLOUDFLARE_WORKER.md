# 🚀 Crear Cloudflare Worker - Guía Paso a Paso

## ✅ DNS Completado

Todos tus registros DNS están correctos:
- ✅ SPF con MailChannels
- ✅ DMARC configurado
- ✅ MailChannels verificado
- ✅ MX records activos

**Ahora vamos a crear el Worker que procesará tu formulario.**

---

## 📋 Paso 1: Ir a Workers & Pages

1. **Abre Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com
   ```

2. **En el menú lateral izquierdo**, busca y haz clic en:
   ```
   Workers & Pages
   ```

3. **Haz clic en el botón:**
   ```
   Create Application
   ```
   (Botón azul, generalmente arriba a la derecha)

---

## 📋 Paso 2: Crear Worker

1. **Verás dos pestañas:**
   - Workers
   - Pages

2. **Selecciona la pestaña:** `Workers`

3. **Haz clic en:**
   ```
   Create Worker
   ```

4. **Te preguntará un nombre:**
   - Nombre sugerido: `formulario-contacto`
   - O el nombre que prefieras (sin espacios, usa guiones)

5. **Haz clic en:**
   ```
   Deploy
   ```
   (Se creará con código de ejemplo por defecto)

---

## 📋 Paso 3: Editar el Código del Worker

1. **Una vez desplegado**, verás un botón que dice:
   ```
   Edit Code
   ```
   (Arriba a la derecha)

2. **Haz clic en "Edit Code"**

3. **Se abrirá un editor de código** con algo de código JavaScript por defecto

4. **IMPORTANTE:**
   - **Selecciona TODO el código** (Cmd+A en Mac, Ctrl+A en Windows)
   - **Bórralo completamente** (Delete o Backspace)

5. **Abre el archivo en tu Mac:**
   ```
   /Volumes/Almacen/ProyectosIA/alamia/cloudflare-worker-mailchannels.js
   ```

6. **Copia TODO el contenido** del archivo (Cmd+A, Cmd+C)

7. **Pega el código** en el editor de Cloudflare (Cmd+V)

8. **Haz clic en:**
   ```
   Save and Deploy
   ```
   (Botón azul arriba a la derecha)

---

## 📋 Paso 4: Configurar Ruta Personalizada

Ahora tu Worker está creado, pero está en una URL tipo:
```
https://formulario-contacto.TU_SUBDOMINIO.workers.dev
```

Vamos a ponerlo en:
```
https://alamia.es/api/contacto
```

### 4.1. Ir a Settings

1. **En tu Worker**, haz clic en la pestaña:
   ```
   Settings
   ```
   (Arriba, junto a "Metrics" y "Logs")

### 4.2. Agregar Route

1. **Busca la sección:** `Triggers`

2. **Dentro de Triggers**, busca la subsección:
   ```
   Routes
   ```

3. **Haz clic en:**
   ```
   Add route
   ```

### 4.3. Configurar la Ruta

**Te pedirá dos campos:**

**Campo 1: Route**
```
alamia.es/api/contacto
```

**Campo 2: Zone**
- Selecciona del dropdown: `alamia.es`

**Haz clic en:**
```
Add route
```

---

## 📋 Paso 5: (Opcional) Configurar Rate Limiting

Esto evita spam limitando envíos por IP. Es opcional pero recomendado.

### 5.1. Crear KV Namespace

1. **En el menú lateral izquierdo de Cloudflare**, busca:
   ```
   Workers & Pages
   ```

2. **Luego en el menú superior**, haz clic en:
   ```
   KV
   ```

3. **Haz clic en:**
   ```
   Create a namespace
   ```

4. **Nombre del namespace:**
   ```
   RATE_LIMIT_CONTACTO
   ```

5. **Haz clic en:**
   ```
   Add
   ```

### 5.2. Vincular al Worker

1. **Vuelve a:** Workers & Pages → Tu worker (`formulario-contacto`)

2. **Pestaña:** `Settings`

3. **Busca la sección:** `Variables`

4. **Scroll hasta encontrar:** `KV Namespace Bindings`

5. **Haz clic en:**
   ```
   Add binding
   ```

**Te pedirá dos campos:**

**Variable name:**
```
RATE_LIMIT
```

**KV namespace:**
- Selecciona del dropdown: `RATE_LIMIT_CONTACTO`

**Haz clic en:**
```
Save and deploy
```

---

## ✅ Verificación

### Verificar que el Worker está activo:

1. **Abre tu navegador**

2. **Ve a la consola de desarrollador** (F12 o Cmd+Option+I en Mac)

3. **Pestaña "Console"**

4. **Pega este código:**

```javascript
fetch('https://alamia.es/api/contacto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Worker',
    email: 'test@test.com',
    service: 'web',
    message: 'Probando que el Worker funciona correctamente'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Respuesta:', data))
.catch(err => console.error('❌ Error:', err));
```

5. **Presiona Enter**

**Deberías ver:**
```json
✅ Respuesta: {
  success: true,
  message: "Mensaje enviado correctamente",
  service: "web"
}
```

**Y deberías recibir un email en `info@alamia.es`** (revisa también spam)

---

## 🐛 Si algo falla:

### Error CORS:
- Verifica que en el código del Worker, `CONFIG.dominio` sea `'alamia.es'` (línea ~13)

### Error 404:
- Verifica que la ruta esté configurada correctamente: `alamia.es/api/contacto`
- No debe tener `https://` en la configuración de ruta

### Email no llega:
1. Revisa spam en `info@alamia.es`
2. Ve a Workers → Tu worker → Logs (para ver errores en tiempo real)

### Ver logs en tiempo real:

1. **Worker → Pestaña "Logs"**
2. **Activa "Begin log stream"**
3. **Envía el formulario**
4. **Verás cada request en tiempo real**

---

## 📊 Estado Actual

Después de completar estos pasos:

- ✅ DNS configurado
- ✅ Worker creado y desplegado
- ✅ Código del Worker actualizado
- ✅ Ruta configurada: `alamia.es/api/contacto`
- ✅ (Opcional) Rate limiting configurado
- ✅ Worker probado y funcionando

---

## 🎯 Siguiente Paso: Probar el Formulario Real

1. **Espera 2-3 minutos** (GitHub Pages se actualiza con los cambios que subimos)

2. **Ve a:** https://alamia.es

3. **Baja al formulario de contacto**

4. **Llena todos los campos:**
   - Nombre: Tu nombre
   - Email: Tu email
   - Servicio: Selecciona uno
   - Mensaje: Escribe algo

5. **Envía el formulario**

6. **Deberías ver:**
   - Mensaje de éxito en el sitio
   - Redirección a página de agradecimiento
   - Email en `info@alamia.es` con tu mensaje

---

## 🎉 ¡Éxito!

Si recibes el email, ¡felicidades! Tu formulario ahora:

✅ Funciona sin terceros externos
✅ Usa tu propia infraestructura (Cloudflare)
✅ Envía emails a `info@alamia.es`
✅ Desde `no-reply@alamia.es`
✅ Sin límites de envíos
✅ 100% gratuito
✅ Control total del código

---

**Última actualización:** 2025-12-27
**Tiempo estimado:** 15-20 minutos
**Dificultad:** ⭐⭐⭐ Media
