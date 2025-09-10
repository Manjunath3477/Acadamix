import React, { useState, useEffect } from 'react';
import { BellIcon, XCircleIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, InformationCircleIcon } from '../icons/Icons';

const NotificationCenter = ({ userId, userRole, courses, assignments, submissions }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [filter, setFilter] = useState('all'); // all, assignments, grades, system, announcements
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        generateNotifications();
    }, [userId, userRole, courses, assignments, submissions]);

    useEffect(() => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    const generateNotifications = () => {
        const now = new Date();
        const notificationList = [];

        // Assignment-related notifications
        if (userRole === 'student') {
            assignments.forEach(assignment => {
                const dueDate = new Date(assignment.dueDate);
                const timeDiff = dueDate - now;
                const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                // Upcoming deadlines
                if (daysUntilDue > 0 && daysUntilDue <= 7) {
                    const course = courses.find(c => c.id === assignment.courseId);
                    notificationList.push({
                        id: `deadline-${assignment.id}`,
                        type: 'assignment',
                        priority: daysUntilDue <= 2 ? 'high' : 'medium',
                        title: `Assignment Due ${daysUntilDue === 1 ? 'Tomorrow' : `in ${daysUntilDue} days`}`,
                        message: `${assignment.title} for ${course?.title} is due ${assignment.dueDate}`,
                        timestamp: new Date(now.getTime() - Math.random() * 86400000),
                        read: Math.random() > 0.7,
                        action: 'Submit Assignment',
                        link: `/assignments/${assignment.id}`
                    });
                }

                // Overdue assignments
                if (daysUntilDue < 0) {
                    const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === userId);
                    if (!submission) {
                        const course = courses.find(c => c.id === assignment.courseId);
                        notificationList.push({
                            id: `overdue-${assignment.id}`,
                            type: 'assignment',
                            priority: 'high',
                            title: 'Overdue Assignment',
                            message: `${assignment.title} for ${course?.title} was due ${assignment.dueDate}`,
                            timestamp: new Date(dueDate.getTime() + 86400000),
                            read: false,
                            action: 'Submit Late',
                            link: `/assignments/${assignment.id}`
                        });
                    }
                }
            });

            // Grade notifications
            submissions
                .filter(s => s.studentId === userId && s.grade && s.gradedAt)
                .forEach(submission => {
                    const assignment = assignments.find(a => a.id === submission.assignmentId);
                    const course = courses.find(c => c.id === assignment?.courseId);
                    notificationList.push({
                        id: `grade-${submission.id}`,
                        type: 'grades',
                        priority: 'medium',
                        title: 'New Grade Available',
                        message: `You received ${submission.grade} for ${assignment?.title} in ${course?.title}`,
                        timestamp: new Date(submission.gradedAt),
                        read: Math.random() > 0.5,
                        action: 'View Grade',
                        link: `/grades/${submission.id}`
                    });
                });
        }

        if (userRole === 'faculty') {
            // New submissions to grade
            const ungraded = submissions.filter(s => !s.grade && 
                assignments.some(a => a.id === s.assignmentId && a.instructorId === userId)
            );
            
            if (ungraded.length > 0) {
                notificationList.push({
                    id: 'ungraded-submissions',
                    type: 'assignments',
                    priority: 'medium',
                    title: 'Submissions Awaiting Grading',
                    message: `You have ${ungraded.length} ungraded submissions`,
                    timestamp: new Date(now.getTime() - 3600000),
                    read: false,
                    action: 'Grade Now',
                    link: '/gradebook'
                });
            }

            // Assignment deadline reminders
            assignments
                .filter(a => a.instructorId === userId)
                .forEach(assignment => {
                    const dueDate = new Date(assignment.dueDate);
                    const timeDiff = dueDate - now;
                    const hoursUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60));
                    
                    if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
                        const course = courses.find(c => c.id === assignment.courseId);
                        const submissionCount = submissions.filter(s => s.assignmentId === assignment.id).length;
                        notificationList.push({
                            id: `reminder-${assignment.id}`,
                            type: 'assignments',
                            priority: 'low',
                            title: 'Assignment Deadline Approaching',
                            message: `${assignment.title} in ${course?.title} is due in ${hoursUntilDue} hours. ${submissionCount} submissions received.`,
                            timestamp: new Date(now.getTime() - 7200000),
                            read: Math.random() > 0.3,
                            action: 'View Submissions',
                            link: `/assignments/${assignment.id}/submissions`
                        });
                    }
                });
        }

        // System notifications (for all users)
        const systemNotifications = [
            {
                id: 'system-maintenance',
                type: 'system',
                priority: 'medium',
                title: 'Scheduled Maintenance',
                message: 'System maintenance scheduled for Sunday 2AM-4AM. Services may be temporarily unavailable.',
                timestamp: new Date(now.getTime() - 86400000),
                read: Math.random() > 0.8,
                action: 'Learn More',
                link: '/maintenance'
            },
            {
                id: 'feature-update',
                type: 'system',
                priority: 'low',
                title: 'New Features Available',
                message: 'Check out the new calendar integration and improved gradebook features!',
                timestamp: new Date(now.getTime() - 172800000),
                read: Math.random() > 0.6,
                action: 'See Updates',
                link: '/updates'
            }
        ];

        // Announcements
        const announcements = [
            {
                id: 'announcement-1',
                type: 'announcements',
                priority: 'medium',
                title: 'Important: Registration Deadline',
                message: 'Course registration for next semester ends on September 30th. Make sure to complete your enrollment.',
                timestamp: new Date(now.getTime() - 43200000),
                read: false,
                action: 'Register Now',
                link: '/registration'
            },
            {
                id: 'announcement-2',
                type: 'announcements',
                priority: 'low',
                title: 'Library Hours Extended',
                message: 'The library will be open 24/7 during finals week (September 15-22).',
                timestamp: new Date(now.getTime() - 259200000),
                read: Math.random() > 0.4,
                action: 'View Hours',
                link: '/library'
            }
        ];

        notificationList.push(...systemNotifications, ...announcements);
        
        // Sort by timestamp (newest first)
        notificationList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setNotifications(notificationList);
    };

    const getFilteredNotifications = () => {
        if (filter === 'all') return notifications;
        return notifications.filter(n => n.type === filter);
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev => prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const getNotificationIcon = (type, priority) => {
        switch (type) {
            case 'assignment':
                return priority === 'high' ? 
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" /> :
                    <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'grades':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'system':
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
            case 'announcements':
                return <BellIcon className="h-5 w-5 text-purple-500" />;
            default:
                return <BellIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            <div className="flex items-center space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircleIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Filter Tabs */}
                        <div className="flex space-x-1 mt-3">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'assignments', label: 'Assignments' },
                                { key: 'grades', label: 'Grades' },
                                { key: 'announcements', label: 'Announcements' },
                                { key: 'system', label: 'System' }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                        filter === tab.key
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {getFilteredNotifications().length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <BellIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            getFilteredNotifications().map(notification => (
                                <div
                                    key={notification.id}
                                    className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                                        notification.read ? 'opacity-75' : ''
                                    }`}
                                >
                                    <div className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 flex-1">
                                                {getNotificationIcon(notification.type, notification.priority)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm font-medium ${
                                                            notification.read ? 'text-gray-600' : 'text-gray-900'
                                                        }`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {formatTimeAgo(notification.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    {notification.action && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-sm text-blue-600 hover:text-blue-800 mt-2 font-medium"
                                                        >
                                                            {notification.action}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 ml-2">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Mark as read"
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => removeNotification(notification.id)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Remove"
                                                >
                                                    <XCircleIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {getFilteredNotifications().length > 0 && (
                        <div className="p-3 border-t bg-gray-50 text-center">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
