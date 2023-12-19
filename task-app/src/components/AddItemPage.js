import React, { useState } from 'react';
import './styles/AddItemPage.css'; 

function AddItemPage() {
  const [isAddingTask, setIsAddingTask] = useState(true); // True for Task, false for Routine

  // Function to handle form submission for both tasks and routines
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="add-item-container">
      <div className="tabs">
        <button className={isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(true)}>TASK</button>
        <button className={!isAddingTask ? 'active' : ''} onClick={() => setIsAddingTask(false)}>ROUTINE</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder={isAddingTask ? "Task name" : "Routine name"} />
        <textarea placeholder="Add a description"></textarea>
        {isAddingTask ? (
          <>
            <input type="text" placeholder="Select a tag" />
            <input type="date" />
          </>
        ) : (
          <input type="text" placeholder="Frequency" />
        )}
        <div className="actions">
          {/* Icons or buttons for actions like voice input, etc. */}
        </div>
        <button type="submit" className="create-button">{isAddingTask ? "Create task" : "Create routine"}</button>
      </form>
    </div>
  );
}

export default AddItemPage;
