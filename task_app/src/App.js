import React, { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import TaskList from './components/TaskList';
import RoutineList from './components/RoutineList';
import AddTaskForm from './components/AddTaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = () => {
    setShowAddTask(true);
  };

  const handleCloseModal = () => {
    setShowAddTask(false);
  };

  const handleSaveTask = (taskContent) => {
    setTasks([...tasks, { content: taskContent }]);
    handleCloseModal();
  };

  return (
    <div className="App">
      <Header />
      <NavBar onAddTask={handleAddTask} />
      <TaskList tasks={tasks} />
      {showAddTask && (
        <AddTaskForm onSaveTask={handleSaveTask} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
