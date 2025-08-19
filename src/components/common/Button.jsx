import React from 'react';

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;