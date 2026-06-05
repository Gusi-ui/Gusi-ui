export type Project = {
  id: string;
  type: 'web' | 'ecommerce';
  badge: string;
  title: string;
  description: string;
  tech: string[];
  image: {
    avif?: string;
    webp?: string;
    jpg: string;
    alt: string;
  };
  demoUrl: string;
  whatsappMessage: string;
};

export const projects: Project[] = [
  {
    id: 'app-restaurante',
    type: 'web',
    badge: 'App Móvil',
    title: 'App Restaurante',
    description:
      'Aplicación móvil para restaurantes con menú digital, pedidos online y sistema de reservas.',
    tech: ['React Native', 'Node.js', 'MongoDB'],
    image: {
      avif: 'images/optimizadas/app-restaurante.avif',
      webp: 'images/optimizadas/app-restaurante.webp',
      jpg: 'images/proyectos/app-restaurante.jpg',
      alt: 'App móvil para restaurante - Sistema de pedidos online',
    },
    demoUrl: '/proyectos-ejemplo/app-restaurante/index.html',
    whatsappMessage:
      'Hola! Me interesa contratar un proyecto similar al de App Restaurante. ¿Podrías darme más información?',
  },
  {
    id: 'dashboard-analytics',
    type: 'web',
    badge: 'Dashboard',
    title: 'Analytics Dashboard',
    description:
      'Panel de control interactivo con gráficos, métricas y visualización de datos en tiempo real.',
    tech: ['Chart.js', 'JavaScript', 'CSS3'],
    image: {
      avif: 'images/optimizadas/dashboard-analytics.avif',
      webp: 'images/optimizadas/dashboard-analytics.webp',
      jpg: 'images/proyectos/dashboard-analytics.jpg',
      alt: 'Dashboard de analytics - Métricas y análisis de datos en tiempo real',
    },
    demoUrl: '/proyectos-ejemplo/dashboard-analytics/index.html',
    whatsappMessage:
      'Hola! Me interesa contratar un proyecto similar al de Dashboard Analytics. ¿Podrías darme más información?',
  },
  {
    id: 'ecommerce-boutique',
    type: 'ecommerce',
    badge: 'E-Commerce',
    title: 'Boutique Online',
    description:
      'Tienda online elegante con catálogo de productos, carrito de compras y checkout integrado.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      avif: 'images/optimizadas/ecommerce-boutique.avif',
      webp: 'images/optimizadas/ecommerce-boutique.webp',
      jpg: 'images/proyectos/ecommerce-boutique.jpg',
      alt: 'E-commerce boutique - Tienda online con carrito de compras',
    },
    demoUrl: '/proyectos-ejemplo/ecommerce-boutique/index.html',
    whatsappMessage:
      'Hola! Me interesa contratar un proyecto similar al de E-Commerce Boutique. ¿Podrías darme más información?',
  },
  {
    id: 'gestion-citas',
    type: 'web',
    badge: 'Sistema Web',
    title: 'Gestión de Citas',
    description:
      'Sistema completo para gestión de citas médicas con calendario interactivo y notificaciones.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      avif: 'imagen-gestion-citas.avif',
      webp: 'imagen-gestion-citas.webp',
      jpg: 'images/proyectos/gestion-citas.jpg',
      alt: 'Sistema de gestión de citas - Calendario y agenda online',
    },
    demoUrl: '/proyectos-ejemplo/gestion-citas/index.html',
    whatsappMessage:
      'Hola! Me interesa contratar un proyecto similar al de Gestión de Citas. ¿Podrías darme más información?',
  },
  {
    id: 'plataforma-educativa',
    type: 'web',
    badge: 'Plataforma Web',
    title: 'Plataforma Educativa',
    description:
      'Sistema de aprendizaje online con cursos, lecciones interactivas y seguimiento de progreso.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      avif: 'images/optimizadas/plataforma-educativa.avif',
      webp: 'images/optimizadas/plataforma-educativa.webp',
      jpg: 'images/proyectos/plataforma-educativa.jpg',
      alt: 'Captura de pantalla de la Plataforma Educativa Online mostrando la interfaz de cursos',
    },
    demoUrl: '/proyectos-ejemplo/plataforma-educativa/index.html',
    whatsappMessage:
      'Hola! Me interesa contratar un proyecto similar al de Plataforma Educativa. ¿Podrías darme más información?',
  },
  {
    id: 'portal-inmobiliario',
    type: 'web',
    badge: 'Portal Web',
    title: 'Portal Inmobiliario',
    description:
      'Plataforma completa para gestión inmobiliaria con búsqueda avanzada y galería de propiedades.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      avif: 'images/optimizadas/portal-inmobiliario.avif',
      webp: 'images/optimizadas/portal-inmobiliario.webp',
      jpg: 'images/proyectos/portal-inmobiliario.jpg',
      alt: 'Portal inmobiliario - Búsqueda de propiedades y bienes raíces',
    },
    demoUrl: '/proyectos-ejemplo/portal-inmobiliario/index.html',
    whatsappMessage:
      'Hola! Me interesa contratar un proyecto similar al de Portal Inmobiliario. ¿Podrías darme más información?',
  },
];
