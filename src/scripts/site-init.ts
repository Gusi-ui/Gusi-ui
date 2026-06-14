import { onCLS, onINP, onLCP } from 'web-vitals';

const initNavigation = (): void => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!navToggle || !navMenu) return;

  const updateMenuState = (isOpen: boolean): void => {
    navToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  navToggle.addEventListener('click', () => {
    updateMenuState(!navMenu.classList.contains('active'));
  });

  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navToggle.click();
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setTimeout(() => updateMenuState(false), 10));
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target as Node) && !navMenu.contains(e.target as Node)) {
      updateMenuState(false);
    }
  });

  window.addEventListener('resize', () => updateMenuState(false));
  updateMenuState(false);
};

const initHeaderScroll = (): void => {
  const header = document.querySelector('.header');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
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

const initScrollAnimations = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  [
    '.section-header',
    '.services-grid__cell',
    '.maintenance-band__cell',
    '.project-card',
    '.contact-item',
    '.hero-text',
    '.hero-visual',
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (
        selector === '.services-grid__cell' ||
        selector === '.maintenance-band__cell' ||
        selector === '.project-card'
      ) {
        (el as HTMLElement).style.animationDelay = `${index * 0.1}s`;
      }
      observer.observe(el);
    });
  });
};

const initSmoothScrolling = (): void => {
  const headerHeight = 80;
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

const initParallaxEffect = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroPattern = document.querySelector('.hero-pattern');
  if (!heroPattern) return;
  window.addEventListener(
    'scroll',
    () => {
      const rate = window.pageYOffset * -0.5;
      (heroPattern as HTMLElement).style.transform = `translateY(${rate}px)`;
    },
    { passive: true }
  );
};

const addLoadAnimations = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelector('.hero-text')?.classList.add('slide-in-left');
  document.querySelector('.hero-visual')?.classList.add('slide-in-right');
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
  initScrollAnimations();
  initSmoothScrolling();
  initParallaxEffect();
  addLoadAnimations();
  initWebVitals();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('load', addLoadAnimations);

declare global {
  function gtag(...args: unknown[]): void;
}
