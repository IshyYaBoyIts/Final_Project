import React, { useState, useEffect } from 'react';

const ThemeSelector = ({ user, onThemeChange }) => {
    const themes = [
      { name: 'Default', value: 'default' },
      { name: 'Theme 1', value: 'theme1' },
      { name: 'Theme 2', value: 'theme2' },
      { name: 'Theme 3', value: 'theme3' },
    ];
  
    const [selectedTheme, setSelectedTheme] = useState(
      user ? user.theme || 'default' : 'default'
    );
  
    useEffect(() => {
      if (user) {
        // Save the selected theme to the user's data
        // You may want to use a Firebase database or a similar method to store this information.
        // For demonstration purposes, we'll just update the state in this example.
        onThemeChange(selectedTheme);
  
        // Update CSS custom properties based on the selected theme
        const root = document.documentElement;
        root.style.setProperty('--primary-color', getThemeColor(selectedTheme, 'primary'));
        root.style.setProperty('--secondary-color', getThemeColor(selectedTheme, 'secondary'));
        root.style.setProperty('--tertiary-color', getThemeColor(selectedTheme, 'tertiary'));
        root.style.setProperty('--quaternary-color', getThemeColor(selectedTheme, 'quaternary'));
        root.style.setProperty('--quinary-color', getThemeColor(selectedTheme, 'quinary'));
      }
    }, [user, selectedTheme, onThemeChange]);
  
    const getThemeColor = (theme, colorName) => {
      // Define color mappings for each theme
      const themeColors = {
        default: {
          primary: '#5dfdcb',
          secondary: '#90d7ff',
          tertiary: '#c9f9ff',
          quaternary: '#bfd0e0',
          quinary: '#b8b3be',
        },
        theme1: {
          primary: '#04E762',
          secondary: '#F5B700',
          tertiary: '#DC0073',
          quaternary: '#008BF8',
          quinary: '#89FC00',
        },
        theme2: {
          primary: '#3498db',
          secondary: '#f1c40f',
          tertiary: '#e74c3c',
          quaternary: '#2ecc71',
          quinary: '#9b59b6',
        },
        theme3: {
          primary: '#e67e22',
          secondary: '#27ae60',
          tertiary: '#2980b9',
          quaternary: '#f39c12',
          quinary: '#8e44ad',
        },
      };
  
      return themeColors[theme][colorName];
    };
  
    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
      };
    
      return (
        <div>
          <h3>Choose a Theme:</h3>
          <div>
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
                className={selectedTheme === themeOption.value ? 'selected' : ''}
              >
                {themeOption.name}
              </button>
            ))}
          </div>
        </div>
      );
    };
    
    export default ThemeSelector;