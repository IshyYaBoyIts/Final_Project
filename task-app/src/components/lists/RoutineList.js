import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext.js';
import { getRoutinesFromDB, markRoutineCompleteInDB, markRoutineIncompleteInDB } from '../firebase/firebase-config.js';
import './styles/List.css';

function RoutineList() {
  const { currentUser } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    fetchRoutines();
  }, [currentUser]);

  const fetchRoutines = async () => {
    if (currentUser) {
      const fetchedRoutines = await getRoutinesFromDB(currentUser.uid);
      setRoutines(fetchedRoutines.map(routine => ({
        ...routine,
        frequencyNumber: parseInt(routine.frequency.split(' ')[0]),
        frequencyPeriod: routine.frequency.split(' ')[3],
        lastCompleted: routine.lastCompleted ? new Date(routine.lastCompleted).toLocaleString() : null,
      })));
    }
  };

  const getNextDueDate = (routine) => {
    const lastCompleted = routine.lastCompleted ? new Date(routine.lastCompleted) : new Date();
    let nextDueDate = new Date(lastCompleted);

    switch (routine.frequencyPeriod) {
      case 'day':
        nextDueDate.setDate(lastCompleted.getDate() + routine.frequencyNumber);
        break;
      case 'week':
        nextDueDate.setDate(lastCompleted.getDate() + 7 * routine.frequencyNumber);
        break;
      case 'month':
        nextDueDate.setMonth(lastCompleted.getMonth() + routine.frequencyNumber);
        break;
      case 'year':
        nextDueDate.setFullYear(lastCompleted.getFullYear() + routine.frequencyNumber);
        break;
      default:
        console.error(`Unsupported frequency period: ${routine.frequencyPeriod} for routine`, routine);
        return 'Unsupported frequency period';
    }

    return nextDueDate.toLocaleString();
  };

  const isRoutineDue = (routine) => {
    const nextDueDate = getNextDueDate(routine);
    return new Date() >= new Date(nextDueDate);
  };

  const handleToggleRoutineStatus = async (routine) => {
    if (currentUser) {
      try {
        if (!routine.lastCompleted || new Date() >= new Date(getNextDueDate(routine))) {
          // Mark as complete
          await markRoutineCompleteInDB(currentUser.uid, routine.id);
        } else {
          // Mark as incomplete, revert to previous completion date if available
          await markRoutineIncompleteInDB(currentUser.uid, routine.id, routine.previousCompletion);
        }
        fetchRoutines(); // Refresh routines list
      } catch (error) {
        console.error("Error toggling routine status:", error);
      }
    }
  };
  

  return (
    <div className="routine-list">
      {routines.length === 0 ? (
        <div className="empty-list">You have no Routines</div>
      ) : (
        routines.map((routine, index) => (
          <div key={index} className="list-item">
            <div className="list-item-inner">
              <div className="item-content">
                <div className="item-detail">
                  <h3 className="item-name">{routine.name}</h3>
                  <p className="item-frequency">Frequency: {routine.frequencyNumber} per {routine.frequencyPeriod}</p>
                  <p className="item-status">
                    {isRoutineDue(routine) ? `Next due: ${getNextDueDate(routine)}` : "Completed"}
                  </p>
                </div>
                <button
                  className={`complete-routine-btn ${isRoutineDue(routine) ? '' : 'mark-incomplete'}`}
                  onClick={() => handleToggleRoutineStatus(routine)}
                >
                  {isRoutineDue(routine) ? "Mark as Complete" : "Mark as Incomplete"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RoutineList;
