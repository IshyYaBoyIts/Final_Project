import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../firebase/firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faRightFromBracket, faBell } from '@fortawesome/free-solid-svg-icons';
import './styles/Header.css';

function Header() { 
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout().then(() => {
      navigate('/');
    });
  };
  // Navigate to notifications page
  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return (
    <header className="app-header">
      {location.pathname !== '/' && (
        <button onClick={handleBack} className="back-button">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
      <h1>Happy Habits</h1>
      <button onClick={handleNotificationsClick} className="notification-button">
        <FontAwesomeIcon icon={faBell} />
      </button>
      {location.pathname === '/profile' && (
        <button onClick={handleLogout} className="logout-button">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      )}
    </header>
  );
}

export default Header;
