# 📧 Configuración de EmailJS para el Formulario de Contacto

## 🚀 Pasos para Configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate con tu email `info@gusi.dev`
3. Confirma tu cuenta

### 2. Configurar un Servicio de Email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"** (recomendado)
4. Conecta tu cuenta de Gmail `info@gusi.dev`
5. **Copia el Service ID** (ej: `service_abc123`)

### 3. Crear una Plantilla de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa esta plantilla:

```
Asunto: Nuevo mensaje de contacto desde tu sitio web

Contenido:
Hola,

Has recibido un nuevo mensaje de contacto desde tu sitio web:

Nombre: {{from_name}}
Email: {{from_email}}
Servicio: {{service}}
Mensaje: {{message}}

---
Enviado desde tu sitio web Gusi.dev
```

4. **Copia el Template ID** (ej: `template_xyz789`)

### 4. Obtener la Clave Pública
1. Ve a **"Account"** → **"General"**
2. **Copia tu Public Key** (ej: `user_abc123def456`)

### 5. Actualizar el Código
Reemplaza en `script.js` las siguientes líneas:

```javascript
// Línea 160: Reemplazar YOUR_PUBLIC_KEY
emailjs.init('TU_PUBLIC_KEY_AQUI');

// Línea 199: Reemplazar YOUR_SERVICE_ID y YOUR_TEMPLATE_ID
emailjs.send('TU_SERVICE_ID_AQUI', 'TU_TEMPLATE_ID_AQUI', templateParams)
```

## 📋 Ejemplo de Configuración Completa

```javascript
// Inicializar EmailJS
emailjs.init('user_abc123def456');

// Enviar email
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

## ✅ Verificación
1. Abre tu sitio web
2. Llena el formulario de contacto
3. Envía el mensaje
4. Revisa tu email `info@gusi.dev`

## 🔧 Características Implementadas
- ✅ Validación de campos
- ✅ Indicador de carga
- ✅ Manejo de errores
- ✅ Notificaciones de éxito/error
- ✅ Redirección a WhatsApp
- ✅ Limpieza del formulario

## 📞 Soporte
Si tienes problemas, revisa la consola del navegador (F12) para ver los errores.
