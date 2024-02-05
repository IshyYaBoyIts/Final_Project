import React, { useState } from 'react';
import TaskComponent from '../components/adding/AddTask.js';
import RoutineComponent from '../components/adding/AddRoutine.js';
import './styles/AddItemPage.css';

const AddItemPage = () => {
  const [isAddingTask, setIsAddingTask] = useState(true);

  const handleSwitchToTask = () => setIsAddingTask(true);
  const handleSwitchToRoutine = () => setIsAddingTask(false);

  return (
    <div className="add-item-container">
      <div className="tabs">
        <button onClick={handleSwitchToTask} className={isAddingTask ? 'active' : ''}>Task</button>
        <button onClick={handleSwitchToRoutine} className={!isAddingTask ? 'active' : ''}>Routine</button>
      </div>
      {isAddingTask ? <TaskComponent onTaskAdded={() => {}} /> : <RoutineComponent onRoutineAdded={() => {}} />}
    </div>
  );
};

export default AddItemPage;
