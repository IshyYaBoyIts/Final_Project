import React, { useState, useEffect, useContext } from 'react';
import { getNotifications } from '../firebase/firebase-config'; // Ensure this is the correct import path
import { AuthContext } from '../contexts/AuthContext'; // Adjust based on where you store your Auth context
import './styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useContext(AuthContext); // Adjust based on your actual Auth context

  useEffect(() => {
    if (currentUser) {
      const fetchNotifications = async () => {
        const userNotifications = await getNotifications(currentUser.uid);
        setNotifications(userNotifications);
      };

      fetchNotifications();
    }
  }, [currentUser]);

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id} style={{ background: notification.readStatus ? '#fff' : '#f4f4f8' }}>
          <h4>{notification.title}</h4> {/* Ensure your notifications have a 'title' field; if not, adjust accordingly */}
          <p>{notification.message}</p>
          {/* Implement mark as read and other actions here */}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
