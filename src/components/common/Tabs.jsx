import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Tabs = ({
  tabs,
  defaultTab = 0,
  onChange,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  // Variant styles
  const variantStyles = {
    default: 'bg-white dark:bg-navy-800 border border-ivory-200 dark:border-navy-700',
    pills: 'bg-ivory-100 dark:bg-navy-900 p-1.5 rounded-xl',
    underline: 'border-b border-ivory-200 dark:border-navy-700',
    minimal: '',
  };

  // Size styles
  const sizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  // Tab button styles based on variant
  const getTabButtonStyles = (isActive) => {
    const baseStyles = `
      font-medium transition-all duration-200 outline-none
      ${sizeStyles[size] || sizeStyles.medium}
      ${fullWidth ? 'flex-1' : ''}
    `;

    switch (variant) {
      case 'pills':
        return `
          ${baseStyles}
          px-6 py-2.5 rounded-lg
          ${isActive
            ? 'bg-white dark:bg-navy-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}
        `;
      case 'underline':
        return `
          ${baseStyles}
          px-6 py-3 border-b-2
          ${isActive
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800'}
        `;
      case 'minimal':
        return `
          ${baseStyles}
          px-5 py-2
          ${isActive
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}
        `;
      default: // default
        return `
          ${baseStyles}
          px-6 py-3 rounded-t-lg
          ${isActive
            ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
            : 'bg-ivory-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}
        `;
    }
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Tab Headers */}
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles[variant] || variantStyles.default} rounded-lg`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={getTabButtonStyles(index === activeTab)}
            onClick={() => handleTabClick(index)}
            aria-selected={index === activeTab}
            role="tab"
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={index === activeTab ? 'block' : 'hidden'}
            role="tabpanel"
            aria-hidden={index !== activeTab}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Animated version of Tabs
export const AnimatedTabs = (props) => {
  const [activeTab, setActiveTab] = useState(props.defaultTab || 0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (props.onChange) {
      props.onChange(index);
    }
  };

  return (
    <div className={`w-full ${props.className || ''}`}>
      {/* Tab Headers */}
      <div className={`relative flex ${props.fullWidth ? 'w-full' : ''} ${props.variant === 'pills' ? 'bg-ivory-100 dark:bg-navy-900 p-1.5 rounded-xl' : ''}`}>
        {props.tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              relative z-10 font-medium transition-colors duration-200
              ${props.fullWidth ? 'flex-1' : ''}
              ${props.size === 'small' ? 'text-sm' : props.size === 'large' ? 'text-lg' : 'text-base'}
              ${props.variant === 'pills' ? 'px-6 py-2.5' : 'px-6 py-3'}
              ${activeTab === index ? 'text-white dark:text-white' : 'text-gray-600 dark:text-gray-300'}
            `}
            onClick={() => handleTabClick(index)}
            aria-selected={index === activeTab}
            role="tab"
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}

        {/* Animated Background */}
        {props.variant === 'pills' && (
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg shadow-md"
            initial={false}
            animate={{
              width: `${100 / props.tabs.length}%`,
              x: `${activeTab * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: `${100 / props.tabs.length}%` }}
          />
        )}

        {/* Underline Indicator */}
        {props.variant === 'underline' && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
            initial={false}
            animate={{
              width: `${100 / props.tabs.length}%`,
              x: `${activeTab * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: `${100 / props.tabs.length}%` }}
          />
        )}
      </div>

      {/* Tab Content with Animation */}
      <div className="mt-4 relative overflow-hidden">
        {props.tabs.map((tab, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index > activeTab ? 20 : -20 }}
            animate={{
              opacity: index === activeTab ? 1 : 0,
              x: index === activeTab ? 0 : index > activeTab ? 20 : -20,
              position: index === activeTab ? 'relative' : 'absolute',
            }}
            transition={{ duration: 0.2 }}
            className="w-full"
            style={{ display: index === activeTab ? 'block' : 'none' }}
            role="tabpanel"
            aria-hidden={index !== activeTab}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;