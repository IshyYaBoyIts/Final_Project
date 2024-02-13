// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/firebase/AuthContext'; // Adjust the import path as necessary
import Header from './components/navigation/Header';
import NavBar from './components/navigation/NavBar';
import TaskList from './components/lists/TaskList';
import RoutineList from './components/lists/RoutineList';
import AddItemPage from './components/pages/AddItemPage';
import Tabs from './components/navigation/Tabs';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);

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
