import React, { useState, useEffect } from 'react';
import NotificationBar from './components/common/NotificationBar';
import { NotificationProvider } from './context/NotificationContext';
import { AuthContext } from './context/AuthContext';
import { AppStateContext } from './context/AppStateContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AppContainer from './components/layout/AppContainer';
import Modal from './components/common/Modal';

// ...existing code...

function App() {
    // Prevent ReferenceError for deleteCourse
    const deleteCourse = () => {
        // TODO: Implement course deletion logic
    };
    // Prevent ReferenceError for editCourse
    const editCourse = () => {
        // TODO: Implement course editing logic
    };
    // ...existing code...

    // Placeholder for gradeSubmission to prevent crash
    // SQL-based grading for faculty
    const gradeSubmission = async (submissionId, grade, feedback = '') => {
        try {
            const res = await fetch(`http://localhost:3001/api/submissions/${submissionId}/grade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade, feedback })
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
                alert('Failed to grade submission: ' + (result.error || 'Unknown error'));
                return;
            }
            // Update local submissions state
            setSubmissions(prevSubmissions => 
                prevSubmissions.map(submission => 
                    submission.id === submissionId 
                        ? { ...submission, grade, feedback }
                        : submission
                )
            );
            alert('Submission graded successfully!');
        } catch (err) {
            alert('Failed to grade submission: ' + err.message);
        }
    };

    // Placeholder for addAssignment to prevent crash
    const addAssignment = async (assignmentData) => {
        // TODO: Implement assignment creation logic
        // Example:
        // const res = await fetch('http://localhost:3001/api/assignments', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(assignmentData)
        // });
        // const result = await res.json();
        // if (!res.ok || !result.success) {
        //     alert('Failed to create assignment: ' + (result.error || 'Unknown error'));
        //     return;
        // }
        // Optionally refresh assignments
        // const updatedAssignments = await fetch('http://localhost:3001/api/assignments').then(r => r.json());
        // setAssignments(updatedAssignments);
    };
    // Placeholder for addCourse to prevent crash
    const addCourse = async (newCourseData) => {
        try {
            // Always set faculty to logged-in user's name
            const courseToCreate = { ...newCourseData, faculty: user?.name };
            const res = await fetch('http://localhost:3001/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseToCreate)
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
                alert('Failed to create course: ' + (result.error || 'Unknown error'));
                console.log('Course creation response:', result);
                return;
            }
            // Optionally fetch courses again or update state
            const updatedCourses = await fetch('http://localhost:3001/api/courses').then(r => r.json());
            setCourses(updatedCourses);
        } catch (err) {
            alert('Failed to create course: ' + err.message);
            console.log('Course creation error:', err);
        }
    };
    // Placeholder for deleteUser to prevent crash
    const deleteUser = () => {
        // TODO: Implement user deletion logic if needed
    };
    // Placeholder for addUser to prevent crash
    const addUser = () => {
        // TODO: Implement user creation logic if needed
    };
    
    // Placeholder for addSubmission to prevent crash
    const addSubmission = async (submissionData) => {
        try {
            // TODO: Implement submission creation logic
            console.log('Add submission called with:', submissionData);
        } catch (err) {
            console.log('Submission creation error:', err);
        }
    };

    // State variables
    const [user, setUser] = useState(null); // Will hold user data from Firestore (id, name, role, etc.)
    const [page, setPage] = useState('landing');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- Data State Management ---
    const [allUsers, setAllUsers] = useState({ students: [], faculty: [] });
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [deadlineReminders, setDeadlineReminders] = useState([]);

    // --- SQL-based authentication and user fetching logic ---
    useEffect(() => {
        const storedUser = localStorage.getItem('acadamix_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // --- SQL-based data fetching logic ---
    useEffect(() => {
        // Load mock data for development (in production, this would be API calls)
        setAllUsers({
            students: [
                { id: 'S002', name: 'Alice Johnson', email: 'alice@example.com', role: 'student' },
                { id: 'S003', name: 'Bob Smith', email: 'bob@example.com', role: 'student' },
                { id: 'S004', name: 'Carol Davis', email: 'carol@example.com', role: 'student' },
                { id: 'S005', name: 'David Wilson', email: 'david@example.com', role: 'student' }
            ],
            faculty: [
                { id: 'F001', name: 'Dr. Sarah Wilson', email: 'sarah@example.com', role: 'faculty' },
                { id: 'F002', name: 'Prof. Michael Chen', email: 'michael@example.com', role: 'faculty' }
            ]
        });
        
        // Set mock courses directly
        setCourses([
            { id: 1, title: "Introduction to React", faculty: "Dr. Evelyn Reed", progress: 65, description: "Master the fundamentals of React, including components, hooks, and state management.", modules: 8, students: 120 },
            { id: 2, title: "Advanced CSS with Tailwind", faculty: "Dr. Evelyn Reed", progress: 30, description: "Dive deep into modern CSS techniques and build complex, responsive layouts with Tailwind.", modules: 12, students: 95 },
            { id: 3, title: "Data Structures & Algorithms", faculty: "Prof. Liam Carter", progress: 0, description: "A comprehensive look at fundamental data structures and algorithms for problem-solving.", modules: 15, students: 150 }
        ]);
        
        // Set mock assignments
        setAssignments([
            { id: 1, title: "React Component Exercise", courseTitle: "Introduction to React", dueDate: "2025-09-15", status: "pending" },
            { id: 2, title: "CSS Grid Layout", courseTitle: "Advanced CSS with Tailwind", dueDate: "2025-09-20", status: "completed" }
        ]);
        
        // Set mock submissions
        setSubmissions([
            { id: 1, studentName: "Alice Johnson", assignmentTitle: "React Component Exercise", submittedAt: "2025-09-10", grade: null },
            { id: 2, studentName: "Bob Smith", assignmentTitle: "CSS Grid Layout", submittedAt: "2025-09-18", grade: "A" }
        ]);

        // Also try to fetch from backend if available
        fetch('http://localhost:3001/api/users')
            .then(res => res.json())
            .then(data => {
                setAllUsers({
                    students: data.filter(u => u.role === 'student'),
                    faculty: data.filter(u => u.role === 'faculty')
                });
            })
            .catch(() => {
                // Backend not available, use mock data already set above
            });
        
        // Try to fetch additional data from backend if available
        fetch('http://localhost:3001/api/courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(() => {});
        
        fetch('http://localhost:3001/api/submissions')
            .then(res => res.json())
            .then(data => setSubmissions(data))
            .catch(() => {});
        
        fetch('http://localhost:3001/api/assignments')
            .then(res => res.json())
            .then(data => setAssignments(data))
            .catch(() => {});
    }, []);

    // TODO: Replace with SQL-based CRUD functions for users, courses, assignments, submissions

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: null });
    const openModal = (title, body) => { setModalContent({ title, body }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => setModalContent({ title: '', body: null }), 300); };
    
    const handleLogout = () => {
        localStorage.removeItem('acadamix_user');
        setUser(null);
        setPage('login');
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Loading Acadamix...</div>;
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
                gradeSubmission
                    ,addSubmission
            };
            switch (user.role) {
                case 'admin': return <AdminDashboard {...dashboardProps} />;
                case 'faculty': return <FacultyDashboard {...dashboardProps} />;
                case 'student': return <StudentDashboard {...dashboardProps} deadlineReminders={deadlineReminders} />;
                default:
                    handleLogout();
                    return <Login setPage={setPage} />;
            }
        }

        switch (page) {
            case 'login': return <Login setPage={setPage} />;
            case 'register': return <Register setPage={setPage} />;
            case 'landing': default: return <LandingPage setPage={setPage} />;
        }
    };

    return (
        <NotificationProvider>
            <NotificationBar />
            <AuthContext.Provider value={{ user }}>
                <AppStateContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
                    <AppContainer>
                        {renderContent()}
                        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>{modalContent.body}</Modal>
                    </AppContainer>
                </AppStateContext.Provider>
            </AuthContext.Provider>
        </NotificationProvider>
    );
}
export default App;
