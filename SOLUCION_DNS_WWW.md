# 🔧 Solución: Error DNS www.alamia.es

## 🚨 Problema Identificado

```
www.alamia.es is improperly configured
Domain's DNS record could not be retrieved. (InvalidDNSError)
```

Este error indica que el registro DNS para `www.alamia.es` no está configurado correctamente en Cloudflare.

## ✅ Solución: Configurar CNAME en Cloudflare

### Paso 1: Ir a Cloudflare Dashboard

1. Abre: `https://dash.cloudflare.com`
2. Selecciona el dominio: `alamia.es`
3. Ve a la pestaña: **DNS** → **Records**

### Paso 2: Verificar/Corregir el Registro CNAME para www

**El registro debe ser exactamente así:**

| Type | Name | Target | Proxy Status |
|------|------|--------|--------------|
| CNAME | `www` | `gusi-ui.github.io.` | 🟡 **DNS only** (nube gris) |

**⚠️ IMPORTANTE:**
- El **Target** debe terminar con un punto: `gusi-ui.github.io.` (con punto al final)
- El **Proxy Status** debe estar en **DNS only** (nube gris, NO naranja)
- El **Name** debe ser solo `www` (sin el dominio completo)

### Paso 3: Si el Registro No Existe

1. Haz clic en **"Add record"**
2. Configura:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `gusi-ui.github.io.` (con punto al final)
   - **Proxy status**: 🟡 **DNS only** (asegúrate de que la nube esté gris)
3. Haz clic en **"Save"**

### Paso 4: Si el Registro Ya Existe pero Está Mal

1. Busca el registro CNAME para `www`
2. Haz clic en el icono de **editar** (lápiz)
3. Verifica que:
   - **Target** sea exactamente: `gusi-ui.github.io.` (con punto al final)
   - **Proxy status** esté en **DNS only** (nube gris)
4. Si el proxy está activado (nube naranja), haz clic en la nube para desactivarlo
5. Haz clic en **"Save"**

### Paso 5: Esperar Propagación DNS

1. Espera **5-10 minutos** para que los cambios DNS se propaguen
2. Verifica que el registro esté correcto usando:
   ```bash
   dig www.alamia.es CNAME
   ```
   Deberías ver: `www.alamia.es. CNAME gusi-ui.github.io.`

### Paso 6: Reconfigurar en GitHub Pages

1. Ve a: `https://github.com/Gusi-ui/Gusi-ui/settings/pages`
2. En la sección **"Custom domain"**:
   - Si aparece `www.alamia.es`, haz clic en **"Remove"**
   - Espera 2 minutos
   - Vuelve a agregar: `www.alamia.es`
   - Haz clic en **"Save"**
3. Espera 5-10 minutos y verifica que el deployment se complete

## 📋 Configuración DNS Completa Correcta

Tu configuración DNS en Cloudflare debería verse así:

### Registros A (para alamia.es - dominio raíz)
```
Type: A
Name: @ (o alamia.es)
Target: 185.199.111.153
Proxy: 🟡 DNS only (gris)

Type: A
Name: @ (o alamia.es)
Target: 185.199.110.153
Proxy: 🟡 DNS only (gris)

Type: A
Name: @ (o alamia.es)
Target: 185.199.109.153
Proxy: 🟡 DNS only (gris)

Type: A
Name: @ (o alamia.es)
Target: 185.199.108.153
Proxy: 🟡 DNS only (gris)
```

### Registro CNAME (para www.alamia.es)
```
Type: CNAME
Name: www
Target: gusi-ui.github.io.  ← CON PUNTO AL FINAL
Proxy: 🟡 DNS only (gris)   ← MUY IMPORTANTE
```

## ⚠️ Errores Comunes

### ❌ Error 1: Proxy Activado
- **Síntoma**: Nube naranja en Cloudflare
- **Solución**: Haz clic en la nube para desactivarla (debe quedar gris)

### ❌ Error 2: Target Sin Punto
- **Síntoma**: `gusi-ui.github.io` (sin punto)
- **Solución**: Debe ser `gusi-ui.github.io.` (con punto al final)

### ❌ Error 3: Name Incorrecto
- **Síntoma**: `www.alamia.es` en lugar de solo `www`
- **Solución**: El Name debe ser solo `www`

### ❌ Error 4: Tipo Incorrecto
- **Síntoma**: Tipo A en lugar de CNAME
- **Solución**: Debe ser CNAME, no A

## 🔍 Verificación

Después de hacer los cambios, verifica:

1. **En Cloudflare**:
   - El registro CNAME existe
   - Target: `gusi-ui.github.io.` (con punto)
   - Proxy: Desactivado (gris)

2. **Con dig (opcional)**:
   ```bash
   dig www.alamia.es CNAME +short
   ```
   Debería mostrar: `gusi-ui.github.io.`

3. **En GitHub Pages**:
   - Ve a Settings → Pages
   - El dominio `www.alamia.es` debería aparecer como verificado
   - El deployment debería completarse sin timeout

## 📝 Notas Importantes

- **NO uses proxy de Cloudflare** para los registros de GitHub Pages (debe estar en DNS only)
- El punto al final en el Target es importante: `gusi-ui.github.io.`
- Los cambios DNS pueden tardar hasta 24 horas en propagarse completamente, pero normalmente es en 5-10 minutos
- Si el problema persiste después de 30 minutos, verifica que no haya otros registros conflictivos en Cloudflare

---

**Última actualización**: 2025-01-13
**Error**: `www.alamia.es is improperly configured (InvalidDNSError)`
