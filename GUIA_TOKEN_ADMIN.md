# 🔐 Guía Paso a Paso: Configurar Token de Administrador

Esta guía te enseñará cómo generar y configurar un token seguro para el panel de administración de reseñas.

## 📚 ¿Qué es un Token y Por Qué lo Necesitamos?

Un **token** es como una contraseña especial que permite acceder al panel de administración. A diferencia de una contraseña normal, un token es:
- Más seguro (más largo y aleatorio)
- Más difícil de adivinar
- Se almacena de forma encriptada en Cloudflare

**¿Por qué lo necesitamos?**
- Proteger el panel de administración
- Solo tú (y quienes tengan el token) pueden aprobar/rechazar reseñas
- Evitar que cualquiera pueda modificar las reseñas

---

## 🎯 Paso 1: Generar un Token Seguro

Primero necesitamos crear un token aleatorio y seguro. Hay varias formas de hacerlo:

### Opción A: Usando OpenSSL (Recomendado - Mac/Linux)

**¿Qué es OpenSSL?**
OpenSSL es una herramienta que viene preinstalada en Mac y Linux para generar números aleatorios seguros.

**Pasos:**

1. **Abre la Terminal** (en Mac: `Cmd + Espacio`, escribe "Terminal")

2. **Navega a tu proyecto** (opcional, pero recomendado):
   ```bash
   cd /Volumes/Almacen/ProyectosIA/alamia
   ```

3. **Genera el token:**
   ```bash
   openssl rand -hex 32
   ```

4. **Copia el resultado** (será algo como: `a1b2c3d4e5f6...` de 64 caracteres)
   - Selecciona todo el texto
   - Copia con `Cmd + C` (Mac) o `Ctrl + C` (Linux)

**Ejemplo de salida:**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

✅ **¡Listo!** Ya tienes tu token generado. Guárdalo en un lugar seguro (pero no lo subas a Git).

---

### Opción B: Usando Node.js

Si tienes Node.js instalado:

1. **Abre la Terminal**

2. **Ejecuta:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Copia el resultado**

---

### Opción C: Generador Online (Si no tienes las herramientas anteriores)

1. Ve a: https://www.random.org/strings/
2. Configura:
   - **Length:** 64
   - **Character set:** Hexadecimal (0-9, a-f)
3. Haz clic en **"Generate Strings"**
4. Copia el resultado

⚠️ **Nota:** Los generadores online son menos seguros, úsalos solo si no tienes otra opción.

---

## 🔧 Paso 2: Configurar el Token en Cloudflare

Ahora vamos a guardar el token en Cloudflare de forma segura. Hay dos métodos:

### Método 1: Usando Wrangler CLI (Recomendado - Más Fácil)

**¿Qué es Wrangler?**
Wrangler es la herramienta de línea de comandos de Cloudflare. Ya la tienes instalada.

**Pasos:**

1. **Abre la Terminal**

2. **Asegúrate de estar en el directorio del proyecto:**
   ```bash
   cd /Volumes/Almacen/ProyectosIA/alamia
   ```

3. **Ejecuta el comando para guardar el secret:**
   ```bash
   wrangler secret put ADMIN_TOKEN
   ```

4. **Wrangler te pedirá que introduzcas el valor:**
   ```
   Enter the secret value: 
   ```

5. **Pega el token que generaste** (el de 64 caracteres)
   - Pega con `Cmd + V` (Mac) o `Ctrl + Shift + V` (Linux)
   - Presiona `Enter`

6. **Wrangler confirmará:**
   ```
   ✨ Successfully put secret ADMIN_TOKEN
   ```

✅ **¡Listo!** El token está guardado de forma segura en Cloudflare.

**¿Qué pasó?**
- Cloudflare encriptó el token
- Lo guardó como un "secret" (variable secreta)
- Solo el Worker puede acceder a él
- No se puede ver en el código ni en el dashboard

---

### Método 2: Desde el Dashboard de Cloudflare (Alternativa)

Si prefieres usar la interfaz web:

1. **Abre tu navegador** y ve a: https://dash.cloudflare.com

2. **Inicia sesión** en tu cuenta de Cloudflare

3. **Ve a Workers & Pages:**
   - En el menú lateral izquierdo, busca **"Workers & Pages"**
   - Haz clic

4. **Selecciona tu Worker:**
   - Busca **"formulario-contacto"**
   - Haz clic en él

5. **Ve a Settings (Configuración):**
   - En la parte superior, verás pestañas: **"Overview"**, **"Logs"**, **"Settings"**
   - Haz clic en **"Settings"**

6. **Busca la sección "Variables":**
   - Scroll hacia abajo
   - Busca **"Environment Variables"** o **"Secrets"**

7. **Agrega el secret:**
   - Haz clic en **"Add variable"** o **"Add secret"**
   - **Variable name:** `ADMIN_TOKEN`
   - **Value:** Pega tu token (el de 64 caracteres)
   - **IMPORTANTE:** Marca la casilla **"Encrypted"** o **"Secret"**
   - Haz clic en **"Save"** o **"Add"**

✅ **¡Listo!** El token está configurado.

---

## ✅ Paso 3: Verificar que el Token Está Configurado

Vamos a verificar que todo esté correcto:

### Verificación con Wrangler:

```bash
wrangler secret list
```

Esto mostrará todos los secrets configurados. Deberías ver `ADMIN_TOKEN` en la lista.

**Nota:** El valor NO se mostrará (por seguridad), solo el nombre.

### Verificación desde el Dashboard:

1. Ve a tu Worker → **Settings** → **Variables**
2. Busca **"Secrets"** o **"Environment Variables"**
3. Deberías ver `ADMIN_TOKEN` listado (pero sin mostrar el valor)

---

## 🚀 Paso 4: Desplegar el Worker

Ahora que el token está configurado, necesitamos desplegar el Worker para que los cambios surtan efecto:

### Opción A: Con Wrangler (Recomendado)

```bash
cd /Volumes/Almacen/ProyectosIA/alamia
wrangler deploy
```

**¿Qué hace este comando?**
- Sube el código del Worker a Cloudflare
- Vincula el secret `ADMIN_TOKEN` al Worker
- Activa el Worker en producción

**Salida esperada:**
```
⛅️ wrangler 4.54.0
─────────────────────────────────────────────
Total Upload: 319.83 KiB / gzip: 40.30 KiB
Your Worker has access to the following bindings:
Binding                                                Resource          
env.REVIEWS_KV (6d1616fd6ada4d109170b1e11a28ce2f)      KV Namespace      
env.ADMIN_TOKEN                                        Secret            

✨ Deployed successfully!
```

✅ **¡Perfecto!** El Worker está desplegado y tiene acceso al token.

---

### Opción B: Desde el Dashboard

1. Ve a tu Worker → **"Edit Code"**
2. Copia todo el contenido de `cloudflare-worker.js`
3. Pégalo en el editor
4. Haz clic en **"Save and Deploy"**

---

## 🧪 Paso 5: Probar el Panel de Administración

Ahora vamos a probar que todo funcione:

### 1. Abrir el Panel

**Opción A: Desde tu servidor local (desarrollo)**
```bash
# Si tienes un servidor local corriendo
open http://localhost:8000/admin-resenas.html
```

**Opción B: Subir a tu servidor**
- Sube `admin-resenas.html` a tu servidor
- Accede vía: `https://alamia.es/admin-resenas.html`

**Opción C: Abrir directamente**
- Abre `admin-resenas.html` en tu navegador (doble clic)

### 2. Autenticarte

1. **Verás un formulario** pidiendo el token
2. **Pega el token** que generaste (el de 64 caracteres)
3. **Haz clic en "Acceder"**

### 3. Verificar que Funciona

Si todo está bien:
- ✅ Verás el panel de administración
- ✅ Verás estadísticas (Total, Aprobadas, Pendientes)
- ✅ Verás las reseñas (si hay alguna)

Si hay error:
- ❌ "Token inválido" → El token no coincide o no está configurado
- ❌ "Panel no configurado" → El secret no está en Cloudflare
- ❌ Error de conexión → Verifica que el Worker esté desplegado

---

## 🔄 Paso 6: Cambiar el Token (Si es Necesario)

Si necesitas cambiar el token por seguridad:

1. **Genera un nuevo token** (Paso 1)

2. **Actualiza el secret:**
   ```bash
   wrangler secret put ADMIN_TOKEN
   ```
   - Pega el nuevo token cuando te lo pida

3. **Redespliega el Worker:**
   ```bash
   wrangler deploy
   ```

4. **Actualiza el token en el panel:**
   - Abre `admin-resenas.html`
   - Cierra sesión (si estás logueado)
   - Introduce el nuevo token

---

## 📝 Resumen Rápido

```bash
# 1. Generar token
openssl rand -hex 32

# 2. Configurar en Cloudflare
wrangler secret put ADMIN_TOKEN
# (pega el token cuando te lo pida)

# 3. Desplegar
wrangler deploy

# 4. Probar
# Abre admin-resenas.html e introduce el token
```

---

## ❓ Preguntas Frecuentes

### ¿Dónde guardo el token?

**Guárdalo en un lugar seguro:**
- ✅ Gestor de contraseñas (1Password, LastPass, etc.)
- ✅ Notas encriptadas
- ✅ Archivo de texto local (NO lo subas a Git)

**NO lo guardes:**
- ❌ En el código
- ❌ En repositorios Git
- ❌ En emails sin encriptar
- ❌ En documentos compartidos

### ¿Qué pasa si olvido el token?

1. Genera un nuevo token
2. Configúralo con `wrangler secret put ADMIN_TOKEN`
3. Redespliega el Worker

### ¿Puedo tener múltiples tokens?

No directamente. Solo puedes tener un `ADMIN_TOKEN` a la vez. Si necesitas múltiples administradores, comparte el mismo token de forma segura.

### ¿El token expira?

No, el token no expira automáticamente. Debes cambiarlo manualmente si sospechas que fue comprometido.

### ¿Es seguro guardar el token en localStorage del navegador?

El panel guarda el token en `localStorage` para comodidad, pero:
- ✅ Solo está en tu navegador local
- ✅ No se envía a ningún servidor excepto Cloudflare
- ⚠️ Si alguien tiene acceso a tu computadora, puede verlo
- 💡 Para mayor seguridad, no marques "Recordar" en navegadores compartidos

---

## 🎓 Conceptos Aprendidos

1. **Token:** Cadena aleatoria que actúa como contraseña
2. **Secret:** Variable encriptada en Cloudflare
3. **Wrangler:** Herramienta CLI de Cloudflare
4. **Deploy:** Subir código a producción
5. **OpenSSL:** Herramienta para generar números aleatorios seguros

---

## ✅ Checklist Final

- [ ] Token generado (64 caracteres hexadecimales)
- [ ] Token guardado en lugar seguro
- [ ] Secret configurado en Cloudflare (`ADMIN_TOKEN`)
- [ ] Worker desplegado
- [ ] Panel de administración accesible
- [ ] Autenticación funcionando
- [ ] Puedo ver las reseñas en el panel

---

**¡Felicidades!** 🎉 Ya sabes cómo configurar y usar el token de administrador. Tu sistema de reseñas está completamente seguro y listo para usar.
