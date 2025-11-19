/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="mb-16 pb-6 border-b border-[var(--border-light)] relative">
      {/* Desktop and Tablet Header (sm and above) */}
      <div className="hidden sm:flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
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
            to="/about"
            className={({ isActive }) =>
              `hover:text-[var(--text-primary)] transition-colors ${isActive ? 'text-[var(--text-primary)]' : ''}`
            }
          >
            About
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
      </div>

      {/* Mobile Header (below sm breakpoint) */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          {/* Name/Logo */}
          <h1 className="text-xl font-semibold tracking-tight">SD</h1>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors z-50 relative"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMenu}
            />

            {/* Menu */}
            <nav
              aria-label="Main Navigation"
              className="absolute top-full right-0 mt-2 bg-[var(--bg-secondary)] rounded-lg shadow-lg p-6 flex flex-col gap-4 text-base font-medium text-[var(--text-secondary)] z-50 min-w-[200px]"
            >
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  `hover:text-[var(--text-primary)] transition-colors py-2 ${isActive ? 'text-[var(--text-primary)]' : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `hover:text-[var(--text-primary)] transition-colors py-2 ${isActive ? 'text-[var(--text-primary)]' : ''}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/works"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `hover:text-[var(--text-primary)] transition-colors py-2 ${isActive ? 'text-[var(--text-primary)]' : ''}`
                }
              >
                Works
              </NavLink>
              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `hover:text-[var(--text-primary)] transition-colors py-2 ${isActive ? 'text-[var(--text-primary)]' : ''}`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `hover:text-[var(--text-primary)] transition-colors py-2 ${isActive ? 'text-[var(--text-primary)]' : ''}`
                }
              >
                Contact
              </NavLink>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
