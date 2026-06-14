import type { IconName } from '@/lib/icons';

export type BillingPlan = 'one_time' | 'monthly';

export type ServiceBadge = 'best-seller' | 'best-value';

export type ProjectService = {
  kind: 'project';
  id: string;
  slug: string;
  icon: IconName;
  title: string;
  description: string;
  features: string[];
  price: number;
  priceHint: string;
  badge?: ServiceBadge;
  highlight?: 'featured';
};

export type MaintenanceService = {
  kind: 'maintenance';
  id: string;
  slug: string;
  icon: IconName;
  title: string;
  description: string;
  features: string[];
  price: number;
  priceHint: string;
  valueAnchor: string;
};

export const projectServices: ProjectService[] = [
  {
    kind: 'project',
    id: 'servicio-1',
    slug: 'desarrollo-web',
    icon: 'laptop-code',
    title: 'Desarrollo',
    description:
      'Tu presencia online lista para captar clientes, sin complicaciones técnicas.',
    features: ['Diseño responsivo', 'SEO básico configurado', 'Entrega en 7–10 días'],
    price: 250,
    priceHint: 'Pago único · Tarjeta o Bizum',
  },
  {
    kind: 'project',
    id: 'servicio-2',
    slug: 'optimizacion-web',
    icon: 'gauge-high',
    title: 'Optimización',
    description:
      'Acelera tu web y mejora tu posicionamiento con métricas reales de rendimiento.',
    features: [
      'Auditoría Core Web Vitals',
      'Optimización de carga (LCP, INP)',
      'Informe antes/después',
    ],
    price: 190,
    priceHint: 'Pago único · Tarjeta o Bizum',
    badge: 'best-seller',
    highlight: 'featured',
  },
  {
    kind: 'project',
    id: 'servicio-3',
    slug: 'backend-apis',
    icon: 'server',
    title: 'Backend & APIs',
    description: 'La base técnica que tu negocio necesita para escalar con seguridad.',
    features: ['API REST documentada', 'Base de datos configurada', 'Panel admin básico'],
    price: 400,
    priceHint: 'Pago único · Tarjeta o Bizum',
    badge: 'best-value',
    highlight: 'featured',
  },
];

export const maintenanceService: MaintenanceService = {
  kind: 'maintenance',
  id: 'servicio-4',
  slug: 'mantenimiento',
  icon: 'shield-halved',
  title: 'Mantenimiento Web',
  description:
    'Tu web siempre actualizada, segura y monitorizada. Olvídate de los problemas técnicos.',
  features: [
    'Actualizaciones de seguridad mensuales',
    'Copias de seguridad automáticas',
    'Monitorización de uptime 24/7',
    'Soporte por email (respuesta < 24h)',
    '1h de cambios menores al mes',
    'Informe mensual de estado',
  ],
  price: 10,
  priceHint: 'Cancela cuando quieras',
  valueAnchor: 'Menos que un café a la semana',
};

export const BADGE_LABELS: Record<ServiceBadge, string> = {
  'best-seller': 'Más vendido',
  'best-value': 'Mayor valor',
};
