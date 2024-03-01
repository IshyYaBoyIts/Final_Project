import React, { useState, useEffect } from 'react';
import firebase from '../firebase';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(newNotifications);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id} style={{ background: notification.readStatus ? '#fff' : '#f4f4f8' }}>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          {/* Implement mark as read and other actions here */}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
