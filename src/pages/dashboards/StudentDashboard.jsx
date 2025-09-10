import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/common/Header';
import DashboardCard from '../../components/common/DashboardCard';
import CourseCard from '../../components/common/CourseCard';
import StudentGradeAnalysis from '../../components/gradebook/StudentGradeAnalysis';
import StudentAssignmentUpload from '../../components/assignments/StudentAssignmentUpload';
import StudentProgress from '../../components/student/StudentProgress';
import LearningCenter from '../../components/learning/LearningCenter';
import Calendar from '../../components/common/Calendar';
import NotificationCenter from '../../components/common/NotificationCenter';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import { LoadingSpinner, EmptyState } from '../../components/common/Loading';
import { useToast } from '../../components/common/Toast';
import { AuthContext } from '../../context/AuthContext';
import { 
    HomeIcon, BookOpenIcon, FileTextIcon, GraduationCapIcon, SettingsIcon, 
    PlayCircleIcon, CheckCircleIcon, ClockIcon, UploadCloudIcon, BarChartIcon,
    CalendarIcon, BellIcon, TrendingUpIcon, UserIcon, TargetIcon
} from '../../components/icons/Icons';

// --- MODAL CONTENT ---
const SubmitAssignmentForm = ({ onCancel, onSave }) => {
    const [content, setContent] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSave(content); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Your Submission</label><textarea rows="5" value={content} onChange={e => setContent(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Submit</button></div>
        </form>
    );
};

// --- VIEW COMPONENTS ---
const CourseDetailPage = ({ course, onBack }) => {
    const modules = [ { name: 'Module 1: Introduction', lessons: ['Welcome to the Course', 'Syllabus Overview'], completed: true }, { name: 'Module 2: Core Concepts', lessons: ['Lesson 1', 'Lesson 2'], completed: false }, ];
    return (
        <div className="space-y-8">
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Courses</button>
            <h1 className="text-4xl font-bold text-gray-800">{course.title}</h1>
            <p className="text-lg text-gray-600 mt-2">Taught by {course.faculty}</p>
            <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h2><div className="space-y-6">{modules.map((module, index) => (<div key={index} className="border border-gray-200 rounded-lg p-6"><div className="flex justify-between items-center"><h3 className="text-xl font-semibold text-gray-700">{module.name}</h3>{module.completed ? <span className="flex items-center text-sm font-medium text-green-600"><CheckCircleIcon className="h-5 w-5 mr-1" /> Completed</span> : <span className="text-sm font-medium text-gray-500">In Progress</span>}</div><ul className="mt-4 space-y-3">{module.lessons.map((lesson, i) => <li key={i} className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer"><PlayCircleIcon className="h-5 w-5 mr-3 text-gray-400" /><span>{lesson}</span></li>)}</ul></div>))}</div></div>
        </div>
    );
};
const MyCoursesPage = ({ courses, onCourseSelect }) => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{courses.map(course => <div key={course.id} onClick={() => onCourseSelect(course)} className="cursor-pointer"><CourseCard course={course} role="student" /></div>)}</div>
    </div>
);
const AssignmentsPage = ({ assignments, submissions, courses, currentUser, openModal, closeModal, addSubmission }) => {
    const getCourseTitle = (id) => courses.find(c => c.id === id)?.title || 'Unknown';
    const getSubmissionStatus = (assignmentId) => {
        const submission = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
        return submission ? { submitted: true, grade: submission.grade || 'Grading' } : { submitted: false, grade: null };
    };
    
    const handleSubmit = (assignmentId) => {
        openModal('Submit Assignment', <SubmitAssignmentForm onCancel={closeModal} onSave={(content) => { addSubmission({ assignmentId, studentId: currentUser.id, content }); closeModal(); }} />);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Assignments & Quizzes</h2>
            <div className="bg-white p-6 rounded-xl shadow-md"><ul className="divide-y divide-gray-200">{assignments.map(a => {
                const { submitted, grade } = getSubmissionStatus(a.id);
                return (
                    <li key={a.id} className="py-4 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center">
                            <FileTextIcon className="h-6 w-6 mr-4 text-blue-500 flex-shrink-0" />
                            <div><p className="text-lg font-semibold text-gray-800">{a.title}</p><p className="text-sm text-gray-500">{getCourseTitle(a.courseId)}</p></div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-sm text-gray-600"><p>Due: {a.dueDate}</p></div>
                            {submitted ? (<span className="flex items-center text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full"><CheckCircleIcon className="h-4 w-4 mr-1.5" />Submitted ({grade})</span>) : (<button onClick={() => handleSubmit(a.id)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"><UploadCloudIcon className="h-4 w-4 mr-2"/>Submit Now</button>)}
                        </div>
                    </li>
                );
            })}</ul></div>
        </div>
    );
};
const GradesPage = ({ assignments, submissions, courses, currentUser }) => {
    const getCourseTitle = (id) => courses.find(c => c.id === id)?.title || 'Unknown';
    const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">My Grades</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4 font-semibold text-gray-600">Course</th><th className="p-4 font-semibold text-gray-600">Assignment</th><th className="p-4 font-semibold text-gray-600">Grade</th></tr></thead><tbody className="divide-y divide-gray-200">{studentSubmissions.map(sub => {
                const assignment = assignments.find(a => a.id === sub.assignmentId);
                return (<tr key={sub.id} className="hover:bg-gray-50"><td className="p-4 text-gray-700">{getCourseTitle(assignment?.courseId)}</td><td className="p-4 font-medium text-gray-800">{assignment?.title}</td><td className="p-4 font-bold text-lg text-blue-600">{sub.grade || 'Grading'}</td></tr>)
            })}</tbody></table></div>
        </div>
    );
};
const SettingsPage = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Settings & Profile</h2>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto"><div className="flex items-center space-x-6 mb-8"><img className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-200" src={user.avatar} alt="User avatar" /><div><h3 className="text-2xl font-bold text-gray-800">{user.name}</h3><p className="text-gray-500 capitalize">{user.role}</p></div></div><form className="space-y-6"><div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="fullName" defaultValue={user.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" id="email" defaultValue={user.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly /></div><div><label htmlFor="password"className="block text-sm font-medium text-gray-700">Change Password</label><input type="password" id="password" placeholder="Enter new password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div><div className="pt-4"><button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Save Changes</button></div></form></div>
        </div>
    );
};
const DashboardView = ({ courses, onCourseSelect, studentStats, assignments, submissions, currentUser }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getMotivationalMessage = () => {
        const messages = [
            "You're doing great! Keep up the excellent work! 🌟",
            "Learning is a journey, and you're making progress! 📚",
            "Every assignment completed is a step toward success! 🚀",
            "Your dedication to learning is inspiring! 💪",
            "Knowledge is power - you're building yours every day! ⚡"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const getUpcomingDeadlines = () => {
        return assignments
            .filter(assignment => {
                const submitted = submissions.some(s => 
                    s.assignmentId === assignment.id && s.studentId === currentUser?.id
                );
                return !submitted;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section with Motivational Message */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}! 👋
                        </h1>
                        <p className="text-lg text-gray-600 mt-2 font-medium">
                            {getMotivationalMessage()}
                        </p>
                        <div className="flex items-center mt-4 text-gray-600">
                            <span className="text-2xl mr-3">📅</span>
                            <span className="font-medium">
                                {currentTime.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-6xl shadow-2xl animate-bounce-in">
                            🎓
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Enrolled Courses"
                    value={studentStats.enrolledCourses}
                    icon="📚"
                    gradient={true}
                    color="blue"
                    trend={studentStats.enrolledCourses > 0 ? "+1" : null}
                    description="Active enrollments"
                    actionLabel="View All Courses"
                    onClick={() => setActiveTab('Courses')}
                />
                
                <DashboardCard
                    title="Total Assignments"
                    value={studentStats.totalAssignments}
                    icon="📝"
                    gradient={true}
                    color="green"
                    description="Assignments available"
                    actionLabel="View Assignments"
                />
                
                <DashboardCard
                    title="Completion Rate"
                    value={`${studentStats.completionRate}%`}
                    icon="🎯"
                    gradient={true}
                    color="purple"
                    trend={studentStats.completionRate > 75 ? "+5%" : null}
                    description="Assignments completed"
                    actionLabel="View Progress"
                />
                
                <DashboardCard
                    title="Average Grade"
                    value={studentStats.avgGrade > 0 ? studentStats.avgGrade : 'N/A'}
                    icon="⭐"
                    gradient={true}
                    color="orange"
                    description="Current GPA"
                    actionLabel="View Grades"
                />
            </div>

            {/* Quick Actions & Upcoming Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="text-2xl mr-3">⚡</span>
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
                            <div className="flex items-center">
                                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">📖</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Continue Learning</p>
                                    <p className="text-sm text-gray-600">Resume your courses</p>
                                </div>
                            </div>
                        </button>
                        
                        <button className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
                            <div className="flex items-center">
                                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">📤</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Submit Assignment</p>
                                    <p className="text-sm text-gray-600">Upload your work</p>
                                </div>
                            </div>
                        </button>
                        
                        <button className="w-full p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
                            <div className="flex items-center">
                                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">💬</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Join Discussion</p>
                                    <p className="text-sm text-gray-600">Connect with peers</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="text-2xl mr-3">⏰</span>
                        Upcoming Deadlines
                    </h3>
                    {getUpcomingDeadlines().length > 0 ? (
                        <div className="space-y-4">
                            {getUpcomingDeadlines().map((assignment, index) => (
                                <div key={assignment.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-1">{assignment.title}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                                            <div className="flex items-center text-sm text-red-600 font-medium">
                                                <span className="mr-2">📅</span>
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex flex-col items-end">
                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2">
                                                URGENT
                                            </span>
                                            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors duration-300">
                                                Start Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">✅</div>
                            <p className="text-gray-600 font-medium">All caught up! No pending deadlines.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="text-3xl mr-3">🎓</span>
                        Your Courses
                    </h2>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        View All Courses
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 6).map(course => (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            role="student" 
                            onClick={() => onCourseSelect(course)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const StudentDashboard = (props) => {
    const { deadlineReminders, courses = [], assignments = [], submissions = [], users = {}, currentUser, addSubmission, openModal, closeModal, onLogout } = props;
    
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    // Student Dashboard Stats
    const studentStats = {
        enrolledCourses: courses.length,
        totalAssignments: assignments.length,
        submittedAssignments: submissions.filter(s => s.studentId === currentUser?.id).length,
        pendingAssignments: assignments.length - submissions.filter(s => s.studentId === currentUser?.id).length,
        avgGrade: (submissions.filter(s => s.grade && s.studentId === currentUser?.id).reduce((sum, s) => {
            const gradeMap = {
                'A+': 4.0, 'A': 4.0, 'A-': 3.7,
                'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7,
                'D+': 1.3, 'D': 1.0, 'D-': 0.7,
                'F': 0.0
            };
            return sum + (gradeMap[s.grade] || 0);
        }, 0) / submissions.filter(s => s.grade && s.studentId === currentUser?.id).length || 0).toFixed(2),
        completionRate: Math.round((submissions.filter(s => s.studentId === currentUser?.id).length / Math.max(assignments.length, 1)) * 100)
    };

    const StudentStatsCard = ({ title, value, subtitle, icon, color, trend }) => (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('600', '100')}`}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{trend}</span>
                    <span className="text-sm text-gray-500 ml-1">improvement</span>
                </div>
            )}
        </div>
    );

    const navigation = [
        { name: 'Dashboard', icon: <HomeIcon /> },
        { name: 'My Courses', icon: <BookOpenIcon /> },
        { name: 'Learning Center', icon: <GraduationCapIcon /> },
        { name: 'Assignments', icon: <FileTextIcon /> },
        { name: 'Submit Work', icon: <UploadCloudIcon /> },
        { name: 'My Grades', icon: <BarChartIcon /> },
        { name: 'Progress', icon: <TargetIcon /> },
        { name: 'Calendar', icon: <CalendarIcon /> },
        { name: 'Notifications', icon: <BellIcon /> },
        { name: 'Settings', icon: <SettingsIcon /> }
    ];

    // --- Assignment Deadline Reminders Bar ---
    const renderDeadlineReminders = () => {
        if (!deadlineReminders || !Array.isArray(deadlineReminders) || deadlineReminders.length === 0) return null;
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded">
                <strong>Upcoming Deadlines:</strong>
                <ul className="list-disc ml-6 mt-2">
                    {deadlineReminders.map(a => (
                        <li key={a.id}>
                            <span className="font-semibold">{a.title}</span> for <span className="italic">{courses.find(c => c.id === a.courseId)?.title || 'Course'}</span> due on <span className="font-bold">{new Date(a.dueDate).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (selectedCourse) {
        return (
            <div className="flex">
                <Sidebar navigation={[]} onLogout={onLogout} activeTab={''} setActiveTab={() => {}} />
                 <main className="flex-1 lg:pl-64"><Header title={selectedCourse.title} /><div className="p-4 sm:p-6 lg:p-8"><CourseDetailPage course={selectedCourse} onBack={() => setSelectedCourse(null)} /></div></main>
            </div>
        );
    }
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': 
                return (
                    <DashboardView 
                        courses={courses} 
                        onCourseSelect={setSelectedCourse}
                        studentStats={studentStats}
                        assignments={assignments}
                        submissions={submissions}
                        currentUser={currentUser}
                    />
                );
            case 'My Courses': 
                return <MyCoursesPage courses={courses} onCourseSelect={setSelectedCourse} />;
            case 'Learning Center':
                return (
                    <LearningCenter
                        courses={courses}
                        assignments={assignments}
                        submissions={submissions}
                        userRole="student"
                        userId={currentUser?.id}
                    />
                );
            case 'Assignments': 
                return <AssignmentsPage {...props} />;
            case 'Submit Work':
                return (
                    <StudentAssignmentUpload
                        assignments={assignments}
                        courses={courses}
                        userId={currentUser?.id}
                        onSubmission={addSubmission}
                    />
                );
            case 'My Grades': 
                return <GradesPage {...props} />;
            case 'Progress':
                return (
                    <StudentProgress
                        courses={courses}
                        assignments={assignments}
                        submissions={submissions.filter(s => s.studentId === currentUser?.id)}
                        userId={currentUser?.id}
                    />
                );
            case 'Calendar':
                return (
                    <Calendar
                        assignments={assignments}
                        courses={courses}
                        userRole="student"
                        userId={currentUser?.id}
                    />
                );
            case 'Notifications':
                return (
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Notifications</h2>
                        <NotificationCenter 
                            userId={currentUser?.id}
                            userRole="student"
                            courses={courses}
                            assignments={assignments}
                            submissions={submissions}
                        />
                    </div>
                );
            case 'Grade Analysis': 
                return <StudentGradeAnalysis 
                    assignments={assignments}
                    submissions={submissions}
                    courses={courses}
                    currentUser={currentUser}
                    deadlineReminders={deadlineReminders}
                />;
            case 'Settings': 
                return <SettingsPage />;
            default: 
                return <DashboardView courses={courses} onCourseSelect={setSelectedCourse} />;
        }
    };

    // FAB Actions for Quick Tasks
    const fabActions = [
        {
            label: 'Submit Assignment',
            icon: <UploadCloudIcon className="h-5 w-5" />,
            color: 'bg-green-500 hover:bg-green-600',
            onClick: () => {
                setActiveTab('Submit Work');
                toast.info('Navigate to Submit Work section');
            }
        },
        {
            label: 'View Grades',
            icon: <BarChartIcon className="h-5 w-5" />,
            color: 'bg-purple-500 hover:bg-purple-600',
            onClick: () => {
                setActiveTab('My Grades');
                toast.info('Navigate to Grades section');
            }
        },
        {
            label: 'Study Materials',
            icon: <BookOpenIcon className="h-5 w-5" />,
            color: 'bg-blue-500 hover:bg-blue-600',
            onClick: () => {
                setActiveTab('Learning Center');
                toast.info('Navigate to Learning Center');
            }
        }
    ];

    return (
        <div className="flex">
            <Sidebar navigation={navigation} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 lg:pl-64">
                <Header title={activeTab} subtitle={`Welcome back, ${currentUser?.name || 'Student'}`} />
                <div className="p-4 sm:p-6 lg:p-8">
                    {renderDeadlineReminders()}
                    {renderContent()}
                </div>
            </main>
            
            {/* Floating Action Button */}
            <FloatingActionButton 
                actions={fabActions}
                position="bottom-right"
            />
        </div>
    );
};

export default StudentDashboard;
