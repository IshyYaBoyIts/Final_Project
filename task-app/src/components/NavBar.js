import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faChartSimple, } from '@fortawesome/free-solid-svg-icons';
import './styles/NavBar.css';

const NavBar = () => {
  const location = useLocation();

  // Render NavBar only on the home page
  if (location.pathname !== '/') {
    return null; // Don't render NavBar on non-home pages
  }

  return (
    <nav className="nav-bar">
      <Link to="" className="other-button">
      <FontAwesomeIcon icon={faChartSimple} />
      </Link>
      <Link to="/add-item" className="add-button">
        <FontAwesomeIcon icon={faPlus} /> {/* Font Awesome Icon */}
      </Link>
      <Link to="/profile" className="other-button">
        <FontAwesomeIcon icon={faUser} /> {/* Font Awesome Icon */}
      </Link>
    </nav>
  );
};

export default NavBar;
