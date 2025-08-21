import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  icon = null,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  as = 'button',
  ...props
}) => {
  // Consistent variant styles using theme variables
  const variantStyles = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-md hover:shadow-lg',
    secondary: 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] shadow-sm hover:shadow-md',
    outline: 'bg-transparent border border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
    danger: 'bg-[var(--color-error)] text-white hover:bg-red-600 shadow-md hover:shadow-lg',
    success: 'bg-[var(--color-success)] text-white hover:bg-green-600 shadow-md hover:shadow-lg',
    warning: 'bg-[var(--color-warning)] text-white hover:bg-yellow-600 shadow-md hover:shadow-lg',
  };

  // Size styles with better spacing
  const sizeStyles = {
    small: 'py-2 px-6 text-sm rounded-lg min-h-[40px]',
    medium: 'py-3 px-8 text-base rounded-xl min-h-[48px]',
    large: 'py-4 px-10 text-lg rounded-2xl min-h-[56px]',
  };

  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Disabled styles
  const disabledStyles = disabled || isLoading
    ? 'opacity-70 cursor-not-allowed'
    : 'transform hover:scale-105 active:scale-95';

  // Icon rendering
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <span className={`inline-flex ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
        {icon}
      </span>
    );
  };

  // Loading spinner
  const renderSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Combine all styles
  const buttonStyles = `
    ${baseClasses}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyles}
  `.trim();

  // Use motion.button for animations
  const Component = as === 'button' ? motion.button : motion[as];

  return (
    <Component
      className={buttonStyles}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading && renderSpinner()}
      {icon && iconPosition === 'left' && renderIcon()}
      {children}
      {icon && iconPosition === 'right' && renderIcon()}
    </Component>
  );
};

export default Button;