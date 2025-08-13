import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobeGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!isRotating) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Slightly faster rotation
    return () => clearInterval(timer);
  }, [images.length, isRotating]);

  // Calculate positions for each image on the globe
  const getImagePosition = (index, totalImages) => {
    const angle = (index * (360 / totalImages) + currentIndex * -360 / totalImages) % 360;
    const radius = 280; // Increased radius for better visibility
    const z = radius * Math.cos((angle * Math.PI) / 180);
    const x = radius * Math.sin((angle * Math.PI) / 180);
    const scale = (z + radius) / (2 * radius); // Scale based on z-position
    const opacity = Math.max(0.3, scale); // Minimum opacity for better visibility

    return {
      x,
      z,
      scale: Math.max(0.5, scale),
      opacity: opacity,
      rotateY: angle
    };
  };

  return (
    <div className="relative w-full h-[600px] perspective-[1000px] overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent rounded-full blur-3xl" />
      
      {/* Globe Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[500px] h-[500px] transform-style-preserve-3d">
          {/* Rotating Images */}
          <AnimatePresence mode="wait">
            {images.map((image, index) => {
              const position = getImagePosition(index, images.length);
              
              return (
                <motion.div
                  key={`${index}-${currentIndex}`}
                  className="absolute top-1/2 left-1/2 w-[320px] h-[220px] origin-center"
                  initial={{ 
                    x: position.x, 
                    y: 0, 
                    z: position.z, 
                    rotateY: position.rotateY,
                    scale: position.scale,
                    opacity: position.opacity
                  }}
                  animate={{
                    x: position.x,
                    y: 0,
                    z: position.z,
                    rotateY: position.rotateY,
                    scale: position.scale,
                    opacity: position.opacity
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: Math.round(position.z)
                  }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transform -translate-x-1/2 -translate-y-1/2">
                    <img
                      src={image}
                      alt={`Location ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Image overlay with location name */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-lg">
                        {`Location ${index + 1}`}
                      </h3>
                      <p className="text-gray-200 text-sm">
                        Diani Beach, Kenya
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating particles for dynamic effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full"
        />
        <motion.div
          animate={{ 
            x: [0, 15, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
        <motion.button
          onClick={() => setIsRotating(!isRotating)}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRotating ? 'Pause' : 'Play'}
        </motion.button>
      </div>
    </div>
  );
};

export default GlobeGallery;