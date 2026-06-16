import { useCallback, useEffect, useState } from 'react';
import {
  pickVisibleProjects,
  type DisplayProject,
} from '@/lib/projects-display';
import { getProjectDemoLabel, isExternalDemo } from '@/lib/project-demo';

type Filter = 'all' | 'web' | 'ecommerce';

interface Props {
  projects: DisplayProject[];
  whatsappUrl: string;
  visibleCount?: number;
  showViewAll?: boolean;
}

const iconEye = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93.6 131.1-3.3 7.9-3.3 16.7 0 24.6 15.5 35.7 46.8 87.7 93.6 131.1 47.1 43.8 111.7 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93.6-131.1 3.3-7.9 3.3-16.7 0-24.6-15.5-35.7-46.8-87.7-93.6-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.6-8.4-1-.6-2.1-1.1-3.1-1.6-22.3-11.4-38.1-34.6-38.1-62.1 0-37.7 30.5-68.2 68.2-68.2 25.2 0 47.2 13.6 59 33.8.9 1.4 1.7 2.9 2.5 4.4 5.1 10.2 7.9 21.7 7.9 33.8z" />
  </svg>
);

const iconCompass = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.6 9.9-15.1 18.2-17.9l144.3-55.5c19.4-7.5 38.5 11.6 31 31l-55.5 144.3c-3.3 8.6-9.9 15.1-18.2 17.9z" />
  </svg>
);

const iconBolt = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10.1 8.8-13.2 23-7.8 35.2S50.7 288 64 288h111.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10.1-8.8 13.2-23 7.8-35.2s-22.5-12.8-35.8-12.8H192l111.5-192z" />
  </svg>
);

const iconWhatsapp = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-70.9-157.7zM223.9 388.8c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 339.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18.1-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 18.1-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const iconRefresh = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
  </svg>
);

const ProjectImage = ({ project }: { project: DisplayProject }) => (
  <picture>
    {project.image.avif && <source srcSet={`/${project.image.avif}`} type="image/avif" />}
    {project.image.webp && <source srcSet={`/${project.image.webp}`} type="image/webp" />}
    <img src={`/${project.image.jpg}`} alt={project.image.alt} loading="lazy" />
  </picture>
);

const ProjectCard = ({ project, whatsappUrl }: { project: DisplayProject; whatsappUrl: string }) => {
  const whatsappHref = `${whatsappUrl}?text=${encodeURIComponent(project.whatsappMessage)}`;
  const externalDemo = isExternalDemo(project.demoUrl);
  const demoLabel = getProjectDemoLabel(project.demoUrl);

  return (
    <article className="project-card" data-project-type={project.type} data-project-id={project.id}>
      <div className="project-image">
        <ProjectImage project={project} />
        <div className="project-overlay">
          <div className="project-actions">
            <a href={project.demoUrl} className="project-btn" target="_blank" rel="noopener noreferrer">
              <span className="icon" aria-hidden="true">
                {iconEye}
              </span>
              <span>{externalDemo ? 'Visitar' : 'Ver demo'}</span>
            </a>
            <a href={`/proyectos/${project.id}/`} className="project-btn project-btn-case">
              <span className="icon" aria-hidden="true">
                {iconCompass}
              </span>
              <span>Ver caso</span>
            </a>
          </div>
        </div>
      </div>
      <div className="project-content">
        <div className="project-card-meta">
          <div className="project-badge">{project.badge}</div>
          <span className="project-demo-label">{demoLabel}</span>
        </div>
        <h3 className="project-title">
          <a href={`/proyectos/${project.id}/`}>{project.title}</a>
        </h3>
        <p className="project-description">{project.hook}</p>
        <p className="project-metric">
          <span className="icon" aria-hidden="true">
            {iconBolt}
          </span>
          <span>{project.featuredMetric}</span>
        </p>
        <div className="project-tech">
          {project.tech.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-card-footer">
          <span className="project-price">desde €{project.servicePrice}</span>
          <a href={whatsappHref} className="project-whatsapp-link" target="_blank" rel="noopener noreferrer">
            <span className="icon" aria-hidden="true">
              {iconWhatsapp}
            </span>
            <span>Quiero algo similar</span>
          </a>
        </div>
      </div>
    </article>
  );
};

const ProjectsShowcase = ({
  projects,
  whatsappUrl,
  visibleCount = 3,
  showViewAll = true,
}: Props) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [visibleProjects, setVisibleProjects] = useState<DisplayProject[]>([]);
  const [rotationKey, setRotationKey] = useState(0);

  const refreshVisible = useCallback(
    (nextFilter: Filter) => {
      setVisibleProjects(pickVisibleProjects(projects, nextFilter, visibleCount));
    },
    [projects, visibleCount],
  );

  useEffect(() => {
    refreshVisible(filter);
  }, [filter, rotationKey, refreshVisible]);

  const handleFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'project_filter', {
        event_category: 'Portfolio',
        event_label: nextFilter,
        custom_parameter_1: 'filter_button',
      });
    }
  };

  const handleShuffle = () => {
    setRotationKey((current) => current + 1);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'project_shuffle', {
        event_category: 'Portfolio',
        event_label: filter,
      });
    }
  };

  return (
    <>
      <div className="projects-filter">
        <button
          className={`filter-btn${filter === 'all' ? ' active' : ''}`}
          type="button"
          onClick={() => handleFilter('all')}
        >
          Todos
        </button>
        <button
          className={`filter-btn${filter === 'web' ? ' active' : ''}`}
          type="button"
          onClick={() => handleFilter('web')}
        >
          Web
        </button>
        <button
          className={`filter-btn${filter === 'ecommerce' ? ' active' : ''}`}
          type="button"
          onClick={() => handleFilter('ecommerce')}
        >
          E-Commerce
        </button>
        <button className="filter-btn filter-btn-shuffle" type="button" onClick={handleShuffle}>
          <span className="icon" aria-hidden="true">
            {iconRefresh}
          </span>
          <span>Ver otros</span>
        </button>
      </div>

      <p className="projects-rotation-hint">
        Mostrando {visibleProjects.length} de {projects.length} proyectos. Cada visita puede mostrar una
        selección distinta.
      </p>

      <div className="projects-grid projects-grid--showcase" id="projects-grid">
        {visibleProjects.map((project, index) => (
          <div
            key={`${project.id}-${rotationKey}`}
            className="project-card-wrapper"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProjectCard project={project} whatsappUrl={whatsappUrl} />
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="projects-view-all">
          <a href="/proyectos/" className="btn btn-secondary">
            Ver los {projects.length} proyectos
          </a>
        </div>
      )}
    </>
  );
};

export default ProjectsShowcase;
