---
title: 'Core Web Vitals explicado: qué son y cómo mejorarlos'
description: 'Guía práctica sobre LCP, INP y CLS: las métricas que Google usa para medir la experiencia de tu web y cómo pasar PageSpeed en verde.'
pubDate: 2026-06-22
serviceSilo: optimizacion-web
relatedSlugs:
  - mantenimiento-web-guia-completa
draft: false
---

Si has usado PageSpeed Insights y has visto métricas en rojo o naranja, probablemente has leído nombres como LCP, INP o CLS. Son los **Core Web Vitals**: las tres métricas que Google considera clave para medir si tu web ofrece una buena experiencia. Si necesitas ayuda profesional, consulta el [servicio de optimización web desde 190€](/servicios/optimizacion-web/).

## ¿Qué son los Core Web Vitals?

Son un conjunto de métricas de rendimiento centradas en el **usuario real**, no en el servidor. Google las usa como señal de posicionamiento desde 2021, junto con otros cientos de factores.

Las tres métricas principales son:

| Métrica | Nombre completo | Mide | Objetivo |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | Velocidad de carga percibida | < 2,5 s |
| **INP** | Interaction to Next Paint | Respuesta a interacciones | < 200 ms |
| **CLS** | Cumulative Layout Shift | Estabilidad visual | < 0,1 |

Si las tres están en verde, tu web ofrece una experiencia sólida en la mayoría de dispositivos.

## LCP: ¿cuánto tarda en verse lo importante?

**LCP** mide cuánto tarda en aparecer el elemento más grande visible en pantalla: una imagen hero, un bloque de texto o un vídeo.

### Causas habituales de LCP lento

- Imágenes enormes sin comprimir (fotos de 3 MB en el hero)
- Servidor lento o sin caché
- Fuentes web que bloquean el renderizado
- CSS o JavaScript que retrasan la pintura inicial

### Cómo mejorarlo

1. Comprime imágenes en **WebP o AVIF**
2. Usa `preload` en la imagen principal del hero
3. Activa caché y CDN (Cloudflare ayuda mucho)
4. Elimina scripts de terceros innecesarios (chatbots, pixels duplicados)
5. Sirve el HTML desde un hosting rápido

**Regla práctica:** si tu imagen principal pesa más de 150 KB, hay margen de mejora.

## INP: ¿responde la web cuando el usuario hace clic?

**INP** (sustituyó a FID en 2024) mide cuánto tarda la página en reaccionar cuando el usuario interactúa: pulsa un botón, abre un menú, envía un formulario.

### Causas habituales de INP alto

- Demasiado JavaScript en la página
- Scripts de terceros pesados (analytics, ads, widgets)
- Código JavaScript bloqueando el hilo principal
- Hidratación excesiva en frameworks (React, Vue)

### Cómo mejorarlo

1. Carga JavaScript solo donde hace falta (lazy hydration)
2. Retrasa scripts no críticos (`defer`, `async`)
3. Reduce plugins y widgets de terceros
4. Divide el JS en chunks más pequeños
5. Evita animaciones pesadas en elementos interactivos

**Regla práctica:** si tu web carga 15 scripts de analytics, chat y redes sociales, el INP sufrirá.

## CLS: ¿la página salta mientras carga?

**CLS** mide los cambios de layout inesperados: lees un párrafo y de repente un banner empuja el texto hacia abajo. Es frustrante y Google lo penaliza.

### Causas habituales de CLS alto

- Imágenes sin `width` y `height` definidos
- Fuentes que cambian el tamaño del texto al cargar (FOUT/FOIT)
- Anuncios o iframes que se insertan dinámicamente
- Banners de cookies que desplazan el contenido

### Cómo mejorarlo

1. Define dimensiones en todas las imágenes
2. Reserva espacio para banners y anuncios con CSS (`min-height`)
3. Usa `font-display: swap` con precaución
4. Carga contenido above-the-fold primero
5. Evita insertar elementos encima del contenido ya visible

**Regla práctica:** si al cargar la web "saltan" cosas, tu CLS necesita atención.

## Cómo medir tus Core Web Vitals

### Herramientas gratuitas

1. **[PageSpeed Insights](https://pagespeed.web.dev/)** — datos de laboratorio + campo (si hay tráfico)
2. **Google Search Console** → Experiencia → Core Web Vitals
3. **Chrome DevTools** → Lighthouse (modo móvil)
4. **WebPageTest** — análisis profundo con waterfall

### Laboratorio vs. datos reales

- **Laboratorio:** simula una visita en condiciones controladas (útil para depurar)
- **Campo (CrUX):** datos reales de usuarios de Chrome (lo que Google usa para ranking)

Una web puede sacar 95 en Lighthouse y aun así tener CrUX en rojo si tus usuarios tienen móviles lentos o mala conexión. Mira ambos.

## ¿Afectan al posicionamiento en Google?

Sí, pero con matices. Los Core Web Vitals son una **señal de ranking**, no el factor único. Una web lenta con contenido excelente puede rankear; una web rápida con contenido pobre, no.

En la práctica: si compites por keywords similares con otro sitio, **la velocidad puede ser el desempate**.

## Plan de acción en 4 pasos

### Paso 1: Diagnóstico

Ejecuta PageSpeed Insights en móvil. Anota LCP, INP y CLS.

### Paso 2: Prioriza por impacto

PageSpeed te ordena oportunidades por ahorro estimado. Empieza por las 3 primeras.

### Paso 3: Implementa

Imágenes, caché y JS son el 80% de las mejoras en la mayoría de webs.

### Paso 4: Compara

Vuelve a medir y documenta el antes/después. Sin métricas, no sabes si mejoraste.

## ¿Cuándo contratar una optimización profesional?

Tiene sentido si:

- PageSpeed te marca en rojo de forma persistente
- Tu web tarda más de 4 segundos en móvil
- Has perdido posiciones y sospechas del rendimiento
- No tienes conocimientos técnicos para aplicar los cambios

Un servicio de [optimización web con informe antes/después](/servicios/optimizacion-web/) te da claridad sobre qué se ha mejorado y cuánto. Para mantener esos resultados en el tiempo, combínalo con un [plan de mantenimiento mensual](/servicios/mantenimiento/).

## Conclusión

Los Core Web Vitals no son un capricho técnico: miden si tu web es agradable de usar. LCP, INP y CLS resumen velocidad, reactividad y estabilidad en tres números.

Pasar a verde no requiere rehacer la web entera. En muchos casos, optimizar imágenes, limpiar scripts y ajustar el servidor basta para una mejora notable.

Mide hoy, prioriza lo que más impacto tenga y vuelve a medir en una semana. Los números te dirán si vas por buen camino.
