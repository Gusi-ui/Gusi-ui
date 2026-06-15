---
title: 'Cómo saber si tu web ha sido hackeada'
description: 'Señales de alerta, comprobaciones rápidas y qué hacer de inmediato si sospechas que tu web ha sido comprometida.'
pubDate: 2026-06-28
serviceSilo: mantenimiento
relatedSlugs:
  - mantenimiento-web-guia-completa
  - core-web-vitals-explicado
draft: false
---

Detectar un hackeo a tiempo puede salvarte semanas de problemas, pérdida de clientes y sanciones de Google. La buena noticia: la mayoría de intrusiones dejan **señales visibles** si sabes dónde mirar.

> **Importante:** si ves tu web redirigiendo a sitios extraños o Google marca "Este sitio puede estar hackeado", actúa hoy mismo. No esperes al lunes.

## Señales de alerta inmediatas

### 1. Redirecciones extrañas

Tu web carga pero redirige a otro dominio, sobre todo en móvil. Los atacantes suelen ocultar el redirect para que solo lo vean los usuarios, no el administrador.

### 2. Aviso de Google en el navegador

Chrome o Firefox muestran "Sitio peligroso" o "Phishing detectado". Google Search Console también envía alertas de seguridad.

### 3. Contenido que no has publicado tú

Aparecen páginas en japonés, chino o ruso con enlaces de spam. URLs raras tipo `/wp-content/uploads/shell.php`.

### 4. Caída brusca de tráfico

Si tu tráfico orgánico cae un 50% en días sin explicación, Google puede haberte penalizado por contenido malicioso.

### 5. Emails de clientes o del hosting

Tu proveedor de hosting te avisa de actividad sospechosa, o clientes dicen que tu web les pide descargar algo raro.

## Comprobaciones que puedes hacer tú mismo

### Revisa Search Console

Entra en [Google Search Console](https://search.google.com/search-console) → **Seguridad y acciones manuales**. Si hay problemas, aparecerán ahí.

### Busca tu dominio en Google

Escribe en Google: `site:alamia.es` y revisa si aparecen URLs que no reconoces.

### Comprueba el certificado SSL

Si el candado del navegador muestra advertencias, puede haber contenido mixto o manipulación del sitio.

### Revisa usuarios administradores

En WordPress: Usuarios → busca cuentas que no hayas creado. Un admin desconocido es señal clara de compromiso.

### Mira los archivos recientes

Si tienes acceso FTP o panel, busca archivos `.php` modificados recientemente en carpetas donde no deberían estar.

## Qué hacer si confirmas el hackeo

### Paso 1: No entres en pánico, pero actúa rápido

Pon la web en modo mantenimiento si puedes, para evitar que infecte a visitantes.

### Paso 2: Cambia todas las contraseñas

Hosting, FTP, WordPress admin, base de datos, email asociado. Todas. Ahora.

### Paso 3: Restaura desde backup limpio

Si tienes una copia de seguridad anterior al hackeo, restáurala. Si no tienes backup verificado, este es el momento de entender por qué el [mantenimiento web mensual](/servicios/mantenimiento/) incluye backups automáticos.

### Paso 4: Actualiza todo

Core, plugins, temas, dependencias. Cierra la puerta por donde entraron.

### Paso 5: Solicita revisión en Google

Una vez limpio, pide revisión en Search Console para quitar la advertencia de seguridad.

## Cómo prevenir futuros hackeos

| Medida | Frecuencia | Impacto |
|---|---|---|
| Actualizaciones de seguridad | Mensual | Alto |
| Copias de seguridad verificadas | Semanal | Crítico |
| Contraseñas fuertes + 2FA | Siempre | Alto |
| Eliminar plugins no usados | Trimestral | Medio |
| Monitorización 24/7 | Continua | Alto |

Todo esto forma parte de un [plan de mantenimiento profesional](/servicios/mantenimiento/). Para entender qué incluye, lee la [guía completa de mantenimiento web](/blog/mantenimiento-web-guia-completa/).

## WordPress vs. webs estáticas: ¿quién tiene más riesgo?

WordPress concentra más ataques por su popularidad y por los plugins de terceros. Las webs estáticas (Astro, HTML) tienen menos superficie de ataque, pero **no son inmunes**: certificados caducados, DNS comprometido o contraseñas débiles afectan a cualquier sitio.

## ¿Deberías contratar ayuda profesional?

Sí, si:

- No sabes identificar archivos maliciosos
- No tienes backup limpio
- Google sigue mostrando advertencias tras "limpiar"
- No tienes tiempo para investigar la causa raíz

Recuperar una web hackeada sin experiencia puede empeorar el problema (borrar archivos del sistema, perder datos).

## Conclusión

Una web hackeada no siempre se nota a simple vista, pero las señales están ahí si las buscas. La mejor estrategia es **prevenir**: actualizaciones, backups y monitorización continua.

Si llevas meses sin tocar tu web, hoy es buen día para revisarla — o para activar un plan que lo haga por ti.
