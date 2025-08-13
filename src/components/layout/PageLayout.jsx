import React from 'react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const PageLayout = ({ children, title, subtitle }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="min-h-screen pt-24">
      {/* Page Header */}
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-12 text-center"
        >
          {title && (
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-yellow-400' : 'text-yellow-600'
            } font-playfair`}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={`text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageLayout;