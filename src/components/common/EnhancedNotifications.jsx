import React from 'react';
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '../icons/Icons';

const NotificationCard = ({ notification, onClick, onMarkAsRead }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            case 'info':
            default:
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    const getNotificationBg = (type, isRead) => {
        if (isRead) return 'bg-gray-50';
        
        switch (type) {
            case 'success':
                return 'bg-green-50 border-l-4 border-green-400';
            case 'warning':
                return 'bg-yellow-50 border-l-4 border-yellow-400';
            case 'info':
            default:
                return 'bg-blue-50 border-l-4 border-blue-400';
        }
    };

    return (
        <div 
            className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${getNotificationBg(notification.type, notification.read)} animate-fade-in`}
            onClick={() => onClick?.(notification)}
        >
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <div className="ml-2 flex-shrink-0">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                    <p className={`mt-1 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        {!notification.read && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead?.(notification.id);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Mark as read
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationDropdown = ({ notifications, isOpen, onClose, onMarkAllAsRead }) => {
    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-large border border-gray-200 z-50 animate-bounce-in">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                {unreadCount > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                        You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No notifications yet</p>
                    </div>
                ) : (
                    <div className="p-2 space-y-2">
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onClick={onClose}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2">
                    View all notifications
                </button>
            </div>
        </div>
    );
};

export { NotificationCard, NotificationDropdown };
