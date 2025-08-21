import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, Wifi, Coffee, Car, Shield } from 'lucide-react';
import { use3DTypeEffect } from '../../hooks/use3DTypeEffect';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('right');
  const [showMobileIntro, setShowMobileIntro] = useState(true);
  const [currentIntroCard, setCurrentIntroCard] = useState(0);

  const heroImages = useMemo(() => [
    { src: '/images/c.jpg', name: 'Chameleon 1', location: 'Garden View Unit' },
    { src: '/images/d.jpg', name: 'Chameleon 2', location: 'Beach Access Unit' },
    { src: '/images/q.jpg', name: "Wendy's Penthouse", location: 'Luxury Penthouse' }
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

  // Mobile intro cards content
  const introCards = useMemo(() => [
    {
      title: "Welcome to Queensy",
      description: "Your luxury accommodation in the heart of Diani Beach",
      icon: "🏝️"
    },
    {
      title: "Premium Experience",
      description: "Enjoy 5-star service and unforgettable moments",
      icon: "⭐"
    },
    {
      title: "Ready to Explore?",
      description: "Discover our properties and book your stay",
      icon: "🔍"
    }
  ], []);

  // Handle mobile intro navigation
  const handleNextIntroCard = () => {
    if (currentIntroCard < introCards.length - 1) {
      setCurrentIntroCard(prev => prev + 1);
    } else {
      setShowMobileIntro(false);
    }
  };

  const handleSkipIntro = () => {
    setShowMobileIntro(false);
  };

  return (
    <section 
      className="relative min-h-screen overflow-hidden pt-20 md:pt-0"
      aria-label="Hero section with luxury accommodations showcase"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>
      
      {/* Mobile Intro Experience */}
      {showMobileIntro && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center md:hidden" style={{ background: 'var(--gradient-hero)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIntroCard}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm px-6 py-8"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center space-y-6">
                  <motion.div 
                    className="text-6xl mb-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {introCards[currentIntroCard].icon}
                  </motion.div>
                  
                  <motion.h2 
                    className="text-3xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {introCards[currentIntroCard].title}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-blue-100 text-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {introCards[currentIntroCard].description}
                  </motion.p>
                  
                  <div className="pt-6 flex flex-col space-y-4">
                    <motion.button
                      onClick={handleNextIntroCard}
                      className="bg-white text-blue-800 font-medium py-3 px-6 rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {currentIntroCard < introCards.length - 1 ? "Next" : "Get Started"}
                    </motion.button>
                    
                    {currentIntroCard < introCards.length - 1 && (
                      <motion.button
                        onClick={handleSkipIntro}
                        className="text-blue-100 text-sm underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        Skip Introduction
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Progress dots */}
                  <div className="flex justify-center space-x-2 pt-4">
                    {introCards.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 rounded-full ${index === currentIntroCard ? 'bg-white w-6' : 'bg-white/40 w-2'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="block-content py-8 md:py-20">
        {/* Mobile-First Layout: Text -> Carousel -> Cards */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center min-h-[100vh] lg:min-h-[80vh]">
          {/* Mobile: Text Content at Top, Desktop: Left Content */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              type: "spring",
              stiffness: 60,
              damping: 20
            }}
            className="space-y-4 md:space-y-6 lg:space-y-8 order-1 lg:order-1 pt-4 lg:pt-0"
          >
            {/* Main Title - Mobile Optimized */}
            <h1 
              className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4 lg:mb-6 leading-tight"
              role="banner"
              aria-label="Welcome to Queensy luxury accommodations"
            >
              Welcome to <span className="text-blue-600">Queensy</span>
            </h1>

            {/* Dynamic Typing Text - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 dark:text-slate-300 font-light tracking-wide min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem] flex items-center justify-start mb-3 md:mb-4"
              role="status"
              aria-live="polite"
              aria-label="Dynamic promotional text"
            >
              <span className="font-mono bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                {typed}
              </span>
              <span className="animate-pulse text-blue-900 ml-1" aria-hidden="true">|</span>
            </motion.div>

          </motion.div>

          {/* Mobile: Carousel in Middle, Desktop: Right Content */}
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
            className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-2 mb-8 lg:mb-0"
          >
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
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
                    opacity: { duration: 0.2 }
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
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
                      <div className="text-center">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                          {heroImages[currentImageIndex].name}
                        </h3>
                        <p className="text-blue-200 text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
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

          {/* Mobile: Contact and Properties Buttons Below Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.8,
              type: "spring",
              stiffness: 60,
              damping: 20
            }}
            className="flex flex-row gap-2 sm:gap-3 md:gap-6 pt-4 md:pt-6 order-3 lg:order-3 justify-center lg:justify-start"
          >
            {/* Contact Us Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 max-w-[140px] sm:max-w-none lg:flex-1"
            >
              <Link
                to="/contact"
                className="airbnb-btn airbnb-btn-primary mobile-btn-small lg:airbnb-btn block text-center"
                aria-label="Contact us for booking inquiries"
              >
                <div className="text-center">
                  <h4 className="text-xs sm:text-sm lg:text-base font-medium mb-0 lg:mb-1">
                    Contact Us
                  </h4>
                  <p className="text-xs hidden lg:block opacity-90">
                    Get in touch
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* View Properties Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 max-w-[140px] sm:max-w-none lg:flex-1"
            >
              <Link
                to="/properties"
                className="airbnb-btn airbnb-btn-secondary mobile-btn-small lg:airbnb-btn block text-center"
                aria-label="Browse available properties"
              >
                <div className="text-center">
                  <h4 className="text-xs sm:text-sm lg:text-base font-medium mb-0 lg:mb-1">
                    View Properties
                  </h4>
                  <p className="text-xs hidden lg:block opacity-90">
                    Explore options
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 bg-[var(--vintage-sage)]/20 rounded-full blur-3xl"
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

export default HeroSection;