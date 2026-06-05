import { useEffect, useState } from 'react';
import { showNotification } from '@/lib/notifications';

const getInitialTheme = (): boolean => {
  const stored = localStorage.getItem('site-theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return true;
  const hour = new Date().getHours();
  return hour >= 20 || hour < 7;
};

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
