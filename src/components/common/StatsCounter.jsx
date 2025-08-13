import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Home, Star, Calendar } from 'lucide-react';

const StatsCounter = ({ endValue, duration = 2000, icon: Icon, label, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [endValue, duration]);

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIncrement = Math.floor(Math.random() * 3) + 1;
      setCount(prev => prev + randomIncrement);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-yellow-400 mr-3" />
        <span className="text-4xl font-bold text-white">
          {count.toLocaleString()}{suffix}
        </span>
      </div>
      <p className="text-gray-300 text-lg font-medium">{label}</p>
    </motion.div>
  );
};

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-playfair text-yellow-400 mb-4">
            Queensy by the Numbers
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real-time statistics showing our commitment to excellence and customer satisfaction
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCounter
            endValue={150}
            icon={Home}
            label="Premium Properties"
            suffix="+"
          />
          <StatsCounter
            endValue={2500}
            icon={Users}
            label="Happy Guests"
            suffix="+"
          />
          <StatsCounter
            endValue={98}
            icon={Star}
            label="Satisfaction Rate"
            suffix="%"
          />
          <StatsCounter
            endValue={5000}
            icon={Calendar}
            label="Nights Booked"
            suffix="+"
          />
        </div>

        {/* Live Updates Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              Live Updates Every 30 Seconds
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { StatsCounter };
export default StatsSection;