# Sistema de Reseñas - Documentación

## Descripción

Se ha implementado un sistema completo de reseñas que permite a los usuarios dejar reseñas directamente en tu página web. Las reseñas se almacenan localmente y se muestran dinámicamente en la sección de testimonios.

## Características

✅ **Formulario de reseñas**: Los usuarios pueden dejar reseñas con nombre, email, empresa, valoración (1-5 estrellas) y mensaje
✅ **Almacenamiento local**: Las reseñas se guardan en localStorage del navegador
✅ **Visualización dinámica**: Las reseñas se muestran automáticamente en la página
✅ **Estadísticas en tiempo real**: Muestra la valoración promedio y el total de reseñas
✅ **Schema.org integrado**: Las reseñas se actualizan automáticamente en el Schema.org para que Google las indexe
✅ **Integración con Google Reviews**: Botón para redirigir a los usuarios a dejar reseñas en Google

## Cómo Obtener tu Google Place ID

Para que el botón "Reseñar en Google" funcione correctamente, necesitas obtener tu Google Place ID:

### Método 1: Desde Google Maps
1. Busca tu negocio en Google Maps
2. Haz clic en tu negocio
3. En la URL, encontrarás algo como: `.../place/ChIJ.../...`
4. El Place ID es la parte después de `/place/` (ejemplo: `ChIJN1t_tDeuEmsRUsoyG83frY4`)

### Método 2: Usando la API de Google Places
1. Ve a: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Usa el Place ID Finder: https://developers.google.com/maps/documentation/places/web-service/place-id#find-id
3. Busca tu negocio y copia el Place ID

### Método 3: Desde la URL de Google Maps
Si tienes una URL de Google Maps de tu negocio, el Place ID está en la URL:
```
https://www.google.com/maps/place/Tu+Negocio/@LAT,LNG,ZOOM/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3dLAT!4dLNG
```
El Place ID está en el parámetro `data` o puedes extraerlo de la URL completa.

## Configuración

### 1. Actualizar el Place ID de Google

Edita el archivo `index.html` y busca la línea:
```html
<a href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
```

Reemplaza `YOUR_PLACE_ID` con tu Place ID real de Google.

### 2. (Opcional) Agregar reseñas de ejemplo

Si quieres tener algunas reseñas de ejemplo al inicio, puedes agregarlas manualmente ejecutando esto en la consola del navegador:

```javascript
const exampleReviews = [
    {
        id: "1",
        name: "María López",
        email: "maria@example.com",
        company: "Directora de Plataforma Educativa",
        rating: 5,
        message: "Trabajar con Jose fue una experiencia excepcional. Transformó completamente nuestra plataforma educativa con un diseño moderno y funcional.",
        date: new Date().toISOString(),
        verified: false
    },
    {
        id: "2",
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        company: "Propietario de Restaurante",
        rating: 5,
        message: "Necesitábamos una aplicación móvil para nuestro restaurante y Jose entregó exactamente lo que necesitábamos. La app es intuitiva y estable.",
        date: new Date().toISOString(),
        verified: false
    }
];

localStorage.setItem('site-reviews', JSON.stringify(exampleReviews));
location.reload();
```

## Funcionamiento

### Almacenamiento
- Las reseñas se guardan en `localStorage` del navegador
- Clave: `site-reviews`
- Formato: Array JSON de objetos de reseña

### Estructura de una Reseña
```javascript
{
    id: "timestamp",           // ID único generado automáticamente
    name: "Nombre del cliente", // Nombre del cliente
    email: "email@example.com", // Email del cliente
    company: "Empresa",         // Empresa/cargo (opcional)
    rating: 5,                 // Valoración de 1 a 5
    message: "Texto de reseña", // Mensaje de la reseña
    date: "2024-01-01T00:00:00.000Z", // Fecha ISO
    verified: false             // Si la reseña está verificada (futuro)
}
```

### Schema.org
El sistema actualiza automáticamente el Schema.org con:
- Valoración promedio (`aggregateRating`)
- Total de reseñas
- Últimas 5 reseñas más recientes

Esto permite que Google muestre las reseñas en los resultados de búsqueda (rich snippets).

## Migración a Backend (Futuro)

Actualmente las reseñas se almacenan en `localStorage`, lo que significa que:
- Solo son visibles en el navegador donde se crearon
- No se sincronizan entre dispositivos
- Se pueden perder si se limpia el almacenamiento

Para una solución profesional, considera migrar a un backend:

### Opciones de Backend
1. **Cloudflare Workers**: Ya tienes uno configurado, puedes extenderlo
2. **Firebase**: Base de datos en tiempo real
3. **Supabase**: Backend open-source
4. **API propia**: Node.js, Python, etc.

### Cambios necesarios
1. Reemplazar `localStorage` por llamadas a API
2. Agregar autenticación/verificación de email
3. Implementar moderación de reseñas
4. Agregar protección contra spam

## Integración con Google Reviews

**Importante**: No es posible sincronizar automáticamente las reseñas de tu página web con Google Reviews. Google requiere que los usuarios dejen las reseñas directamente en su plataforma.

Sin embargo, el sistema:
1. ✅ Muestra un botón que redirige a Google Reviews
2. ✅ Actualiza el Schema.org para que Google indexe tus reseñas
3. ✅ Permite que los usuarios vean reseñas en tu sitio web

## Personalización

### Cambiar el número máximo de reseñas mostradas
En `script.js`, busca la función `renderReviews` y modifica:
```javascript
const sortedReviews = [...reviews].sort(...).slice(0, MAX_REVIEWS);
```

### Cambiar el número de reseñas en Schema.org
En `script.js`, busca la función `updateSchemaOrg`:
```javascript
const recentReviews = [...reviews].slice(0, 5); // Cambia 5 por el número deseado
```

### Modificar estilos
Los estilos están en `styles.css` en la sección `/* Modal de reseña */` y `/* Formulario de reseña */`.

## Solución de Problemas

### Las reseñas no se muestran
1. Verifica que el contenedor `#testimonials-container` exista en el HTML
2. Abre la consola del navegador y verifica errores
3. Verifica que `localStorage` esté habilitado en el navegador

### El modal no se abre
1. Verifica que el botón `#open-review-form` exista
2. Verifica que no haya errores de JavaScript en la consola
3. Asegúrate de que el CSS esté cargado correctamente

### Las reseñas no se guardan
1. Verifica que `localStorage` no esté bloqueado
2. Verifica que el navegador soporte `localStorage`
3. Revisa la consola para errores de JavaScript

## Notas Importantes

⚠️ **Privacidad**: Las reseñas se almacenan localmente. Si migras a un backend, asegúrate de cumplir con GDPR/RGPD.

⚠️ **Moderación**: Actualmente no hay moderación automática. Considera agregar un sistema de moderación antes de migrar a producción.

⚠️ **Spam**: El sistema actual no tiene protección contra spam. Considera agregar:
- Verificación de email
- Rate limiting
- CAPTCHA
- Moderación manual

## Próximos Pasos Recomendados

1. ✅ Obtener y configurar el Google Place ID
2. ⚠️ Agregar reseñas de ejemplo (opcional)
3. ⚠️ Migrar a backend para producción
4. ⚠️ Agregar sistema de moderación
5. ⚠️ Implementar verificación de email
6. ⚠️ Agregar protección contra spam
