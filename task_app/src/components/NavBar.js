import React from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className="nav-bar">
      {/* Other buttons */}
      <Link to="/add-item" className="add-button">Add</Link>
      {/* Other buttons */}
    </div>
  );
}

export default NavBar;
