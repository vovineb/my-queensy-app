import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Header = ({ isDark, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

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
    <header className="fixed top-0 left-0 right-0 bg-[var(--vintage-cream)]/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold font-playfair transition-colors font-sans text-[var(--vintage-brown)] drop-shadow-[0_0_8px_var(--vintage-brown)] animate-pulse-slow">
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
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:mx-2 hover:my-1 ${
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
                {/* Properties Dropdown */}
                {item.path === '/properties' && (
                  <div className="absolute left-0 mt-2 w-64 bg-[var(--vintage-cream)]/80 backdrop-blur-md rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-[var(--vintage-sage)]/30">
                    <Link
                      to="/properties/chameleon-1"
                      className="block px-4 py-2 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300"
                    >
                      Chameleon 1 – 1 Bedroom
                    </Link>
                    <Link
                      to="/properties/chameleon-2"
                      className="block px-4 py-2 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300"
                    >
                      Chameleon 2 – 1 Bedroom
                    </Link>
                    <Link
                      to="/properties/wendys-penthouse"
                      className="block px-4 py-2 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300"
                    >
                      W. Penthouse – 3 Bedroom
                    </Link>
                    <Link
                      to="/properties/watamu-villa"
                      className="block px-4 py-2 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300"
                    >
                      Watamu Villa – 4 Bedroom
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center space-x-6">
            {/* Search and Menu Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 bg-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] shadow-lg"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 lg:hidden bg-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Profile Button */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative group">
                  {/* User Icon/Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[var(--vintage-sage)] flex items-center justify-center text-[var(--tech-white)] font-bold cursor-pointer">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--vintage-cream)] rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-[var(--vintage-sage)]/30 backdrop-blur-md">
                                      <Link
                                        to="/bookings"
                                        className="block px-4 py-3 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300 font-medium rounded-t-xl"
                                      >
                                        My Bookings
                                      </Link>
                                      <button
                                        onClick={() => auth.signOut()}
                                        className="block w-full text-left px-4 py-3 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300 font-medium rounded-b-xl"
                                      >
                                        Sign Out
                                      </button>
                                    </div>
                </div>
              ) : (
                <div className="relative group">
                  {/* Profile Icon */}
                  <div className="w-10 h-10 rounded-full bg-[var(--vintage-sage)] flex items-center justify-center text-[var(--tech-white)] font-bold cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--vintage-cream)] rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-[var(--vintage-sage)]/30 backdrop-blur-md">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-[var(--vintage-brown)] hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="w-10 h-10 sm:w-12 sm:h-12">
              <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            </div>
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
              {/* Mobile Profile Options */}
              {user && (
                              <Link
                                to="/bookings"
                                className="py-3 px-6 bg-[var(--vintage-cream)] text-[var(--vintage-brown)] font-semibold rounded-xl hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300 text-center mb-3"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                My Bookings
                              </Link>
                            )}
              <div className="flex flex-col gap-4 px-6 py-4 border-t border-[var(--vintage-sage)]/30 mt-4">
                {user ? (
                  <button
                    onClick={() => {
                      auth.signOut();
                      setIsMenuOpen(false);
                    }}
                    className="py-3 px-6 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-semibold rounded-xl hover:bg-[var(--vintage-brown)] transition-all duration-300 text-center"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="py-3 px-6 bg-[var(--vintage-cream)] text-[var(--vintage-brown)] font-semibold rounded-xl hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="py-3 px-6 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-semibold rounded-xl hover:bg-[var(--vintage-brown)] transition-all duration-300 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;