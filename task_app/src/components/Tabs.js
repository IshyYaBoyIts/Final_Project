import React from 'react';
import './styles/Tabs.css';

function Tabs({ currentView, onChangeView }) {
  return (
    <div className="tabs">
      <button
        className={`tab-button ${currentView === 'tasks' ? 'active' : ''}`}
        onClick={() => onChangeView('tasks')}
      >
        Tasks
      </button>
      <button
        className={`tab-button ${currentView === 'routines' ? 'active' : ''}`}
        onClick={() => onChangeView('routines')}
      >
        Routines
      </button>
    </div>
  );
}

export default Tabs;
