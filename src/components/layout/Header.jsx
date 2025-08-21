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
        ? 'bg-[var(--vintage-dark)]/95 backdrop-blur-md shadow-lg border-b border-[var(--vintage-sage)]/30'
        : 'bg-[var(--vintage-dark)]/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold font-playfair transition-colors font-sans text-[var(--vintage-sage)]">
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
                    ? 'bg-[var(--vintage-sage)] text-[var(--tech-white)] shadow-2xl'
                    : 'text-[var(--vintage-brown)] hover:text-[var(--tech-white)] hover:bg-[var(--vintage-brown)]'
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
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 bg-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] shadow-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 lg:hidden bg-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] shadow-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="absolute top-full left-0 right-0 p-4 bg-[var(--vintage-dark)]/95 backdrop-blur-md border-b border-[var(--vintage-sage)]/30">
            <div className="container mx-auto max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties, blog posts..."
                  className="w-full py-4 pl-12 pr-4 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] bg-[var(--vintage-cream)] text-[var(--vintage-brown)] placeholder-[var(--vintage-brown)]/60 border border-[var(--vintage-sage)]/30"
                  aria-label="Search"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--vintage-sage)]" />
                {/* Submit button (clickable icon) */}
                <button
                  type="submit"
                  title="Search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 bg-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)]"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden bg-[var(--vintage-dark)]/95 backdrop-blur-md border-b border-[var(--vintage-sage)]/30">
            <div className="container mx-auto py-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-5 px-6 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === item.path
                      ? 'text-[var(--vintage-sage)] bg-[var(--vintage-sage)]/20'
                      : 'text-[var(--vintage-cream)] hover:text-[var(--vintage-sage)] hover:bg-[var(--vintage-brown)]/30'
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