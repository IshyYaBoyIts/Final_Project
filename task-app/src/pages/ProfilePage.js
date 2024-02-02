import React, { useEffect, useState } from 'react';
import { signInWithGoogle, auth, db } from '../components/firebase/firebase-config'; // Ensure these imports are correct
import ThemeSelector from '../components/ThemeSelector';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Correct imports for Firestore operations
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    // This effect runs once on component mount and whenever the user's authentication state changes.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // Directly update the theme only if it exists to avoid flickering
            setSelectedTheme(docSnap.data().theme);
          } else {
            // Handle the case where the document does not exist.
            // Consider setting a default theme or creating the document as needed.
          }
        } catch (error) {
          console.error("Error accessing user document:", error);
        }
      } else {
        // Handle user not signed in or authentication state reset
        setSelectedTheme('default'); // Reset to default theme if user is not signed in
      }
    });
  
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [auth]); // Depend on auth object to re-run if auth state changes
  

  const updateTheme = async (newTheme) => {
    if (user && selectedTheme !== newTheme) { // Check if the theme has actually changed
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
  
        if (!docSnap.exists()) {
          // Document does not exist, so create it with the selected theme
          await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            theme: newTheme,
          });
          console.log('Document created with selected theme');
        } else if (docSnap.data().theme !== newTheme) {
          // Document exists and the theme is different, update the theme
          await updateDoc(userDocRef, { theme: newTheme });
          console.log('Document updated with new theme');
        } else {
          // If the theme in Firestore is the same as the new theme, no need to update
          console.log('Theme is the same, no update required');
        }
        setSelectedTheme(newTheme); // Update local state to reflect the change
      } catch (error) {
        console.error("Error creating/updating user document:", error);
      }
    }
  };
  
  
  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-container">
          <ThemeSelector user={user} onThemeChange={updateTheme} selectedTheme={selectedTheme} />
          <div className="profile-item">
            <h2>Welcome, {user.displayName}</h2>
          </div>
          <div className="profile-item">
            <p>Email: {user.email}</p>
          </div>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default ProfilePage;
