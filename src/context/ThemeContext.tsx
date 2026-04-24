import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeType, THEMES, ThemeConfig } from '../types';

interface ThemeContextType {
  theme: ThemeType;
  config: ThemeConfig;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('default');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDark);
  }, []);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
  };

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const newVal = !prev;
      localStorage.setItem('darkMode', String(newVal));
      return newVal;
    });
  };

  const config = THEMES[theme];

  return (
    <ThemeContext.Provider value={{ theme, config, setTheme, isDark, toggleDarkMode }}>
      <div className={`${isDark ? 'dark' : ''} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
