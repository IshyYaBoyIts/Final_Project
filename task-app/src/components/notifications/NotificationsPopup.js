import React from 'react';
import { updateNotificationStatus } from '../firebase/firebase-config'; // Adjust import path as needed

const NotificationsPopup = ({ notifications, onClose }) => {
  const markAsRead = async (notificationId) => {
    await updateNotificationStatus(notificationId, true);
    // Refresh notifications or handle UI update
  };

  return (
    <div className="notifications-popup">
      <button onClick={onClose}>Close</button>
      {notifications.map(notification => (
        <div key={notification.id} className={notification.readStatus ? 'notification read' : 'notification unread'}>
          <p>{notification.message}</p>
          {!notification.readStatus && (
            <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationsPopup;
