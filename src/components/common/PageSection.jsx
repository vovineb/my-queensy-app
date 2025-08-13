import React from 'react';

const PageSection = ({
  children,
  className = '',
  fullWidth = false,
  dark = false,
  containerClassName = ''
}) => {
  return (
    <section
      className={`py-16 ${dark ? 'bg-black/50' : ''} ${className}`}
    >
      <div className={`${fullWidth ? 'w-full' : 'container mx-auto px-4'} ${containerClassName}`}>
        {/* Grid system for content balance */}
        <div className="grid grid-cols-12 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
};

export default PageSection;