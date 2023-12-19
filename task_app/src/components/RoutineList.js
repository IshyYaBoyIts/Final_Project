import React from 'react';
import './styles/RoutineList.css';

function RoutineList({ routines }) {
  return (
    <div className="routine-list-container">
      <div className="routine-list">
        {routines.map((routine, index) => (
          <div key={index} className="routine-card">
            <h3>{routine.title}</h3>
            <p>{routine.category}</p>
            <p>Due date - {routine.dueDate}</p>
            {/* Include colored status dot */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoutineList;
