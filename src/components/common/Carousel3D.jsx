import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel3D = ({ images, propertyName = "Property" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-blue-400 text-lg">Loading images...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      {/* 3D Carousel Container */}
      <div className="relative w-full h-full transform-style-preserve-3d">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % images.length;
          const isPrev = index === (currentIndex - 1 + images.length) % images.length;
          const isNext2 = index === (currentIndex + 2) % images.length;
          const isPrev2 = index === (currentIndex - 2 + images.length) % images.length;
          
          let transform = '';
          let zIndex = 0;
          let opacity = 0;
          let scale = 0.6;
          let rotateY = 0;

          if (isActive) {
            transform = 'rotateY(0deg) translateZ(0px)';
            zIndex = 20;
            opacity = 1;
            scale = 1;
            rotateY = 0;
          } else if (isNext) {
            transform = 'rotateY(25deg) translateZ(150px) translateX(20px)';
            zIndex = 15;
            opacity = 0.8;
            scale = 0.85;
            rotateY = 25;
          } else if (isPrev) {
            transform = 'rotateY(-25deg) translateZ(150px) translateX(-20px)';
            zIndex = 15;
            opacity = 0.8;
            scale = 0.85;
            rotateY = -25;
          } else if (isNext2) {
            transform = 'rotateY(45deg) translateZ(100px) translateX(40px)';
            zIndex = 10;
            opacity = 0.5;
            scale = 0.7;
            rotateY = 45;
          } else if (isPrev2) {
            transform = 'rotateY(-45deg) translateZ(100px) translateX(-40px)';
            zIndex = 10;
            opacity = 0.5;
            scale = 0.7;
            rotateY = -45;
          } else {
            transform = 'rotateY(60deg) translateZ(50px) translateX(60px)';
            zIndex = 5;
            opacity = 0.2;
            scale = 0.5;
            rotateY = 60;
          }

          return (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform,
                zIndex,
              }}
              initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
              animate={{ 
                opacity, 
                scale,
                rotateY,
                translateZ: isActive ? 0 : isNext || isPrev ? 150 : isNext2 || isPrev2 ? 100 : 50,
                translateX: isActive ? 0 : isNext ? 20 : isPrev ? -20 : isNext2 ? 40 : isPrev2 ? -40 : 60
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={`${propertyName} ${index + 1}`}
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  style={{
                    filter: 'brightness(1.1) contrast(1.1)',
                  }}
                />
                
                {/* Glass Morphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 backdrop-blur-sm border border-white/20 rounded-3xl" />
                
                {/* Property Info Overlay */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-6 left-6 right-6 text-center"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-playfair drop-shadow-lg">
                      {propertyName}
                    </h3>
                    <p className="text-blue-100 text-sm md:text-base drop-shadow-lg">
                      Luxury Accommodation in Diani Beach
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-blue-500/90 backdrop-blur-md rounded-full hover:scale-110 transition-all duration-300 border border-white/30 shadow-2xl hover:shadow-blue-500/50"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-blue-500/90 backdrop-blur-md rounded-full hover:scale-110 transition-all duration-300 border border-white/30 shadow-2xl hover:shadow-blue-500/50"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50' 
                : 'bg-white/60 hover:bg-white/90 hover:scale-110'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 rounded-b-3xl overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default Carousel3D;