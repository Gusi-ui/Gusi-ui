# Imágenes del portafolio

Cada proyecto usa una imagen **SVG de mockup de interfaz** generada de forma
consistente (1200 × 630, tema oscuro + color de acento propio). El **id** del
proyecto en `src/data/project-case-studies*.ts` define el nombre del archivo.

## Ruta

```
public/images/proyectos/{id}.svg
```

Ejemplo: `public/images/proyectos/gusi-dev.svg`

En los datos del proyecto, el campo `image.jpg` apunta al SVG (el nombre del
campo se mantiene como `jpg` por compatibilidad con el tipo, pero el valor es
el `.svg`):

```ts
image: {
  jpg: 'images/proyectos/mi-proyecto.svg',
  alt: 'Descripción para accesibilidad',
},
```

## Generador

Las 15 imágenes se generan con un script reproducible. Para regenerarlas
(p. ej. tras editar título, subtítulo, color de acento o el mockup de un
proyecto):

```bash
node scripts/generate-project-images.mjs
```

La configuración de cada proyecto (acento, arquetipo de mockup y textos) vive
en el array `PROJECTS` dentro de `scripts/generate-project-images.mjs`.
Arquetipos disponibles: `dashboard`, `kanban`, `ecommerce`, `calendar`,
`landing`, `listView`, `formView`, `realestate`, `terminal`.

## IDs actuales (15 proyectos)

| ID | Título |
|----|--------|
| `app-restaurante` | App Restaurante |
| `dashboard-analytics` | Analytics Dashboard |
| `ecommerce-boutique` | Boutique Online |
| `ecommerce-tech` | TechStore Online |
| `ecommerce-organico` | EcoMercado |
| `gestion-citas` | Gestión de Citas |
| `plataforma-educativa` | Plataforma Educativa |
| `portal-inmobiliario` | Portal Inmobiliario |
| `landing-saas` | MetricFlow SaaS |
| `gestor-tareas` | Gestor de Tareas |
| `presupuestador-web` | Presupuestador Web |
| `menu-qr-cafe` | Menú QR Café |
| `crm-leads` | CRM de Leads |
| `reservas-coworking` | Reservas Coworking |
| `gusi-dev` | gusi.dev |

## Referencia en código

Los datos viven en:

- `src/data/project-case-studies.ts` (proyectos base)
- `src/data/project-case-studies-extra.ts`
- `src/data/project-case-studies-ecommerce.ts`
- `src/data/project-case-studies-personal.ts`
