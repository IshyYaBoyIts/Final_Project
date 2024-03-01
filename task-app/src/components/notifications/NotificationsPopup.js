// NotificationsPopup.jsx
import React from 'react';

const NotificationsPopup = ({ notifications, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup">
        <button className="close-button" onClick={onClose}>Close</button>
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.readStatus ? 'read' : 'unread'}`}>
            <p>{notification.message}</p>
            {/* Implement further notification handling here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPopup;
