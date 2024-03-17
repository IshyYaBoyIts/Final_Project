import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../firebase/AuthContext'; 
import { getTasksFromDB, updateTaskStatusInDB, deleteTask } from '../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import './styles/List.css';

function TaskList() {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      getTasksFromDB(currentUser.uid).then(fetchedTasks => {
        setTasks(fetchedTasks);
      });
    }
  }, [currentUser]);

  const toggleTaskStatus = async (taskId, isComplete) => {
    await updateTaskStatusInDB(currentUser.uid, taskId, !isComplete);
    // Refetch tasks to update the UI
    getTasksFromDB(currentUser.uid).then(fetchedTasks => setTasks(fetchedTasks));
  };

  const handleEditTask = (taskId) => navigate(`/editTask/${taskId}`);

  const handleDeleteTask = async (taskId) => {
    await deleteTask(currentUser.uid, taskId);
    // Refetch tasks to update the UI
    getTasksFromDB(currentUser.uid).then(fetchedTasks => setTasks(fetchedTasks));
  };

  const handleDeleteAllTasks = async () => {
    // Loop through all tasks and delete them
    for (const task of tasks) {
      await deleteTask(currentUser.uid, task.id);
    }
    // Refetch tasks to ensure the UI is updated
    getTasksFromDB(currentUser.uid).then(fetchedTasks => setTasks(fetchedTasks));
  };

  const handleToggleTaskStatus = async (taskId, isComplete) => {
    try {
      await toggleTaskStatus(taskId, isComplete);
    } catch (error) {
      console.error("Failed to toggle task status:", error);
      // Optionally, show a user-friendly error message or perform other error handling here
    }
  };
  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isComplete;
    if (filter === 'incomplete') return !task.isComplete;
    return true; // 'all'
  });

  return (
    <div className="task-list">
      <div className="options">
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === 'all' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === 'completed' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-button ${filter === 'incomplete' ? 'selected-filter' : ''}`}
            onClick={() => setFilter('incomplete')}
          >
            Incomplete
          </button>
        </div>
        {tasks.length > 0 && (
        <div className="delete-all-container">
          <button className="delete-all-button" onClick={handleDeleteAllTasks}>Delete All Tasks</button>
        </div>
        )}
      </div>
      {filteredTasks.length === 0 ? (
        <div className="empty-list">No tasks match this filter</div>
      ) : (
        filteredTasks.map((task) => (
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
                  onClick={() => handleToggleTaskStatus(task.id, task.isComplete)}
                  className={`mark-complete-button ${task.isComplete ? 'complete' : 'incomplete'}`}
                >
                  {task.isComplete ? 'Completed' : 'Incomplete'}
                </button>
                <button className="edit-button" onClick={() => handleEditTask(task.id)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
