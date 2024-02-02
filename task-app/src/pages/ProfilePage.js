import React, { useEffect, useState } from 'react';
import { signInWithGoogle, auth } from '../components/firebase/firebase-config.js';
import ThemeSelector from '../components/ThemeSelector';
import { updateThemeInFirestore } from '../components/firebase/firebaseService'; // Import the service to update the theme in Firestore
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && firebaseUser.theme) {
        setSelectedTheme(firebaseUser.theme);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateTheme = (theme) => {
    if (user) {
      // Update the user's theme in Firestore and update the local state
      updateThemeInFirestore(user.uid, theme) // Call the updateThemeInFirestore function
        .then(() => {
          setSelectedTheme(theme); // Update the local state
        })
        .catch((error) => {
          console.error('Error updating theme:', error);
        });
    }
  };

  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-container">
          <ThemeSelector user={user} onThemeChange={updateTheme} />
          <div className="profile-item">
            <h2>Welcome, {user.displayName}</h2>
          </div>
          <div className="profile-item">
            <p>Email: {user.email}</p>
          </div>
          {/* Add more profile items here */}
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default ProfilePage;
