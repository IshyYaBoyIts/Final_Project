import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this line
import './styles/AddItemPage.css';

function AddItemPage({ onAddTask, onAddRoutine }) {
  const [isAddingTask, setIsAddingTask] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState(''); // Only for tasks
  const [dueDate, setDueDate] = useState(''); // Only for tasks
  const [frequency, setFrequency] = useState(''); // Only for routines
  const navigate = useNavigate(); // Now this should work

  // Function to handle form submission for tasks
  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = { name, description, tag, dueDate };
    onAddTask(newTask);
  };

  // Function to handle form submission for routines
  const handleAddRoutine = (e) => {
    e.preventDefault();
    const newRoutine = { name, description, frequency };
    onAddRoutine(newRoutine);
  };

  // The handleSubmit function decides which submission handler to call
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddingTask) {
      const newTask = {
        name, // Ensure these fields are set from state
        description,
        tag, // This should only be set for tasks
        dueDate, // This should be a valid date string
      };
      onAddTask(newTask); // Call the function passed as a prop
    } else {
      const newRoutine = {
        name, // Ensure these fields are set from state
        description,
        frequency, // This should be set for routines
      };
      onAddRoutine(newRoutine); // Call the function passed as a prop
    }
  };

  return (
    <div className="add-item-container">
      <div className="tabs">
        <button className={isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(true)}>TASK</button>
        <button className={!isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(false)}>ROUTINE</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name your task/routine" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea 
          placeholder="Add a description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isAddingTask ? (
          <>
            <input 
              type="text" 
              placeholder="Select a tag" 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </>
        ) : (
          <input 
            type="text" 
            placeholder="Frequency" 
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        )}
        <button type="submit" className="create-button">
          {isAddingTask ? "Create Task" : "Create Routine"}
        </button>
      </form>
    </div>
  );
}

export default AddItemPage;
