/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('portfolio-global-theme') || 'dark'
  );
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-global-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="theme-toggler">
      <button
        id="theme-toggle-button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
      </button>
    </div>
  );
};

export default ThemeToggle;
