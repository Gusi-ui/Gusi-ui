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

const ProjectImage = ({ project }: { project: DisplayProject }) => (
  <picture>
    {project.image.avif && <source srcSet={`/${project.image.avif}`} type="image/avif" />}
    {project.image.webp && <source srcSet={`/${project.image.webp}`} type="image/webp" />}
    <img src={`/${project.image.jpg}`} alt="" loading="lazy" width="1200" height="630" />
  </picture>
);

// Mismo marcado que src/components/projects/ProjectCard.astro (página /proyectos/).
const ProjectCard = ({ project, whatsappUrl }: { project: DisplayProject; whatsappUrl: string }) => {
  const whatsappHref = `${whatsappUrl}?text=${encodeURIComponent(project.whatsappMessage)}`;
  const externalDemo = isExternalDemo(project.demoUrl);

  return (
    <article className="proyecto" data-project-type={project.type} data-project-id={project.id}>
      <a className="proyecto__imagen" href={`/proyectos/${project.id}/`} tabIndex={-1} aria-hidden="true">
        <ProjectImage project={project} />
      </a>
      <div className="proyecto__cuerpo">
        <p className="proyecto__sector">
          {project.badge}
          <span className="proyecto__estado">{getProjectDemoLabel(project.demoUrl)}</span>
        </p>
        <h3 className="proyecto__titulo">
          <a href={`/proyectos/${project.id}/`}>{project.title}</a>
        </h3>
        <p className="proyecto__resumen">{project.hook}</p>
        <p className="proyecto__resultado">{project.featuredMetric}</p>
        <div className="proyecto__acciones">
          <a href={project.demoUrl} className="proyecto__demo" target="_blank" rel="noopener noreferrer">
            {externalDemo ? 'Visitar la web' : 'Probar la demo'}
          </a>
          <a href={`/proyectos/${project.id}/`} className="proyecto__caso">
            Cómo se hizo
          </a>
        </div>
        <p className="proyecto__pie">
          <span>Desde {project.servicePrice} €</span>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Quiero algo parecido
          </a>
        </p>
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

  const filtros: Array<[Filter, string]> = [
    ['all', 'Todos'],
    ['web', 'Webs y apps'],
    ['ecommerce', 'Tiendas online'],
  ];

  return (
    <>
      <div className="proyectos__filtros" role="group" aria-label="Filtrar proyectos">
        {filtros.map(([valor, texto]) => (
          <button
            key={valor}
            className="proyectos__filtro"
            type="button"
            aria-pressed={filter === valor}
            onClick={() => handleFilter(valor)}
          >
            {texto}
          </button>
        ))}
        <button className="proyectos__filtro proyectos__filtro--otros" type="button" onClick={handleShuffle}>
          Ver otros
        </button>
      </div>

      <div className="proyectos__rejilla" aria-live="polite">
        {visibleProjects.map((project) => (
          <ProjectCard key={`${project.id}-${rotationKey}`} project={project} whatsappUrl={whatsappUrl} />
        ))}
      </div>

      {showViewAll && (
        <p className="proyectos__todos">
          Enseño {visibleProjects.length} de {projects.length}, distintos en cada visita.{' '}
          <a href="/proyectos/">Ver los {projects.length}</a>
        </p>
      )}
    </>
  );
};

export default ProjectsShowcase;
