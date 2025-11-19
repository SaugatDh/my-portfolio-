/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 pb-6 border-b border-[var(--border-light)]">
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <img
          src="./profile.png"
          alt="Profile picture of Saugat Dhungana"
          className="w-12 h-12 rounded-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <h1 className="text-xl font-semibold tracking-tight">Saugat Dhungana</h1>
      </div>
      <nav aria-label="Main Navigation" className="flex gap-6 text-base font-medium text-[var(--text-secondary)]">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `hover:text-[var(--text-primary)] transition-colors ${isActive ? 'text-[var(--text-primary)]' : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/works"
          className={({ isActive }) =>
            `hover:text-[var(--text-primary)] transition-colors ${isActive ? 'text-[var(--text-primary)]' : ''}`
          }
        >
          Works
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `hover:text-[var(--text-primary)] transition-colors ${isActive ? 'text-[var(--text-primary)]' : ''}`
          }
        >
          Blog
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `hover:text-[var(--text-primary)] transition-colors ${isActive ? 'text-[var(--text-primary)]' : ''}`
          }
        >
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
