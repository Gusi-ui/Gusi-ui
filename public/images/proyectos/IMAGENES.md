# Imágenes del portafolio

Coloca aquí las capturas de cada proyecto. El **id** del proyecto en `src/data/project-case-studies*.ts` define el nombre del archivo.

## Ruta obligatoria (fallback)

```
public/images/proyectos/{id}.jpg
```

Ejemplo: `public/images/proyectos/gusi-dev.jpg`

## Rutas opcionales (mejor rendimiento)

```
public/images/optimizadas/{id}.webp
public/images/optimizadas/{id}.avif
```

Si añades WebP/AVIF, actualiza el objeto `image` del proyecto en datos:

```ts
image: {
  avif: 'images/optimizadas/mi-proyecto.avif',
  webp: 'images/optimizadas/mi-proyecto.webp',
  jpg: 'images/proyectos/mi-proyecto.jpg',
  alt: 'Descripción para accesibilidad',
},
```

## Tamaño recomendado

- **1200 × 630 px** (ratio 1.91:1, ideal para tarjetas y Open Graph)
- Formato JPG calidad 80–85 % o WebP

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

Tras sustituir una imagen, no hace falta tocar código si mantienes el mismo `{id}.jpg`.
