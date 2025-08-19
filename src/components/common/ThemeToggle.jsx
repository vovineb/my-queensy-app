import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
        isDark
          ? 'bg-gradient-to-r from-navy-700 to-navy-800 text-ivory-300 hover:from-navy-600 hover:to-navy-700 hover:text-white'
          : 'bg-gradient-to-r from-oceanic-50 to-pool-50 text-navy-600 hover:from-oceanic-100 hover:to-pool-100'
      }`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
