import React from 'react';
import './styles/ThemeCard.css';

const ThemeCard = ({ theme, isSelected, onSelect }) => {
  return (
<div
      className={`theme-card ${isSelected ? 'theme-card-selected' : ''}`}
      onClick={() => onSelect(theme.value)}
    >      <div className="theme-card-preview" style={{ backgroundColor: theme.primary }}>
        {/* Optionally show secondary and tertiary colors */}
        <div className="theme-card-color" style={{ backgroundColor: theme.secondary }}></div>
        <div className="theme-card-color" style={{ backgroundColor: theme.tertiary }}></div>
      </div>
      <div className="theme-card-name">{theme.name}</div>
    </div>
  );
};

export default ThemeCard;
