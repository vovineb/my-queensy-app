import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-blue-600 rounded-full animate-ping mx-auto`}></div>
      </div>
      {message && (
        <p className="text-gray-300 font-body text-center">
          {message}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  message: PropTypes.string
};

export default LoadingSpinner; 