// ThemeSelector.js
import React, { useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext'; // Adjust the import path as necessary
import ThemeCard from './ThemeCard';
import { themes } from './Themes'; // Ensure this is the correct path to your themes

const ThemeSelector = () => {
  const { theme: selectedTheme, updateTheme } = useContext(AuthContext);

  const handleThemeChange = (themeValue) => {
    console.log(`Changing theme to: ${themeValue}`); // Add this log
    if (themeValue) {
      updateTheme(themeValue);
    } else {
      console.error("Attempted to update theme with undefined value.");
    }
  };

  return (
    <div className="theme-selector">
      <h3>Choose a Theme:</h3>
      <div className="theme-cards-container">
        {Object.entries(themes).map(([themeKey, themeDetails]) => (
          <ThemeCard
            key={themeKey}
            theme={themeDetails}
            isSelected={selectedTheme === themeKey}
            onSelect={() => handleThemeChange(themeKey)} // Ensure themeKey is defined
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
