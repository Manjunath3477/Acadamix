import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info') => {
        setNotifications(prev => [...prev, { message, type, id: Date.now() }]);
        setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 4000);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
