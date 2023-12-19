import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';
import RoutineList from './components/RoutineList';
import AddItemPage from './components/AddItemPage';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  // State for tasks and routines
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);

  // Function to add a new task
  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Function to add a new routine
  const handleAddRoutine = (routine) => {
    setRoutines([...routines, routine]);
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<TaskList tasks={tasks} />} />
        <Route path="/routines" element={<RoutineList routines={routines} />} />
        <Route path="/add-item" element={
          <AddItemPage onAddTask={handleAddTask} onAddRoutine={handleAddRoutine} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
