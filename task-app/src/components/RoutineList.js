import React from 'react';
import './styles/List.css';

function RoutineList({ routines }) {
  if (routines.length === 0) {
    return <div className="empty-list">You have no Routines</div>;
  }

  return (
    <div className="routine-list">
      {routines.map((routine, index) => (
      <div key={index} className="list-item">
        <div className="list-item-inner">
          <div className="item-content">
            <div className="item-detail">
              <h3 className="item-name">{routine.name}</h3>
              <p className="item-frequency">Frequency: {routine.frequency}</p>
            </div>
            {/* Include status indicator if needed */}
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}

export default RoutineList;
