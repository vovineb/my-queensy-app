import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';  // ✅ Added arrows

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('right');
  const [currentIntroCard, setCurrentIntroCard] = useState(0);
  const [typed, setTyped] = useState('');

  const heroImages = [
    { src: '/images/c.jpg', name: 'Luxury Villa', location: 'Diani Beach' },
    { src: '/images/c2.jpg', name: 'Beach House', location: 'Diani Beach' },
    { src: '/images/c3.jpg', name: 'Coastal Retreat', location: 'Diani Beach' },
    { src: '/images/c4.jpg', name: 'Premium Suite', location: 'Diani Beach' },
    { src: '/images/c5.jpg', name: 'Ocean View', location: 'Diani Beach' },
    { src: '/images/c6.jpg', name: 'Garden Villa', location: 'Diani Beach' }
  ];

  const introCards = [
    {
      title: "Welcome to Queensy",
      content: "Discover premium accommodations in Australia's most beautiful destinations."
    },
    {
      title: "Luxury Meets Comfort",
      content: "Experience world-class amenities and personalized service in every stay."
    },
    {
      title: "Your Perfect Getaway",
      content: "From beachfront villas to mountain retreats, find your ideal escape."
    }
  ];

  const phrases = [
    "Sound Rest",
    "Pure Relaxation", 
    "Hidden Gem",
    "Comfort Optimised"
  ];

  const typingTexts = [
    "Premium Accommodations",
    "Luxury Experiences",
    "Unforgettable Stays",
    "Australian Destinations"
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // ✅ Added missing functions
  const prevImage = () => {
    setAnimationDirection('left');
    setCurrentImageIndex((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setAnimationDirection('right');
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const handleDotClick = (index) => {
    if (index > currentImageIndex) {
      setAnimationDirection('right');
    } else {
      setAnimationDirection('left');
    }
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      setAnimationDirection('right');
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout;
    const currentText = typingTexts[currentTextIndex];
    
    if (typed.length < currentText.length) {
      timeout = setTimeout(() => {
        setTyped(currentText.slice(0, typed.length + 1));
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setTyped('');
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
      }, 2000);
    }
    
    return () => clearTimeout(timeout);
  }, [typed, currentTextIndex]);

  const handleNextIntroCard = () => {
    if (currentIntroCard < introCards.length - 1) {
      setCurrentIntroCard(currentIntroCard + 1);
    }
  };

  const handleSkipIntro = () => {
    setCurrentIntroCard(introCards.length - 1);
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <section className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 lg:pb-16">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center gap-6 lg:gap-8 min-h-[75vh]">
          {/* Image Carousel Container */}
          <div className="lg:w-4/5 w-full order-1">
            <motion.div
              key={currentImageIndex}
              initial={{ 
                opacity: 0, 
                x: animationDirection === 'right' ? 100 : -100,
                scale: 0.98
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: animationDirection === 'right' ? -100 : 100,
                scale: 0.98
              }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 150,
                damping: 25
              }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              style={{
                background: 'linear-gradient(135deg, var(--vintage-cream) 0%, var(--vintage-sage) 100%)'
              }}
            >
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
                  
                  {/* Vintage Overlay */}
                  <div className="absolute inset-0 bg-[var(--vintage-dark)]/30" />
                  
                  {/* Property Info Card */}
                  <motion.div 
                    className="absolute bottom-6 left-6 right-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="bg-[var(--vintage-cream)]/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                      <h3 className="text-lg font-bold text-[var(--tech-black)] mb-1">
                        {heroImages[currentImageIndex].name}
                      </h3>
                      <p className="text-[var(--vintage-brown)] text-sm mb-2">
                        {heroImages[currentImageIndex].location}
                      </p>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[var(--vintage-sage)] fill-current" />
                        <span className="text-[var(--tech-black)] text-sm font-medium">Premium</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div 
                className="absolute top-6 right-6 flex flex-col gap-2"
                role="tablist"
                aria-label="Property image navigation"
              >
                {heroImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-[var(--vintage-cream)] scale-125 shadow-lg' 
                        : 'bg-[var(--vintage-cream)]/50 hover:bg-[var(--vintage-cream)]/80'
                    }`}
                    role="tab"
                    aria-selected={index === currentImageIndex}
                    aria-label={`View ${image.name}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[var(--vintage-cream)]/90 hover:bg-[var(--vintage-cream)] text-[var(--tech-black)] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[var(--vintage-cream)]/90 hover:bg-[var(--vintage-cream)] text-[var(--tech-black)] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </motion.div>
          </div>

          {/* Right Content - Text and Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              type: "spring",
              stiffness: 90,
              damping: 20
            }}
            className="lg:w-1/5 w-full flex flex-col justify-start text-center lg:text-left z-10 space-y-4 order-2 pt-8"
          >
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.3,
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--vintage-sage)] mb-3 leading-tight font-display"
            >
              Queensy
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.5,
                type: "spring",
                stiffness: 70,
                damping: 20
              }}
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-4 sm:mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Discover luxury accommodations in Australia's most stunning destinations
            </motion.p>

            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.7,
                type: "spring",
                stiffness: 60,
                damping: 20
              }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-[var(--vintage-brown)] mb-4 h-10 flex items-center justify-center lg:justify-start"
              role="status"
              aria-live="polite"
              aria-label="Dynamic promotional text"
            >
              <span className="typing-text">{typed}</span>
              <span className="typing-cursor">|</span>
            </motion.div>

            {/* Mobile Button Cards - Side by side below carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.9,
                type: "spring",
                stiffness: 50,
                damping: 20
              }}
              className="flex gap-3 justify-center order-3 px-2 w-full"
            >
              {/* Contact Us Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex-1"
              >
                <Link
                  to="/contact"
                  className="block relative bg-[var(--vintage-brown)] rounded-lg p-3 shadow-lg transform-gpu transition-all duration-300 hover:shadow-xl overflow-hidden min-h-[50px]"
                  aria-label="Contact us for inquiries"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--vintage-sage)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-3 h-3 text-[var(--tech-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--tech-white)] mb-0">
                        Contact Us
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* View Properties Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex-1"
              >
                <Link
                  to="/properties"
                  className="block relative bg-[var(--vintage-sage)] rounded-lg p-3 shadow-lg transform-gpu transition-all duration-300 hover:shadow-xl overflow-hidden min-h-[50px]"
                  aria-label="Browse available properties"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--vintage-brown)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-3 h-3 text-[var(--tech-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--tech-white)] mb-0">
                        View Properties
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Static Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                type: "spring",
                stiffness: 70,
                damping: 20
              }}
              className="text-sm sm:text-base text-[var(--vintage-brown)] mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
            >
              Experience premium accommodations in the heart of Diani Beach, where luxury meets the pristine Kenyan coastline.
            </motion.p>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col lg:hidden items-center gap-6 min-h-[100vh] py-4">
          {/* Mobile Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.2,
              type: "spring",
              stiffness: 60,
              damping: 20
            }}
            className="flex flex-col justify-center text-center z-10 space-y-4 order-1 px-4"
          >
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.3,
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
              className="text-3xl sm:text-4xl font-bold text-[var(--vintage-sage)] mb-3 leading-tight font-display"
            >
              Queensy
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.5,
                type: "spring",
                stiffness: 70,
                damping: 20
              }}
              className="text-base sm:text-lg text-[var(--text-secondary)] mb-4 max-w-xl mx-auto leading-relaxed"
            >
              Discover luxury accommodations in Australia's most stunning destinations
            </motion.p>

            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.7,
                type: "spring",
                stiffness: 60,
                damping: 20
              }}
              className="text-lg sm:text-xl font-medium text-[var(--vintage-brown)] mb-4 min-h-[2rem] flex items-center justify-center"
              role="status"
              aria-live="polite"
              aria-label="Dynamic promotional text"
            >
              <span className="font-mono text-[var(--vintage-brown)]">
                {typed}
              </span>
              <span className="animate-pulse text-[var(--vintage-brown)] ml-1" aria-hidden="true">|</span>
            </motion.div>
          </motion.div>

          {/* Mobile Image Carousel */}
          <div className="w-full order-2 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.3,
                type: "spring",
                stiffness: 60,
                damping: 20
              }}
              className="relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl shadow-2xl group"
              style={{
                background: 'linear-gradient(135deg, var(--vintage-cream) 0%, var(--vintage-sage) 100%)'
              }}
            >
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
                  
                  {/* Vintage Overlay */}
                  <div className="absolute inset-0 bg-[var(--vintage-dark)]/30" />
                  
                  {/* Property Info Card */}
                  <motion.div 
                    className="absolute bottom-6 left-6 right-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="bg-[var(--vintage-cream)]/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                      <h3 className="text-lg font-bold text-[var(--tech-black)] mb-1">
                        {heroImages[currentImageIndex].name}
                      </h3>
                      <p className="text-[var(--vintage-brown)] text-sm mb-2">
                        {heroImages[currentImageIndex].location}
                      </p>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[var(--vintage-sage)] fill-current" />
                        <span className="text-[var(--tech-black)] text-sm font-medium">Premium</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div 
                className="absolute top-6 right-6 flex flex-col gap-2"
                role="tablist"
                aria-label="Property image navigation"
              >
                {heroImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-[var(--vintage-cream)] scale-125 shadow-lg' 
                        : 'bg-[var(--vintage-cream)]/50 hover:bg-[var(--vintage-cream)]/80'
                    }`}
                    role="tab"
                    aria-selected={index === currentImageIndex}
                    aria-label={`View ${image.name}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[var(--vintage-cream)]/90 hover:bg-[var(--vintage-cream)] text-[var(--tech-black)] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[var(--vintage-cream)]/90 hover:bg-[var(--vintage-cream)] text-[var(--tech-black)] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </motion.div>
          </div>

          {/* Mobile Button Cards - Below Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              type: "spring",
              stiffness: 70,
              damping: 20
            }}
            className="flex flex-row gap-4 px-4 order-3"
          >
            {/* Contact Us Card - Left */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex-1"
            >
              <Link
                to="/contact"
                className="block relative bg-[var(--vintage-cream)] rounded-lg p-4 shadow-md transform-gpu transition-all duration-300 hover:shadow-lg overflow-hidden"
                aria-label="Contact us for booking inquiries"
              >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--vintage-sage)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 text-[var(--tech-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--tech-black)] mb-0">
                      Contact Us
                    </h4>
                    <p className="text-[var(--tech-black)] text-xs font-medium">
                      Get assistance
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* View Properties Card - Right */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex-1"
            >
              <Link
                to="/properties"
                className="block relative bg-[var(--vintage-sage)] rounded-lg p-4 shadow-md transform-gpu transition-all duration-300 hover:shadow-lg overflow-hidden"
                aria-label="Browse available properties"
              >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--vintage-brown)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 text-[var(--tech-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--tech-white)] mb-0">
                      View Properties
                    </h4>
                    <p className="text-[var(--tech-white)] text-xs font-medium">
                      Explore options
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile Static Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              delay: 1.1,
              type: "spring",
              stiffness: 70,
              damping: 20
            }}
            className="text-sm md:text-base text-[var(--tech-black)] leading-relaxed font-medium text-center px-4 order-4"
          >
            Experience premium accommodations with world-class amenities and personalized service in Australia's most beautiful locations.
          </motion.p>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 bg-[var(--vintage-sage)]/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-48 h-48 bg-[var(--vintage-brown)]/20 rounded-full blur-3xl"
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
