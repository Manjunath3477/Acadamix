import React from 'react';
import { useNotification } from '../../context/NotificationContext';

const NotificationBar = () => {
    const { notifications } = useNotification();
    if (notifications.length === 0) return null;
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(n => (
                <div key={n.id} className={`px-4 py-2 rounded shadow text-white ${n.type === 'error' ? 'bg-red-600' : n.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>{n.message}</div>
            ))}
        </div>
    );
};

export default NotificationBar;
