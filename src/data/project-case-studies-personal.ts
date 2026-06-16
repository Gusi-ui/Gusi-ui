import type { ProjectCaseStudy } from '@/data/project-case-studies';

/** Proyectos reales en producción (no demos locales). */
export const personalProjectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'gusi-dev',
    type: 'web',
    badge: 'Proyecto Personal',
    title: 'gusi.dev',
    hook: 'Terminal cyberpunk interactiva con juegos retro, noticias IA y estética Blade Runner.',
    context: 'Experimental · Portfolio interactivo en producción',
    problem: [
      'Quería un portfolio que no pareciera una plantilla más: algo memorable que demostrara dominio de frontend y personalidad técnica.',
      'Los CV en PDF no transmiten cómo piensas ni cómo construyes experiencias; hacía falta algo que el visitante quisiera explorar.',
    ],
    solutionSummary:
      'Terminal NEXUS-7 en el navegador: consola con comandos, menú de módulos, juegos retro, APOD de la NASA y chat simulado con estética CRT.',
    solution: {
      frontend:
        'Interfaz tipo shell con tipografía monoespaciada, scanlines, prompt interactivo y navegación por comandos (help, menu, clear).',
      integrations:
        'Módulos de noticias tech, imagen astronómica del día (NASA APOD) y minijuegos clásicos embebidos en la misma experiencia.',
      security:
        'Sin backend expuesto al usuario: experiencia estática/edge con APIs públicas consumidas desde el cliente de forma controlada.',
    },
    techDecisions: [
      { technology: 'Astro', benefit: 'Carga mínima y rutas estáticas para una experiencia casi instantánea.' },
      { technology: 'TypeScript', benefit: 'Lógica de terminal y módulos tipados, mantenibles al crecer el proyecto.' },
      { technology: 'CSS + efectos CRT', benefit: 'Estética retro-futurista sin sacrificar legibilidad en móvil.' },
    ],
    metrics: [
      { label: 'Tiempo de carga', before: 'Webs portfolio genéricas', after: '< 2 s en edge' },
      { label: 'Memorabilidad', before: 'Plantilla estándar', after: 'Experiencia única' },
      { label: 'Módulos interactivos', before: '0', after: '6+ en un solo sitio' },
      { label: 'Dependencia de PDF', before: '100% CV estático', after: 'CV dentro de la terminal' },
    ],
    featuredMetric: '6+ módulos en una terminal',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['Astro', 'TypeScript', 'CSS3'],
    image: {
      jpg: 'images/proyectos/gusi-dev.jpg',
      alt: 'gusi.dev - Terminal cyberpunk interactiva',
    },
    demoUrl: 'https://gusi.dev',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto gusi.dev y me interesa algo creativo e interactivo para mi marca.\n\nMi negocio: [tu sector]\nNecesito: web con personalidad / experiencia interactiva\n\n¿Tienes disponibilidad para hablarlo?',
    metaTitle: 'gusi.dev · Terminal cyberpunk interactiva | Caso de estudio',
    metaDescription:
      'Proyecto personal en producción: terminal estilo Blade Runner con juegos, noticias y APIs. Portfolio experimental de Jose Martínez (Gusi).',
    hasArchitectureDiagram: false,
  },
];
