import type { ProjectCaseStudy } from '@/data/project-case-studies';

/**
 * Proyectos reales en producción (no demos locales).
 *
 * Las webs de clientes no llevan `metrics`: no hay datos medidos de antes y
 * después, y una tabla inventada con el nombre de un negocio real sería
 * mentira. La ficha oculta ese apartado cuando la lista está vacía.
 */
export const personalProjectCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'amparo-medium',
    type: 'web',
    badge: 'Bienestar',
    title: 'AmparoMédium',
    hook: 'Consultas, cursos y productos en una sola web, con reserva online y área de alumnos.',
    context: 'Bienestar · Consultas espirituales online y presenciales en España',
    problem: [
      'Amparo ofrece varios tipos de consulta, cursos y productos. Hacía falta que cada visitante entendiera qué es cada servicio y pudiera reservarlo sin escribir antes para preguntar.',
      'Los cursos necesitaban un sitio propio al que entrar con usuario, separado de la parte pública de la web.',
    ],
    solutionSummary:
      'Web con las consultas explicadas una a una, reserva online, tienda de productos, reseñas de clientes y un área con inicio de sesión para los cursos.',
    solution: {
      frontend:
        'Portada con los servicios, fichas de cada consulta y del pack de tres, productos, reseñas y botón directo a WhatsApp. Pensada primero para el móvil.',
      backend:
        'Sistema de reservas y cuentas de usuario para acceder a los cursos desde cualquier dispositivo.',
      security:
        'Acceso a los cursos con inicio de sesión, páginas legales de aviso y privacidad, y conexión cifrada HTTPS.',
    },
    techDecisions: [
      { technology: 'Next.js', benefit: 'Parte pública rápida y área privada de cursos en el mismo proyecto.' },
      { technology: 'Tailwind CSS', benefit: 'Diseño propio y coherente en todas las páginas sin CSS que se descontrole.' },
      { technology: 'Vercel', benefit: 'Publicación automática y la web servida cerca del visitante.' },
    ],
    metrics: [],
    featuredMetric: 'Reserva online y área de cursos',
    serviceSlug: 'backend-apis',
    serviceLabel: 'Backend & APIs',
    servicePrice: 400,
    tech: ['Next.js', 'React', 'Tailwind CSS'],
    image: {
      jpg: 'images/proyectos/amparo-medium.svg',
      alt: 'AmparoMédium - Web de consultas espirituales con reserva online',
    },
    demoUrl: 'https://amparomedium.com',
    whatsappMessage:
      'Hola Gusi, he visto la web de AmparoMédium y me interesa algo parecido: servicios con reserva online.\n\nMi negocio: [tu sector]\nNecesito: web con reservas / área de clientes\n\n¿Tienes disponibilidad para hablarlo?',
    metaTitle: 'AmparoMédium · Web con reservas y área de cursos | Caso de estudio',
    metaDescription:
      'Web en producción para AmparoMédium: consultas con reserva online, tienda de productos, reseñas y área de cursos con inicio de sesión. Hecha con Next.js.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'irene-puigdemont',
    type: 'web',
    badge: 'Salud',
    title: 'Irene Puigdemont',
    hook: 'Web de nutricionista en catalán, castellano e inglés, con reserva de consulta desde la propia web.',
    context: 'Salud · Nutricionista en Girona, consulta presencial y online',
    problem: [
      'Irene atiende en Girona y online, a pacientes que le hablan en catalán, en castellano o en inglés. La web tenía que servir a los tres sin duplicar el trabajo.',
      'Una primera consulta de nutrición genera dudas: hacía falta explicar bien cada servicio y dejar que el paciente reservara sin llamar.',
    ],
    solutionSummary:
      'Web trilingüe con los servicios explicados, preguntas frecuentes, bonos y packs, y reserva de cita integrada.',
    solution: {
      frontend:
        'Páginas por servicio (consulta especializada en autismo, pack de tres sesiones, primera consulta), preguntas frecuentes y presentación de Irene, en tres idiomas.',
      integrations:
        'Reserva de consulta desde la web y contacto directo por WhatsApp.',
      security:
        'Web estática servida desde Cloudflare con HTTPS, y páginas de aviso legal, privacidad y cookies.',
    },
    techDecisions: [
      { technology: 'Astro', benefit: 'Páginas que cargan casi al instante, también con mala cobertura.' },
      { technology: 'Rutas por idioma', benefit: 'Cada idioma con su dirección propia, así Google enseña la versión correcta.' },
      { technology: 'Cloudflare', benefit: 'Alojamiento rápido y barato de mantener.' },
    ],
    metrics: [],
    featuredMetric: 'Tres idiomas y reserva de cita',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['Astro', 'TypeScript', 'Cloudflare'],
    image: {
      jpg: 'images/proyectos/irene-puigdemont.svg',
      alt: 'Irene Puigdemont - Web de nutricionista con reserva de cita',
    },
    demoUrl: 'https://irenepuigdemont.com',
    whatsappMessage:
      'Hola Gusi, he visto la web de Irene Puigdemont y me interesa algo parecido para mi consulta.\n\nMi negocio: [tu sector]\nNecesito: web con reserva de cita / varios idiomas\n\n¿Tienes disponibilidad para hablarlo?',
    metaTitle: 'Irene Puigdemont · Web de nutricionista trilingüe | Caso de estudio',
    metaDescription:
      'Web en producción para la nutricionista Irene Puigdemont: catalán, castellano e inglés, servicios, bonos y reserva de consulta. Hecha con Astro.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'carlos-plua',
    type: 'web',
    badge: 'Servicios técnicos',
    title: 'Carlos Plua',
    hook: 'Reparaciones e instalaciones en Barcelona: una página por servicio para salir en Google y llamada o WhatsApp a un toque.',
    context: 'Servicios técnicos · Reparaciones y reformas en Barcelona y área metropolitana',
    problem: [
      'Quien necesita un técnico lo busca en el móvil y con prisa: «reparar lavadora Barcelona», «aire acondicionado Barcelona». Si no sales en esas búsquedas, llama a otro.',
      'Con cuatro servicios muy distintos, una sola página genérica no posiciona bien ninguno.',
    ],
    solutionSummary:
      'Web con una página propia para cada servicio orientada a búsquedas locales, preguntas frecuentes y el teléfono y WhatsApp siempre a mano.',
    solution: {
      frontend:
        'Portada con los servicios, zona de trabajo, preguntas frecuentes y botones de llamada y WhatsApp visibles en todo momento en el móvil.',
      integrations:
        'Páginas de electrodomésticos, instalaciones, aire acondicionado y reformas, cada una con datos estructurados para Google.',
      security:
        'Web estática sin base de datos que atacar, servida desde Cloudflare con HTTPS.',
    },
    techDecisions: [
      { technology: 'HTML y CSS a medida', benefit: 'Carga muy ligera: la web abre rápido aunque el cliente esté en la calle.' },
      { technology: 'SEO local', benefit: 'Una dirección y un título por servicio y ciudad, lo que la gente escribe en Google.' },
      { technology: 'Cloudflare', benefit: 'Alojamiento rápido y sin mantenimiento de servidor.' },
    ],
    metrics: [],
    featuredMetric: 'Una página por servicio para Google',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: {
      jpg: 'images/proyectos/carlos-plua.svg',
      alt: 'Carlos Plua - Web de reparaciones e instalaciones en Barcelona',
    },
    demoUrl: 'https://carlosplua.com',
    whatsappMessage:
      'Hola Gusi, he visto la web de Carlos Plua y me interesa algo parecido para mi negocio.\n\nMi negocio: [tu sector]\nNecesito: web para salir en Google en mi zona\n\n¿Tienes disponibilidad para hablarlo?',
    metaTitle: 'Carlos Plua · Web de servicios técnicos con SEO local | Caso de estudio',
    metaDescription:
      'Web en producción para Carlos Plua, reparaciones e instalaciones en Barcelona: una página por servicio, SEO local y contacto por teléfono y WhatsApp.',
    hasArchitectureDiagram: false,
  },
  {
    id: 'gusi-dev',
    type: 'web',
    badge: 'Proyecto Personal',
    title: 'gusi.dev',
    hook: 'Terminal cyberpunk interactiva con juegos retro, noticias IA y estética Blade Runner.',
    context: 'Experimental · Portfolio interactivo en producción',
    problem: [
      'Quería un portfolio que no pareciera una plantilla más: algo memorable que demostrara dominio de frontend y personalidad técnica.',
      'Los CV en PDF no transmiten cómo piensas ni cómo construyes experiencias; hacía falta algo que el visitante quisiera explorar.',
    ],
    solutionSummary:
      'Terminal NEXUS-7 en el navegador: consola con comandos, menú de módulos, juegos retro, APOD de la NASA y chat simulado con estética CRT.',
    solution: {
      frontend:
        'Interfaz tipo shell con tipografía monoespaciada, scanlines, prompt interactivo y navegación por comandos (help, menu, clear).',
      integrations:
        'Módulos de noticias tech, imagen astronómica del día (NASA APOD) y minijuegos clásicos embebidos en la misma experiencia.',
      security:
        'Sin backend expuesto al usuario: experiencia estática/edge con APIs públicas consumidas desde el cliente de forma controlada.',
    },
    techDecisions: [
      { technology: 'Astro', benefit: 'Carga mínima y rutas estáticas para una experiencia casi instantánea.' },
      { technology: 'TypeScript', benefit: 'Lógica de terminal y módulos tipados, mantenibles al crecer el proyecto.' },
      { technology: 'CSS + efectos CRT', benefit: 'Estética retro-futurista sin sacrificar legibilidad en móvil.' },
    ],
    metrics: [
      { label: 'Tiempo de carga', before: 'Webs portfolio genéricas', after: '< 2 s en edge' },
      { label: 'Memorabilidad', before: 'Plantilla estándar', after: 'Experiencia única' },
      { label: 'Módulos interactivos', before: '0', after: '6+ en un solo sitio' },
      { label: 'Dependencia de PDF', before: '100% CV estático', after: 'CV dentro de la terminal' },
    ],
    featuredMetric: '6+ módulos en una terminal',
    serviceSlug: 'desarrollo-web',
    serviceLabel: 'Desarrollo Web',
    servicePrice: 250,
    tech: ['Astro', 'TypeScript', 'CSS3'],
    image: {
      jpg: 'images/proyectos/gusi-dev.svg',
      alt: 'gusi.dev - Terminal cyberpunk interactiva',
    },
    demoUrl: 'https://gusi.dev',
    whatsappMessage:
      'Hola Gusi, he visto tu proyecto gusi.dev y me interesa algo creativo e interactivo para mi marca.\n\nMi negocio: [tu sector]\nNecesito: web con personalidad / experiencia interactiva\n\n¿Tienes disponibilidad para hablarlo?',
    metaTitle: 'gusi.dev · Terminal cyberpunk interactiva | Caso de estudio',
    metaDescription:
      'Proyecto personal en producción: terminal estilo Blade Runner con juegos, noticias y APIs. Portfolio experimental de Jose Martínez (Gusi).',
    hasArchitectureDiagram: false,
  },
];
