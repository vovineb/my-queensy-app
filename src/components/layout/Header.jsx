import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Triangle } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold text-yellow-400 font-playfair">
            Queensy
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12 ml-16">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                  location.pathname === item.path
                    ? 'text-yellow-400 bg-black/40 shadow-lg shadow-black/20'
                    : 'text-gray-100 hover:text-yellow-400 hover:bg-black/20'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center gap-6">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-black/20 rounded-full transition-colors"
            >
              <Search className="w-6 h-6 text-yellow-400" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-black/20 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-yellow-400" />
              ) : (
                <Menu className="w-6 h-6 text-yellow-400" />
              )}
            </button>
          </div>
        </div>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm p-4">
            <div className="container mx-auto max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties, blog posts..."
                  className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/10 text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-black/95 backdrop-blur-sm">
            <div className="container mx-auto py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-3 px-4 rounded-lg text-lg font-semibold transition-colors ${
                    location.pathname === item.path
                      ? 'text-yellow-400 bg-black/30'
                      : 'text-yellow-100 hover:text-yellow-400 hover:bg-black/20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;