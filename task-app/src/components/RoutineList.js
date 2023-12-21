import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext.js'; 
import { getRoutinesFromDB } from './firebase-config.js'; 
import './styles/List.css';

function RoutineList() {
  const { currentUser } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getRoutinesFromDB(currentUser.uid).then(fetchedRoutines => {
        setRoutines(fetchedRoutines);
      });
    }
  }, [currentUser]);

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
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}

export default RoutineList;
