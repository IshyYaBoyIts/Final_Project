import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faTrophy, } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const location = useLocation();

  // Handler functions for logging
  const logAchievementsClick = () => console.log('Achievements clicked');
  const logAddItemClick = () => console.log('Add Item clicked');
  const logProfileClick = () => console.log('Profile clicked');

  // Render NavBar only on the home page
  if (location.pathname !== '/') {
    return null; // Don't render NavBar on non-home pages
  }

  return (
    <nav className="nav-bar">
      <Link to="/achievements" className="other-button" onClick={logAchievementsClick}>
        <FontAwesomeIcon icon={faTrophy} />
      </Link>
      <Link to="/add-item" className="add-button" onClick={logAddItemClick}>
        <FontAwesomeIcon icon={faPlus} />
      </Link>
      <Link to="/profile" className="other-button" onClick={logProfileClick}>
        <FontAwesomeIcon icon={faUser} />
      </Link>
    </nav>
  );
};

export default NavBar;
