import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg bg-[var(--vintage-brown)] text-[var(--vintage-cream)] hover:bg-[var(--vintage-sage)]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
