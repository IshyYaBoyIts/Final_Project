import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

function NavBar() {
    return (
      <nav className="nav-bar">
        {/* Other navigation links can go here */}
        <Link to="/add-item" className="add-button">
          {/* Use a plus icon or text */}
          +
        </Link>
      </nav>
    );
  }
  
  export default NavBar;
