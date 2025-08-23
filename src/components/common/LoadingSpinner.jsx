import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--vintage-cream)]">
      <div className="text-[var(--vintage-brown)] text-xl font-semibold">
        Loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;