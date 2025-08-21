import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  animate = true,
  padding = 'default',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md',
    glass: 'bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl',
    gradient: 'bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl',
    elevated: 'bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl',
  };

  // Spacious padding styles
  const paddingStyles = {
    none: '',
    small: 'p-6',
    default: 'p-8',
    large: 'p-10',
  };

  // Hover effect
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  // Combine all styles
  const cardStyles = `
    rounded-2xl
    transition-all duration-300
    mb-6
    ${variantStyles[variant] || variantStyles.default}
    ${paddingStyles[padding] || paddingStyles.default}
    ${hoverStyles}
    ${className}
  `.trim();

  // Use motion.div for animations if animate is true
  const Component = animate ? motion.div : 'div';
  
  // Animation props
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    whileHover: hover ? { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {},
  } : {};

  return (
    <Component
      className={cardStyles}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;