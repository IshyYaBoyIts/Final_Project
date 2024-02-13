import React, { useEffect, useMemo } from 'react';
import './styles/ThemeSelector.css'; // Ensure the CSS file path is correct

const ThemeSelector = ({ user, onThemeChange, selectedTheme }) => {
  const themes = useMemo(() => [
    {
      name: 'Default',
      value: 'default',
      primary: '#5dfdcb',
      secondary: '#90d7ff',
      tertiary: '#c9f9ff',
      quaternary: '#bfd0e0',
      quinary: '#b8b3be',
    },
    {
      name: 'Theme1',
      value: 'theme1',
      primary: '#04E762',
      secondary: '#F5B700',
      tertiary: '#DC0073',
      quaternary: '#008BF8',
      quinary: '#89FC00',
    },
    {
      name: 'Theme2',
      value: 'theme2',
      primary: '#3498db',
      secondary: '#f1c40f',
      tertiary: '#e74c3c',
      quaternary: '#2ecc71',
      quinary: '#9b59b6',
    },
    {
      name: 'Theme3',
      value: 'theme3',
      primary: '#e67e22',
      secondary: '#27ae60',
      tertiary: '#2980b9',
      quaternary: '#f39c12',
      quinary: '#8e44ad',
    },
  ], []); // Empty dependency array means this useMemo will only run once

  useEffect(() => {
    const theme = themes.find(t => t.value === selectedTheme);
    if (theme && user) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', theme.primary);
      root.style.setProperty('--secondary-color', theme.secondary);
      root.style.setProperty('--tertiary-color', theme.tertiary);
      root.style.setProperty('--quaternary-color', theme.quaternary);
      root.style.setProperty('--quinary-color', theme.quinary);
    }

  })

  const handleThemeChange = (themeValue) => {
    onThemeChange(themeValue);
  };

  return (
    <div className="theme-selector">
      <h3>Choose a Theme:</h3>
      <div className="theme-cards-container">
        {themes.map((theme) => (
          <div
            key={theme.value}
            className={`theme-card ${selectedTheme === theme.value ? 'theme-card-selected' : ''}`}
            onClick={() => handleThemeChange(theme.value)}
          >
            <div className="theme-card-preview" style={{ backgroundColor: theme.primary }}>
              {/* <div className="theme-card-color" style={{ backgroundColor: theme.secondary }} /> hidden from card */}
              <div className="theme-card-color" style={{ backgroundColor: theme.tertiary }} />
              {/* Add more divs if you need to show more colors */}
            </div>
            <div className="theme-card-name">{theme.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
