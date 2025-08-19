import React, { useState } from 'react';

const ImageAsset = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://placehold.co/600x400/1a1a1a/d4af37?text=Image+Loading',
  onError = null
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = (e) => {
    setError(true);
    setLoading(false);
    if (onError) onError(e);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default ImageAsset;