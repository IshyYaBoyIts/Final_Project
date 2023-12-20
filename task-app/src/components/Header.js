import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, logout } from './firebase-config'; // Adjust the path as needed
import './styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleBack = () => {
    navigate(-1); // Go back in the history stack
  };

  const handleLogout = () => {
    logout().then(() => {
      navigate('/'); // Redirect to home after logout
    });
  };

  return (
    <header className="app-header">
      {location.pathname !== '/' && (
        <button onClick={handleBack} className="back-button">
          Back
        </button>
      )}
      <h1>Task-App</h1>
      {location.pathname === '/profile' && user && (
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;
