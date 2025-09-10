import React, { useState, useEffect } from 'react';
import NotificationBar from './components/common/NotificationBar';
import { NotificationProvider } from './context/NotificationContext';
import { AuthContext } from './context/AuthContext';
import { AppStateContext } from './context/AppStateContext';
import ToastProvider from './components/common/Toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AppContainer from './components/layout/AppContainer';
import Modal from './components/common/Modal';

function App() {
    // State variables
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('landing');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Data State Management
    const [allUsers, setAllUsers] = useState({ students: [], faculty: [] });
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [deadlineReminders, setDeadlineReminders] = useState([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: null });

    // Helper functions
    const openModal = (title, body) => { 
        setModalContent({ title, body }); 
        setIsModalOpen(true); 
    };
    
    const closeModal = () => { 
        setIsModalOpen(false); 
        setTimeout(() => setModalContent({ title: '', body: null }), 300); 
    };

    const handleLogout = () => {
        localStorage.removeItem('acadamix_user');
        setUser(null);
        setPage('landing');
    };

    // CRUD Functions
    const addUser = async (userData) => {
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    password: 'defaultpass123' // Default password for admin-created users
                })
            });

            if (response.ok) {
                // Refresh users from backend
                const usersResponse = await fetch('http://localhost:3001/api/users');
                if (usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    const students = usersData.filter(user => user.role === 'student').map(user => ({
                        ...user,
                        avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${user.name.split(' ').map(n => n[0]).join('')}`
                    }));
                    const faculty = usersData.filter(user => user.role === 'faculty').map(user => ({
                        ...user,
                        avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${user.name.split(' ').map(n => n[0]).join('')}`
                    }));
                    setAllUsers({ students, faculty });
                }
            } else {
                const error = await response.json();
                alert('Failed to create user: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user: ' + error.message);
        }
    };

    const deleteUser = (userId, role) => {
        if (role === 'student') {
            setAllUsers(prev => ({
                ...prev,
                students: prev.students.filter(s => s.id !== userId)
            }));
        } else if (role === 'faculty') {
            setAllUsers(prev => ({
                ...prev,
                faculty: prev.faculty.filter(f => f.id !== userId)
            }));
        }
    };

    const addCourse = async (courseData) => {
        try {
            const newCourse = {
                ...courseData,
                faculty: user?.name || 'Unknown Faculty',
                students: 0,
                progress: 0
            };
            
            const response = await fetch('http://localhost:3001/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                // Refresh courses from backend
                const coursesResponse = await fetch('http://localhost:3001/api/courses');
                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    setCourses(coursesData);
                }
            } else {
                console.error('Failed to create course');
                alert('Failed to create course');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Error creating course: ' + error.message);
        }
    };

    const editCourse = (courseId, updatedData) => {
        setCourses(prev => prev.map(course => 
            course.id === courseId ? { ...course, ...updatedData } : course
        ));
    };

    const deleteCourse = (courseId) => {
        setCourses(prev => prev.filter(course => course.id !== courseId));
    };

    const addAssignment = (assignmentData) => {
        const newAssignment = {
            ...assignmentData,
            id: Date.now(),
            status: 'pending'
        };
        setAssignments(prev => [...prev, newAssignment]);
    };

    const gradeSubmission = (submissionId, grade, feedback = '') => {
        setSubmissions(prev => prev.map(submission => 
            submission.id === submissionId 
                ? { ...submission, grade, feedback, gradedAt: new Date().toISOString() }
                : submission
        ));
    };

    const addSubmission = (submissionData) => {
        const newSubmission = {
            ...submissionData,
            id: Date.now(),
            submittedAt: new Date().toISOString(),
            grade: null,
            feedback: ''
        };
        setSubmissions(prev => [...prev, newSubmission]);
    };

    // Authentication logic
    useEffect(() => {
        const storedUser = localStorage.getItem('acadamix_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing stored user:', e);
                localStorage.removeItem('acadamix_user');
            }
        }
        setIsLoading(false);
    }, []);

    // Data loading - Fetch real data from backend with proper error handling
    useEffect(() => {
        const fetchData = async () => {
            // Always set fallback data first, then try to fetch from backend
            console.log('Loading fallback data...');
            
            // Set fallback data
            setAllUsers({
                students: [
                    { id: 'S001', name: 'Alice Johnson', email: 'student@acadamix.edu', role: 'student', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AJ' },
                    { id: 'S002', name: 'Bob Smith', email: 'bob@example.com', role: 'student', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=BS' }
                ],
                faculty: [
                    { id: 'F001', name: 'Dr. Sarah Wilson', email: 'faculty@acadamix.edu', role: 'faculty', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SW' },
                    { id: 'F002', name: 'Prof. Michael Chen', email: 'michael@example.com', role: 'faculty', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MC' }
                ]
            });

            setCourses([
                { id: 1, title: "Introduction to React", faculty: "Dr. Sarah Wilson", progress: 65, description: "Master React fundamentals", modules: 8, students: 120 },
                { id: 2, title: "Advanced CSS", faculty: "Prof. Michael Chen", progress: 30, description: "Advanced CSS techniques", modules: 12, students: 95 },
                { id: 3, title: "Database Design", faculty: "Dr. Sarah Wilson", progress: 0, description: "Learn database fundamentals", modules: 10, students: 75 }
            ]);

            setAssignments([
                { id: 1, title: "React Component Exercise", courseTitle: "Introduction to React", dueDate: "2025-09-15", status: "pending", description: "Create functional components" },
                { id: 2, title: "CSS Grid Layout", courseTitle: "Advanced CSS", dueDate: "2025-09-20", status: "completed", description: "Build responsive layouts" }
            ]);

            setSubmissions([
                { id: 1, studentName: "Alice Johnson", assignmentTitle: "React Component Exercise", submittedAt: "2025-09-10", grade: null, feedback: "", fileName: "component.jsx" },
                { id: 2, studentName: "Bob Smith", assignmentTitle: "CSS Grid Layout", submittedAt: "2025-09-18", grade: "A", feedback: "Excellent work!", fileName: "layout.html" }
            ]);

            setDeadlineReminders([
                { id: 1, title: "React Component Exercise", dueDate: "2025-09-15", course: "Introduction to React" },
                { id: 2, title: "Database Project", dueDate: "2025-09-25", course: "Database Design" }
            ]);

            // Try to fetch from backend if available
            try {
                console.log('Attempting to fetch from backend...');
                
                // Fetch users from backend
                try {
                    const usersResponse = await fetch('http://localhost:3001/api/users');
                    if (usersResponse.ok) {
                        const usersData = await usersResponse.json();
                        const students = usersData.filter(user => user.role === 'student').map(user => ({
                            ...user,
                            avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${user.name.split(' ').map(n => n[0]).join('')}`
                        }));
                        const faculty = usersData.filter(user => user.role === 'faculty').map(user => ({
                            ...user,
                            avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${user.name.split(' ').map(n => n[0]).join('')}`
                        }));
                        setAllUsers({ students, faculty });
                        console.log('Successfully fetched users from backend');
                    }
                } catch (error) {
                    console.log('Backend users API not available, using fallback data');
                }

                // Fetch courses from backend
                try {
                    const coursesResponse = await fetch('http://localhost:3001/api/courses');
                    if (coursesResponse.ok) {
                        const coursesData = await coursesResponse.json();
                        if (coursesData.length > 0) {
                            setCourses(coursesData);
                            console.log('Successfully fetched courses from backend');
                        }
                    }
                } catch (error) {
                    console.log('Backend courses API not available, using fallback data');
                }

                // Fetch assignments from backend
                try {
                    const assignmentsResponse = await fetch('http://localhost:3001/api/assignments');
                    if (assignmentsResponse.ok) {
                        const assignmentsData = await assignmentsResponse.json();
                        if (assignmentsData.length > 0) {
                            setAssignments(assignmentsData);
                            console.log('Successfully fetched assignments from backend');
                        }
                    }
                } catch (error) {
                    console.log('Backend assignments API not available, using fallback data');
                }

                // Fetch submissions from backend
                try {
                    const submissionsResponse = await fetch('http://localhost:3001/api/submissions');
                    if (submissionsResponse.ok) {
                        const submissionsData = await submissionsResponse.json();
                        if (submissionsData.length > 0) {
                            setSubmissions(submissionsData);
                            console.log('Successfully fetched submissions from backend');
                        }
                    }
                } catch (error) {
                    console.log('Backend submissions API not available, using fallback data');
                }

                // Set some sample deadline reminders
                setDeadlineReminders([
                    { id: 1, title: "Upcoming Assignment", dueDate: "2025-09-15", course: "Sample Course" }
                ]);

            } catch (error) {
                console.error('Error fetching data:', error);
                // Use minimal fallback data in case of network error
                setAllUsers({
                    students: [{ id: 'S001', name: 'Alice Johnson', email: 'student@acadamix.edu', role: 'student', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AJ' }],
                    faculty: [{ id: 'F001', name: 'Dr. Sarah Wilson', email: 'faculty@acadamix.edu', role: 'faculty', avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SW' }]
                });
                setCourses([]);
                setAssignments([]);
                setSubmissions([]);
                setDeadlineReminders([]);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-xl font-semibold text-gray-700">Loading Acadamix...</p>
                    </div>
                </div>
            );
        }

        if (user) {
            const dashboardProps = {
                onLogout: handleLogout,
                openModal,
                closeModal,
                users: allUsers,
                courses,
                addUser,
                deleteUser,
                addCourse,
                editCourse,
                deleteCourse,
                currentUser: user,
                assignments,
                addAssignment,
                submissions,
                gradeSubmission,
                addSubmission
            };
            
            switch (user.role) {
                case 'admin': 
                    return <AdminDashboard {...dashboardProps} />;
                case 'faculty': 
                    return <FacultyDashboard {...dashboardProps} />;
                case 'student': 
                    return <StudentDashboard {...dashboardProps} deadlineReminders={deadlineReminders} />;
                default:
                    handleLogout();
                    return <Login setPage={setPage} setUser={setUser} />;
            }
        }

        switch (page) {
            case 'login': 
                return <Login setPage={setPage} setUser={setUser} />;
            case 'register': 
                return <Register setPage={setPage} setUser={setUser} />;
            case 'landing': 
            default: 
                return <LandingPage setPage={setPage} />;
        }
    };

    return (
        <ToastProvider>
            <NotificationProvider>
                <NotificationBar />
                <AuthContext.Provider value={{ user }}>
                    <AppStateContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
                        <AppContainer>
                            {renderContent()}
                            <Modal 
                                isOpen={isModalOpen} 
                                onClose={closeModal} 
                                title={modalContent.title}
                            >
                                {modalContent.body}
                            </Modal>
                        </AppContainer>
                    </AppStateContext.Provider>
                </AuthContext.Provider>
            </NotificationProvider>
        </ToastProvider>
    );
}

export default App;


