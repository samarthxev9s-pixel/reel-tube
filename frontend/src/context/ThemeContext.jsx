import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  minimal: {
    id: 'minimal',
    name: 'Pure Dark Minimal',
    bg: '#0a0a0a',
    card: '#141414',
    border: '#222',
    text: '#ffffff',
    muted: '#a0a0a0',
    accent: '#ff0000',
    accentHover: '#cc0000',
    nav: '#0a0a0a',
  },
  neon: {
    id: 'neon',
    name: 'Immersive Neon',
    bg: '#000000',
    card: '#0d0d0d',
    border: '#1a1a1a',
    text: '#ffffff',
    muted: '#b0b0b0',
    accent: '#ff2d55',
    accentHover: '#e6003d',
    nav: '#000000',
  },
  soft: {
    id: 'soft',
    name: 'Soft Modern',
    bg: '#121212',
    card: '#1e1e1e',
    border: '#2a2a2a',
    text: '#f5f5f5',
    muted: '#9ca3af',
    accent: '#ef4444',
    accentHover: '#dc2626',
    nav: '#121212',
  }
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('rt-theme') || 'minimal';
  });

  const theme = themes[themeId] || themes.minimal;

  useEffect(() => {
    localStorage.setItem('rt-theme', themeId);
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', theme.accentHover);
    root.style.setProperty('--nav', theme.nav);
    document.body.style.backgroundColor = theme.bg;
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
