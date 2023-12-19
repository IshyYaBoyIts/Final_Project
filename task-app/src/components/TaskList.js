import React from 'react';
import './styles/TaskList.css';

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <div className="empty-list">You have no Tasks</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div key={index} className="task-item">
          {task.name} - Due date: {task.dueDate}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
