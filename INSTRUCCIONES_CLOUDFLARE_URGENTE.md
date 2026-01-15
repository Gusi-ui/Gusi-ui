# 🚨 INSTRUCCIONES URGENTES: SOLUCIÓN ERROR RESEÑAS

Hola, he detectado exactamente por qué fallan las reseñas. El error `Unexpected token '<'` ocurre porque **GitHub Pages** está respondiendo en lugar de tu **Cloudflare Worker**.

Para solucionarlo, necesitas realizar 2 cambios críticos en tu panel de Cloudflare. Son rápidos pero **obligatorios**.

---

## 1️⃣ PASO 1: Activar el Proxy (Nube Naranja) ☁️🧡

Para que los Workers funcionen en tus rutas, el tráfico **DEBE** pasar por Cloudflare.

1.  Ve a [Cloudflare Dashboard](https://dash.cloudflare.com) > Selecciona `alamia.es`.
2.  En el menú lateral, ve a **DNS** > **Records**.
3.  Busca los registros **A** (que apuntan a IPs como `185.199...`) y el **CNAME** `www`.
4.  Si la nube está **GRIS (DNS Only)**, haz clic en **Edit** y cambia el "Proxy status" a **Proxied** (Nube Naranja).
5.  **Guardar**.

> **⚠️ IMPORTANTE:** Sin esto, el Worker NUNCA se ejecutará en `alamia.es/api/...`.

---

## 2️⃣ PASO 2: Configurar la Ruta del Worker 🛣️

He actualizado la configuración local, pero debes asegurarte de que en Cloudflare coincida.

1.  En Cloudflare, ve a **Workers & Pages**.
2.  Entra en tu worker: `formulario-contacto`.
3.  Ve a **Settings** (Pestaña superior) > **Triggers** (Menú lateral o sección).
4.  Baja hasta **Routes**.
5.  Haz clic en **Add route**.
6.  Configura EXACTAMENTE así:
    *   **Route:** `*alamia.es/api/*`
    *   **Zone:** `alamia.es`
7.  Haz clic en **Add route**.

> **Nota:** Los asteriscos `*` son cruciales. Esto asegura que capture `https://alamia.es/api/resenas`, `https://www.alamia.es/api/resenas`, etc.

---

## 3️⃣ PASO 3: Actualizar el Worker (Desde tu terminal)

He actualizado el archivo `wrangler.toml` y las dependencias. Ahora solo necesitas desplegar la nueva configuración.

Ejecuta este comando en tu terminal (en la carpeta del proyecto):

```bash
npx wrangler deploy
```

---

## ✅ ¿Cómo saber si funciona?

1.  Espera 1-2 minutos después de hacer los cambios.
2.  Ve a tu web `https://alamia.es` (asegúrate de borrar caché o usar incógnito).
3.  Intenta dejar una reseña.
4.  Si todo está bien, ya no verás el error `<` y la reseña se enviará.

---

### ℹ️ Sobre el Panel de Admin (`admin-resenas.html`)

El archivo que tienes está perfecto. Una vez arregles lo de arriba, podrás usarlo entrando a:
`https://alamia.es/admin-resenas.html`

Te pedirá un token. Este token lo configuras en las variables de entorno del Worker (en Cloudflare Dashboard > Workers > Settings > Variables) como `ADMIN_TOKEN`.
