import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from './firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { themes } from '../theme/Themes'; // Ensure this path correctly points to your Themes.js file

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().theme) {
          const userTheme = userSnap.data().theme;
          setTheme(userTheme); // Set the theme in state
          applyTheme(userTheme); // Apply theme styles immediately
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to apply theme styles
  const applyTheme = (themeName) => {
    const root = document.documentElement;
    const themeColors = themes[themeName] || themes['default']; // Fallback to default theme if not found
    Object.keys(themeColors).forEach(key => {
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
