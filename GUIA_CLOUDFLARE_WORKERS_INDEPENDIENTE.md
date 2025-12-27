# 🚀 Solución 100% Independiente: Cloudflare Workers + MailChannels

## 🎯 Por qué esta es la MEJOR solución para ti

### ✅ Sin terceros adicionales:
- **Cloudflare Workers** = Ya usas Cloudflare para DNS (no es un tercero nuevo)
- **MailChannels** = API gratuita específica para Cloudflare Workers
- **Tu código** = Control total, sin depender de Formspree/Web3Forms

### ✅ Ventajas:
- 100% gratuito (100,000 requests/día)
- Sin límites de envíos
- Emails desde `no-reply@alamia.es` (tu dominio)
- Código backend ejecutándose en Cloudflare
- No necesitas servidor/hosting
- Integrado con tu infraestructura actual

---

## 📋 Requisitos

- ✅ Cuenta de Cloudflare (ya la tienes)
- ✅ Dominio en Cloudflare (alamia.es - ya configurado)
- ✅ 30 minutos de tiempo

---

## 🛠️ PASO 1: Configurar Registros DNS para MailChannels

MailChannels requiere que agregues registros DNS para verificar que eres dueño del dominio.

### 1.1. Ir a DNS en Cloudflare

1. **Cloudflare Dashboard:** https://dash.cloudflare.com
2. Selecciona tu dominio: **alamia.es**
3. Menú izquierdo → **DNS** → **Records**

### 1.2. Agregar registro SPF

**Tipo:** TXT
**Name:** `@` (o `alamia.es`)
**Content:**
```
v=spf1 a mx include:relay.mailchannels.net ~all
```
**TTL:** Auto
**Proxy status:** DNS only (nube gris, NO naranja)

**Clic en "Save"**

### 1.3. Agregar registro DMARC (opcional pero recomendado)

**Tipo:** TXT
**Name:** `_dmarc`
**Content:**
```
v=DMARC1; p=quarantine; rua=mailto:info@alamia.es
```
**TTL:** Auto
**Proxy status:** DNS only (gris)

**Clic en "Save"**

### 1.4. Agregar Domain Lockdown (seguridad MailChannels)

Este registro evita que otros usen MailChannels con tu dominio.

**Tipo:** TXT
**Name:** `_mailchannels`
**Content:**
```
v=mc1 cfid=AQUI_TU_CLOUDFLARE_ACCOUNT_ID
```

**⚠️ IMPORTANTE:** Reemplaza `AQUI_TU_CLOUDFLARE_ACCOUNT_ID` con tu Account ID de Cloudflare.

**¿Dónde encontrar tu Account ID?**
- Cloudflare Dashboard → Cualquier página → Sidebar derecho
- O en la URL: `https://dash.cloudflare.com/ESTE_ES_TU_ACCOUNT_ID/alamia.es`

**Ejemplo:**
```
v=mc1 cfid=a1b2c3d4e5f6789012345678901234567890abcd
```

**TTL:** Auto
**Proxy status:** DNS only (gris)

**Clic en "Save"**

### 1.5. Verificar DNS (opcional)

Espera 5-10 minutos y verifica:

```bash
# En tu terminal (Mac/Linux):
dig TXT alamia.es
dig TXT _dmarc.alamia.es
dig TXT _mailchannels.alamia.es
```

Deberías ver los registros que agregaste.

---

## 🚀 PASO 2: Crear Cloudflare Worker

### 2.1. Ir a Workers & Pages

1. **Cloudflare Dashboard** → Workers & Pages
2. Clic en **"Create Application"**
3. Tab **"Workers"**
4. Clic en **"Create Worker"**

### 2.2. Configurar Worker

**Nombre del Worker:**
```
formulario-contacto
```

**Clic en "Deploy"** (se crea con código por defecto)

### 2.3. Editar código

1. Clic en **"Edit Code"** (arriba a la derecha)
2. **Borra TODO el código** que aparece
3. **Copia y pega** el contenido del archivo: `cloudflare-worker-mailchannels.js`
4. Clic en **"Save and Deploy"** (arriba a la derecha)

---

## 🔗 PASO 3: Configurar Ruta Personalizada

Por defecto, el Worker está en: `formulario-contacto.TU_SUBDOMINIO.workers.dev`

Vamos a ponerlo en: `https://alamia.es/api/contacto`

### 3.1. Agregar Route

1. En el Worker → **Settings** (pestaña)
2. Sección **"Triggers"**
3. Subsección **"Routes"** → Clic en **"Add route"**

### 3.2. Configurar

**Route:**
```
alamia.es/api/contacto
```

**Zone:**
```
alamia.es
```

**Clic en "Add route"**

Ahora tu Worker está disponible en:
```
https://alamia.es/api/contacto
```

---

## ⚙️ PASO 4: Configurar Rate Limiting (Opcional)

Esto evita spam limitando envíos por IP.

### 4.1. Crear KV Namespace

1. **Cloudflare Dashboard** → Workers & Pages → **KV**
2. Clic en **"Create a namespace"**
3. **Namespace Name:** `RATE_LIMIT_CONTACTO`
4. Clic en **"Add"**

### 4.2. Vincular al Worker

1. Ve a tu Worker: **formulario-contacto**
2. **Settings** → **Variables**
3. Scroll hasta **"KV Namespace Bindings"**
4. Clic en **"Add binding"**

**Variable name:**
```
RATE_LIMIT
```

**KV namespace:**
```
RATE_LIMIT_CONTACTO
```

**Clic en "Save and deploy"**

---

## 📝 PASO 5: Actualizar tu Formulario

### 5.1. Actualizar JavaScript

Edita `script.js` (línea ~481):

**CAMBIAR:**
```javascript
const formEndpoint = 'https://api.web3forms.com/submit';
```

**POR:**
```javascript
const formEndpoint = 'https://alamia.es/api/contacto';
```

### 5.2. Actualizar formDataObj

Edita `script.js` (línea ~452):

**CAMBIAR:**
```javascript
const formDataObj = {
    access_key: 'TU_WEB3FORMS_ACCESS_KEY_AQUI',
    name: sanitizedName,
    email: sanitizedEmail,
    service: sanitizedService,
    message: sanitizedMessage,
    subject: `Nuevo mensaje de contacto desde Gusi.dev - ${sanitizedService}`,
    from_name: 'Formulario Gusi.dev',
    replyto: sanitizedEmail,
    botcheck: ''
};
```

**POR:**
```javascript
const formDataObj = {
    name: sanitizedName,
    email: sanitizedEmail,
    service: sanitizedService,
    message: sanitizedMessage
    // Ya no necesitas access_key ni otros campos especiales
};
```

### 5.3. Actualizar HTML

Edita `index.html` (línea ~887):

**CAMBIAR:**
```html
<form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="TU_WEB3FORMS_ACCESS_KEY_AQUI">
```

**POR:**
```html
<form class="contact-form" action="https://alamia.es/api/contacto" method="POST">
    <!-- Ya no necesitas access_key -->
```

### 5.4. Actualizar campo honeypot

En `index.html`, el campo anti-spam debe llamarse `_gotcha`:

```html
<div style="display: none;">
    <label>No llenar este campo: <input name="_gotcha"></label>
</div>
```

---

## 🧪 PASO 6: Probar el Worker

### 6.1. Probar directamente el Worker

Antes de subir a GitHub, prueba que el Worker funcione:

**Opción A: Desde el navegador**

Abre la consola (F12) en cualquier página y ejecuta:

```javascript
fetch('https://alamia.es/api/contacto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Usuario',
    email: 'test@test.com',
    service: 'web',
    message: 'Este es un mensaje de prueba desde la consola'
  })
})
.then(r => r.json())
.then(data => console.log('Respuesta:', data))
.catch(err => console.error('Error:', err));
```

Deberías ver:
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "service": "web"
}
```

Y recibir un email en `info@alamia.es`.

### 6.2. Subir cambios a GitHub

```bash
git add index.html script.js
git commit -m "feat: integrar Cloudflare Workers para formulario"
git push origin main
```

### 6.3. Probar desde el sitio

1. Espera 2-3 minutos (GitHub Pages se actualiza)
2. Ve a https://alamia.es
3. Llena el formulario
4. Envía
5. Revisa `info@alamia.es` (y spam)

---

## 🐛 Solución de Problemas

### ❌ Error: "Failed to send email"

**Posibles causas:**

1. **Registros DNS no propagados:**
   - Espera 10-15 minutos
   - Verifica con `dig TXT _mailchannels.alamia.es`

2. **Account ID incorrecto:**
   - Verifica el registro `_mailchannels` TXT
   - Debe contener tu Account ID real de Cloudflare

3. **Worker mal configurado:**
   - Revisa los logs: Workers & Pages → formulario-contacto → Logs
   - Busca errores en tiempo real

### ❌ Error CORS

**Solución:** Verifica que en el código del Worker, `CONFIG.dominio` sea `'alamia.es'`

### ❌ Email no llega

1. **Revisa spam** en `info@alamia.es`
2. **Verifica registros DNS:**
   ```bash
   dig TXT alamia.es  # Debe mostrar SPF
   dig TXT _mailchannels.alamia.es  # Debe mostrar tu Account ID
   ```
3. **Logs del Worker:**
   - Dashboard → formulario-contacto → Logs
   - Busca errores de MailChannels

### ❌ Rate limit muy restrictivo

Si quieres más envíos por hora, edita el Worker:

```javascript
// Línea ~13
maxEnviosPorHora: 10  // Cambiar a 20, 50, etc.
```

Guarda y Deploy.

---

## 📊 Verificar que TODO Funciona

### Checklist:

- [ ] ✅ Registros DNS configurados (SPF, DMARC, _mailchannels)
- [ ] ✅ Worker creado y desplegado
- [ ] ✅ Ruta configurada: `alamia.es/api/contacto`
- [ ] ✅ KV namespace vinculado (opcional)
- [ ] ✅ Código del Worker actualizado
- [ ] ✅ `script.js` apunta al Worker
- [ ] ✅ `index.html` sin access_key
- [ ] ✅ Cambios en GitHub
- [ ] ✅ Formulario probado
- [ ] ✅ Email recibido en `info@alamia.es`

---

## 🎨 Personalización Avanzada

### Cambiar email remitente

En el Worker, línea ~12:

```javascript
emailRemitente: 'contacto@alamia.es',  // Cambiar aquí
nombreRemitente: 'Formulario Alamia',  // Y aquí
```

### Personalizar HTML del email

En el Worker, función `enviarEmailMailChannels`, edita la variable `htmlContent`.

### Agregar webhooks

Puedes enviar notificaciones a Slack, Discord, etc.:

```javascript
// Después de enviar email, agregar:
await fetch('https://hooks.slack.com/tu-webhook', {
  method: 'POST',
  body: JSON.stringify({
    text: `Nuevo mensaje de ${nombre} (${email})`
  })
});
```

---

## 📈 Monitoreo y Analytics

### Ver estadísticas del Worker

1. **Cloudflare Dashboard** → Workers & Pages → formulario-contacto
2. Tab **"Metrics"**
3. Verás:
   - Requests por día/hora
   - Errores
   - Duración promedio

### Logs en tiempo real

1. Tab **"Logs"**
2. Activar **"Live Logs"**
3. Envía el formulario
4. Verás cada request en tiempo real

---

## 💰 Costos

### Cloudflare Workers Free Plan:

- ✅ 100,000 requests/día (suficiente para ~3,000,000 al mes)
- ✅ 10ms de CPU por request
- ✅ KV: 100,000 lecturas/día, 1,000 escrituras/día

**Para un formulario de contacto:** MÁS que suficiente (gratis para siempre)

### MailChannels:

- ✅ 100% gratuito para Cloudflare Workers
- ✅ Sin límites de envíos
- ✅ Solo requiere verificación DNS

---

## 🔒 Seguridad

### Medidas implementadas:

1. ✅ **CORS** - Solo acepta requests de `alamia.es`
2. ✅ **Rate Limiting** - Máximo 10 envíos/hora por IP
3. ✅ **Honeypot** - Campo `_gotcha` anti-bots
4. ✅ **Sanitización** - Limpia datos antes de enviar
5. ✅ **Validación** - Verifica formato de email, longitud, etc.
6. ✅ **SPF/DMARC** - Previene suplantación de identidad

### Recomendaciones adicionales:

- Activar **Cloudflare WAF** (Web Application Firewall)
- Configurar **Cloudflare Bot Management** (plan Pro)
- Agregar **Turnstile** (CAPTCHA de Cloudflare - gratis)

---

## 🎉 Resultado Final

Tu stack ahora es:

```
┌─────────────────────────────────────────┐
│  Usuario → alamia.es (GitHub Pages)     │
│            ↓                              │
│  Formulario enviado a:                   │
│  https://alamia.es/api/contacto          │
│            ↓                              │
│  Cloudflare Worker (TU CÓDIGO)          │
│            ↓                              │
│  MailChannels API (gratuito)            │
│            ↓                              │
│  Email → info@alamia.es (Ionos) ✅      │
└─────────────────────────────────────────┘
```

### ✅ Beneficios:

- **100% independiente** - No dependes de Web3Forms, Formspree, etc.
- **Sin costos** - Todo gratuito
- **Tu código** - Control total
- **Cloudflare** - Infraestructura que ya usas
- **Sin límites** - Envíos ilimitados
- **Profesional** - Emails desde tu dominio

---

## 📚 Referencias

- **MailChannels Docs:** https://support.mailchannels.com/hc/en-us/articles/16918954360845
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **SPF Records:** https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/

---

## 🆘 Soporte

Si tienes problemas:

1. **Logs del Worker** - Primera parada para debugging
2. **DNS Check** - Verifica que los registros estén correctos
3. **Test con curl:**
   ```bash
   curl -X POST https://alamia.es/api/contacto \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","service":"web","message":"Mensaje de prueba desde curl"}'
   ```

---

**Última actualización:** 2025-12-27
**Dificultad:** ⭐⭐⭐ Media
**Tiempo:** 30 minutos
**Costo:** $0 (100% gratis)
