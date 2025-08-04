import React, { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { AppStateContext } from './context/AppStateContext';
import AppContainer from './components/layout/AppContainer';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './pages/LandingPage';
import Modal from './components/common/Modal';

// Firebase Imports
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

function App() {
    const [user, setUser] = useState(null); // Will hold user data from Firestore (id, name, role, etc.)
    const [page, setPage] = useState('landing');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- Data State Management ---
    const [allUsers, setAllUsers] = useState({ students: [], faculty: [] });
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    // --- Firebase Auth Listener ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser({ id: firebaseUser.uid, ...userDocSnap.data() });
                } else {
                    auth.signOut(); // User exists in auth but not DB, force sign out
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Firestore Real-time Listeners ---
    useEffect(() => {
        if (!user) return;

        const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
            setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllUsers({
                students: usersData.filter(u => u.role === 'student'),
                faculty: usersData.filter(u => u.role === 'faculty')
            });
        });
        const unsubAssignments = onSnapshot(collection(db, "assignments"), (snapshot) => {
            setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubSubmissions = onSnapshot(collection(db, "submissions"), (snapshot) => {
            setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubCourses();
            unsubUsers();
            unsubAssignments();
            unsubSubmissions();
        };
    }, [user]); // Re-run when user logs in/out

    // --- Firestore Write Functions ---
    const addUser = async (userType, newUser) => {
        // This is a placeholder for an admin adding a user. In a real app, this would trigger an invite email.
        await addDoc(collection(db, "users"), {
            name: newUser.name, email: newUser.email, role: userType,
            avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${newUser.name.charAt(0).toUpperCase()}`
        });
    };
    const deleteUser = async (userId) => { await deleteDoc(doc(db, "users", userId)); };
    const addCourse = async (newCourseData) => { await addDoc(collection(db, "courses"), newCourseData); };
    const addAssignment = async (newAssignment) => { await addDoc(collection(db, "assignments"), newAssignment); };
    const gradeSubmission = async (submissionId, grade) => {
        const submissionRef = doc(db, "submissions", submissionId);
        await updateDoc(submissionRef, { grade });
    };

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: null });
    const openModal = (title, body) => { setModalContent({ title, body }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => setModalContent({ title: '', body: null }), 300); };
    
    const handleLogout = () => { auth.signOut(); setPage('login'); };

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
                currentUser: user,
                assignments,
                addAssignment,
                submissions,
                gradeSubmission
            };
            switch (user.role) {
                case 'admin': return <AdminDashboard {...dashboardProps} />;
                case 'faculty': return <FacultyDashboard {...dashboardProps} />;
                case 'student': return <StudentDashboard {...dashboardProps} />;
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
        <AuthContext.Provider value={{ user }}>
            <AppStateContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
                <AppContainer>
                    {renderContent()}
                    <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>{modalContent.body}</Modal>
                </AppContainer>
            </AppStateContext.Provider>
        </AuthContext.Provider>
    );
}
export default App;
