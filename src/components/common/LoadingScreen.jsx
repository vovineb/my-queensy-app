import React from 'react';
import { motion } from 'framer-motion';
import { use3DTypeEffect } from '../../hooks/use3DTypeEffect';

const LoadingScreen = () => {
  const loadingText = use3DTypeEffect(
    ["Thank you for the wait. I am sure it is worth it."],
    80,
    40,
    3000
  );

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-playfair text-yellow-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {loadingText}
          <span className="animate-blink">|</span>
        </motion.h2>
        
        <motion.div
          className="w-48 h-1 bg-yellow-900 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="h-full bg-yellow-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;