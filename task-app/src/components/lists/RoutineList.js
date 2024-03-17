import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../firebase/AuthContext';
import { getRoutinesFromDB, updateRoutineCheckboxStates, getCheckboxCount, deleteRoutine } from '../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import './styles/List.css';

function RoutineList() {
  const { currentUser } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchRoutines = useCallback(async () => {
    if (currentUser) {
      try {
        const fetchedRoutines = await getRoutinesFromDB(currentUser.uid);
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
        fetchRoutines(); // Refresh routines to reflect the updated checkbox states
    }
  };

  const handleEditRoutine = (routineId) => {
    navigate(`/editRoutine/${routineId}`);
  };

  const handleDeleteRoutine = async (routineId) => {
    await deleteRoutine(currentUser.uid, routineId);
    fetchRoutines(); // Refresh routines after deletion
  };
  
  const handleDeleteAllRoutines = async () => {
    for (const routine of routines) {
      await deleteRoutine(currentUser.uid, routine.id);
    }
    fetchRoutines(); // Refresh routines after all deletions
  };

  // Filter routines based on the provided logic
  const filteredRoutines = routines.filter(routine => {
    const totalCheckboxes = getCheckboxCount(routine);
    const checkedCount = routine.checkboxStates.filter(state => state === "checked").length;

    switch (filter) {
      case 'incomplete':
        return checkedCount === 0;
      case 'inprogress':
        return checkedCount > 0 && checkedCount < totalCheckboxes;
      case 'complete':
        return checkedCount === totalCheckboxes;
      default:
        return true; // 'all'
    }
  });

  return (
    <div className="routine-list">
      <div className="options">
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === 'all' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Routines
          </button>
          <button
            className={`filter-button ${filter === 'incomplete' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('incomplete')}
          >
            Incomplete Routines
          </button>
          <button
            className={`filter-button ${filter === 'inprogress' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('inprogress')}
          >
            In Progress Routines
          </button>
          <button
            className={`filter-button ${filter === 'complete' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('complete')}
          >
            Complete Routines
          </button>
        </div>
        <div className="delete-all-container">
          {routines.length > 0 && (
            <button className="delete-all-button" onClick={handleDeleteAllRoutines}>Delete All Routines</button>
          )}
        </div>
      </div>
      {filteredRoutines.length === 0 ? (
        <div className="empty-list">No routines match this filter</div>
      ) : (
        filteredRoutines.map((routine, index) => (
          <div key={index} className="list-item">
            <div className="list-item-inner">
              <div className="item-content">
                <div className="item-detail">
                  <h3 className="item-name">{routine.name}</h3>
                  <h4 className="item-description">{routine.description}</h4>
                  <p className="item-frequency">Frequency: {routine.frequencyNumber} per {routine.frequencyPeriod}</p>
                  <div className="checkboxes-container">
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
                  <div className="button-container">
                    <button className="edit-button" onClick={() => handleEditRoutine(routine.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteRoutine(routine.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RoutineList;
