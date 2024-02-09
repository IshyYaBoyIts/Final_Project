import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext.js'; 
import { getTasksFromDB, updateTaskStatusInDB } from '../firebase/firebase-config.js'; // Ensure you have this function in your firebase-config.js
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

  const toggleTaskStatus = (taskId, isComplete) => {
    updateTaskStatusInDB(currentUser.uid, taskId, !isComplete)
      .then(() => {
        // Optimistically update the UI
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            // Log the task data with the updated status
            console.log(`Task ID: ${taskId}, Name: ${task.name}, Status: ${!isComplete ? 'Complete' : 'Incomplete'}`);
            return { ...task, isComplete: !isComplete };
          }
          return task;
        });
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error("Error updating task status:", error);
      });
  };
  

  if (tasks.length === 0) {
    return <div className="empty-list">You have no Tasks</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="list-item">
          <div className="list-item-inner">
            <div className="item-content">
              <div className="item-detail">
                <h3 className="item-name">{task.name}</h3>
                <h4 className="item-description">{task.description}</h4>
                <p className="item-category">{task.tag}</p>
                <p className="item-due-date">Due Date: {task.date}</p>
              </div>
              <div className={`status-indicator ${task.isComplete ? 'complete' : 'incomplete'}`}></div>
              <button
                onClick={() => toggleTaskStatus(task.id, task.isComplete)}
                className={`mark-complete-button ${task.isComplete ? 'complete' : 'incomplete'}`}
              >
                {task.isComplete ? 'Complete' : 'Incomplete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
