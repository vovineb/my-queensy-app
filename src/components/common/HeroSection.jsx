import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, Wifi, Coffee, Car, Shield } from 'lucide-react';
import { use3DTypeEffect } from '../../hooks/use3DTypeEffect';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('right');

  const heroImages = useMemo(() => [
    { src: '/src/assets/images/c.jpg', name: 'Chameleon 1', location: 'Garden View Unit' },
    { src: '/src/assets/images/d.jpg', name: 'Chameleon 2', location: 'Beach Access Unit' },
    { src: '/src/assets/images/q.jpg', name: "Wendy's Penthouse", location: 'Luxury Penthouse' }
  ], []);

  const typingTexts = useMemo(() => [
    'Luxury Accommodations in Diani Beach',
    'Premium Service & Unforgettable Experiences',
    'Your Gateway to Coastal Paradise',
    'If stuck, call +254 707 335 604'
  ], []);
  
  const typed = use3DTypeEffect(typingTexts, 80, 50, 5000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % heroImages.length;
        setAnimationDirection(next > prev ? 'right' : 'left');
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const imageVariants = useMemo(() => ({
    enter: (direction) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
      rotate: direction === 'right' ? 5 : -5,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotate: 0,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
      rotate: direction === 'right' ? -5 : 5,
      scale: 0.8
    })
  }), []);

  const features = useMemo(() => [
    { icon: '🏖️', text: 'Relaxation Zone', desc: 'Premium beach access' },
    { icon: '🌟', text: '5-Star Service', desc: 'Luxury hospitality' },
    { icon: '🌴', text: 'Tropical Paradise', desc: 'Coastal beauty' }
  ], []);

  return (
    <section 
      className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-200 to-white overflow-hidden"
      aria-label="Hero section with luxury accommodations showcase"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Enhanced Typography Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.2,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="space-y-8 text-center order-1 lg:order-1"
          >
            {/* Main Title with Enhanced Spacing */}
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-900 mb-6 leading-tight"
              role="banner"
              aria-label="Welcome to Queensy luxury accommodations"
            >
              Welcome to <span className="text-blue-700">Queensy</span>
            </h1>

            {/* Dynamic Typing Text with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-800 font-light tracking-wide min-h-[3rem] flex items-center justify-center lg:justify-start"
              role="status"
              aria-live="polite"
              aria-label="Dynamic promotional text"
            >
              <span className="font-mono bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                {typed}
              </span>
              <span className="animate-pulse text-blue-900 ml-1" aria-hidden="true">|</span>
            </motion.div>

            {/* Subtitle with Better Spacing */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.4,
                type: "spring",
                stiffness: 80,
                damping: 25
              }}
              className="text-2xl md:text-3xl text-oceanic-100 leading-relaxed max-w-3xl mx-auto lg:mx-0 font-medium tracking-wide"
            >
              Your premier destination for luxury accommodations in the heart of Diani Beach
            </motion.p>

            {/* Enhanced Call to Action Buttons with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 1.2,
                type: "spring",
                stiffness: 60,
                damping: 30
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center pt-8 max-w-2xl mx-auto"
            >
              {/* Contact Us Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  to="/contact"
                  className="block bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  aria-label="Contact us for booking inquiries"
                >
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-blue-600 mb-2 group-hover:text-white transition-colors">
                      Contact Us
                    </h4>
                    <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors">
                      Get in touch for bookings
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* View Properties Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  to="/properties"
                  className="block bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  aria-label="View available properties and accommodations"
                >
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-blue-600 mb-2 group-hover:text-white transition-colors">
                      View Properties
                    </h4>
                    <p className="text-blue-200 text-sm group-hover:text-blue-100 transition-colors">
                      Explore our accommodations
                    </p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Features with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 1.4,
                type: "spring",
                stiffness: 50,
                damping: 35
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6"
              role="region"
              aria-label="Key features and amenities"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 1.6 + (index * 0.15),
                    type: "spring",
                    stiffness: 120,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="text-center space-y-3"
                  role="article"
                  aria-labelledby={`feature-${index}`}
                >
                  <motion.div 
                    className="text-3xl mb-2" 
                    aria-hidden="true"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 
                    id={`feature-${index}`}
                    className="text-blue-900 font-semibold text-base md:text-lg"
                  >
                    {feature.text}
                  </h3>
                  <p className="text-blue-800 text-xs md:text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              duration: 1.4, 
              delay: 0.4,
              type: "spring",
              stiffness: 70,
              damping: 25
            }}
            whileHover={{ scale: 1.02 }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-2"
          >
            <div className="relative h-[600px] lg:h-[700px] xl:h-[800px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait" custom={animationDirection}>
                <motion.div
                  key={currentImageIndex}
                  custom={animationDirection}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 200, damping: 25 },
                    opacity: { duration: 0.4 },
                    rotate: { type: "spring", stiffness: 150, damping: 20 },
                    scale: { type: "spring", stiffness: 180, damping: 22 }
                  }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImages[currentImageIndex].src}
                    alt={heroImages[currentImageIndex].name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Property Name Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {heroImages[currentImageIndex].name}
                        </h3>
                        <p className="text-blue-200 text-lg mb-3">
                          {heroImages[currentImageIndex].location}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">4.9/5 Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Navigation Dots */}
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3"
                role="tablist"
                aria-label="Property image navigation"
              >
                {heroImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setAnimationDirection(index > currentImageIndex ? 'right' : 'left');
                    }}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white scale-125 shadow-lg'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    role="tab"
                    aria-selected={index === currentImageIndex}
                    aria-label={`View ${image.name} image`}
                    tabIndex={index === currentImageIndex ? 0 : -1}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      scale: index === currentImageIndex ? 1.25 : 1,
                      opacity: index === currentImageIndex ? 1 : 0.7
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25 
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </section>
  );
};

export default memo(HeroSection);