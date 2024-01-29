import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext.js';
import Header from './components/Header';
import NavBar from './components/NavBar';
import TaskList from './components/TaskList';
import RoutineList from './components/RoutineList';
import AddItemPage from './pages/AddItemPage';
import Tabs from './components/Tabs';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' or 'routines'
  const [tasks, setTasks] = useState([]); // Define tasks state
  const [routines, setRoutines] = useState([]); // Define routines state


  return (
    <AuthProvider>
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
          <Route path="/add-item" element={<AddItemPage setTasks={setTasks} setRoutines={setRoutines} />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
