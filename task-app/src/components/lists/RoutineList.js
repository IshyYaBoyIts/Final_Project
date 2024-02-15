import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import { getRoutinesFromDB, updateRoutineCompletions } from '../firebase/firebase-config';
import './styles/List.css';

function RoutineList() {
  const { currentUser } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});

  const fetchRoutines = useCallback(async () => {
    if (currentUser) {
      try {
        const fetchedRoutines = await getRoutinesFromDB(currentUser.uid);
        setRoutines(fetchedRoutines);
        // No need to transform checkboxStates, as they are already in the desired format
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    }
  }, [currentUser]);  

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleCheckboxChange = async (routineId, index) => {
    const routine = routines.find(r => r.id === routineId);
    if (routine) {
      const updatedCheckboxStates = [...routine.checkboxStates];
      updatedCheckboxStates[index] = updatedCheckboxStates[index] === "unchecked" ? "checked" : "unchecked";
  
      // Update Firestore
      await updateRoutineCheckboxStates(currentUser.uid, routineId, index, updatedCheckboxStates[index] === "checked");
  
      // Update local state
      const updatedRoutines = routines.map(r => r.id === routineId ? {...r, checkboxStates: updatedCheckboxStates} : r);
      setRoutines(updatedRoutines);
    }
  };  

  const getCheckboxCount = (routine) => {
    switch (routine.frequencyPeriod) {
      case 'hour':
        // Assuming frequencyNumber is how many times per hour, and you want to show checkboxes for each occurrence in a day
        return 24 * routine.frequencyNumber;
      case 'day':
        // Show a checkbox for each occurrence in a day
        return routine.frequencyNumber;
      case 'week':
        // For weekly routines, you may want to show a single checkbox or adjust based on your application's logic
        return 1;
      case 'month':
        // For monthly routines, likely a single checkbox is needed
        return 1;
      case 'year':
        // For yearly routines, likely a single checkbox is needed
        return 1;
      default:
        console.warn(`Unknown frequency period: ${routine.frequencyPeriod}`);
        return 0;
    }
  };

  const shouldResetRoutine = (routine) => {
    const now = new Date();
    const createdAt = new Date(routine.createdAt);
    const elapsed = now.getTime() - createdAt.getTime();
  
    switch (routine.frequencyPeriod) {
      case 'hour': 
        return elapsed >= routine.frequencyNumber * 60 * 60 * 1000;
      case 'day':
        return elapsed >= routine.frequencyNumber * 24 * 60 * 60 * 1000;
      case 'week':
        return elapsed >= routine.frequencyNumber * 7 * 24 * 60 * 60 * 1000;
      case 'month':
        // Assuming 30 days in a month for simplicity
        return elapsed >= routine.frequencyNumber * 30 * 24 * 60 * 60 * 1000;
      case 'year':
        // Assuming 365 days in a year for simplicity
        return elapsed >= routine.frequencyNumber * 365 * 24 * 60 * 60 * 1000;
      default:
        console.error(`Unsupported frequency period: ${routine.frequencyPeriod}`);
        return false;
    }
  };

  return (
    <div className="routine-list">
      {routines.length === 0 ? (
        <div className="empty-list">You have no Routines</div>
      ) : (
        routines.map((routine, index) => {
          const checkboxCount = getCheckboxCount(routine);
          const checkboxes = Array.from({ length: checkboxCount }, (_, i) => (
            <input
              key={i}
              type="checkbox"
              checked={checkboxStates[routine.id] && checkboxStates[routine.id][i]}
              onChange={() => handleCheckboxChange(routine.id, i)}
            />
          ));
          return (
            <div key={index} className="list-item">
              <div className="list-item-inner">
                <div className="item-content">
                  <div className="item-detail">
                    <h3 className="item-name">{routine.name}</h3>
                    <h4 className="item-description">{routine.description}</h4>
                    <p className="item-frequency">Frequency: {routine.frequencyNumber} per {routine.frequencyPeriod}</p>
                    <div className="checkboxes-container">{checkboxes}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default RoutineList;
