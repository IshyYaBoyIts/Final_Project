import React from 'react';
import './styles/TaskList.css';

function TaskList({ tasks }) {
  return (
    <div className="task-list-container">
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.category}</p>
            <p>Due date - {task.dueDate}</p>
            {/* Include colored status dot */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
