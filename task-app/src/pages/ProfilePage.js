import React, { useEffect, useState } from 'react';
import { signInWithGoogle, auth } from '../components/firebase-config.js';
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-container">
          <div className="profile-item">
            <h2>Welcome, {user.displayName}</h2>
          </div>
          <div className="profile-item">
            <p>Email: {user.email}</p>
          </div>
          {/* Add more profile items here */}
        </div>
      ) : (
        <button onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default ProfilePage;