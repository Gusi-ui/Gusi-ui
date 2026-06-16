import type { ProjectCaseStudy } from '@/data/project-case-studies';

export const ecommerceProjectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'ecommerce-tech',
    type: 'ecommerce',
    badge: 'E-Commerce',
    title: 'TechStore Online',
    hook: 'Tienda de gadgets con filtros, ficha técnica y checkout simulado listo para Stripe.',
    context: 'Electrónica · Tienda online de accesorios tech',
    problem: [
      'La tienda vendía solo en marketplaces con comisiones del 15% y sin control de la marca.',
      'Los clientes no encontraban compatibilidad ni especificaciones claras desde el móvil.',
    ],
    solutionSummary:
      'E-commerce de gadgets con filtros por categoría, comparación rápida y carrito optimizado para móvil.',
    solution: {
      frontend:
        'Catálogo con filtros (audio, periféricos, smart home), ficha con specs y carrito persistente.',
      backend:
        'Estructura preparada para API de stock y precios dinámicos sin rehacer el frontend.',
      integrations: 'Checkout simulado con flujo de 3 pasos, listo para conectar Stripe.',
      security: 'HTTPS y validación de formularios; datos de pago delegados a pasarela externa.',
    },
    techDecisions: [
      { technology: 'JavaScript vanilla', benefit: 'Tienda ligera que carga rápido en móvil.' },
      { technology: 'localStorage', benefit: 'Carrito que sobrevive al cerrar el navegador.' },
      { technology: 'CSS Grid', benefit: 'Catálogo adaptable de 1 a 4 columnas.' },
    ],
    metrics: [
      { label: 'Comisión marketplace', before: '~15%', after: '0% venta directa' },
      { label: 'Filtros de catálogo', before: 'Ninguno', after: '4 categorías' },
      { label: 'Checkout', before: 'Manual', after: '3 pasos automatizados' },
      { label: 'Tiempo de carga', before: '4–5 s', after: '< 2.5 s objetivo' },
    ],
    featuredMetric: '0% comisión de marketplace',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      jpg: 'images/proyectos/ecommerce-tech.jpg',
      alt: 'TechStore Online - E-commerce de gadgets',
    },
    demoUrl: '/proyectos-ejemplo/ecommerce-tech/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "TechStore Online" y me interesa un ecommerce similar.\n\nMi negocio: tienda de electrónica\nNecesito: tienda online con catálogo y pagos\nPresupuesto orientativo: 400€ backend\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'TechStore Online · E-commerce tech | Caso de estudio',
    metaDescription: 'Caso de estudio: tienda online de gadgets con filtros, carrito y checkout simulado.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'ecommerce-organico',
    type: 'ecommerce',
    badge: 'E-Commerce',
    title: 'EcoMercado',
    hook: 'Tienda de productos ecológicos con suscripción semanal y carrito por peso/unidad.',
    context: 'Alimentación · Cooperativa de productos orgánicos',
    problem: [
      'Los socios pedían por WhatsApp y el equipo copiaba pedidos a mano cada domingo.',
      'No había forma de combinar productos por peso (kg) y por unidad en un solo carrito.',
    ],
    solutionSummary:
      'Tienda con categorías eco, selector kg/unidad, cesta semanal y resumen de pedido para recogida o envío.',
    solution: {
      frontend:
        'Catálogo por categorías (fruta, despensa, higiene) con badge bio y precio por kg o unidad.',
      backend:
        'Cálculo automático del total según cantidad y tipo de medida, sin errores de redondeo manual.',
      integrations: 'Flujo de pedido semanal con fecha de entrega y nota para el repartidor.',
      security: 'Validación de cantidades mínimas y stock visible antes de confirmar.',
    },
    techDecisions: [
      { technology: 'HTML5 + CSS3', benefit: 'Imágenes y tipografía que transmiten confianza natural.' },
      { technology: 'JavaScript modular', benefit: 'Lógica de carrito separada por tipo de unidad (kg vs ud.).' },
      { technology: 'Diseño mobile-first', benefit: 'El 80% de pedidos de alimentación son desde móvil.' },
    ],
    metrics: [
      { label: 'Pedidos por WhatsApp', before: '100%', after: '< 20% objetivo' },
      { label: 'Errores en pedido', before: 'Frecuentes', after: 'Cálculo automático' },
      { label: 'Tiempo gestión pedidos', before: '~2 h/domingo', after: '< 20 min' },
      { label: 'Transparencia precio/kg', before: 'Consultar', after: 'Visible en ficha' },
    ],
    featuredMetric: '−90% pedidos manuales',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      jpg: 'images/proyectos/ecommerce-organico.jpg',
      alt: 'EcoMercado - Tienda online de productos ecológicos',
    },
    demoUrl: '/proyectos-ejemplo/ecommerce-organico/index.html',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto "EcoMercado" y me interesa un ecommerce similar.\n\nMi negocio: alimentación / cooperativa\nNecesito: tienda con pedidos online\nPresupuesto orientativo: 400€ backend\n\n¿Tienes disponibilidad esta semana?',
    metaTitle: 'EcoMercado · E-commerce ecológico | Caso de estudio',
    metaDescription: 'Caso de estudio: tienda online de productos orgánicos con carrito por kg/unidad y pedido semanal.',
    hasArchitectureDiagram: false,
  },
];
