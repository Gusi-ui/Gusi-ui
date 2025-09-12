# 🎯 Configuración Paso a Paso en el Panel de Google Analytics 4

## 📋 Requisitos Previos
- Cuenta de Google activa
- Acceso a [Google Analytics](https://analytics.google.com/)
- Tu sitio web con el código GA4 ya instalado (ID: `G-165E9VQDD8`)

---

## 🚀 PASO 1: Acceder y Verificar la Propiedad

### 1.1 Iniciar Sesión
1. Ve a **https://analytics.google.com/**
2. Inicia sesión con tu cuenta de Google
3. Selecciona la cuenta que contiene tu propiedad `G-165E9VQDD8`

### 1.2 Verificar la Propiedad
1. En el panel izquierdo, verifica que estés en la propiedad correcta
2. Deberías ver el nombre de tu sitio web (ej: "Gusi.dev - Portfolio")
3. El ID de medición debe ser `G-165E9VQDD8`

---

## 📊 PASO 2: Configurar Eventos Personalizados

### 2.1 Acceder a la Configuración de Eventos
1. En el menú izquierdo, haz clic en **"Configurar"**
2. Selecciona **"Eventos"**
3. Aquí verás todos los eventos que se están enviando desde tu sitio

### 2.2 Verificar Eventos Implementados
Busca estos eventos en la lista (pueden tardar 24-48h en aparecer):

**📝 Eventos del Formulario de Contacto:**
- `form_submit_start` - Usuario inicia envío del formulario
- `form_submit_success` - Formulario enviado exitosamente
- `form_submit_error` - Error en el envío del formulario
- `conversion` - Evento de conversión principal
- `whatsapp_redirect` - Redirección a WhatsApp

**🧭 Eventos de Navegación:**
- `internal_navigation` - Navegación interna del sitio
- `project_filter` - Filtrado de proyectos en portfolio
- `project_click` - Clics en tarjetas de proyectos

**⚡ Eventos Automáticos:**
- `page_view` - Visualizaciones de página
- `session_start` - Inicio de sesión
- `first_visit` - Primera visita

---

## 🎯 PASO 3: Configurar Conversiones

### 3.1 Marcar Eventos como Conversiones
1. En la lista de **Eventos**, busca estos eventos clave:
   - `form_submit_success`
   - `conversion`
   - `whatsapp_redirect`

2. Para cada evento:
   - Haz clic en el **interruptor** en la columna "Marcar como conversión"
   - El interruptor se pondrá azul cuando esté activado

### 3.2 Configurar Valores de Conversión
1. Haz clic en el nombre del evento `form_submit_success`
2. En "Valor", asigna un valor monetario (ej: €50 por lead)
3. Guarda los cambios

---

## 👥 PASO 4: Crear Audiencias Personalizadas

### 4.1 Acceder a Audiencias
1. Ve a **"Configurar"** → **"Audiencias"**
2. Haz clic en **"Nueva audiencia"**

### 4.2 Crear Audiencia "Usuarios Interesados"
1. Selecciona **"Crear una audiencia personalizada"**
2. Nombre: `Usuarios Interesados`
3. Descripción: `Usuarios que enviaron el formulario de contacto`
4. En "Condiciones":
   - Evento: `form_submit_success`
   - Período: Últimos 30 días
5. Haz clic en **"Guardar"**

### 4.3 Crear Audiencia "Exploradores de Portfolio"
1. Nueva audiencia personalizada
2. Nombre: `Exploradores de Portfolio`
3. Descripción: `Usuarios que interactuaron con el portfolio`
4. Condiciones:
   - Evento: `project_filter` O `project_click`
   - Período: Últimos 7 días
5. Guardar

### 4.4 Crear Audiencia "Usuarios de WhatsApp"
1. Nueva audiencia personalizada
2. Nombre: `Usuarios de WhatsApp`
3. Descripción: `Usuarios redirigidos a WhatsApp`
4. Condiciones:
   - Evento: `whatsapp_redirect`
   - Período: Últimos 30 días
5. Guardar

---

## 📈 PASO 5: Configurar Informes Personalizados

### 5.1 Crear Informe de Conversiones
1. Ve a **"Informes"** → **"Biblioteca"**
2. Haz clic en **"Crear informe"** → **"Informe detallado"**
3. Configuración:
   - **Nombre**: `Análisis de Formulario de Contacto`
   - **Dimensiones**: 
     - Evento
     - Página de destino
     - Fuente/medio
   - **Métricas**:
     - Recuento de eventos
     - Conversiones
     - Tasa de conversión
4. **Filtros**:
   - Nombre del evento contiene: `form_submit`
5. Guardar informe

### 5.2 Crear Informe de Portfolio
1. Nuevo informe detallado
2. Nombre: `Rendimiento del Portfolio`
3. Dimensiones:
   - Evento
   - Etiqueta del evento (para ver qué proyectos)
   - Página
4. Métricas:
   - Recuento de eventos
   - Usuarios únicos
5. Filtros:
   - Nombre del evento: `project_filter` o `project_click`
6. Guardar

---

## 🔔 PASO 6: Configurar Alertas Inteligentes

### 6.1 Crear Alerta de Conversiones
1. Ve a **"Configurar"** → **"Alertas personalizadas"**
2. Haz clic en **"Crear alerta personalizada"**
3. Configuración:
   - **Nombre**: `Caída en Conversiones`
   - **Condición**: Conversiones disminuyen 20% semana a semana
   - **Frecuencia**: Diaria
   - **Destinatarios**: Tu email
4. Guardar alerta

### 6.2 Crear Alerta de Tráfico
1. Nueva alerta personalizada
2. Nombre: `Aumento de Tráfico`
3. Condición: Usuarios aumentan 50% día a día
4. Frecuencia: Diaria
5. Guardar

---

## 📊 PASO 7: Configurar Panel de Control (Dashboard)

### 7.1 Crear Dashboard Principal
1. Ve a **"Informes"** → **"Biblioteca"**
2. Haz clic en **"Crear colección"**
3. Nombre: `Dashboard Principal - Gusi.dev`

### 7.2 Agregar Tarjetas al Dashboard
1. **Tarjeta 1: Conversiones del Formulario**
   - Métrica: Conversiones (`form_submit_success`)
   - Período: Últimos 30 días
   - Comparación: Período anterior

2. **Tarjeta 2: Interacciones del Portfolio**
   - Métrica: Eventos (`project_click` + `project_filter`)
   - Dimensión: Etiqueta del evento
   - Visualización: Gráfico de barras

3. **Tarjeta 3: Embudo de Conversión**
   - Métricas múltiples:
     - Visualizaciones de página
     - `form_submit_start`
     - `form_submit_success`
     - `whatsapp_redirect`

4. **Tarjeta 4: Fuentes de Tráfico**
   - Dimensión: Fuente/medio
   - Métrica: Usuarios
   - Filtro: Solo usuarios que convirtieron

---

## 🎯 PASO 8: Configurar Objetivos Avanzados

### 8.1 Configurar Embudo de Conversión
1. Ve a **"Explorar"** → **"Análisis de embudo"**
2. Configura estos pasos:
   - **Paso 1**: Visualización de página (página de inicio)
   - **Paso 2**: Scroll hasta formulario (`scroll` event)
   - **Paso 3**: Inicio de formulario (`form_submit_start`)
   - **Paso 4**: Envío exitoso (`form_submit_success`)
   - **Paso 5**: Redirección WhatsApp (`whatsapp_redirect`)

### 8.2 Configurar Análisis de Cohortes
1. Ve a **"Explorar"** → **"Análisis de cohortes"**
2. Configura:
   - **Criterio de cohorte**: Primera visita
   - **Criterio de retorno**: `form_submit_success`
   - **Período**: Semanal

---

## 🔍 PASO 9: Verificar Configuración

### 9.1 Probar en Tiempo Real
1. Ve a **"Informes"** → **"Tiempo real"**
2. En otra pestaña, abre tu sitio web
3. Navega por el sitio y llena el formulario
4. Verifica que aparezcan los eventos en tiempo real:
   - `page_view`
   - `internal_navigation`
   - `project_filter` (si filtras proyectos)
   - `form_submit_start`
   - `form_submit_success`
   - `whatsapp_redirect`

### 9.2 Verificar DebugView (Opcional)
1. Instala la extensión **Google Analytics Debugger** en Chrome
2. Activa la extensión
3. Ve a **"Configurar"** → **"DebugView"**
4. Navega por tu sitio y verifica los eventos en detalle

---

## 📱 PASO 10: Configurar Informes Móviles

### 10.1 Descargar la App de Google Analytics
1. Descarga **Google Analytics** desde App Store/Google Play
2. Inicia sesión con tu cuenta
3. Selecciona tu propiedad `G-165E9VQDD8`

### 10.2 Configurar Notificaciones Móviles
1. En la app, ve a **Configuración**
2. Activa notificaciones para:
   - Alertas personalizadas
   - Informes semanales
   - Picos de tráfico

---

## 🎉 PASO 11: Configuración Avanzada (Opcional)

### 11.1 Integrar con Google Ads
1. Ve a **"Configurar"** → **"Vinculación de productos"**
2. Selecciona **"Google Ads"**
3. Vincula tu cuenta de Google Ads (si tienes una)
4. Importa conversiones a Google Ads

### 11.2 Configurar Google Tag Manager (GTM)
1. Si quieres eventos más avanzados, considera usar GTM
2. Ve a **"Configurar"** → **"Flujos de datos"**
3. Configura GTM para eventos más complejos

### 11.3 Configurar Enhanced Ecommerce
1. Si planeas vender productos/servicios:
2. Ve a **"Configurar"** → **"Configuración de comercio electrónico"**
3. Activa **"Informes de comercio electrónico mejorados"**

---

## 📋 CHECKLIST FINAL

### ✅ Configuración Básica
- [ ] Propiedad verificada (`G-165E9VQDD8`)
- [ ] Eventos personalizados configurados
- [ ] Conversiones marcadas
- [ ] Audiencias creadas

### ✅ Informes y Análisis
- [ ] Dashboard principal configurado
- [ ] Informes personalizados creados
- [ ] Embudo de conversión configurado
- [ ] Alertas inteligentes activadas

### ✅ Verificación
- [ ] Eventos funcionando en tiempo real
- [ ] Conversiones registrándose correctamente
- [ ] App móvil configurada
- [ ] Notificaciones activadas

---

## 🆘 Solución de Problemas

### Los eventos no aparecen
- **Espera 24-48 horas** para que aparezcan en la interfaz
- Verifica en **"Tiempo real"** que se estén enviando
- Revisa la consola del navegador para errores

### Las conversiones no se registran
- Asegúrate de haber marcado los eventos como conversiones
- Verifica que el evento `form_submit_success` se esté disparando
- Comprueba que no hay bloqueadores de anuncios activos

### Los informes están vacíos
- Los datos pueden tardar hasta 24 horas en procesarse
- Verifica que el período de fechas sea correcto
- Asegúrate de que hay tráfico en tu sitio web

---

## 📞 Soporte

**¿Necesitas ayuda adicional?**
- 📧 **Email**: info@gusi.dev
- 💬 **WhatsApp**: +34 619 027 645
- 📚 **Documentación**: [Google Analytics Help](https://support.google.com/analytics/)

---

**🎯 ¡Tu Google Analytics está completamente configurado para rastrear todas las interacciones importantes de tu sitio web freelance!**

**Próxima revisión recomendada**: En 1 semana para verificar que todos los datos se están recopilando correctamente.