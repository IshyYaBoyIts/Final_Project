// ThemedAppWrapper.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import { themes } from './Themes'; 

const ThemedAppWrapper = ({ children }) => {
  const { theme } = useContext(AuthContext);

  useEffect(() => {
    const applyTheme = (themeName) => {
      const themeColors = themes[themeName] || themes['default'];
      const root = document.documentElement;

      root.style.setProperty('--primary-color', themeColors.primary);
      root.style.setProperty('--secondary-color', themeColors.secondary);
      root.style.setProperty('--tertiary-color', themeColors.tertiary);
      root.style.setProperty('--quaternary-color', themeColors.quaternary);
      root.style.setProperty('--quinary-color', themeColors.quinary);
    };

    applyTheme(theme);
    console.log(`Theme applied: ${theme}`);
  }, [theme]);

  return <>{children}</>;
};

export default ThemedAppWrapper;
