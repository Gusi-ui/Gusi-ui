# 📧 Guía Completa: Configuración de Resend

## ✅ Estado Actual

- [x] Worker creado con Resend
- [x] SDK de Resend instalado
- [x] API key configurada
- [ ] **Dominio verificado en Resend** ← PENDIENTE

---

## 🎯 Lo que falta hacer

### Paso 1: Editar Registro SPF en Cloudflare

**Registro SPF actual:**
```
v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net ~all
```

**Nuevo registro SPF (con Resend):**
```
v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net include:amazonses.com ~all
```

**Cómo editarlo:**
1. Ve a: **Cloudflare Dashboard** → `alamia.es` → **DNS** → **Records**
2. Busca el registro **TXT** con el contenido que empieza por `v=spf1`
3. Haz clic en **Edit** (icono de lápiz)
4. **Reemplaza** el contenido completo por:
   ```
   v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net include:amazonses.com ~all
   ```
5. Haz clic en **Save**

---

### Paso 2: Agregar Registros DKIM de Resend

Resend te da **3 registros DKIM**. Ejemplo (tus valores serán diferentes):

#### DKIM 1
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ... (valor largo)
```

#### DKIM 2
```
Type: TXT
Name: resend2._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ... (valor largo)
```

#### DKIM 3
```
Type: TXT
Name: resend3._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ... (valor largo)
```

**Cómo agregarlos en Cloudflare:**

Para **cada uno** de los 3 registros DKIM:

1. **Cloudflare Dashboard** → `alamia.es` → **DNS** → **Records**
2. Clic en **Add record**
3. Configurar:
   - **Type:** TXT
   - **Name:** (el que te dio Resend, ej: `resend._domainkey`)
   - **Content:** (pega el valor completo que te dio Resend)
   - **TTL:** Auto
   - **Proxy status:** DNS only (nube GRIS, NO naranja)
4. Clic en **Save**
5. Repetir para los otros 2 registros DKIM

---

### Paso 3: Verificar en Resend

Después de agregar los registros DNS:

1. Ve a **Resend Dashboard** → **Domains** → `alamia.es`
2. Espera 2-5 minutos
3. Haz clic en **Verify DNS Records**
4. Debería aparecer como ✅ **Verified**

---

## 🚀 Cuando todo esté verificado

Una vez que Resend muestre el dominio como **Verified**, podremos:

1. Desplegar el Worker final
2. Probar el envío de emails
3. Hacer commit y push a GitHub

---

## 📝 Registros DNS Finales

Cuando termines, tu DNS debería tener:

### Registros TXT en `@` (alamia.es):
```
v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net include:amazonses.com ~all
```

### Registros DKIM:
```
cf2024-1._domainkey.alamia.es       → (tu DKIM de Cloudflare - mantener)
resend._domainkey.alamia.es         → (DKIM 1 de Resend - nuevo)
resend2._domainkey.alamia.es        → (DKIM 2 de Resend - nuevo)
resend3._domainkey.alamia.es        → (DKIM 3 de Resend - nuevo)
```

### Otros (mantener como están):
```
_dmarc.alamia.es                    → (tu DMARC actual)
_mailchannels.alamia.es             → (tu registro MailChannels)
```

---

## ⚠️ Importante

- **NO borres** ningún registro DNS existente
- Solo **edita** el SPF para agregar `include:amazonses.com`
- Los DKIM de Resend son **adicionales** a tu DKIM actual
- Todos los registros DKIM deben tener **DNS only** (nube gris)

---

## 🆘 Si tienes problemas

### El dominio no se verifica en Resend

1. Verifica que los registros estén exactamente como te los dio Resend
2. Espera 10-15 minutos para propagación DNS
3. Verifica con:
   ```bash
   dig TXT alamia.es +short
   dig TXT resend._domainkey.alamia.es +short
   ```

### No encuentro los registros DKIM en Resend

1. Ve a: **Resend Dashboard** → **Domains** → `alamia.es`
2. Debajo de "DNS Records" deberían aparecer todos los registros
3. Cópialos exactamente como aparecen

---

**Última actualización:** 2025-12-29
**Estado:** Esperando configuración DNS de Resend
