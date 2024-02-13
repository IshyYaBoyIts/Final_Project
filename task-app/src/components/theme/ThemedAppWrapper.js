// ThemedAppWrapper.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from './components/firebase/AuthContext';
import { themes } from './components/theme/Themes';

const ThemedAppWrapper = ({ children }) => {
  const { theme } = useContext(AuthContext);

  useEffect(() => {
    const themeColors = themes[theme] || themes['default'];
    const root = document.documentElement;
    Object.keys(themeColors).forEach(key => {
      root.style.setProperty(`--${key}`, themeColors[key]);
    });
  }, [theme]);

  return <>{children}</>;
};

export default ThemedAppWrapper;
