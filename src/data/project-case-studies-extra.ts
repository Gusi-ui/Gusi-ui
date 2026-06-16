import type { ProjectCaseStudy } from '@/data/project-case-studies';

export const extraProjectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'landing-saas',
    type: 'web',
    badge: 'Landing SaaS',
    title: 'MetricFlow SaaS',
    hook: 'Landing que convierte visitas en pruebas gratuitas con pricing claro y CTA visible.',
    context: 'SaaS B2B · Startup de analítica para pymes',
    problem: [
      'MetricFlow tenía un producto sólido pero la web no explicaba el valor en 10 segundos. El 78% de visitantes salía sin probar la demo.',
      'El pricing estaba enterrado en un PDF y los leads llegaban sin saber qué plan necesitaban.',
    ],
    solutionSummary:
      'Landing con propuesta de valor clara, comparativa de planes y formulario de prueba gratuita integrado en el hero.',
    solution: {
      frontend:
        'Hero con beneficio principal, prueba social y CTA duplicado. Secciones de features, pricing con toggle mensual/anual y FAQ.',
      integrations:
        'Formulario de registro simulado con validación en tiempo real y confirmación visual al enviar.',
      security: 'Validación de email y campos obligatorios en cliente y servidor simulado.',
    },
    techDecisions: [
      { technology: 'HTML5 semántico', benefit: 'Estructura clara para SEO y lectores de pantalla.' },
      { technology: 'CSS Grid + Flexbox', benefit: 'Layout responsive sin frameworks pesados.' },
      { technology: 'JavaScript vanilla', benefit: 'Toggle de pricing y formulario sin dependencias.' },
    ],
    metrics: [
      { label: 'Tiempo hasta CTA', before: 'Scroll largo', after: 'Visible en hero' },
      { label: 'Comprensión del pricing', before: 'PDF externo', after: '3 planes comparados' },
      { label: 'Tiempo de carga (LCP)', before: '3–4 s', after: '< 2 s objetivo' },
      { label: 'Leads cualificados', before: 'Sin segmentar', after: 'Formulario con plan elegido' },
    ],
    featuredMetric: 'CTA visible sin hacer scroll',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: { jpg: 'images/proyectos/landing-saas.svg', alt: 'Landing page SaaS MetricFlow' },
    demoUrl: '/proyectos-ejemplo/landing-saas/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "MetricFlow SaaS" y me interesa algo similar.\n\nMi negocio: startup SaaS\nNecesito: landing con pricing y formulario\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'MetricFlow SaaS · Landing de conversión | Caso de estudio',
    metaDescription: 'Caso de estudio: landing SaaS con pricing, CTA y formulario de prueba gratuita.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'gestor-tareas',
    type: 'web',
    badge: 'Productividad',
    title: 'Gestor de Tareas',
    hook: 'Tablero Kanban para equipos que necesitan ver el estado de cada tarea de un vistazo.',
    context: 'Equipos remotos · Agencia de marketing de 8 personas',
    problem: [
      'El equipo coordinaba tareas en WhatsApp y hojas de cálculo. Nadie sabía qué estaba bloqueado ni quién tenía capacidad.',
      'Las reuniones de seguimiento consumían 3 horas semanales solo para actualizar estados.',
    ],
    solutionSummary:
      'Tablero Kanban con columnas Por hacer, En progreso y Hecho, drag & drop y persistencia local.',
    solution: {
      frontend:
        'Interfaz tipo Trello con tarjetas arrastrables, prioridades por color y contador por columna.',
      backend:
        'Persistencia en localStorage con sincronización al mover o editar tareas.',
      security: 'Datos locales del equipo sin exposición a terceros en la demo.',
    },
    techDecisions: [
      { technology: 'Drag & Drop API', benefit: 'Mover tareas sin recargar ni librerías externas.' },
      { technology: 'localStorage', benefit: 'Las tareas persisten entre sesiones del navegador.' },
      { technology: 'CSS variables', benefit: 'Prioridades visuales (alta/media/baja) de un vistazo.' },
    ],
    metrics: [
      { label: 'Reuniones de seguimiento', before: '~3 h/semana', after: '< 30 min/semana' },
      { label: 'Visibilidad del equipo', before: 'Dispersa', after: '100% en tablero' },
      { label: 'Tareas perdidas', before: 'Frecuentes', after: 'Centralizadas' },
      { label: 'Tiempo de actualización', before: 'Manual diario', after: 'Al instante' },
    ],
    featuredMetric: '−2.5 h/semana en reuniones',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: { jpg: 'images/proyectos/gestor-tareas.svg', alt: 'Gestor de tareas Kanban' },
    demoUrl: '/proyectos-ejemplo/gestor-tareas/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Gestor de Tareas" y me interesa algo similar.\n\nMi negocio: agencia / equipo\nNecesito: tablero Kanban de tareas\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Gestor de Tareas · Tablero Kanban | Caso de estudio',
    metaDescription: 'Caso de estudio: gestor de tareas con tablero Kanban, drag & drop y persistencia.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'presupuestador-web',
    type: 'web',
    badge: 'Herramienta Web',
    title: 'Presupuestador Web',
    hook: 'Calculadora interactiva que genera presupuestos de web en tiempo real para freelancers.',
    context: 'Servicios · Desarrollador freelance que cotiza webs a medida',
    problem: [
      'Cada presupuesto se calculaba a mano en Excel: 20–30 minutos por cliente y respuestas inconsistentes.',
      'Los clientes no entendían por qué un proyecto costaba más sin ver el desglose de funcionalidades.',
    ],
    solutionSummary:
      'Calculadora con páginas, funcionalidades y extras seleccionables que muestra el total al instante.',
    solution: {
      frontend:
        'Formulario interactivo con sliders, checkboxes y resumen lateral que se actualiza en tiempo real.',
      integrations:
        'Botón para copiar presupuesto al portapapeles o enviar por WhatsApp (simulado).',
      security: 'Cálculo en cliente sin enviar datos a servidores en la demo.',
    },
    techDecisions: [
      { technology: 'JavaScript reactivo', benefit: 'El total cambia al marcar cada opción, sin recargar.' },
      { technology: 'Diseño mobile-first', benefit: 'Cotizar desde el móvil en una reunión con el cliente.' },
      { technology: 'Sin backend', benefit: 'Herramienta ligera desplegable en cualquier hosting.' },
    ],
    metrics: [
      { label: 'Tiempo por presupuesto', before: '20–30 min', after: '< 2 min' },
      { label: 'Consistencia de precios', before: 'Variable', after: '100% según reglas' },
      { label: 'Transparencia al cliente', before: 'Baja', after: 'Desglose visible' },
      { label: 'Errores de cálculo', before: 'Ocasionales', after: '0 (automatizado)' },
    ],
    featuredMetric: 'Presupuesto en < 2 minutos',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: { jpg: 'images/proyectos/presupuestador-web.svg', alt: 'Presupuestador web interactivo' },
    demoUrl: '/proyectos-ejemplo/presupuestador-web/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Presupuestador Web" y me interesa algo similar.\n\nMi negocio: freelance / agencia\nNecesito: calculadora de presupuestos\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Presupuestador Web · Calculadora de cotizaciones | Caso de estudio',
    metaDescription: 'Caso de estudio: calculadora de presupuestos web con desglose en tiempo real.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'menu-qr-cafe',
    type: 'web',
    badge: 'Carta Digital',
    title: 'Menú QR Café',
    hook: 'Carta digital escaneable con alérgenos, precios actualizados y pedido en mesa.',
    context: 'Hostelería · Cafetería de especialidad con 25 mesas',
    problem: [
      'Imprimir cartas cada vez que cambiaba un precio o un café de temporada costaba tiempo y dinero.',
      'Los clientes preguntaban por alérgenos y el personal interrumpía el servicio para consultar.',
    ],
    solutionSummary:
      'Menú digital responsive accesible por QR con categorías, filtros de alérgenos y carrito de pedido.',
    solution: {
      frontend:
        'Carta por categorías (cafés, desayunos, dulces) con iconos de alérgenos y botón de añadir al pedido.',
      integrations:
        'Carrito de mesa que resume el pedido y simula envío a caja.',
      security: 'Sin datos personales: solo productos y cantidades en la demo.',
    },
    techDecisions: [
      { technology: 'Mobile-first', benefit: 'El 95% de escaneos QR son desde móvil.' },
      { technology: 'Filtros de alérgenos', benefit: 'El cliente filtra sin preguntar al camarero.' },
      { technology: 'JavaScript vanilla', benefit: 'Carga instantánea al escanear el QR.' },
    ],
    metrics: [
      { label: 'Coste de impresión cartas', before: 'Cada cambio de precio', after: '€0 (digital)' },
      { label: 'Consultas de alérgenos', before: '~15/día al personal', after: 'Autogestionadas' },
      { label: 'Actualización de precios', before: 'Reimprimir carta', after: 'Cambio en segundos' },
      { label: 'Tiempo de carga', before: 'N/A', after: '< 1.5 s objetivo' },
    ],
    featuredMetric: 'Carta actualizable al instante',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: { jpg: 'images/proyectos/menu-qr-cafe.svg', alt: 'Menú digital QR para cafetería' },
    demoUrl: '/proyectos-ejemplo/menu-qr-cafe/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Menú QR Café" y me interesa algo similar.\n\nMi negocio: cafetería / bar\nNecesito: carta digital con QR\nPresupuesto orientativo: 250€ web\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Menú QR Café · Carta digital | Caso de estudio',
    metaDescription: 'Caso de estudio: menú digital con QR, alérgenos y pedido en mesa para hostelería.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'crm-leads',
    type: 'web',
    badge: 'CRM',
    title: 'CRM de Leads',
    hook: 'Pipeline visual para no perder ningún contacto comercial entre llamada y cierre.',
    context: 'Ventas · Inmobiliaria boutique con 2 comerciales',
    problem: [
      'Los leads de Idealista y la web se apuntaban en notas del móvil. Seguimientos olvidados y oportunidades perdidas.',
      'Sin visibilidad del embudo, el responsable no sabía cuántos contactos había en negociación.',
    ],
    solutionSummary:
      'CRM ligero con pipeline Kanban (Nuevo → Contactado → Visita → Propuesta → Cerrado) y ficha por lead.',
    solution: {
      frontend:
        'Tablero con columnas de estado, tarjetas de lead con nombre, fuente y valor estimado.',
      backend:
        'API simulada con localStorage: mover lead de columna actualiza estado automáticamente.',
      security: 'Datos de contacto en localStorage, preparado para migrar a backend real.',
    },
    techDecisions: [
      { technology: 'Pipeline Kanban', benefit: 'Estado de cada lead visible sin abrir Excel.' },
      { technology: 'localStorage + JSON', benefit: 'Persistencia sin servidor en la demo.' },
      { technology: 'Filtros por fuente', benefit: 'Saber qué canal (web, Idealista, referido) convierte más.' },
    ],
    metrics: [
      { label: 'Leads sin seguimiento', before: '~30% perdidos', after: '< 5% con pipeline' },
      { label: 'Visibilidad del embudo', before: 'Ninguna', after: '5 etapas claras' },
      { label: 'Tiempo de actualización', before: 'Notas dispersas', after: 'Drag & drop' },
      { label: 'Tiempo de respuesta', before: '24–48 h', after: '< 4 h objetivo' },
    ],
    featuredMetric: '0 leads olvidados en pipeline',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: { jpg: 'images/proyectos/crm-leads.svg', alt: 'CRM de leads con pipeline Kanban' },
    demoUrl: '/proyectos-ejemplo/crm-leads/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "CRM de Leads" y me interesa algo similar.\n\nMi negocio: ventas / inmobiliaria\nNecesito: CRM con pipeline de leads\nPresupuesto orientativo: 400€ backend\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'CRM de Leads · Pipeline comercial | Caso de estudio',
    metaDescription: 'Caso de estudio: CRM ligero con pipeline Kanban para gestión de leads comerciales.',
    hasArchitectureDiagram: true,
  },
  {
    id: 'reservas-coworking',
    type: 'web',
    badge: 'Reservas',
    title: 'Reservas Coworking',
    hook: 'Reserva de escritorios y salas por horas sin llamadas ni emails de ida y vuelta.',
    context: 'Coworking · Espacio con 30 puestos y 3 salas de reuniones',
    problem: [
      'Las reservas llegaban por email y WhatsApp. Solapamientos frecuentes y salas dobles reservadas los martes.',
      'El community manager dedicaba 1 hora diaria a cuadrar disponibilidad manualmente.',
    ],
    solutionSummary:
      'Sistema de reservas con calendario visual, selección de recurso (escritorio/sala) y confirmación instantánea.',
    solution: {
      frontend:
        'Calendario semanal con slots disponibles en verde, selector de tipo de espacio y duración.',
      backend:
        'Motor de disponibilidad que bloquea slots ocupados en tiempo real.',
      integrations:
        'Confirmación simulada por email y resumen de reserva descargable.',
      security: 'Validación de fechas pasadas y solapamientos en servidor simulado.',
    },
    techDecisions: [
      { technology: 'Calendario interactivo', benefit: 'El usuario ve huecos libres sin preguntar.' },
      { technology: 'Validación de conflictos', benefit: 'Cero dobles reservas aunque dos personas reserven a la vez.' },
      { technology: 'localStorage + reglas', benefit: 'Demo funcional sin backend, migrable a API REST.' },
    ],
    metrics: [
      { label: 'Solapamientos', before: '2–3/semana', after: '0 con validación' },
      { label: 'Gestión manual', before: '~1 h/día', after: '< 10 min/día' },
      { label: 'Reservas online', before: '0%', after: '100% self-service' },
      { label: 'Disponibilidad', before: 'Horario oficina', after: '24/7' },
    ],
    featuredMetric: 'Reservas 24/7 sin llamadas',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: { jpg: 'images/proyectos/reservas-coworking.svg', alt: 'Sistema de reservas para coworking' },
    demoUrl: '/proyectos-ejemplo/reservas-coworking/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "Reservas Coworking" y me interesa algo similar.\n\nMi negocio: coworking / espacio flexible\nNecesito: reservas de escritorios y salas\nPresupuesto orientativo: 400€ backend\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'Reservas Coworking · Booking online | Caso de estudio',
    metaDescription: 'Caso de estudio: sistema de reservas para coworking con calendario y validación de disponibilidad.',
    hasArchitectureDiagram: true,
  },
];
