import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/firebase/AuthContext'; 
import Header from './components/navigation/Header';
import NavBar from './components/navigation/NavBar';
import TaskList from './components/lists/TaskList';
import RoutineList from './components/lists/RoutineList';
import AddItemPage from './components/pages/AddItemPage';
import Tabs from './components/navigation/Tabs';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';
import ThemedAppWrapper from './components/theme/ThemedAppWrapper';
import NotificationsPage from './components/pages/NotificationsPage';
import AchievementsPage from './components/pages/AchievementsPage';

const App = () => {
  const [currentView, setCurrentView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);

  return (
    <AuthProvider>
      <Router>
        <ThemedAppWrapper>
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
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </ThemedAppWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
