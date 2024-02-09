import React, { useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import ThemeCard from './ThemeCard'; 
import { themes } from '../theme/Themes';
import './styles/ThemeSelector.css';

const ThemeSelector = () => {
  const { theme: selectedTheme, updateTheme } = useContext(AuthContext);

  const handleThemeChange = (themeValue) => {
    console.log(`Changing theme to: ${themeValue}`);
    updateTheme(themeValue);
  };

  return (
    <div className="theme-selector">
      <h3>Choose a Theme:</h3>
      <div className="theme-cards-container">
      {Object.entries(themes).map(([themeKey, themeDetails]) => (
        <ThemeCard
            key={themeKey}
            theme={themeDetails}
            isSelected={selectedTheme === themeKey} // Ensure this comparison is correct
            onSelect={() => handleThemeChange(themeKey)}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
