import type { IconName } from '@/lib/icons';

export type GraciasPage = {
  slug: string;
  title: string;
  heading: string;
  subtitle: string;
  icon: IconName;
  nextSteps: string[];
};

export const graciasPages: GraciasPage[] = [
  {
    slug: 'web',
    title: 'Consulta de web recibida | alamia.es',
    heading: 'Tu consulta sobre una web ha llegado',
    subtitle: 'Gracias por tu interés en desarrollo web. Revisaré tu proyecto y te contactaré en menos de 24 horas.',
    icon: 'laptop-code',
    nextSteps: [
      'Revisaré los detalles de tu proyecto',
      'Te enviaré una propuesta personalizada',
      'Agendaremos una llamada si lo necesitas',
    ],
  },
  {
    slug: 'mobile',
    title: 'Consulta de app móvil recibida | alamia.es',
    heading: 'Tu consulta sobre una app ha llegado',
    subtitle: 'Gracias por tu interés en desarrollo de aplicaciones móviles.',
    icon: 'mobile',
    nextSteps: [
      'Analizaré los requisitos de tu app',
      'Te propondré la mejor tecnología (nativa o híbrida)',
      'Te contactaré con un presupuesto detallado',
    ],
  },
  {
    slug: 'ecommerce',
    title: 'Consulta de tienda online recibida | alamia.es',
    heading: 'Tu consulta sobre una tienda online ha llegado',
    subtitle: 'Gracias por tu interés en tu tienda online.',
    icon: 'shopping-cart',
    nextSteps: [
      'Evaluaré las funcionalidades que necesitas',
      'Te propondré la plataforma ideal',
      'Prepararé un plan de lanzamiento',
    ],
  },
  {
    slug: 'mantenimiento',
    title: 'Consulta de mantenimiento recibida | alamia.es',
    heading: 'Tu consulta sobre mantenimiento ha llegado',
    subtitle: 'Gracias por confiar en mis servicios de mantenimiento web.',
    icon: 'tools',
    nextSteps: [
      'Revisaré el estado actual de tu sitio',
      'Te propondré un plan de mantenimiento',
      'Configuraremos monitorización y backups',
    ],
  },
  {
    slug: 'otros',
    title: 'Consulta recibida | alamia.es',
    heading: 'Tu consulta ha llegado',
    subtitle: 'Gracias por contactarme. Revisaré tu mensaje y te responderé pronto.',
    icon: 'envelope',
    nextSteps: [
      'Leeré tu mensaje con atención',
      'Te responderé en menos de 24 horas',
      'Propondré la mejor solución para tu caso',
    ],
  },
];

export const graciasDefault: GraciasPage = {
  slug: '',
  title: 'Mensaje recibido | alamia.es',
  heading: 'Tu mensaje ha llegado',
  subtitle: 'Gracias por contactarme. Te responderé lo antes posible.',
  icon: 'check-circle',
  nextSteps: ['Revisaré tu mensaje', 'Te contactaré en menos de 24 horas'],
};
