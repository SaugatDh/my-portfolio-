/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        id="theme-toggle-button"
        aria-label="Toggle theme"
        className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-[var(--text-secondary)] flex items-center justify-center shadow-lg hover:scale-105 hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all duration-300"
      >
        {theme === 'light' ? (
          <i className="fas fa-moon"></i>
        ) : (
          <i className="fas fa-sun"></i>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
