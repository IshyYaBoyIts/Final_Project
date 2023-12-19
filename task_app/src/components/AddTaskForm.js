import React, { useState } from 'react';

function AddTaskForm({ onAddTask }) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTag, setTaskTag] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a task object
    const newTask = {
      name: taskName,
      description: taskDescription,
      tag: taskTag,
      dueDate: taskDueDate
    };
    // Call the onAddTask function passed from the parent component
    onAddTask(newTask);
    // Reset the form
    setTaskName('');
    setTaskDescription('');
    setTaskTag('');
    setTaskDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tag"
        value={taskTag}
        onChange={(e) => setTaskTag(e.target.value)}
      />
      <input
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
