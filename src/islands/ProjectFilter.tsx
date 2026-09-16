import { useState } from 'react';

type Filter = 'all' | 'web' | 'ecommerce';

const FILTROS: Array<[Filter, string]> = [
  ['all', 'Todos'],
  ['web', 'Webs y apps'],
  ['ecommerce', 'Tiendas online'],
];

// Filtra las tarjetas que Astro ya pintó en /proyectos/, sin volver a renderizarlas.
const ProjectFilter = () => {
  const [filter, setFilter] = useState<Filter>('all');

  const aplicar = (siguiente: Filter) => {
    setFilter(siguiente);
    document.querySelectorAll<HTMLElement>('.proyectos__rejilla .proyecto').forEach((card) => {
      card.hidden = siguiente !== 'all' && card.dataset.projectType !== siguiente;
    });

    if (typeof gtag !== 'undefined') {
      gtag('event', 'project_filter', {
        event_category: 'Portfolio',
        event_label: siguiente,
        custom_parameter_1: 'filter_button',
      });
    }
  };

  return (
    <div className="proyectos__filtros" role="group" aria-label="Filtrar proyectos">
      {FILTROS.map(([valor, texto]) => (
        <button
          key={valor}
          className="proyectos__filtro"
          type="button"
          aria-pressed={filter === valor}
          onClick={() => aplicar(valor)}
        >
          {texto}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
