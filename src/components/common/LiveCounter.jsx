import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const LiveCounter = ({ end, duration = 2, prefix = '', suffix = '', formatter = null }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    let startTime;
    let animationFrame;

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4); // Easing function for smooth animation

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = easeOutQuart(progress);
      
      setCount(Math.floor(end * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setHasAnimated(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView, hasAnimated]);

  const formattedCount = formatter ? formatter(count) : count.toLocaleString();

  return (
    <motion.span
      ref={countRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center"
    >
      {prefix}{formattedCount}{suffix}
    </motion.span>
  );
};

export default LiveCounter;