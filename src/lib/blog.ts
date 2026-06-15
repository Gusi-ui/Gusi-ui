import type { ServiceSlug } from '@/data/service-landings';
import { getServiceLandingPath } from '@/data/service-landings';

export const SILO_LABELS: Record<ServiceSlug, string> = {
  'desarrollo-web': 'Desarrollo Web',
  'optimizacion-web': 'Optimización Web',
  'backend-apis': 'Backend & APIs',
  mantenimiento: 'Mantenimiento Web',
};

export const SILO_HERO_IMAGES: Record<ServiceSlug, string> = {
  'desarrollo-web': '/images/stripe/desarrollo-web.jpg',
  'optimizacion-web': '/images/stripe/optimizacion-web.jpg',
  'backend-apis': '/images/stripe/backend-apis.jpg',
  mantenimiento: '/images/stripe/mantenimiento.jpg',
};

export const getBlogHeroImage = (silo: ServiceSlug, custom?: string): string =>
  custom ?? SILO_HERO_IMAGES[silo];

export const getReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const formatBlogDate = (date: Date): string =>
  date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export type BlogCta = {
  title: string;
  text: string;
  button: string;
  href: string;
};

export const BLOG_CTA_BY_SILO: Record<ServiceSlug, BlogCta> = {
  'desarrollo-web': {
    title: '¿Necesitas una web para tu negocio?',
    text: 'Desarrollo web profesional desde 250€ con entrega en 7-10 días.',
    button: 'Ver servicio de desarrollo web',
    href: getServiceLandingPath('desarrollo-web'),
  },
  'optimizacion-web': {
    title: '¿Tu web carga lenta?',
    text: 'Optimización de Core Web Vitals desde 190€ con informe antes/después.',
    button: 'Ver servicio de optimización',
    href: getServiceLandingPath('optimizacion-web'),
  },
  'backend-apis': {
    title: '¿Tu proyecto necesita un backend?',
    text: 'APIs REST documentadas y panel admin desde 400€.',
    button: 'Ver servicio de backend y APIs',
    href: getServiceLandingPath('backend-apis'),
  },
  mantenimiento: {
    title: '¿Quieres olvidarte del mantenimiento técnico?',
    text: 'Plan mensual desde 10€ con backups, seguridad y soporte.',
    button: 'Ver plan de mantenimiento',
    href: getServiceLandingPath('mantenimiento'),
  },
};
