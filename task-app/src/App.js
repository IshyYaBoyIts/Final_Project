import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/firebase/AuthContext.js';
import Header from './components/navigation/Header.js';
import NavBar from './components/navigation/NavBar.js';
import TaskList from './components/lists/TaskList.js';
import RoutineList from './components/lists/RoutineList.js';
import AddItemPage from './components/pages/AddItemPage';
import Tabs from './components/navigation/Tabs.js';
import ProfilePage from './components/pages/ProfilePage';
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
