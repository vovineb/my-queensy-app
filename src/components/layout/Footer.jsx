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

  return (
    <footer 
      className="relative bg-[var(--vintage-dark)] text-[var(--vintage-cream)] py-16 mt-24"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[var(--vintage-cream)] mb-4 font-sans">Queensy</h3>
            <p className="text-[var(--vintage-cream)]/80 mb-4 max-w-md font-sans">
              Your premier destination for luxury accommodations in the heart of Diani Beach. Experience the perfect blend of comfort, style, and authentic Kenyan hospitality.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-oceanic-400" />
                <span className="text-[var(--vintage-cream)]">Diani Beach, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-oceanic-400" />
                <span className="text-[var(--vintage-cream)]">+254 707 335 604</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-oceanic-400" />
                <span className="text-[var(--vintage-cream)]">info@queensy.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--vintage-sage)] mb-6">Quick Links</h4>
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
                  className="text-[var(--vintage-cream)] hover:text-[var(--vintage-sage)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--vintage-sage)] mb-6">Our Services</h4>
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
                  className="text-[var(--vintage-cream)]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--vintage-sage)] mb-6">Connect With Us</h4>
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
                  className="text-[var(--vintage-cream)] hover:text-[var(--vintage-sage)] transition-colors transform hover:scale-110 p-2"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-[var(--vintage-sage)]">Newsletter</h5>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-[var(--vintage-brown)]/20 backdrop-blur-sm border border-[var(--vintage-sage)]/20 rounded-lg text-[var(--vintage-cream)] placeholder-[var(--vintage-cream)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-semibold rounded-lg hover:bg-[var(--vintage-brown)] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[var(--vintage-sage)]/30 text-center">
          <p className="text-[var(--vintage-cream)]">
            &copy; {new Date().getFullYear()} Queensy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;