import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, BellIcon, BookOpenIcon, UsersIcon, CheckCircleIcon, XCircleIcon, PlusIcon } from '../icons/Icons';

const Calendar = ({ assignments, courses, userRole, userId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'assignment', // assignment, exam, meeting, class
        courseId: '',
        priority: 'medium'
    });

    useEffect(() => {
        generateCalendarEvents();
    }, [assignments, courses, currentDate]);

    const generateCalendarEvents = () => {
        const calendarEvents = [];

        // Assignment due dates
        assignments.forEach(assignment => {
            const course = courses.find(c => c.id === assignment.courseId);
            calendarEvents.push({
                id: `assignment-${assignment.id}`,
                title: `Due: ${assignment.title}`,
                date: assignment.dueDate,
                type: 'assignment',
                course: course?.title || 'Unknown Course',
                courseColor: course?.color || '#3B82F6',
                priority: getDaysUntilDeadline(assignment.dueDate) <= 3 ? 'high' : 'medium',
                description: assignment.description
            });
        });

        // Add sample events for demonstration
        const sampleEvents = [
            {
                id: 'exam-1',
                title: 'Midterm Exam - Data Structures',
                date: '2025-09-15',
                type: 'exam',
                course: 'Data Structures',
                courseColor: '#EF4444',
                priority: 'high',
                description: 'Comprehensive exam covering arrays, linked lists, and trees'
            },
            {
                id: 'meeting-1',
                title: 'Faculty Meeting',
                date: '2025-09-12',
                type: 'meeting',
                course: 'Administration',
                courseColor: '#8B5CF6',
                priority: 'medium',
                description: 'Monthly department meeting'
            },
            {
                id: 'class-1',
                title: 'Special Lecture - AI Ethics',
                date: '2025-09-10',
                type: 'class',
                course: 'Computer Science',
                courseColor: '#10B981',
                priority: 'medium',
                description: 'Guest speaker on AI ethics and responsible computing'
            }
        ];

        if (userRole === 'faculty') {
            calendarEvents.push(...sampleEvents);
        }

        setEvents(calendarEvents);
    };

    const getDaysUntilDeadline = (dueDate) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Previous month's days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const prevDate = new Date(year, month, -i);
            days.push({ date: prevDate, isCurrentMonth: false });
        }
        
        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push({ date, isCurrentMonth: true });
        }
        
        // Next month's days to fill the grid
        const totalCells = 42; // 6 rows × 7 days
        const remainingCells = totalCells - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            const nextDate = new Date(year, month + 1, day);
            days.push({ date: nextDate, isCurrentMonth: false });
        }
        
        return days;
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            const event = {
                ...newEvent,
                id: `custom-${Date.now()}`,
                course: courses.find(c => c.id === newEvent.courseId)?.title || 'Custom Event',
                courseColor: courses.find(c => c.id === newEvent.courseId)?.color || '#6B7280'
            };
            setEvents(prev => [...prev, event]);
            setNewEvent({
                title: '',
                description: '',
                date: '',
                time: '',
                type: 'assignment',
                courseId: '',
                priority: 'medium'
            });
            setShowEventModal(false);
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'assignment': return <BookOpenIcon className="h-4 w-4" />;
            case 'exam': return <CheckCircleIcon className="h-4 w-4" />;
            case 'meeting': return <UsersIcon className="h-4 w-4" />;
            case 'class': return <CalendarIcon className="h-4 w-4" />;
            default: return <BellIcon className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendar Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => navigateMonth(1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                →
                            </button>
                            {userRole === 'faculty' && (
                                <button
                                    onClick={() => setShowEventModal(true)}
                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Day names header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentDate).map((dayObj, index) => {
                            const dayEvents = getEventsForDate(dayObj.date);
                            const isToday = dayObj.date.toDateString() === new Date().toDateString();
                            const isSelected = dayObj.date.toDateString() === selectedDate.toDateString();

                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedDate(dayObj.date)}
                                    className={`
                                        min-h-24 p-2 border cursor-pointer transition-colors
                                        ${dayObj.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                                        ${isToday ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                                    `}
                                >
                                    <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                                        {dayObj.date.getDate()}
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        {dayEvents.slice(0, 2).map(event => (
                                            <div
                                                key={event.id}
                                                className={`text-xs p-1 rounded border ${getPriorityColor(event.priority)}`}
                                                title={event.title}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    {getEventIcon(event.type)}
                                                    <span className="truncate">{event.title}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-gray-500">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Event Details Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Events for {selectedDate.toLocaleDateString()}
                        </h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {getEventsForDate(selectedDate).length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No events scheduled</p>
                            ) : (
                                getEventsForDate(selectedDate).map(event => (
                                    <div
                                        key={event.id}
                                        className={`p-4 border rounded-lg ${getPriorityColor(event.priority)}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-2">
                                                {getEventIcon(event.type)}
                                                <div>
                                                    <h4 className="font-semibold">{event.title}</h4>
                                                    <p className="text-sm opacity-75">{event.course}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-white rounded">
                                                {event.type}
                                            </span>
                                        </div>
                                        {event.description && (
                                            <p className="text-sm mt-2 opacity-90">{event.description}</p>
                                        )}
                                        {event.time && (
                                            <div className="flex items-center space-x-1 mt-2 text-sm">
                                                <ClockIcon className="h-4 w-4" />
                                                <span>{event.time}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
                        <div className="space-y-2">
                            {events
                                .filter(event => event.type === 'assignment' && new Date(event.date) > new Date())
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 5)
                                .map(event => {
                                    const daysLeft = getDaysUntilDeadline(event.date);
                                    return (
                                        <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm">{event.title}</p>
                                                <p className="text-xs text-gray-600">{event.course}</p>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded ${
                                                daysLeft <= 1 ? 'bg-red-100 text-red-800' :
                                                daysLeft <= 3 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {daysLeft === 0 ? 'Today' : 
                                                 daysLeft === 1 ? 'Tomorrow' : 
                                                 `${daysLeft} days`}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Add New Event</h3>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Event title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="assignment">Assignment</option>
                                    <option value="exam">Exam</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="class">Class</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <select
                                    value={newEvent.courseId}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, courseId: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={newEvent.priority}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Event description"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleAddEvent}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Event
                                </button>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
