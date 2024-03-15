import React, { useEffect, useState, useContext } from 'react';
import { getNotifications, markNotificationAsReadOrUnread, deleteNotification, db } from '../firebase/firebase-config';
import { writeBatch, collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../firebase/AuthContext';
import './styles/NotificationsPage.css';

const NotificationsPage = () => {
    const { currentUser } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (currentUser) {
            getNotifications(currentUser.uid).then(setNotifications);
        }
    }, [currentUser]);

    const handleToggleReadStatus = async (notification) => {
        await markNotificationAsReadOrUnread(currentUser.uid, notification.id, !notification.readStatus);
        // Refresh notifications list
        getNotifications(currentUser.uid).then(setNotifications);
    };

    const handleDelete = async (notificationId) => {
        await deleteNotification(currentUser.uid, notificationId);
        // Refresh notifications list
        getNotifications(currentUser.uid).then(setNotifications);
    };

    const handleToggleAllReadStatus = async () => {
        const notificationsRef = collection(db, `users/${currentUser.uid}/notifications`);
        const querySnapshot = await getDocs(notificationsRef);
    
        // Initialize Firestore batch
        const batch = writeBatch(db);
        let allRead = true; // Assume all notifications are read initially
    
        // Check if at least one notification is unread
        querySnapshot.forEach(doc => {
            if (!doc.data().readStatus) {
                allRead = false;
            }
        });
    
        querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { readStatus: !allRead }); 
        });
    
        try {
            await batch.commit();
            console.log(`All notifications have been marked as ${allRead ? 'unread' : 'read'}`);
            // Refresh notifications list
            getNotifications(currentUser.uid).then(setNotifications);
        } catch (error) {
            console.error("Error updating notifications' read status:", error);
        }
    };  

    const handleDeleteAll = async () => {
        for (const notification of notifications) {
            await deleteNotification(currentUser.uid, notification.id);
        }
        setNotifications([]);
    };

    return (
        <div className="notifications-page">
            <h2>Notifications</h2>
            {notifications.length > 0 && (
                <>
                    <button onClick={handleToggleAllReadStatus}>Mark All as Read/Unread</button>
                    <button onClick={handleDeleteAll}>Delete All</button>
                </>
            )}
            <div className="notifications-list">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification ${notification.readStatus ? 'read' : 'unread'}`}>
                        <p>{notification.message}</p>
                        <div className="notification-actions">
                            <button onClick={() => handleToggleReadStatus(notification)}>
                                {notification.readStatus ? 'Mark as Unread' : 'Mark as Read'}
                            </button>
                            <button onClick={() => handleDelete(notification.id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {notifications.length === 0 && <p>No notifications found.</p>}
            </div>
        </div>
    );
};

export default NotificationsPage;
