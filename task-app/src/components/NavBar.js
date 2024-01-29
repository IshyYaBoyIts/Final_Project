import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faChartSimple } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const location = useLocation();

  // Handler functions for logging
  const logStatisticsClick = () => console.log('Statistics clicked');
  const logAddItemClick = () => console.log('Add Item clicked');
  const logProfileClick = () => console.log('Profile clicked');

  // Render NavBar only on the home page
  if (location.pathname !== '/') {
    return null; // Don't render NavBar on non-home pages
  }

  return (
    <nav className="nav-bar">
      <Link to="/statistics" className="other-button" onClick={logStatisticsClick}>
        <FontAwesomeIcon icon={faChartSimple} />
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
