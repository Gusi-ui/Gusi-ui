import { extraProjectCaseStudies } from '@/data/project-case-studies-extra';
import { ecommerceProjectCaseStudies } from '@/data/project-case-studies-ecommerce';
import { personalProjectCaseStudies } from '@/data/project-case-studies-personal';

export type ProjectMetric = {
  label: string;
  before: string;
  after: string;
};

export type TechDecision = {
  technology: string;
  benefit: string;
};

export type ProjectSolution = {
  frontend: string;
  backend?: string;
  integrations?: string;
  security: string;
};

export type ProjectImage = {
  avif?: string;
  webp?: string;
  jpg: string;
  alt: string;
};

export type ProjectCaseStudy = {
  id: string;
  type: 'web' | 'ecommerce';
  badge: string;
  title: string;
  /** Gancho corto para la tarjeta del grid */
  hook: string;
  /** Sector · tipo de cliente */
  context: string;
  problem: string[];
  solutionSummary: string;
  solution: ProjectSolution;
  techDecisions: TechDecision[];
  metrics: ProjectMetric[];
  featuredMetric: string;
  serviceSlug: 'desarrollo-web' | 'backend-apis';
  serviceLabel: string;
  servicePrice: number;
  tech: string[];
  image: ProjectImage;
  demoUrl: string;
  whatsappMessage: string;
  metaTitle: string;
  metaDescription: string;
  hasArchitectureDiagram: boolean;
};

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'app-restaurante',
    type: 'web',
    badge: 'App Móvil',
    title: 'App Restaurante',
    hook: 'Menú digital, pedidos en tiempo real y reservas sin errores de comanda.',
    context: 'Hostelería · Restaurante de 40 cubiertos',
    problem: [
      'La Brasa gestionaba pedidos por WhatsApp y reservas en una libreta. Los fines de semana, errores en comandas y mesas dobles eran el pan de cada día.',
      'Sin un sistema centralizado, el equipo perdía hasta 2 horas diarias coordinando sala y cocina.',
    ],
    solutionSummary:
      'App con menú digital, pedidos en tiempo real y reservas automatizadas para que el personal se centre en el cliente, no en el papel.',
    solution: {
      frontend:
        'Interfaz móvil con menú por categorías, carrito de pedido y confirmación visual. Diseñada para usarse con una mano en hora punta.',
      backend:
        'API REST en Node.js que sincroniza pedidos entre sala y cocina al instante, sin duplicar comandas ni perder órdenes.',
      integrations:
        'Panel de reservas con validación de disponibilidad: si la mesa está ocupada, el sistema lo bloquea automáticamente.',
      security:
        'Acceso por roles (camarero / cocina / admin) y conexión cifrada HTTPS para proteger datos de clientes y pedidos.',
    },
    techDecisions: [
      {
        technology: 'React Native',
        benefit: 'Una sola base de código para iOS y Android, reduciendo coste de mantenimiento.',
      },
      {
        technology: 'Node.js',
        benefit: 'Backend rápido de desplegar que escala si el restaurante abre más locales.',
      },
      {
        technology: 'MongoDB',
        benefit: 'Menú flexible: platos del día, temporadas y cambios de precio sin migraciones complejas.',
      },
    ],
    metrics: [
      { label: 'Gestión de pedidos', before: 'Manual por WhatsApp', after: '100% digitalizado' },
      { label: 'Errores en comandas', before: 'Frecuentes en hora punta', after: 'Validación automática' },
      { label: 'Reservas duplicadas', before: '1–2 por semana', after: '0 con calendario centralizado' },
      { label: 'Disponibilidad', before: 'Horario comercial', after: 'Menú y reservas 24/7' },
    ],
    featuredMetric: '−2 h/día en coordinación de sala',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['React Native', 'Node.js', 'MongoDB'],
    image: {
      jpg: 'images/proyectos/app-restaurante.svg',
      alt: 'App móvil para restaurante - Sistema de pedidos online',
    },
    demoUrl: '/proyectos-ejemplo/app-restaurante/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "App Restaurante" y me interesa algo similar.\n\nMi negocio: restaurante\nNecesito: menú digital + pedidos + reservas\nPresupuesto orientativo: 400€ backend\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'App Restaurante · Menú digital y pedidos | Caso de estudio',
    metaDescription:
      'Caso de estudio: app para restaurante con menú digital, pedidos en tiempo real y reservas automatizadas. Proyecto de demostración con Node.js y React Native.',
    hasArchitectureDiagram: true,
  },
  {
    id: 'dashboard-analytics',
    type: 'web',
    badge: 'Dashboard',
    title: 'Analytics Dashboard',
    hook: 'Decisiones de negocio con KPIs claros, sin exportar Excel cada semana.',
    context: 'Retail · Tienda online con 200+ productos',
    problem: [
      'El equipo tomaba decisiones a ciegas: no sabían qué producto vendía más, de dónde venían los clientes ni cuándo picaban las ventas.',
      'Cada lunes dedicaban 45 minutos a montar informes en hojas de cálculo que quedaban obsoletos al día siguiente.',
    ],
    solutionSummary:
      'Panel de control con métricas en tiempo real, gráficos interactivos y filtros por periodo para ver el negocio de un vistazo.',
    solution: {
      frontend:
        'Dashboard responsive con gráficos de barras, líneas y dona. Cualquier persona del equipo entiende los datos sin formación técnica.',
      backend:
        'API que agrega ventas, tráfico y conversión por periodo. Los datos se actualizan al refrescar, sin recargar toda la página.',
      security:
        'Acceso restringido con sesión segura. Solo usuarios autorizados ven cifras de facturación y clientes.',
    },
    techDecisions: [
      {
        technology: 'Chart.js',
        benefit: 'Gráficos ligeros y legibles que cargan rápido incluso con muchos datos.',
      },
      {
        technology: 'JavaScript modular',
        benefit: 'Código organizado por módulos para añadir nuevos KPIs sin rehacer el panel.',
      },
      {
        technology: 'CSS Grid + variables',
        benefit: 'Layout adaptable a móvil, tablet y pantalla grande sin duplicar vistas.',
      },
    ],
    metrics: [
      { label: 'Tiempo en informes', before: '~45 min/semana', after: '< 5 min/día' },
      { label: 'KPIs visibles', before: 'Dispersos en Excel', after: '5+ en un solo panel' },
      { label: 'Actualización de datos', before: 'Manual semanal', after: 'Al instante al filtrar' },
      { label: 'Tiempo de carga', before: '4–6 s (hojas pesadas)', after: '< 2.5 s objetivo' },
    ],
    featuredMetric: '5+ KPIs en un solo panel',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['Chart.js', 'JavaScript', 'CSS3'],
    image: {
      jpg: 'images/proyectos/dashboard-analytics.svg',
      alt: 'Dashboard de analytics - Métricas y análisis de datos en tiempo real',
    },
    demoUrl: '/proyectos-ejemplo/dashboard-analytics/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Analytics Dashboard" y me interesa algo similar.\n\nMi negocio: tienda / ecommerce\nNecesito: panel con métricas de ventas\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Analytics Dashboard · Panel de métricas | Caso de estudio',
    metaDescription:
      'Caso de estudio: dashboard interactivo con KPIs, gráficos y filtros por periodo. Proyecto de demostración para retail y ecommerce.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'ecommerce-boutique',
    type: 'ecommerce',
    badge: 'E-Commerce',
    title: 'Boutique Online',
    hook: 'Tienda elegante con checkout en 3 clics y catálogo optimizado para móvil.',
    context: 'Moda · Boutique con tienda física en centro urbano',
    problem: [
      'La boutique dependía del paso por tienda: sin catálogo online, perdía ventas fuera del horario comercial y de clientes que compran desde el móvil.',
      'Los pagos por transferencia o Bizum manual generaban abandonos de carrito y seguimiento tedioso de cada pedido.',
    ],
    solutionSummary:
      'Tienda online con catálogo filtrable, carrito persistente y checkout integrado para vender 24/7 sin perseguir pagos.',
    solution: {
      frontend:
        'Catálogo con filtros por talla y categoría, ficha de producto con galería y carrito optimizado para móvil (donde ocurre el 70% de compras en moda).',
      backend:
        'API de inventario que actualiza stock al instante: si una talla se agota, el cliente lo ve antes de pagar.',
      integrations:
        'Checkout preparado para Stripe: pagos con tarjeta en 3 clics, sin confirmaciones manuales por WhatsApp.',
      security:
        'HTTPS, validación de datos en servidor y cumplimiento PCI delegado en Stripe (los datos de tarjeta nunca pasan por tu web).',
    },
    techDecisions: [
      {
        technology: 'HTML5 semántico + CSS3',
        benefit: 'Base ligera y rápida, ideal para catálogos con buen SEO y carga mínima.',
      },
      {
        technology: 'JavaScript vanilla',
        benefit: 'Carrito y filtros sin frameworks pesados: menos JavaScript, más velocidad.',
      },
      {
        technology: 'Stripe (integración)',
        benefit: 'Cobros automáticos al 100%: el pedido se confirma solo al pagar.',
      },
    ],
    metrics: [
      { label: 'Disponibilidad de venta', before: 'Horario comercial', after: '24/7 online' },
      { label: 'Pagos manuales', before: 'Bizum / transferencia', after: '100% automatizados' },
      { label: 'Abandono en checkout', before: 'Alto (fricción manual)', after: 'Reducido con 3 clics' },
      { label: 'Tiempo de carga (LCP)', before: '4–6 s típico', after: '< 2.5 s objetivo' },
    ],
    featuredMetric: 'Ventas 24/7 sin intervención manual',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Stripe'],
    image: {
      jpg: 'images/proyectos/ecommerce-boutique.svg',
      alt: 'E-commerce boutique - Tienda online con carrito de compras',
    },
    demoUrl: '/proyectos-ejemplo/ecommerce-boutique/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Boutique Online" y me interesa algo similar.\n\nMi negocio: tienda de moda\nNecesito: ecommerce con pagos online\nPresupuesto orientativo: 400€ backend\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Boutique Online · E-commerce con checkout | Caso de estudio',
    metaDescription:
      'Caso de estudio: tienda online con catálogo, carrito y checkout integrado. Proyecto de demostración para retail y moda.',
    hasArchitectureDiagram: true,
  },
  {
    id: 'gestion-citas',
    type: 'web',
    badge: 'Sistema Web',
    title: 'Gestión de Citas',
    hook: 'Agenda digital que elimina solapamientos y reduce las citas perdidas.',
    context: 'Salud · Clínica de fisioterapia con 3 profesionales',
    problem: [
      'La clínica gestionaba citas en una agenda de papel y por teléfono. Llamadas perdidas, huecos vacíos y pacientes que no acudían sin avisar.',
      'Cada recepcionista dedicaba más de una hora diaria a cuadrar horarios entre tres agendas distintas.',
    ],
    solutionSummary:
      'Sistema web con calendario interactivo, reserva online y confirmaciones automáticas para centralizar toda la agenda.',
    solution: {
      frontend:
        'Calendario visual por profesional y día, con slots disponibles en verde y ocupados en gris. El paciente reserva en menos de 1 minuto.',
      backend:
        'Motor de disponibilidad que impide solapamientos: si un hueco está cogido, nadie más puede reservarlo.',
      integrations:
        'Confirmación automática por email (simulada en demo) y recordatorio previo a la cita para reducir no-shows.',
      security:
        'Datos de pacientes protegidos con acceso por rol y validación en servidor de cada reserva.',
    },
    techDecisions: [
      {
        technology: 'JavaScript + LocalStorage/API',
        benefit: 'Reservas persistentes sin perder datos al cerrar el navegador.',
      },
      {
        technology: 'CSS Grid para calendario',
        benefit: 'Vista clara en móvil y escritorio sin scroll infinito.',
      },
      {
        technology: 'Validación en servidor',
        benefit: 'Cero citas duplicadas aunque dos personas reserven a la vez.',
      },
    ],
    metrics: [
      { label: 'Gestión de agenda', before: 'Papel + teléfono', after: '100% digital' },
      { label: 'Solapamientos', before: '2–3 por semana', after: '0 con validación' },
      { label: 'No-shows estimados', before: '~25% del sector', after: '−20–30% con recordatorios' },
      { label: 'Tiempo recepción', before: '~60 min/día', after: '< 15 min/día' },
    ],
    featuredMetric: '0 solapamientos en agenda',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      jpg: 'images/proyectos/gestion-citas.svg',
      alt: 'Sistema de gestión de citas - Calendario y agenda online',
    },
    demoUrl: '/proyectos-ejemplo/gestion-citas/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Gestión de Citas" y me interesa algo similar.\n\nMi negocio: clínica / consulta\nNecesito: agenda online con reservas\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Gestión de Citas · Agenda online | Caso de estudio',
    metaDescription:
      'Caso de estudio: sistema de citas con calendario interactivo, validación de disponibilidad y confirmaciones automáticas.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'plataforma-educativa',
    type: 'web',
    badge: 'Plataforma Web',
    title: 'Plataforma Educativa',
    hook: 'Cursos online con progreso visible y lecciones que el alumno puede retomar donde lo dejó.',
    context: 'Formación · Academia online de marketing digital',
    problem: [
      'La academia repartía PDFs y vídeos sueltos por email. Los alumnos no sabían en qué módulo iban ni cuánto les quedaba por completar.',
      'Sin seguimiento centralizado, el 40% de inscripciones no terminaban el curso y era imposible identificar en qué lección abandonaban.',
    ],
    solutionSummary:
      'Plataforma con cursos estructurados, lecciones interactivas y barra de progreso para retener alumnos y medir avance.',
    solution: {
      frontend:
        'Interfaz de curso con sidebar de lecciones, reproductor integrado y barra de progreso por módulo. El alumno retoma exactamente donde lo dejó.',
      backend:
        'Sistema de seguimiento que guarda lección completada, tiempo invertido y porcentaje del curso.',
      security:
        'Acceso por usuario: cada alumno solo ve sus cursos contratados, no el catálogo ajeno.',
    },
    techDecisions: [
      {
        technology: 'HTML5 + CSS3 progresivo',
        benefit: 'Carga rápida en conexiones móviles, donde muchos alumnos estudian.',
      },
      {
        technology: 'JavaScript modular',
        benefit: 'Lógica de progreso separada del contenido: fácil añadir nuevos cursos.',
      },
      {
        technology: 'Diseño mobile-first',
        benefit: 'El 65% del aprendizaje online ocurre desde el teléfono.',
      },
    ],
    metrics: [
      { label: 'Seguimiento de progreso', before: 'Ninguno', after: 'Por lección y curso' },
      { label: 'Tasa de finalización', before: '~60% (sector)', after: '+15–20% con progreso visible' },
      { label: 'Material disperso', before: 'Email / Drive', after: 'Centralizado en plataforma' },
      { label: 'Tiempo de carga', before: '3–5 s', after: '< 2 s objetivo' },
    ],
    featuredMetric: '+15–20% finalización estimada',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      jpg: 'images/proyectos/plataforma-educativa.svg',
      alt: 'Plataforma Educativa Online - Interfaz de cursos y progreso',
    },
    demoUrl: '/proyectos-ejemplo/plataforma-educativa/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Plataforma Educativa" y me interesa algo similar.\n\nMi negocio: academia / formación\nNecesito: cursos online con seguimiento\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Plataforma Educativa · Cursos online | Caso de estudio',
    metaDescription:
      'Caso de estudio: plataforma de aprendizaje con cursos, lecciones y seguimiento de progreso del alumno.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'portal-inmobiliario',
    type: 'web',
    badge: 'Portal Web',
    title: 'Portal Inmobiliario',
    hook: 'Búsqueda avanzada de propiedades y captación de leads cualificados en un solo portal.',
    context: 'Inmobiliaria · Agencia con 80+ propiedades activas',
    problem: [
      'Las propiedades estaban repartidas entre Idealista, Fotocasa y una web desactualizada. Leads dispersos y sin control de qué anuncio generaba contactos.',
      'Los clientes abandonaban la búsqueda porque los filtros eran limitados y las fotos tardaban en cargar.',
    ],
    solutionSummary:
      'Portal propio con búsqueda multicriterio, galería optimizada y formularios de contacto que cualifican al interesado.',
    solution: {
      frontend:
        'Buscador con filtros simultáneos (zona, precio, habitaciones, m²), galería con carga progresiva y ficha detallada por propiedad.',
      backend:
        'API de listado con paginación y filtros en servidor: resultados instantáneos aunque haya cientos de inmuebles.',
      integrations:
        'Formulario de contacto con validación y campos de intención (comprar / alquilar) para priorizar leads calientes.',
      security:
        'Protección anti-spam en formularios y conexión segura para datos de contacto de clientes.',
    },
    techDecisions: [
      {
        technology: 'JavaScript + fetch API',
        benefit: 'Búsqueda dinámica sin recargar la página: experiencia fluida para el usuario.',
      },
      {
        technology: 'Imágenes optimizadas (AVIF/WebP)',
        benefit: 'Galerías que cargan 3× más rápido que JPEG sin perder calidad visual.',
      },
      {
        technology: 'HTML semántico',
        benefit: 'Mejor posicionamiento en Google para búsquedas locales de propiedades.',
      },
    ],
    metrics: [
      { label: 'Filtros de búsqueda', before: '1–2 básicos', after: '4+ simultáneos' },
      { label: 'Carga de galería', before: '5–8 s', after: '< 2 s con lazy load' },
      { label: 'Leads cualificados', before: 'Sin segmentar', after: 'Formulario con intención' },
      { label: 'Control de anuncios', before: 'Disperso en portales', after: 'Centralizado' },
    ],
    featuredMetric: '4+ filtros de búsqueda simultáneos',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      jpg: 'images/proyectos/portal-inmobiliario.svg',
      alt: 'Portal inmobiliario - Búsqueda de propiedades y bienes raíces',
    },
    demoUrl: '/proyectos-ejemplo/portal-inmobiliario/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Portal Inmobiliario" y me interesa algo similar.\n\nMi negocio: inmobiliaria\nNecesito: portal con búsqueda y fichas\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Portal Inmobiliario · Búsqueda de propiedades | Caso de estudio',
    metaDescription:
      'Caso de estudio: portal inmobiliario con búsqueda avanzada, galería optimizada y captación de leads cualificados.',
    hasArchitectureDiagram: false,
  },
  ...extraProjectCaseStudies,
  ...ecommerceProjectCaseStudies,
  ...personalProjectCaseStudies,
];

export const getProjectBySlug = (slug: string): ProjectCaseStudy | undefined =>
  projectCaseStudies.find((project) => project.id === slug);

export const getRelatedProjects = (
  currentId: string,
  limit = 3,
): ProjectCaseStudy[] =>
  projectCaseStudies.filter((project) => project.id !== currentId).slice(0, limit);
