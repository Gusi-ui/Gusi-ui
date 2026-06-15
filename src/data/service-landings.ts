import type { IconName } from '@/lib/icons';

export type ServiceSlug =
  | 'desarrollo-web'
  | 'optimizacion-web'
  | 'backend-apis'
  | 'mantenimiento';

export type ServiceInclude = {
  title: string;
  description: string;
};

export type ServiceProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceLanding = {
  slug: ServiceSlug;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  problemTitle: string;
  problemText: string;
  solutionText: string;
  includes: ServiceInclude[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
  relatedBlogSlugs: string[];
  siloLabel: string;
};

export const SERVICE_SLUGS: ServiceSlug[] = [
  'desarrollo-web',
  'optimizacion-web',
  'backend-apis',
  'mantenimiento',
];

export const serviceLandings: ServiceLanding[] = [
  {
    slug: 'desarrollo-web',
    metaTitle: 'Desarrollo Web desde 250€ | Entrega 7-10 días | alamia.es',
    metaDescription:
      'Página web profesional para autónomos y PYMEs desde 250€. Diseño responsive, SEO básico y entrega en 7-10 días. +50 proyectos. Presupuesto sin compromiso.',
    h1: 'Desarrollo Web Profesional para Autónomos y PYMEs',
    heroSubtitle:
      'Tu presencia online lista para captar clientes, sin complicaciones técnicas. Diseño moderno, móvil primero y optimizada para Google.',
    problemTitle: '¿Tu negocio pierde clientes por no tener web?',
    problemText:
      'Cada día que tu negocio no tiene una web profesional, potenciales clientes eligen a la competencia. Una página lenta, antigua o inexistente transmite desconfianza y te cuesta oportunidades reales de venta.',
    solutionText:
      'Desarrollo tu web a medida con tecnologías modernas (Astro, React), diseño responsive y SEO básico configurado desde el primer día. Entrega en 7-10 días laborables con un único pago de 250€.',
    includes: [
      {
        title: 'Diseño responsive',
        description: 'Tu web se ve perfecta en móvil, tablet y escritorio.',
      },
      {
        title: 'SEO básico configurado',
        description: 'Meta tags, sitemap, schema y estructura optimizada para Google.',
      },
      {
        title: 'Rendimiento optimizado',
        description: 'Carga rápida con imágenes modernas y código ligero.',
      },
      {
        title: 'Formulario de contacto',
        description: 'Captura leads directamente desde tu web.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Brief inicial',
        description: 'Conversamos por WhatsApp o email sobre tu negocio, objetivos y referencias.',
      },
      {
        step: 2,
        title: 'Diseño y estructura',
        description: 'Defino la arquitectura de la web y el estilo visual acorde a tu marca.',
      },
      {
        step: 3,
        title: 'Desarrollo',
        description: 'Programo la web con código limpio, responsive y listo para producción.',
      },
      {
        step: 4,
        title: 'Publicación',
        description: 'Despliego en tu dominio y te entrego todo listo para captar clientes.',
      },
    ],
    faqs: [
      {
        question: '¿Qué incluye el precio de 250€?',
        answer:
          'Incluye diseño responsive, hasta 5 secciones, SEO básico, formulario de contacto y despliegue. No incluye dominio, hosting ni redacción de textos extensos.',
      },
      {
        question: '¿Cuánto tarda en estar lista mi web?',
        answer: 'El plazo habitual es de 7 a 10 días laborables desde que recibo todo el contenido necesario.',
      },
      {
        question: '¿Necesito saber de tecnología?',
        answer:
          'No. Te guío en cada paso y te entrego la web lista para usar. Solo necesitas proporcionar textos, logo e imágenes básicas.',
      },
      {
        question: '¿Puedo pedir cambios después de la entrega?',
        answer:
          'Sí. Incluyo una ronda de revisiones durante el desarrollo. Cambios posteriores se pueden contratar por separado o con el plan de mantenimiento mensual.',
      },
      {
        question: '¿Trabajas con clientes fuera de Barcelona?',
        answer:
          'Sí. Trabajo con clientes de toda España de forma remota. La comunicación es por WhatsApp, email y videollamada.',
      },
    ],
    relatedBlogSlugs: ['cuanto-cuesta-pagina-web-autonomos'],
    siloLabel: 'Desarrollo Web',
  },
  {
    slug: 'optimizacion-web',
    metaTitle: 'Optimización Web y Core Web Vitals desde 190€ | alamia.es',
    metaDescription:
      'Mejora la velocidad y el SEO técnico de tu web. Auditoría Core Web Vitals, optimización LCP/INP y informe antes/después. Desde 190€ pago único.',
    h1: 'Optimización Web y Core Web Vitals',
    heroSubtitle:
      'Acelera tu web y mejora tu posicionamiento con métricas reales de rendimiento. Ideal si ya tienes web pero carga lenta o puntúa mal en PageSpeed.',
    problemTitle: '¿Tu web carga lenta y Google te penaliza?',
    problemText:
      'Una web lenta aumenta la tasa de rebote, reduce conversiones y empeora tu posicionamiento. Si PageSpeed Insights te marca en rojo o naranja, estás perdiendo visitas y ventas.',
    solutionText:
      'Realizo una auditoría completa de Core Web Vitals, optimizo LCP, INP y CLS, y te entrego un informe comparativo antes/después con mejoras medibles.',
    includes: [
      {
        title: 'Auditoría Core Web Vitals',
        description: 'Análisis de LCP, INP, CLS y diagnóstico de cuellos de botella.',
      },
      {
        title: 'Optimización de carga',
        description: 'Imágenes, fuentes, JS/CSS y caché optimizados para máxima velocidad.',
      },
      {
        title: 'Informe antes/después',
        description: 'Métricas comparativas con capturas de PageSpeed y Lighthouse.',
      },
      {
        title: 'SEO técnico básico',
        description: 'Revisión de meta tags, canonical, sitemap y errores de rastreo.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Auditoría inicial',
        description: 'Mido rendimiento actual con Lighthouse, PageSpeed y Search Console.',
      },
      {
        step: 2,
        title: 'Plan de acción',
        description: 'Priorizo mejoras por impacto: imágenes, scripts, servidor y caché.',
      },
      {
        step: 3,
        title: 'Implementación',
        description: 'Aplico optimizaciones en tu web sin romper funcionalidad existente.',
      },
      {
        step: 4,
        title: 'Informe final',
        description: 'Te entrego métricas mejoradas y recomendaciones de mantenimiento.',
      },
    ],
    faqs: [
      {
        question: '¿Cuánto puedo mejorar la velocidad?',
        answer:
          'Depende del estado inicial, pero es habitual ver mejoras del 30-70% en LCP y puntuaciones de PageSpeed significativamente más altas.',
      },
      {
        question: '¿Funciona con WordPress?',
        answer: 'Sí. Optimizo WordPress, Astro, React y la mayoría de stacks web modernos.',
      },
      {
        question: '¿Romperá algo de mi web actual?',
        answer:
          'Trabajo con precaución y pruebas. Hago backup antes de cambios y verifico que todo funcione correctamente.',
      },
      {
        question: '¿Incluye posicionamiento en Google?',
        answer:
          'Incluye SEO técnico (velocidad, rastreo, estructura). El posicionamiento de contenidos requiere estrategia adicional.',
      },
    ],
    relatedBlogSlugs: [],
    siloLabel: 'Optimización Web',
  },
  {
    slug: 'backend-apis',
    metaTitle: 'Backend y APIs desde 400€ | Escalable y Seguro | alamia.es',
    metaDescription:
      'Desarrollo de APIs REST, bases de datos y paneles admin para tu negocio. Node.js, documentación incluida. Desde 400€. Presupuesto sin compromiso.',
    h1: 'Desarrollo de Backend y APIs a Medida',
    heroSubtitle:
      'La base técnica que tu negocio necesita para escalar con seguridad. APIs documentadas, base de datos configurada y panel de administración.',
    problemTitle: '¿Tu negocio necesita más que una web estática?',
    problemText:
      'Cuando gestionas pedidos, usuarios, reservas o integraciones con terceros (Stripe, CRM, ERP), una web sola no basta. Necesitas un backend robusto que conecte todo.',
    solutionText:
      'Desarrollo APIs REST documentadas con Node.js, configuro tu base de datos y creo un panel admin básico para que gestiones tu negocio sin depender de código.',
    includes: [
      {
        title: 'API REST documentada',
        description: 'Endpoints claros, autenticación y documentación para futuras integraciones.',
      },
      {
        title: 'Base de datos configurada',
        description: 'PostgreSQL o MongoDB según las necesidades de tu proyecto.',
      },
      {
        title: 'Panel admin básico',
        description: 'Gestiona contenido, usuarios o pedidos desde un panel web.',
      },
      {
        title: 'Integraciones',
        description: 'Conexión con Stripe, email transaccional y servicios externos.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Análisis técnico',
        description: 'Definimos entidades, flujos de datos y integraciones necesarias.',
      },
      {
        step: 2,
        title: 'Arquitectura',
        description: 'Diseño la estructura de API, base de datos y seguridad.',
      },
      {
        step: 3,
        title: 'Desarrollo',
        description: 'Implemento endpoints, lógica de negocio y panel admin.',
      },
      {
        step: 4,
        title: 'Entrega y documentación',
        description: 'API desplegada con documentación y guía de uso para tu equipo.',
      },
    ],
    faqs: [
      {
        question: '¿Qué tecnologías usas?',
        answer: 'Node.js, TypeScript, PostgreSQL/MongoDB y despliegue en Cloudflare Workers o VPS según el proyecto.',
      },
      {
        question: '¿Puedo conectar la API con mi web actual?',
        answer: 'Sí. Diseño la API para integrarse con tu frontend existente o uno nuevo.',
      },
      {
        question: '¿Incluye mantenimiento?',
        answer:
          'El desarrollo es pago único. Puedes añadir el plan de mantenimiento mensual (10€/mes) para actualizaciones y soporte.',
      },
      {
        question: '¿Es seguro para datos de clientes?',
        answer:
          'Implemento autenticación, HTTPS, validación de datos y buenas prácticas de seguridad estándar.',
      },
    ],
    relatedBlogSlugs: ['que-es-api-rest'],
    siloLabel: 'Backend & APIs',
  },
  {
    slug: 'mantenimiento',
    metaTitle: 'Mantenimiento Web 10€/mes | Soporte y Seguridad | alamia.es',
    metaDescription:
      'Plan de mantenimiento web mensual desde 10€. Actualizaciones de seguridad, copias de seguridad, monitorización 24/7 y soporte en menos de 24h.',
    h1: 'Mantenimiento Web Mensual Profesional',
    heroSubtitle:
      'Tu web siempre actualizada, segura y monitorizada. Olvídate de los problemas técnicos por menos de un café a la semana.',
    problemTitle: '¿Y si tu web se cae o la hackean un domingo?',
    problemText:
      'Sin mantenimiento, las vulnerabilidades se acumulan, los backups no existen y un fallo técnico puede dejarte sin web durante días. Cada hora offline es dinero perdido.',
    solutionText:
      'Con el plan de mantenimiento mensual me encargo de actualizaciones de seguridad, copias automáticas, monitorización 24/7 y soporte con respuesta en menos de 24 horas.',
    includes: [
      {
        title: 'Actualizaciones de seguridad',
        description: 'Parches mensuales para mantener tu web protegida.',
      },
      {
        title: 'Copias de seguridad automáticas',
        description: 'Backups programados para recuperar tu web ante cualquier incidente.',
      },
      {
        title: 'Monitorización 24/7',
        description: 'Alertas si tu web deja de estar disponible.',
      },
      {
        title: '1 hora de cambios menores',
        description: 'Textos, imágenes o ajustes pequeños incluidos cada mes.',
      },
    ],
    process: [
      {
        step: 1,
        title: 'Activación',
        description: 'Contratas online y configuro el monitorización en tu web.',
      },
      {
        step: 2,
        title: 'Auditoría inicial',
        description: 'Reviso el estado actual y aplico las primeras actualizaciones.',
      },
      {
        step: 3,
        title: 'Mantenimiento mensual',
        description: 'Actualizaciones, backups y revisión de seguridad cada mes.',
      },
      {
        step: 4,
        title: 'Informe mensual',
        description: 'Recibes un resumen del estado de tu web y acciones realizadas.',
      },
    ],
    faqs: [
      {
        question: '¿Puedo cancelar cuando quiera?',
        answer: 'Sí. Sin permanencia. Cancelas desde el portal de gestión cuando lo necesites.',
      },
      {
        question: '¿Qué incluye la hora de cambios menores?',
        answer:
          'Cambios de texto, sustitución de imágenes, ajustes de estilo menores o corrección de enlaces rotos.',
      },
      {
        question: '¿Funciona con webs que no has desarrollado tú?',
        answer:
          'Sí, siempre que la web use tecnologías que pueda mantener (WordPress, Astro, React, HTML estático).',
      },
      {
        question: '¿Qué pasa si mi web se cae?',
        answer:
          'Recibo alerta automática, investigo la causa y trabajo en la recuperación lo antes posible.',
      },
    ],
    relatedBlogSlugs: [],
    siloLabel: 'Mantenimiento Web',
  },
];

export const getServiceLanding = (slug: string): ServiceLanding | undefined =>
  serviceLandings.find((landing) => landing.slug === slug);

export const getServiceLandingPath = (slug: ServiceSlug): string => `/servicios/${slug}/`;
