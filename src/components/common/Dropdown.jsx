import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({
  trigger,
  children,
  align = 'right',
  width = 'auto',
  className = '',
  closeOnClick = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown
  const closeDropdown = () => setIsOpen(false);

  // Handle item click
  const handleItemClick = () => {
    if (closeOnClick) {
      closeDropdown();
    }
  };

  // Alignment styles
  const alignmentStyles = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  };

  // Width styles
  const widthStyles = {
    auto: '',
    full: 'w-full',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
    xl: 'w-72',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} {...props}>
      {/* Trigger element */}
      <div 
        className="cursor-pointer" 
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 mt-2
              bg-white dark:bg-navy-800
              border border-ivory-200 dark:border-navy-700
              rounded-lg shadow-lg
              py-2
              ${alignmentStyles[align] || alignmentStyles.right}
              ${widthStyles[width] || ''}
              ${className}
            `}
            onClick={handleItemClick}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Item component
const DropdownItem = ({ children, onClick, className = '', disabled = false, ...props }) => {
  const baseClasses = `
    flex items-center w-full px-4 py-2 text-left
    text-gray-700 dark:text-ivory-200
    hover:bg-blue-50 dark:hover:bg-navy-700
    transition-colors duration-150
  `;
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseClasses} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Dropdown Divider component
const DropdownDivider = ({ className = '', ...props }) => (
  <div 
    className={`my-1 border-t border-ivory-200 dark:border-navy-700 ${className}`}
    {...props}
  />
);

// Dropdown Header component
const DropdownHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`px-4 py-2 text-xs font-semibold text-gray-500 dark:text-ivory-400 uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </div>
);

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
Dropdown.Header = DropdownHeader;

export default Dropdown;