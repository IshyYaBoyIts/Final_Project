import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './firebase/AuthContext.js'; 
import { getTasksFromDB } from './firebase/firebase-config.js'; 
import './styles/List.css';

function TaskList() {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getTasksFromDB(currentUser.uid).then(fetchedTasks => {
        setTasks(fetchedTasks);
      });
    }
  }, [currentUser]);

  if (tasks.length === 0) {
    return <div className="empty-list">You have no Tasks</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
      <div key={index} className="list-item">
        <div className="list-item-inner">
          <div className="item-content">
            <div className="item-detail">
              <h3 className="item-name">{task.name}</h3>
              <h4 className="item-description">{task.description}</h4>
              <p className="item-category">{task.tag}</p>
              <p className="item-due-date">Due Date: {task.date}</p>
            </div>
            <div className={`status-indicator ${task.status}`}></div>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}

export default TaskList;
