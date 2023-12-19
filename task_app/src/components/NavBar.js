import React from 'react';
import './styles/NavBar.css';

function NavBar({ onAddTask }) {
    return (
        <nav className="nav-bar">
            <button onClick={onAddTask}>Add Task</button>
            {/* Add more navigation items as needed */}
        </nav>
    );
}

export default NavBar;
