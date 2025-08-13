import React from 'react';
import { motion } from 'framer-motion';

const Heading3D = ({ children, className = '', level = 1, color = 'yellow' }) => {
  const Tag = `h${level}`;
  const baseClasses = 'font-playfair font-bold relative';
  const colorClasses = {
    yellow: 'text-yellow-400',
    white: 'text-white',
    gray: 'text-gray-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* 3D Shadow Layers */}
      <Tag className={`${baseClasses} ${className} absolute -bottom-1 -right-1 opacity-10 blur-sm ${colorClasses[color]}`}>
        {children}
      </Tag>
      <Tag className={`${baseClasses} ${className} absolute -bottom-0.5 -right-0.5 opacity-20 blur-[2px] ${colorClasses[color]}`}>
        {children}
      </Tag>
      
      {/* Main Text */}
      <Tag className={`${baseClasses} ${className} relative ${colorClasses[color]}`}>
        {children}
      </Tag>
    </motion.div>
  );
};

export default Heading3D;