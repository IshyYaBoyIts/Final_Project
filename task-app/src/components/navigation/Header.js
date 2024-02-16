import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, logout } from '../firebase/firebase-config'; // Adjust the path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
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
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
      <h1>Happy Habits</h1>
      {location.pathname === '/profile' && user && (
        <button onClick={handleLogout} className="logout-button">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      )}
    </header>
  );
}

export default Header;
