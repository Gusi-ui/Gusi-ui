export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: number;
};

export const services: Service[] = [
  {
    id: 'servicio-1',
    icon: 'fas fa-laptop-code',
    title: 'Desarrollo Web',
    description:
      'Sitios web modernos, responsivos y optimizados para SEO. Desde landing pages hasta aplicaciones web complejas.',
    features: ['Diseño Responsivo', 'Optimización SEO', 'Velocidad de Carga'],
    price: 20,
  },
  {
    id: 'servicio-2',
    icon: 'fas fa-mobile-alt',
    title: 'Apps Móviles',
    description:
      'Aplicaciones móviles nativas e híbridas para iOS y Android. Experiencia de usuario excepcional garantizada.',
    features: ['iOS & Android', 'UI/UX Moderno', 'Integración API'],
    price: 50,
  },
  {
    id: 'servicio-3',
    icon: 'fas fa-server',
    title: 'Backend & APIs',
    description:
      'APIs RESTful, bases de datos y servidores escalables para aplicaciones web y móviles.',
    features: ['Pasarelas de Pago', 'Panel Admin', 'Inventario'],
    price: 75,
  },
  {
    id: 'servicio-4',
    icon: 'fas fa-tools',
    title: 'Mantenimiento',
    description:
      'Soporte técnico continuo, actualizaciones de seguridad, optimización de rendimiento y hosting con dominio incluido.',
    features: ['Soporte 24/7', 'Actualizaciones', 'Backups'],
    price: 10,
  },
];
