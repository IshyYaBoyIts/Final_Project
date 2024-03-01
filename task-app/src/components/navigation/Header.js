import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, logout, getNotifications } from '../firebase/firebase-config'; 
import NotificationsPopup from '../notifications/NotificationsPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faRightFromBracket, faBell } from '@fortawesome/free-solid-svg-icons';
import './styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    // Fetch notifications for the logged-in user
    if (user) {
      getNotifications(user.uid).then(setNotifications); // Implement getNotifications in firebase-config
    }

    return () => unsubscribe();
  }, [user]);

  const toggleNotificationsPopup = () => {
    setShowNotifications(!showNotifications);
  };

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
      {location.pathname === '/' && user && (
        <>
          <button onClick={toggleNotificationsPopup} className="notifications-button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          {showNotifications && <NotificationsPopup notifications={notifications} onClose={() => setShowNotifications(false)} />}
        </>
      )}
      {location.pathname === '/profile' && user && (
        <button onClick={handleLogout} className="logout-button">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      )}
    </header>
  );
}

export default Header;
