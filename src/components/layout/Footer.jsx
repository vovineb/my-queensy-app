import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';

// Custom TikTok icon component
const TikTokIcon = (props) => (
  <svg viewBox="0 0 32 32" fill="currentColor" width="1em" height="1em" {...props}>
    <path d="M28.5 10.5c-2.1 0-4-0.7-5.5-1.9v10.2c0 4.2-3.4 7.7-7.7 7.7s-7.7-3.4-7.7-7.7 3.4-7.7 7.7-7.7c0.5 0 1 0 1.5 0.1v3.1c-0.5-0.1-1-0.2-1.5-0.2-2.5 0-4.6 2-4.6 4.6s2 4.6 4.6 4.6 4.6-2 4.6-4.6v-17.1h3.1c0.1 2.1 1.8 3.8 3.9 3.9v3.1z" />
  </svg>
);

const Footer = ({ watermarkText = "QUEENSY DIANI BnBs" }) => {
  return (
    <footer className="relative bg-black text-yellow-100 py-16 mt-24 overflow-hidden">
      {/* Large watermark text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[20vw] font-bold text-yellow-400 whitespace-nowrap tracking-wider font-playfair"
        >
          QUEENSY BNB
        </motion.span>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[15vw] font-bold text-yellow-400 whitespace-nowrap tracking-widest font-playfair rotate-[-10deg]">
            QUEENSY BNB
          </span>
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-6 font-playfair">Queensy</h3>
            <div className="space-y-4 text-yellow-200">
              <p className="flex items-center gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Diani Beach Road, Diani, Mombasa, Kenya</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+254706880575</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@queensy.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-6">Quick Links</h4>
            <div className="grid gap-4">
              {[
                { to: '/home', label: 'Home' },
                { to: '/properties', label: 'Properties' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-yellow-200 hover:text-yellow-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-6">Connect With Us</h4>
            <div className="flex gap-6 mb-8">
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
                  className="text-yellow-200 hover:text-yellow-400 transition-colors transform hover:scale-125 p-2"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Hire Developer Section */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-6">Hire the Developer</h4>
            <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-900">
              <p className="text-yellow-200 mb-4">Looking for a skilled developer for your project?</p>
              <div className="space-y-3">
                <a
                  href="tel:+254706880575"
                  className="flex items-center gap-2 text-yellow-200 hover:text-yellow-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +254706880575
                </a>
                <a
                  href="https://www.linkedin.com/in/byron-agong-729543263/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-yellow-200 hover:text-yellow-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Byron Agong
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-yellow-900 text-center">
          <p className="text-yellow-200">
            &copy; {new Date().getFullYear()} Queensy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;