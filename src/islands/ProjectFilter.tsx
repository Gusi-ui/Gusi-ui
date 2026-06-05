import { useEffect } from 'react';

const ProjectFilter = () => {
  useEffect(() => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const handlers: Array<{ btn: Element; handler: EventListener }> = [];

    filterButtons.forEach((button) => {
      const handler = function (this: HTMLElement) {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        if (typeof gtag !== 'undefined' && filter) {
          gtag('event', 'project_filter', {
            event_category: 'Portfolio',
            event_label: filter,
            custom_parameter_1: 'filter_button',
          });
        }

        projectCards.forEach((card, index) => {
          const el = card as HTMLElement;
          const projectType = el.getAttribute('data-project-type');
          if (filter === 'all' || projectType === filter) {
            setTimeout(() => {
              el.style.display = 'block';
              el.style.animation = 'fadeInUp 0.6s ease-out';
            }, index * 100);
          } else {
            el.style.display = 'none';
          }
        });
      };

      button.addEventListener('click', handler);
      handlers.push({ btn: button, handler });
    });

    return () => {
      handlers.forEach(({ btn, handler }) => btn.removeEventListener('click', handler));
    };
  }, []);

  return (
    <div className="projects-filter">
      <button className="filter-btn active" data-filter="all" type="button">
        Todos
      </button>
      <button className="filter-btn" data-filter="web" type="button">
        Web
      </button>
      <button className="filter-btn" data-filter="ecommerce" type="button">
        E-Commerce
      </button>
    </div>
  );
};

export default ProjectFilter;
