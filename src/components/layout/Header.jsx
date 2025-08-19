import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Header = ({ isDark, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? isDark 
          ? 'bg-navy-900/95 backdrop-blur-md shadow-lg border-b border-navy-700' 
          : 'bg-ivory-50/95 backdrop-blur-md shadow-lg border-b border-ivory-200'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className={`text-2xl font-bold font-playfair transition-colors ${
            isDark ? 'text-oceanic-400' : 'text-oceanic-600'
          }`}>
            Queensy
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/properties', label: 'Properties' },
              { path: '/blog', label: 'Blog' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === item.path
                    ? isDark
                      ? 'bg-gradient-to-r from-oceanic-600 to-pool-600 text-white shadow-2xl'
                      : 'bg-gradient-to-r from-oceanic-600 to-pool-600 text-white shadow-2xl'
                    : isDark
                    ? 'text-ivory-300 hover:text-white hover:bg-gradient-to-r hover:from-navy-700 hover:to-navy-800'
                    : 'text-navy-700 hover:text-oceanic-600 hover:bg-gradient-to-r hover:from-oceanic-50 hover:to-pool-50'
                }`}
                style={{
                  boxShadow: location.pathname === item.path 
                    ? isDark 
                      ? '0 8px 32px rgba(2, 132, 199, 0.4)' 
                      : '0 8px 32px rgba(2, 132, 199, 0.3)'
                    : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center space-x-6">
            {/* Search and Menu Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? 'bg-gradient-to-r from-navy-700 to-navy-800 text-ivory-300 hover:from-navy-600 hover:to-navy-700 hover:text-white'
                    : 'bg-gradient-to-r from-oceanic-50 to-pool-50 text-navy-600 hover:from-oceanic-100 hover:to-pool-100'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 lg:hidden ${
                  isDark
                    ? 'bg-gradient-to-r from-navy-700 to-navy-800 text-ivory-300 hover:from-navy-600 hover:to-navy-700 hover:text-white'
                    : 'bg-gradient-to-r from-oceanic-50 to-pool-50 text-navy-600 hover:from-oceanic-100 hover:to-pool-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className={`absolute top-full left-0 right-0 p-4 ${
            isDark 
              ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-700' 
              : 'bg-ivory-50/95 backdrop-blur-md border-b border-ivory-200'
          }`}>
            <div className="container mx-auto max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties, blog posts..."
                  className={`w-full py-3 pl-12 pr-4 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-oceanic-500 ${
                    isDark
                      ? 'bg-navy-800 text-ivory-100 placeholder-ivory-400 border border-navy-700'
                      : 'bg-white text-navy-900 placeholder-navy-500 border border-ivory-300'
                  }`}
                  aria-label="Search"
                />
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-ivory-400' : 'text-navy-400'
                }`} />
                {/* Submit button (clickable icon) */}
                <button
                  type="submit"
                  title="Search"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? 'bg-navy-700 text-ivory-200 hover:bg-navy-600'
                      : 'bg-oceanic-50 text-navy-700 hover:bg-oceanic-100'
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className={`lg:hidden ${
            isDark 
              ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-700' 
              : 'bg-ivory-50/95 backdrop-blur-md border-b border-ivory-200'
          }`}>
            <div className="container mx-auto py-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-4 px-6 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === item.path
                      ? isDark
                        ? 'text-oceanic-400 bg-oceanic-900/30'
                        : 'text-oceanic-600 bg-oceanic-50'
                      : isDark
                        ? 'text-ivory-300 hover:text-oceanic-400 hover:bg-navy-800/50'
                        : 'text-navy-700 hover:text-oceanic-600 hover:bg-oceanic-50'
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