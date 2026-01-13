# 🚨 INSTRUCCIONES INMEDIATAS - Resolver Timeout GitHub Pages

## ⚠️ IMPORTANTE

Si ya tienes configurado **"Deploy from a branch"** y el problema persiste, ve directamente a:
👉 **[SOLUCION_TIMEOUT_AVANZADA.md](./SOLUCION_TIMEOUT_AVANZADA.md)**

El problema probablemente está relacionado con el dominio personalizado (`alamia.es`).

---

## ⚡ Solución Rápida (5 minutos)

El timeout en `deployment_queued` se resuelve cambiando la configuración de GitHub Pages.

### Paso 1: Ir a Configuración de Pages

Abre este enlace en tu navegador:
```
https://github.com/Gusi-ui/Gusi-ui/settings/pages
```

### Paso 2: Cambiar Source

1. **Busca la sección "Source"** (arriba de la página)
2. **Si dice "GitHub Actions"**:
   - Haz clic en el dropdown
   - Selecciona **"Deploy from a branch"**
3. **Configura**:
   - **Branch**: Selecciona `main`
   - **Folder**: Selecciona `/ (root)`
4. **Haz clic en "Save"**

### Paso 3: Verificar

1. Espera 1-2 minutos
2. Recarga la página de Settings → Pages
3. Deberías ver un deployment en progreso o completado
4. Tu sitio debería estar disponible en: `https://alamia.es`

---

## ❓ ¿Por qué funciona esto?

GitHub Pages tiene dos modos de deployment:
- **"GitHub Actions"**: Usa workflows automáticos (puede tener problemas de timeout)
- **"Deploy from a branch"**: Despliega directamente desde el branch (más confiable)

El modo "Deploy from a branch" es más simple y evita los problemas de timeout con workflows.

---

## 🔄 Si Quieres Volver a GitHub Actions

Si más adelante quieres usar GitHub Actions (para más control), puedes:

1. Crear un workflow manual en `.github/workflows/deploy-pages.yml`
2. Cambiar la configuración de vuelta a "GitHub Actions"
3. Asegurarte de tener los permisos correctos

Pero por ahora, **"Deploy from a branch" es la solución más rápida y confiable**.

---

## ✅ Verificación Final

Después de cambiar la configuración, verifica:

- [ ] El deployment se completa sin timeout
- [ ] El sitio está accesible en `https://alamia.es`
- [ ] Los cambios recientes están visibles

---

**Si el problema persiste después de cambiar a "Deploy from a branch"**, contacta a soporte de GitHub con el ID del deployment que falló.
