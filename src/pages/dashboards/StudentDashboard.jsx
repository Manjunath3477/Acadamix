import React, { useState, useContext } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/common/Header';
import CourseCard from '../../components/common/CourseCard';
import { AuthContext } from '../../context/AuthContext';
import { HomeIcon, BookOpenIcon, FileTextIcon, GraduationCapIcon, SettingsIcon, PlayCircleIcon, CheckCircleIcon, ClockIcon, UploadCloudIcon } from '../../components/icons/Icons';

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
const DashboardView = ({ courses, onCourseSelect }) => (
    <><h2 className="text-2xl font-bold text-gray-800">Enrolled Courses</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{courses.map(course => <div key={course.id} onClick={() => onCourseSelect(course)} className="cursor-pointer"><CourseCard course={course} role="student" /></div>)}</div></>
);

const StudentDashboard = (props) => {
    const { onLogout, courses } = props;
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedCourse, setSelectedCourse] = useState(null);

    if (selectedCourse) {
        return (
            <div className="flex">
                <Sidebar navigation={[]} onLogout={onLogout} activeTab={''} setActiveTab={() => {}} />
                 <main className="flex-1 lg:pl-64"><Header title={selectedCourse.title} /><div className="p-4 sm:p-6 lg:p-8"><CourseDetailPage course={selectedCourse} onBack={() => setSelectedCourse(null)} /></div></main>
            </div>
        );
    }
    
    const navigation = [
        { name: 'Dashboard', icon: <HomeIcon /> }, { name: 'My Courses', icon: <BookOpenIcon /> },
        { name: 'Assignments & Quizzes', icon: <FileTextIcon /> }, { name: 'My Grades', icon: <GraduationCapIcon /> },
        { name: 'Settings', icon: <SettingsIcon /> },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'My Courses': return <MyCoursesPage courses={courses} onCourseSelect={setSelectedCourse} />;
            case 'Assignments & Quizzes': return <AssignmentsPage {...props} />;
            case 'My Grades': return <GradesPage {...props} />;
            case 'Settings': return <SettingsPage />;
            case 'Dashboard': 
            default: 
                return <DashboardView courses={courses} onCourseSelect={setSelectedCourse} />;
        }
    };

    return (
        <div className="flex">
            <Sidebar navigation={navigation} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 lg:pl-64">
                <Header title={activeTab} />
                <div className="p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
