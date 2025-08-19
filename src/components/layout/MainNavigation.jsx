import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/blog', label: 'Blog' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
];

const MainNavigation = () => (
  <nav className="flex gap-4">
    {navItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all
          ${isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-blue-100 hover:text-white hover:bg-blue-500/40'}
          `
        }
        // No border or border-* classes
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);

export default MainNavigation;