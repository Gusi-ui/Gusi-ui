import { useEffect, useState } from 'react';
import { showNotification } from '@/lib/notifications';

// Lee el tema que el script inline de BaseLayout ya aplicó antes del pintado,
// en lugar de volver a decidirlo, para que el botón no pueda desincronizarse
// de lo que se está mostrando.
const getInitialTheme = (): boolean => document.documentElement.classList.contains('dark');

const applyTheme = (isDark: boolean): void => {
  document.documentElement.classList.toggle('dark', isDark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setIsDark(initial);
    applyTheme(initial);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('site-theme')) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleToggle = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem('site-theme', next ? 'dark' : 'light');
    showNotification(`Modo ${next ? 'oscuro' : 'claro'} activado`, 'success');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      id="theme-toggle"
      className="theme-toggle"
      aria-label="Alternar tema oscuro"
      title="Alternar tema oscuro"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      type="button"
    >
      <span id="theme-icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
