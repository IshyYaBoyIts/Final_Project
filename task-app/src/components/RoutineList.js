import React from 'react';
import './styles/RoutineList.css';

function RoutineList({ routines }) {
  if (routines.length === 0) {
    return <div className="empty-list">You have no Routines</div>;
  }

  return (
    <div className="routine-list">
      {routines.map((routine, index) => (
        <div key={index} className="routine-item">
          {routine.name} - Frequency: {routine.frequency}
        </div>
      ))}
    </div>
  );
}

export default RoutineList;
