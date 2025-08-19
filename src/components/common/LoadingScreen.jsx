import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-800 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo/Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-playfair text-blue-400 mb-6"
        >
          Queensy
        </motion.h1>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-48 h-1 bg-blue-900 rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            className="h-full bg-blue-400"
            animate={{
              width: ["0%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-blue-200 text-lg"
        >
          Loading your luxury experience...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;