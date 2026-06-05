export type GraciasPage = {
  slug: string;
  title: string;
  heading: string;
  subtitle: string;
  icon: string;
  color: string;
  nextSteps: string[];
};

export const graciasPages: GraciasPage[] = [
  {
    slug: 'web',
    title: '¡Consulta Web Recibida! | alamia.es',
    heading: '¡Consulta de Desarrollo Web Recibida!',
    subtitle: 'Gracias por tu interés en desarrollo web. Revisaré tu proyecto y te contactaré en menos de 24 horas.',
    icon: 'fas fa-laptop-code',
    color: '#4f46e5',
    nextSteps: [
      'Revisaré los detalles de tu proyecto',
      'Te enviaré una propuesta personalizada',
      'Agendaremos una llamada si lo necesitas',
    ],
  },
  {
    slug: 'mobile',
    title: '¡Consulta App Móvil Recibida! | alamia.es',
    heading: '¡Consulta de App Móvil Recibida!',
    subtitle: 'Gracias por tu interés en desarrollo de aplicaciones móviles.',
    icon: 'fas fa-mobile-alt',
    color: '#06b6d4',
    nextSteps: [
      'Analizaré los requisitos de tu app',
      'Te propondré la mejor tecnología (nativa o híbrida)',
      'Te contactaré con un presupuesto detallado',
    ],
  },
  {
    slug: 'ecommerce',
    title: '¡Consulta E-Commerce Recibida! | alamia.es',
    heading: '¡Consulta de E-Commerce Recibida!',
    subtitle: 'Gracias por tu interés en tu tienda online.',
    icon: 'fas fa-shopping-cart',
    color: '#10b981',
    nextSteps: [
      'Evaluaré las funcionalidades que necesitas',
      'Te propondré la plataforma ideal',
      'Prepararé un plan de lanzamiento',
    ],
  },
  {
    slug: 'mantenimiento',
    title: '¡Consulta Mantenimiento Recibida! | alamia.es',
    heading: '¡Consulta de Mantenimiento Recibida!',
    subtitle: 'Gracias por confiar en mis servicios de mantenimiento web.',
    icon: 'fas fa-tools',
    color: '#f59e0b',
    nextSteps: [
      'Revisaré el estado actual de tu sitio',
      'Te propondré un plan de mantenimiento',
      'Configuraremos monitorización y backups',
    ],
  },
  {
    slug: 'otros',
    title: '¡Consulta Recibida! | alamia.es',
    heading: '¡Consulta Recibida!',
    subtitle: 'Gracias por contactarme. Revisaré tu mensaje y te responderé pronto.',
    icon: 'fas fa-envelope',
    color: '#8b5cf6',
    nextSteps: [
      'Leeré tu mensaje con atención',
      'Te responderé en menos de 24 horas',
      'Propondré la mejor solución para tu caso',
    ],
  },
];

export const graciasDefault: GraciasPage = {
  slug: '',
  title: '¡Mensaje Recibido! | alamia.es',
  heading: '¡Mensaje Recibido!',
  subtitle: 'Gracias por contactarme. Te responderé lo antes posible.',
  icon: 'fas fa-check-circle',
  color: '#10b981',
  nextSteps: ['Revisaré tu mensaje', 'Te contactaré en menos de 24 horas'],
};
