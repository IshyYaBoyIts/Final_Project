import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
  } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import TaskList from './components/TaskList';
import RoutineList from './components/RoutineList';
import AddItemPage from './components/AddItemPage';
import ErrorBoundary from './components/ErrorBoundary.js';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const addRoutine = (newRoutine) => {
    setRoutines([...routines, newRoutine]);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={
              <>
                <NavBar />
                <TaskList tasks={tasks} />
              </>
            } />
            <Route path="/routines" element={
              <>
                <NavBar />
                <RoutineList routines={routines} />
              </>
            } />
            <Route path="/add-item" element={
              <AddItemPage 
                onAddTask={addTask} 
                onAddRoutine={addRoutine}
              />
            } />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;