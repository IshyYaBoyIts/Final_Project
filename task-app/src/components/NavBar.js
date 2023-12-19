import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

function NavBar() {
  return (
    <nav className="nav-bar">
      {/* Define your navigation links using react-router-dom Link components */}
      <Link to="/">Home</Link>
      <Link to="/add-item">Add Item</Link>
      {/* Add other navigation links as needed */}
    </nav>
  );
}

export default NavBar;
