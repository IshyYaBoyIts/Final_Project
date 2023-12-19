import React, { useState } from 'react';

function AddTaskForm({ onAddTask }) {
  const [task, setTask] = useState({
    name: '',
    description: '',
    dueDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(task);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name your task"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
      />
      <textarea
        placeholder="Add a description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <input
        type="date"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />
      <button type="submit">Create Task</button>
    </form>
  );
}

export default AddTaskForm;
