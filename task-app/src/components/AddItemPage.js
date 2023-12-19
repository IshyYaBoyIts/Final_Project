import React, { useState } from 'react';
import './styles/AddItemPage.css';

function AddItemPage() {
  const [isAddingTask, setIsAddingTask] = useState(true); // true for tasks, false for routines

  return (
    <div className="add-item-page">
      <div className="tabs">
        <button onClick={() => setIsAddingTask(true)}>Task</button>
        <button onClick={() => setIsAddingTask(false)}>Routine</button>
      </div>
      <form>
        {/* Form fields */}
        <input placeholder="Name your task/routine" />
        <textarea placeholder="Add a description" />
        {/* Add more fields as needed */}
        <button type="submit">{isAddingTask ? 'Create task' : 'Create routine'}</button>
      </form>
    </div>
  );
}

export default AddItemPage;
