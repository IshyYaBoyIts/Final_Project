import React, { useState } from 'react';
import './styles/AddTaskForm.css';

function AddTaskForm({ onSaveTask, onClose }) {
  const [taskContent, setTaskContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTask(taskContent);
    setTaskContent('');
    onClose(); // Close the modal after saving
  };

  return (
    <div className="add-task-modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <button type="submit">Save Task</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default AddTaskForm;
