import React, { useState, useEffect } from 'react';
import { 
    BookOpenIcon, UsersIcon, FileTextIcon, CalendarIcon, ClockIcon, 
    ChartBarIcon, PlusIcon, EditIcon, TrashIcon, StarIcon, 
    VideoIcon, DocumentIcon, LinkIcon, QuizIcon, SettingsIcon
} from '../icons/Icons';

const CourseManagement = ({ courses, setCourses, addCourse, editCourse, deleteCourse, assignments, submissions, users, userRole, userId }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [newCourse, setNewCourse] = useState({
        title: '',
        code: '',
        description: '',
        category: 'Computer Science',
        credits: 3,
        semester: 'Fall 2025',
        schedule: '',
        location: '',
        capacity: 30,
        prerequisites: '',
        syllabus: '',
        color: '#3B82F6',
        isPublished: false
    });

    const [courseContent, setCourseContent] = useState({
        modules: [],
        resources: [],
        announcements: []
    });

    useEffect(() => {
        if (selectedCourse) {
            loadCourseContent(selectedCourse.id);
        }
    }, [selectedCourse]);

    const loadCourseContent = (courseId) => {
        // Mock course content - in real app, this would come from API
        setCourseContent({
            modules: [
                {
                    id: '1',
                    title: 'Introduction to the Course',
                    description: 'Course overview, objectives, and expectations',
                    lessons: [
                        { id: '1', title: 'Welcome Video', type: 'video', duration: '15 min', completed: true },
                        { id: '2', title: 'Course Syllabus', type: 'document', duration: '10 min', completed: true },
                        { id: '3', title: 'Getting Started Quiz', type: 'quiz', duration: '20 min', completed: false }
                    ],
                    isLocked: false
                },
                {
                    id: '2',
                    title: 'Fundamentals',
                    description: 'Core concepts and basic principles',
                    lessons: [
                        { id: '4', title: 'Core Concepts Lecture', type: 'video', duration: '45 min', completed: false },
                        { id: '5', title: 'Practice Exercise', type: 'assignment', duration: '60 min', completed: false },
                        { id: '6', title: 'Reading Material', type: 'document', duration: '30 min', completed: false }
                    ],
                    isLocked: false
                },
                {
                    id: '3',
                    title: 'Advanced Topics',
                    description: 'In-depth exploration of advanced concepts',
                    lessons: [
                        { id: '7', title: 'Advanced Techniques', type: 'video', duration: '60 min', completed: false },
                        { id: '8', title: 'Case Study Analysis', type: 'assignment', duration: '120 min', completed: false }
                    ],
                    isLocked: true
                }
            ],
            resources: [
                { id: '1', title: 'Course Textbook (PDF)', type: 'document', size: '15 MB', url: '#' },
                { id: '2', title: 'Reference Materials', type: 'link', url: 'https://example.com' },
                { id: '3', title: 'Supplementary Videos', type: 'video', url: '#' },
                { id: '4', title: 'Practice Problems', type: 'document', size: '2 MB', url: '#' }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Welcome to the Course!',
                    content: 'Welcome to our course! Please review the syllabus and complete the introduction module.',
                    author: 'Dr. Smith',
                    timestamp: '2025-09-01',
                    priority: 'high'
                },
                {
                    id: '2',
                    title: 'Assignment 1 Released',
                    content: 'The first assignment is now available. Due date: September 15th.',
                    author: 'Dr. Smith',
                    timestamp: '2025-09-05',
                    priority: 'medium'
                }
            ]
        });
    };

    const handleCreateCourse = async () => {
        try {
            const courseData = {
                ...newCourse,
                instructorId: userId,
                enrolledStudents: [],
                modules: 0
            };
            
            // Use the addCourse function passed from App.jsx
            if (addCourse) {
                await addCourse(courseData);
            } else {
                // Fallback to local state update
                const course = {
                    ...courseData,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setCourses(prev => [...prev, course]);
            }
            
            // Reset form
            setNewCourse({
                title: '',
                code: '',
                description: '',
                category: 'Computer Science',
                credits: 3,
                semester: 'Fall 2025',
                schedule: '',
                location: '',
                capacity: 30,
                prerequisites: '',
                syllabus: '',
                color: '#3B82F6',
                isPublished: false
            });
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course: ' + error.message);
        }
    };

    const handleUpdateCourse = async () => {
        try {
            if (editCourse) {
                await editCourse(selectedCourse.id, { ...selectedCourse, updatedAt: new Date().toISOString() });
            } else {
                // Fallback to local state update
                setCourses(prev => prev.map(course => 
                    course.id === selectedCourse.id 
                        ? { ...selectedCourse, updatedAt: new Date().toISOString() }
                        : course
                ));
            }
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update course: ' + error.message);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                if (deleteCourse) {
                    await deleteCourse(courseId);
                } else {
                    // Fallback to local state update
                    setCourses(prev => prev.filter(course => course.id !== courseId));
                }
                if (selectedCourse?.id === courseId) {
                    setSelectedCourse(null);
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course: ' + error.message);
            }
        }
    };

    const getCourseStats = (course) => {
        const courseAssignments = assignments.filter(a => a.courseId === course.id);
        const courseSubmissions = submissions.filter(s => 
            courseAssignments.some(a => a.id === s.assignmentId)
        );
        const enrolledCount = course.enrolledStudents?.length || Math.floor(Math.random() * 30) + 10;
        const avgGrade = courseSubmissions.length > 0 ? 
            (courseSubmissions.reduce((sum, s) => sum + (convertGradeToPoints(s.grade) || 0), 0) / courseSubmissions.length).toFixed(2) : 'N/A';
        
        return {
            enrolledCount,
            assignmentCount: courseAssignments.length,
            avgGrade,
            completionRate: enrolledCount > 0 ? Math.floor(Math.random() * 40) + 60 : 0
        };
    };

    function convertGradeToPoints(grade) {
        const gradeMap = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'D-': 0.7,
            'F': 0.0
        };
        return gradeMap[grade?.toUpperCase()] || 0;
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <VideoIcon className="h-4 w-4" />;
            case 'document': return <DocumentIcon className="h-4 w-4" />;
            case 'quiz': return <QuizIcon className="h-4 w-4" />;
            case 'assignment': return <FileTextIcon className="h-4 w-4" />;
            case 'link': return <LinkIcon className="h-4 w-4" />;
            default: return <DocumentIcon className="h-4 w-4" />;
        }
    };

    const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];

    if (!selectedCourse) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Course Management</h2>
                        <p className="text-gray-600">Create, manage, and monitor your courses</p>
                    </div>
                    {userRole === 'faculty' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span>Create Course</span>
                        </button>
                    )}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses
                        .filter(course => userRole === 'admin' || course.instructorId === userId)
                        .map(course => {
                            const stats = getCourseStats(course);
                            return (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <div 
                                        className="h-32 rounded-t-xl flex items-center justify-center text-white text-2xl font-bold"
                                        style={{ backgroundColor: course.color }}
                                    >
                                        {course.code || course.title.substring(0, 3).toUpperCase()}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                                                <p className="text-sm text-gray-600">{course.code} • {course.semester}</p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {userRole === 'faculty' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCourse(course);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                                        >
                                                            <EditIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteCourse(course.id);
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{course.description}</p>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <UsersIcon className="h-4 w-4 text-gray-500" />
                                                <span>{stats.enrolledCount} students</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FileTextIcon className="h-4 w-4 text-gray-500" />
                                                <span>{stats.assignmentCount} assignments</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <ChartBarIcon className="h-4 w-4 text-gray-500" />
                                                <span>{stats.avgGrade !== 'N/A' ? `${stats.avgGrade} avg` : 'No grades'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <StarIcon className="h-4 w-4 text-gray-500" />
                                                <span>{stats.completionRate}% completion</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                course.isPublished 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {course.credits} credits
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Create Course Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                            <h3 className="text-xl font-bold mb-6">Create New Course</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                    <input
                                        type="text"
                                        value={newCourse.title}
                                        onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Introduction to Computer Science"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <input
                                        type="text"
                                        value={newCourse.code}
                                        onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="CS101"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={newCourse.description}
                                        onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Course description and objectives"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={newCourse.category}
                                        onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                                    <input
                                        type="number"
                                        value={newCourse.credits}
                                        onChange={(e) => setNewCourse(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                        max="6"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                    <select
                                        value={newCourse.semester}
                                        onChange={(e) => setNewCourse(prev => ({ ...prev, semester: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Fall 2025">Fall 2025</option>
                                        <option value="Spring 2026">Spring 2026</option>
                                        <option value="Summer 2026">Summer 2026</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <div className="flex space-x-2">
                                        {colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setNewCourse(prev => ({ ...prev, color }))}
                                                className={`w-8 h-8 rounded-full border-2 ${
                                                    newCourse.color === color ? 'border-gray-800' : 'border-gray-300'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCourse}
                                    disabled={!newCourse.title || !newCourse.code}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Create Course
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Course Detail View
    return (
        <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                        ← Back to Courses
                    </button>
                    {userRole === 'faculty' && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <EditIcon className="h-4 w-4" />
                                <span>Edit</span>
                            </button>
                            <button className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                <SettingsIcon className="h-4 w-4" />
                                <span>Settings</span>
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="flex items-start space-x-6">
                    <div 
                        className="w-24 h-24 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                        style={{ backgroundColor: selectedCourse.color }}
                    >
                        {selectedCourse.code || selectedCourse.title.substring(0, 3).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h1>
                        <p className="text-gray-600 mb-4">{selectedCourse.code} • {selectedCourse.semester} • {selectedCourse.credits} Credits</p>
                        <p className="text-gray-700">{selectedCourse.description}</p>
                        
                        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <UsersIcon className="h-4 w-4" />
                                <span>{getCourseStats(selectedCourse).enrolledCount} students</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FileTextIcon className="h-4 w-4" />
                                <span>{getCourseStats(selectedCourse).assignmentCount} assignments</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{selectedCourse.schedule || 'Schedule TBD'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { key: 'overview', label: 'Overview', icon: BookOpenIcon },
                            { key: 'content', label: 'Course Content', icon: FileTextIcon },
                            { key: 'students', label: 'Students', icon: UsersIcon },
                            { key: 'announcements', label: 'Announcements', icon: CalendarIcon },
                            { key: 'analytics', label: 'Analytics', icon: ChartBarIcon }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                                        activeTab === tab.key
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Course Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Instructor</p>
                                            <p className="font-semibold">Dr. John Smith</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="font-semibold">{selectedCourse.location || 'Room 101'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Prerequisites</p>
                                            <p className="font-semibold">{selectedCourse.prerequisites || 'None'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Capacity</p>
                                            <p className="font-semibold">{selectedCourse.capacity || 30} students</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Announcements</h3>
                                    <div className="space-y-3">
                                        {courseContent.announcements.map(announcement => (
                                            <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                                                        <p className="text-gray-600 mt-1">{announcement.content}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {announcement.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                                                    <span>By {announcement.author}</span>
                                                    <span>{announcement.timestamp}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Enrolled Students</span>
                                            <span className="font-semibold">{getCourseStats(selectedCourse).enrolledCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Assignments</span>
                                            <span className="font-semibold">{getCourseStats(selectedCourse).assignmentCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Average Grade</span>
                                            <span className="font-semibold">{getCourseStats(selectedCourse).avgGrade}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Completion Rate</span>
                                            <span className="font-semibold">{getCourseStats(selectedCourse).completionRate}%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-2">
                                        <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                            Create Assignment
                                        </button>
                                        <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                            Send Announcement
                                        </button>
                                        <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                            View Gradebook
                                        </button>
                                        <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                                            Export Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Course Modules</h3>
                                {userRole === 'faculty' && (
                                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        <PlusIcon className="h-4 w-4" />
                                        <span>Add Module</span>
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                {courseContent.modules.map((module, moduleIndex) => (
                                    <div key={module.id} className="border border-gray-200 rounded-xl">
                                        <div className="p-6 bg-gray-50 border-b border-gray-200 rounded-t-xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {moduleIndex + 1}. {module.title}
                                                    </h4>
                                                    <p className="text-gray-600 mt-1">{module.description}</p>
                                                </div>
                                                {module.isLocked && (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                                        Locked
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="space-y-3">
                                                {module.lessons.map((lesson, lessonIndex) => (
                                                    <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`p-2 rounded-lg ${
                                                                lesson.completed ? 'bg-green-100' : 'bg-gray-100'
                                                            }`}>
                                                                {getTypeIcon(lesson.type)}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                                                <p className="text-sm text-gray-600">{lesson.duration}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {lesson.completed && (
                                                                <span className="text-green-600 text-sm">✓ Completed</span>
                                                            )}
                                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                                {lesson.completed ? 'Review' : 'Start'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Enrolled Students</h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    {userRole === 'faculty' && (
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Export List
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.students?.slice(0, 10).map((student, index) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {student.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-600 h-2 rounded-full" 
                                                            style={{ width: `${Math.random() * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {['A', 'B+', 'B', 'A-', 'C+'][Math.floor(Math.random() * 5)]}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {Math.floor(Math.random() * 7) + 1} days ago
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Add other tab contents here */}
                </div>
            </div>

            {/* Edit Course Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                        <h3 className="text-xl font-bold mb-6">Edit Course</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    value={selectedCourse.title}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                <input
                                    type="text"
                                    value={selectedCourse.code}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, code: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={selectedCourse.description}
                                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCourse}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
