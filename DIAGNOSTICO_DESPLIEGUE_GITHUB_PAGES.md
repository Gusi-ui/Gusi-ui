# 🔍 Diagnóstico Completo: GitHub Pages No Se Despliega

**Fecha**: 2026-01-13
**Estado**: Todos los despliegues recientes están fallando con "Page build failed"

---

## ❌ Problema Principal Identificado

**El CNAME del DNS está mal configurado:**

### DNS Actual (INCORRECTO):
```
www.alamia.es → usi-ui.github.io.  ❌ FALTA LA "G"
```

### DNS Correcto (debe ser):
```
www.alamia.es → gusi-ui.github.io.  ✅ CON LA "G"
```

---

## 📊 Historial de Builds

| Fecha | Commit | Estado | Error |
|-------|--------|--------|-------|
| 2026-01-13 17:20 | 2fecf0d | ❌ errored | Page build failed |
| 2026-01-13 17:11 | 5724cb4 | ❌ errored | Page build failed |
| 2026-01-13 17:08 | 8d3a876 | ❌ errored | Page build failed |
| 2026-01-13 17:01 | 7d380a3 | ❌ errored | Page build failed |
| 2025-12-29 17:10 | 8bd53d5 | ✅ built | - |

**Último despliegue exitoso**: 29 de diciembre de 2025

---

## 🔧 SOLUCIÓN INMEDIATA

### Paso 1: Corregir el CNAME en Cloudflare

1. **Ve a Cloudflare Dashboard**:
   ```
   https://dash.cloudflare.com
   ```

2. **Selecciona el dominio**: `alamia.es`

3. **Ve a**: **DNS** → **Records**

4. **Busca el registro CNAME para www**:
   - Debería mostrar: `www` → `usi-ui.github.io.` ❌

5. **Edita el registro** (haz clic en el icono de lápiz):
   - **Type**: `CNAME` (no cambiar)
   - **Name**: `www` (no cambiar)
   - **Target**: Cambiar a: `gusi-ui.github.io.` ✅ (agregar la G)
   - **Proxy status**: 🟡 **DNS only** (nube gris, NO naranja)

6. **Haz clic en "Save"**

### Paso 2: Verificar el Cambio

Espera 2-5 minutos y ejecuta:

```bash
dig www.alamia.es CNAME +short
```

Debe mostrar: `gusi-ui.github.io.` (con la G)

### Paso 3: Forzar Revalidación en GitHub Pages

**Opción A - Remover y Reagregar el Dominio:**

1. Ve a: `https://github.com/Gusi-ui/Gusi-ui/settings/pages`
2. En **"Custom domain"**, haz clic en **"Remove"**
3. Espera 30 segundos
4. Vuelve a escribir: `alamia.es` (sin www)
5. Haz clic en **"Save"**
6. Espera 5-10 minutos para que GitHub verifique el dominio

**Opción B - Crear un Commit Vacío:**

```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 📋 Configuración DNS Correcta Completa

### Registros A (para alamia.es - dominio raíz)
✅ **ESTOS ESTÁN CORRECTOS** - No cambiar

```
Type: A   Name: @   Target: 185.199.111.153   Proxy: DNS only
Type: A   Name: @   Target: 185.199.110.153   Proxy: DNS only
Type: A   Name: @   Target: 185.199.109.153   Proxy: DNS only
Type: A   Name: @   Target: 185.199.108.153   Proxy: DNS only
```

### Registro CNAME (para www.alamia.es)
❌ **ESTE ESTÁ MAL** - Necesita corrección

**Actual:**
```
Type: CNAME   Name: www   Target: usi-ui.github.io.   Proxy: DNS only
```

**Debe ser:**
```
Type: CNAME   Name: www   Target: gusi-ui.github.io.   Proxy: DNS only
```

---

## 🎯 Estado Actual de GitHub Pages

```json
{
  "status": "errored",
  "cname": "alamia.es",
  "html_url": "https://alamia.es/",
  "https_enforced": true,
  "protected_domain_state": "verified"
}
```

**Análisis:**
- ✅ El dominio raíz (alamia.es) está verificado
- ❌ Los builds están fallando ("errored")
- ⚠️ El subdominio www tiene un CNAME incorrecto

---

## ⏱️ Tiempo Estimado de Resolución

1. **Corrección del CNAME**: 1 minuto
2. **Propagación DNS**: 5-10 minutos (puede tardar hasta 24 horas)
3. **Revalidación en GitHub**: 2-5 minutos
4. **Nuevo despliegue**: 1-2 minutos

**Total**: 10-20 minutos (en condiciones normales)

---

## ✅ Verificación Final

Después de hacer los cambios, verifica:

1. **DNS del subdominio www**:
   ```bash
   dig www.alamia.es CNAME +short
   ```
   Debe mostrar: `gusi-ui.github.io.`

2. **Builds de GitHub Pages**:
   ```bash
   gh api repos/:owner/:repo/pages/builds/latest -q '{status: .status, error: .error.message}'
   ```
   Debe mostrar: `{"status":"built","error":null}`

3. **Sitio web accesible**:
   - https://alamia.es ✅
   - https://www.alamia.es ✅

---

## 🚨 Si el Problema Persiste

### 1. Verificar que no hay otros registros conflictivos

En Cloudflare, asegúrate de que **NO haya**:
- Múltiples registros CNAME para www
- Registros A para www (debe ser solo CNAME)
- Proxy activado (la nube debe estar gris)

### 2. Limpiar caché de Cloudflare

Si usas Cloudflare:
1. Ve a **Caching** → **Configuration**
2. Haz clic en **Purge Everything**

### 3. Verificar estado de GitHub

Revisa: https://www.githubstatus.com/

Si hay incidentes con GitHub Pages, espera a que se resuelvan.

---

## 📝 Resumen Ejecutivo

**Causa raíz**: El CNAME del DNS apunta a `usi-ui.github.io` (sin la G) en lugar de `gusi-ui.github.io`

**Solución**: Corregir el CNAME en Cloudflare agregando la "G" al inicio

**Impacto**: Todos los despliegues desde el 29 de diciembre están fallando

**Prioridad**: Alta - El sitio no se puede desplegar hasta que se corrija

---

**Documento creado**: 2026-01-13 18:30
**Última verificación DNS**: 2026-01-13 18:28
