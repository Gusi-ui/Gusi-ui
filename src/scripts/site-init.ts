import { onCLS, onINP, onLCP } from 'web-vitals';

const initNavigation = (): void => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!navToggle || !navMenu) return;

  const updateMenuState = (isOpen: boolean): void => {
    navToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  };

  navToggle.addEventListener('click', () => {
    updateMenuState(!navMenu.classList.contains('active'));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setTimeout(() => updateMenuState(false), 10));
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target as Node) && !navMenu.contains(e.target as Node)) {
      updateMenuState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      updateMenuState(false);
      navToggle.focus();
    }
  });

  window.addEventListener('resize', () => updateMenuState(false));
  updateMenuState(false);
};

const initHeaderScroll = (): void => {
  const header = document.querySelector('.cabecera');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
};

const initSmoothScrolling = (): void => {
  const headerHeight = 68;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = (target as HTMLElement).offsetTop - headerHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

const initWhatsAppFlotante = (): void => {
  // La portada y el pie ya tienen su botón de WhatsApp: mientras alguno está a
  // la vista, el flotante sobra (y en móvil tapaba el chat y los enlaces legales).
  const flotante = document.querySelector('.whatsapp-float');
  const zonas = document.querySelectorAll('.portada, .pie');
  if (!flotante || zonas.length === 0 || !('IntersectionObserver' in window)) return;

  const visibles = new Set<Element>();
  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target)));
      const ocultar = visibles.size > 0;
      flotante.classList.toggle('whatsapp-float--oculto', ocultar);
      flotante.toggleAttribute('inert', ocultar);
    },
    { threshold: 0.15 }
  );
  zonas.forEach((zona) => observer.observe(zona));
};

const initWebVitals = (): void => {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  const send = (metric: { name: string; value: number; id: string }) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  };

  onLCP(send);
  onINP(send);
  onCLS(send);
};

const init = (): void => {
  initNavigation();
  initHeaderScroll();
  initSmoothScrolling();
  initWhatsAppFlotante();
  initWebVitals();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


declare global {
  function gtag(...args: unknown[]): void;
}
