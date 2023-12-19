import React from 'react';
import './styles/List.css';

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <div className="empty-list">You have no Tasks</div>;
  }

  return (
    <div>
    {tasks.map((task, index) => (
      <div key={index}>
        <h3>{task.name}</h3>
        <p>{task.description}</p>
        <p>{task.tag}</p>
        <p>Due Date: {task.date}</p>
      </div>
    ))}
  </div>
);
}

export default TaskList;
