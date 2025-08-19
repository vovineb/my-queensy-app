import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to dark theme
    return true;
  });

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Apply theme to document body and update CSS variables
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--bg-primary', '#1e293b'); // Dark navy
      document.documentElement.style.setProperty('--bg-secondary', '#334155'); // Charcoal
      document.documentElement.style.setProperty('--bg-tertiary', '#0f172a'); // Darker navy
      document.documentElement.style.setProperty('--text-primary', '#f8fafc'); // White
      document.documentElement.style.setProperty('--text-secondary', '#e2e8f0'); // Light blue/ivory
      document.documentElement.style.setProperty('--text-accent', '#0ea5e9'); // Glowing oceanic blue
      document.documentElement.style.setProperty('--text-glow', '#38bdf8'); // Bright oceanic blue for glow effect
      document.documentElement.style.setProperty('--button-bg', '#1e40af'); // Blue button
      document.documentElement.style.setProperty('--button-hover', '#1d4ed8'); // Darker blue hover
      document.documentElement.style.setProperty('--card-bg', '#1e3a8a'); // Navy blue card background
      document.documentElement.style.setProperty('--card-border', '#3b82f6'); // Oceanic blue border
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-primary', '#ffffff'); // White
      document.documentElement.style.setProperty('--bg-secondary', '#f8fafc'); // Very light gradient base
      document.documentElement.style.setProperty('--bg-tertiary', '#f1f5f9'); // Light blue tint
      document.documentElement.style.setProperty('--text-primary', '#0f172a'); // Deep navy/black
      document.documentElement.style.setProperty('--text-secondary', '#1e40af'); // Blue
      document.documentElement.style.setProperty('--text-accent', '#3b82f6'); // Bright blue
      document.documentElement.style.setProperty('--text-glow', '#60a5fa'); // Light blue glow for light mode
      document.documentElement.style.setProperty('--button-bg', '#3b82f6'); // Blue button
      document.documentElement.style.setProperty('--button-hover', '#2563eb'); // Darker blue hover
      document.documentElement.style.setProperty('--card-bg', '#ffffff'); // White card background
      document.documentElement.style.setProperty('--card-border', '#e5e7eb'); // Light border
    }
  }, [isDark]);

  const value = {
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };

