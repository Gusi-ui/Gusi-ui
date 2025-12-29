# 📧 Formulario de Contacto - Cloudflare Workers + Resend

## ✅ Stack Técnico

- **Frontend:** GitHub Pages (alamia.es)
- **Backend:** Cloudflare Workers
- **Email:** Resend (3,000 emails/mes gratis)
- **Infraestructura:** 100% Cloudflare

---

## 📁 Archivos del Proyecto

### Worker (Backend)
- `cloudflare-worker.js` - Código del Worker con Resend
- `wrangler.toml` - Configuración del Worker

### Frontend
- `index.html` - Página principal con formulario
- `script.js` - JavaScript del formulario (envía a `/api/contacto`)

### Documentación
- `GUIA_RESEND_SETUP.md` - Guía de configuración DNS para Resend
- `README_FORMULARIO.md` - Este archivo

---

## 🚀 Configuración Realizada

### 1. Cloudflare Worker
- ✅ Worker creado: `formulario-contacto`
- ✅ Ruta configurada: `alamia.es/api/contacto`
- ✅ SDK de Resend instalado
- ✅ API key configurada como secret

### 2. Resend
- ✅ Cuenta creada
- ✅ API key obtenida y configurada
- ⏳ **PENDIENTE:** Verificar dominio `alamia.es`

### 3. DNS (Cloudflare)
- ✅ SPF base configurado
- ⏳ **PENDIENTE:** Actualizar SPF para incluir Resend
- ⏳ **PENDIENTE:** Agregar registros DKIM de Resend

---

## ⚙️ Variables de Entorno (Secrets)

Configuradas con `wrangler secret put`:

```bash
RESEND_API_KEY=re_bsZ5SSdD_PcQdBY4gZRqGFKnov6nFxs45
```

---

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
wrangler dev
```

### Desplegar Worker
```bash
wrangler deploy
```

### Ver Logs en Tiempo Real
```bash
wrangler tail --format pretty
```

### Configurar un Secret
```bash
wrangler secret put RESEND_API_KEY
```

---

## 📊 Flujo del Formulario

```
┌─────────────────────────────────────────┐
│  Usuario rellena formulario             │
│  (alamia.es)                            │
└──────────────┬──────────────────────────┘
               │
               ↓ POST /api/contacto
┌─────────────────────────────────────────┐
│  Cloudflare Worker                      │
│  - Valida datos                         │
│  - Rate limiting                        │
│  - Anti-spam (honeypot)                 │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Resend API                             │
│  - Envía email profesional              │
│  - HTML formateado                      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Email recibido en:                     │
│  info@alamia.es                         │
└─────────────────────────────────────────┘
```

---

## 🔒 Seguridad Implementada

1. ✅ **CORS** - Solo acepta requests de `alamia.es`
2. ✅ **Validación** - Email, longitud de campos, formato
3. ✅ **Sanitización** - Limpia HTML/scripts maliciosos
4. ✅ **Honeypot** - Campo oculto anti-bots
5. ✅ **Rate Limiting** - Máximo 10 envíos/hora por IP (opcional con KV)
6. ✅ **Secrets** - API keys guardadas de forma segura

---

## 📧 Configuración de Email

### Remitente
```
Formulario Gusi.dev <info@alamia.es>
```

### Destinatario
```
info@alamia.es
```

### Reply-To
El email del usuario que envió el formulario, para poder responder directamente.

---

## 💰 Costos

### Cloudflare Workers
- ✅ **100,000 requests/día** - Plan gratuito
- ✅ Más que suficiente para un formulario de contacto

### Resend
- ✅ **3,000 emails/mes** - Plan gratuito
- ✅ Sin tarjeta de crédito necesaria
- ✅ Emails profesionales desde tu dominio

**Total: $0/mes**

---

## 🎯 Próximos Pasos

Para completar la configuración:

1. **Editar registro SPF** en Cloudflare DNS
   - Agregar `include:amazonses.com` al SPF existente

2. **Agregar registros DKIM** de Resend (3 registros)
   - Los encuentras en Resend Dashboard → Domains

3. **Verificar dominio** en Resend
   - Esperar 5-10 minutos para propagación DNS
   - Clic en "Verify DNS Records"

4. **Probar el formulario**
   - Enviar mensaje de prueba
   - Verificar recepción en info@alamia.es

5. **Commit y Push** a GitHub
   - Actualizar repositorio con Worker final

Ver `GUIA_RESEND_SETUP.md` para instrucciones detalladas.

---

## 🐛 Troubleshooting

### El email no llega

1. Verifica que el dominio esté **Verified** en Resend
2. Revisa los logs: `wrangler tail`
3. Revisa la carpeta de spam en info@alamia.es

### Error 401/403 en el Worker

1. Verifica que la API key esté configurada: `wrangler secret list`
2. Verifica que el origen sea correcto (CORS)

### DNS no se verifica

1. Espera 10-15 minutos para propagación
2. Verifica los registros:
   ```bash
   dig TXT alamia.es +short
   dig TXT resend._domainkey.alamia.es +short
   ```

---

## 📚 Referencias

- [Resend Documentation](https://resend.com/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Última actualización:** 2025-12-29
**Estado:** Configuración de DNS pendiente
