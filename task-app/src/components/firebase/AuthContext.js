// AuthProvider.js
import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from './firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { themes } from '../theme/Themes';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('userTheme') || 'default');

  useEffect(() => {
    // This effect is responsible for initializing theme based on authentication state and user preferences
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().theme) {
          const userTheme = docSnap.data().theme;
          setTheme(userTheme);
          localStorage.setItem('userTheme', userTheme); // Persist theme selection
          applyTheme(userTheme); // Apply theme
        }
      } else {
        // Handle theme for users not logged in
        setTheme('default');
        localStorage.setItem('userTheme', 'default');
        applyTheme('default');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Apply theme whenever it changes
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (themeName) => {
    const themeColors = themes[themeName] || themes['default'];
    const root = document.documentElement;
    Object.keys(themeColors).forEach(key => {
      root.style.setProperty(`--${key}`, themeColors[key]);
    });
  };

  const updateTheme = async (newTheme) => {
    if (!currentUser || !newTheme) {
      console.error("Invalid theme update attempt.");
      return;
    }
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, { theme: newTheme });
      setTheme(newTheme);
      localStorage.setItem('userTheme', newTheme); // Update locally stored theme
      applyTheme(newTheme); // Apply the newly selected theme
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
