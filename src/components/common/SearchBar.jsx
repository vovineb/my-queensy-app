import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-2xl mx-auto ${
        isDark ? 'bg-gray-800/50' : 'bg-white/80'
      } backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-6 py-4 pr-12 ${
            isDark 
              ? 'bg-transparent text-white placeholder-gray-400' 
              : 'bg-transparent text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;