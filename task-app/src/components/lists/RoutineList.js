import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import { getRoutinesFromDB, updateRoutineCheckboxStates, getCheckboxCount } from '../firebase/firebase-config';
import './styles/List.css';

function RoutineList() {
  const { currentUser } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);

  // This will hold the checked state for each checkbox of every routine
  // eslint-disable-next-line
  const [checkboxStates, setCheckboxStates] = useState({});

  const fetchRoutines = useCallback(async () => {
    if (currentUser) {
      try {
        const fetchedRoutines = await getRoutinesFromDB(currentUser.uid);
        const newCheckboxStates = {};
        fetchedRoutines.forEach(routine => {
          newCheckboxStates[routine.id] = routine.checkboxStates;
        });
        setCheckboxStates(newCheckboxStates);
        setRoutines(fetchedRoutines);
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

        await updateRoutineCheckboxStates(currentUser.uid, routineId, updatedCheckboxStates);
        setCheckboxStates(prevStates => ({...prevStates, [routineId]: updatedCheckboxStates}));

        const updatedRoutines = routines.map(r => r.id === routineId ? {...r, checkboxStates: updatedCheckboxStates} : r);
        setRoutines(updatedRoutines);
    }
  };

  return (
    <div className="routine-list">
      {routines.length === 0 ? (
        <div className="empty-list">You have no Routines</div>
      ) : (
        routines.map((routine, index) => {
          const isCheckedCount = routine.checkboxStates.filter(state => state === "checked").length;
          const totalCheckboxes = getCheckboxCount(routine);
          const progressPercentage = (isCheckedCount / totalCheckboxes) * 100;

          return (
            <div key={index} className="list-item">
              <div className="list-item-inner">
                <div className="item-content">
                  <div className="item-detail">
                    <h3 className="item-name">{routine.name}</h3>
                    <h4 className="item-description">{routine.description}</h4>
                    <p className="item-frequency">Frequency: {routine.frequencyNumber} per {routine.frequencyPeriod}</p>
                    <div className="checkboxes-container" 
                      style={{background: `linear-gradient(to right, #4CAF50 
                      ${progressPercentage}%, #ff4081 
                      ${progressPercentage}%, #ff4081 100%)`
                    }}>
                      {routine.checkboxStates.map((state, i) => (
                        <input
                          key={i}
                          type="checkbox"
                          className="routine-checkbox"
                          checked={state === "checked"}
                          onChange={() => handleCheckboxChange(routine.id, i)}
                        />
                      ))}
                    </div>
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
