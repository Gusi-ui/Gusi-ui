import type { ProjectCaseStudy } from '@/data/project-case-studies';

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

export const pickVisibleProjects = (
  projects: DisplayProject[],
  filter: 'all' | 'web' | 'ecommerce',
  count: number,
): DisplayProject[] => {
  const filtered =
    filter === 'all' ? projects : projects.filter((project) => project.type === filter);
  return shuffleProjects(filtered).slice(0, Math.min(count, filtered.length));
};
