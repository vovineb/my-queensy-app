import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Carousel3D = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!isRotating) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [images.length, isRotating]);

  return (
    <div className="relative w-full h-[600px] perspective-[2000px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[400px] h-[400px] transform-style-preserve-3d"
          animate={{ rotateY: currentIndex * -120 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full backface-visible"
              style={{
                transform: `rotateY(${index * 120}deg) translateZ(230px)`,
                transformOrigin: "50% 50% -230px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsRotating(false);
              setTimeout(() => setIsRotating(true), 10000);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <motion.button
        onClick={() => setIsRotating(!isRotating)}
        className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isRotating ? 'Pause' : 'Play'}
      </motion.button>
    </div>
  );
};

export default Carousel3D;