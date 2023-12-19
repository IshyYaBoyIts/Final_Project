import React from 'react';
import './styles/List.css';

function RoutineList({ routines }) {
  if (routines.length === 0) {
    return <div className="empty-list">You have no Routines</div>;
  }

  return (
    <div className="routine-list">
      {routines.map((routine, index) => (
        <div key={index} className="routine-item">
          <h3>{routine.name}</h3>
          <p>Description: {routine.description}</p> {/* Display the description */}
          <p>Frequency: {routine.frequency}</p> {/* Display the frequency */}
          {/* Add more details here if needed */}
        </div>
      ))}
    </div>
  );
}

export default RoutineList;
