import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from './firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { themes } from '../theme/Themes'; // Ensure this path correctly points to your Themes.js file

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Start with a 'default' theme or attempt to retrieve the theme from local storage.
  const [theme, setTheme] = useState(localStorage.getItem('userTheme') || 'default');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Attempt to fetch the user's theme from Firestore.
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().theme) {
          const userTheme = userSnap.data().theme;
          setTheme(userTheme); // Set the theme in state
          localStorage.setItem('userTheme', userTheme); // Also save it locally
          applyTheme(userTheme); // Apply theme styles immediately
        }
      } else {
        // If no user is logged in, revert to the default theme.
        setTheme('default');
        applyTheme('default');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply theme whenever it changes. This ensures the theme persists across pages.
    applyTheme(theme);
  }, [theme]);

  // Function to apply theme styles
  const applyTheme = (themeName) => {
    console.log(`Applying theme: ${themeName}`);
    const root = document.documentElement;
    const themeColors = themes[themeName] || themes['default'];
    Object.keys(themeColors).forEach(key => {
      console.log(`--${key}: ${themeColors[key]}`); // Log the variable being set
      root.style.setProperty(`--${key}`, themeColors[key]);
    });
  };

  // Function to update the theme in Firestore and re-apply it
  const updateTheme = async (newTheme) => {
    if (!currentUser || !newTheme) {
      console.error("Invalid theme update attempt. User:", currentUser, "Theme:", newTheme);
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, { theme: newTheme });
      setTheme(newTheme); // Update local state
      localStorage.setItem('userTheme', newTheme); // Save the new theme locally for persistence
      applyTheme(newTheme); // Re-apply theme with new settings
      console.log(`Theme successfully updated to ${newTheme}`);
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, theme, setTheme, updateTheme }}>
      {children}
    </AuthContext.Provider>
  );
};
