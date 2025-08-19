import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom TikTok icon component
const TikTokIcon = (props) => (
  <svg viewBox="0 0 32 32" fill="currentColor" width="1em" height="1em" {...props}>
    <path d="M28.5 10.5c-2.1 0-4-0.7-5.5-1.9v10.2c0 4.2-3.4 7.7-7.7 7.7s-7.7-3.4-7.7-7.7 3.4-7.7 7.7-7.7c0.5 0 1 0 1.5 0.1v3.1c-0.5-0.1-1-0.2-1.5-0.2-2.5 0-4.6 2-4.6 4.6s2 4.6 4.6 4.6 4.6-2 4.6-4.6v-17.1h3.1c0.1 2.1 1.8 3.8 3.9 3.9v3.1z" />
  </svg>
);

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show footer when near bottom of page or scrolling up
      const nearBottom = currentScrollY + windowHeight >= documentHeight - 200;
      const scrollingUp = currentScrollY < scrollY;
      
      setIsVisible(nearBottom || scrollingUp);
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <motion.footer 
      className="relative bg-navy-900 text-ivory-500 py-16 mt-24"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        duration: 0.6, 
        ease: "easeInOut" 
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Queensy</h3>
            <p className="text-blue-200 mb-4 max-w-md">
              Your premier destination for luxury accommodations in the heart of Diani Beach. Experience the perfect blend of comfort, style, and authentic Kenyan hospitality.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-oceanic-400" />
                <span className="text-white">Diani Beach, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-oceanic-400" />
                <span className="text-white">+254 707 335 604</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-oceanic-400" />
                <span className="text-white">info@queensy.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-6">Quick Links</h4>
            <div className="grid gap-4">
              {[
                { to: '/', label: 'Home' },
                { to: '/properties', label: 'Properties' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-6">Our Services</h4>
            <div className="grid gap-4">
              {[
                'Web Development',
                'Auditing',
                'Financial Bookkeeping',
                'QuickBooks',
                '3D Rendering',
                'AutoCAD'
              ].map((service) => (
                <span
                  key={service}
                  className="text-white"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-6">Connect With Us</h4>
            <div className="flex gap-4 mb-8">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/byron-agong-729543263/', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: TikTokIcon, href: '#', label: 'TikTok' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-300 transition-colors transform hover:scale-110 p-2"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-blue-300">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-navy-800 border border-navy-700 rounded-l-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-oceanic-600 to-pool-600 text-white font-semibold rounded-2xl hover:from-oceanic-700 hover:to-pool-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-navy-700 text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Queensy. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;