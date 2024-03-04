import React, { useState, useEffect } from 'react'; // Added useEffect for fetching notifications
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/firebase/AuthContext';
import Header from './components/navigation/Header';
import NavBar from './components/navigation/NavBar';
import TaskList from './components/lists/TaskList';
import RoutineList from './components/lists/RoutineList';
import AddItemPage from './components/pages/AddItemPage';
import Tabs from './components/navigation/Tabs';
import ProfilePage from './components/pages/ProfilePage';
import NotificationsPopup from './components/notifications/NotificationsPopup';
import './App.css';
import ThemedAppWrapper from './components/theme/ThemedAppWrapper';
// Assuming getNotifications is properly imported
import { getNotifications } from './components/firebase/firebase-config'; // Ensure this is correctly imported

const App = () => {
  const [currentView, setCurrentView] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [notifications, setNotifications] = useState([]); // Added state for notifications

  // Fetch notifications on component mount
  useEffect(() => {
    // Assuming there's a way to get the current user ID, placeholder 'userId' used
    const userId = "currentUser's ID"; // Placeholder, replace with actual logic to obtain current user's ID
    getNotifications(userId).then(notifications => {
      setNotifications(notifications);
    });
  }, []); // Empty dependency array means this runs once on mount

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  return (
    <AuthProvider>
      <Router>
        <ThemedAppWrapper>
          <Header togglePopup={togglePopup} />
          {isPopupVisible && <NotificationsPopup notifications={notifications} onClose={() => setIsPopupVisible(false)} />}
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
        </ThemedAppWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
