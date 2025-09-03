/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav aria-label="Main Navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? 'nav-active' : '')}
      >
        Home
      </NavLink>
      <NavLink
        to="/works"
        className={({ isActive }) => (isActive ? 'nav-active' : '')}
      >
        Works
      </NavLink>
      <NavLink
        to="/blog"
        className={({ isActive }) => (isActive ? 'nav-active' : '')}
      >
        Blog
      </NavLink>
 
      <NavLink
        to="/contact"
        className={({ isActive }) => (isActive ? 'nav-active' : '')}
      >
        Contact Me
      </NavLink>
    </nav>
  );
};

export default Nav;
