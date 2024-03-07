import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext.js'; 
import { getTasksFromDB, updateTaskStatusInDB, deleteTask } from '../firebase/firebase-config.js'; // Ensure you have this function in your firebase-config.js
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
  
  const handleDeleteTask = async (taskId) => {
    await deleteTask(currentUser.uid, taskId);
    // Refresh the task list
    getTasksFromDB(currentUser.uid).then(fetchedTasks => {
      setTasks(fetchedTasks);
    });
  };
  
  const handleDeleteAllTasks = async () => {
    for (const task of tasks) {
      await deleteTask(currentUser.uid, task.id);
    }
    // Assume all tasks are now deleted, refresh list
    getTasksFromDB(currentUser.uid).then(fetchedTasks => {
      setTasks(fetchedTasks);
    });
  };
  

  if (tasks.length === 0) {
    return <div className="empty-list">You have no Tasks</div>;
  }

  return (
    <div className="task-list">
    <div className="delete-all-container">
    {tasks.length > 0 && (
      <button className="delete-all-button" onClick={handleDeleteAllTasks}>Delete All Tasks</button>
    )}
    </div>
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
              <button
                onClick={() => toggleTaskStatus(task.id, task.isComplete)}
                className={`mark-complete-button ${task.isComplete ? 'complete' : 'incomplete'}`}
              >
                {task.isComplete ? 'Completed' : 'Incomplete'}
              </button>
              <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
