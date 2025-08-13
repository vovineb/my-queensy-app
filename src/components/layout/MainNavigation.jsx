import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const MainNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '/blog', label: 'Blog', icon: BookOpen }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        
        return (
          <Link
            key={path}
            to={path}
            className="relative group"
          >
            <motion.div
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </motion.div>
            
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNavigation;