import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import TaskList from './components/TaskList';
import RoutineList from './components/RoutineList';
import AddItemPage from './components/AddItemPage';
import Tabs from './components/Tabs';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' or 'routines'
  const [tasks, setTasks] = useState([]); // Define tasks state
  const [routines, setRoutines] = useState([]); // Define routines state


  return (
    <Router>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={
          <>
            <Tabs currentView={currentView} onChangeView={setCurrentView} />
            {currentView === 'tasks' ? <TaskList tasks={tasks} /> : <RoutineList routines={routines} />}
          </>
        } />
        <Route path="/add-item" element={<AddItemPage />} />
      </Routes>
    </Router>
  );
}

export default App;
