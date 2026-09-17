import type { ProjectCaseStudy } from '@/data/project-case-studies';
// Relativo y no '@/': los tests de Vitest no resuelven el alias.
import { isExternalDemo } from './project-demo';

export type DisplayProject = Pick<
  ProjectCaseStudy,
  | 'id'
  | 'type'
  | 'badge'
  | 'title'
  | 'hook'
  | 'featuredMetric'
  | 'servicePrice'
  | 'tech'
  | 'image'
  | 'demoUrl'
  | 'whatsappMessage'
>;

export const toDisplayProjects = (projects: ProjectCaseStudy[]): DisplayProject[] =>
  projects.map(
    ({
      id,
      type,
      badge,
      title,
      hook,
      featuredMetric,
      servicePrice,
      tech,
      image,
      demoUrl,
      whatsappMessage,
    }) => ({
      id,
      type,
      badge,
      title,
      hook,
      featuredMetric,
      servicePrice,
      tech,
      image,
      demoUrl,
      whatsappMessage,
    }),
  );

export const shuffleProjects = <T>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Elige `count` proyectos al azar. `minLive` reserva sitio para webs en vivo:
 * son la prueba de que hay clientes reales, así que no se dejan a la suerte.
 * Si el filtro no tiene tantas, se rellena con demos.
 */
export const pickVisibleProjects = (
  projects: DisplayProject[],
  filter: 'all' | 'web' | 'ecommerce',
  count: number,
  minLive = 0,
): DisplayProject[] => {
  const filtered =
    filter === 'all' ? projects : projects.filter((project) => project.type === filter);
  const live = shuffleProjects(filtered.filter((project) => isExternalDemo(project.demoUrl)));
  const reserved = live.slice(0, Math.min(minLive, count));
  const rest = shuffleProjects(filtered.filter((project) => !reserved.includes(project)));
  // Barajar al final para que las webs en vivo no ocupen siempre los primeros huecos.
  return shuffleProjects([...reserved, ...rest].slice(0, Math.min(count, filtered.length)));
};
