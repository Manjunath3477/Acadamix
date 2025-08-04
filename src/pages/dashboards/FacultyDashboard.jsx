import React, { useState, useContext } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/common/Header';
import CourseCard from '../../components/common/CourseCard';
import { AuthContext } from '../../context/AuthContext';
import { HomeIcon, BookOpenIcon, FileTextIcon, BarChartIcon, PlusCircleIcon, SettingsIcon } from '../../components/icons/Icons';

// --- MODAL CONTENT COMPONENTS ---
const CreateCourseForm = ({ onCancel, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSave({ title, description }); };
    return (<form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700">Course Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div><div><label className="block text-sm font-medium text-gray-700">Course Description</label><textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea></div><div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Create Course</button></div></form>);
};
const CreateAssignmentForm = ({ onCancel, onSave, facultyCourses }) => {
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState(facultyCourses[0]?.id || '');
    const [dueDate, setDueDate] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSave({ title, courseId: parseInt(courseId), dueDate }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Assignment Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Course</label><select value={courseId} onChange={e => setCourseId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">{facultyCourses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Create Assignment</button></div>
        </form>
    );
};
const GradeSubmissionForm = ({ onCancel, onSave }) => {
    const [grade, setGrade] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSave(grade); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Grade (e.g., A+, B, C-)</label><input type="text" value={grade} onChange={e => setGrade(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Submit Grade</button></div>
        </form>
    );
};

// --- VIEW COMPONENTS ---
const SubmissionsView = ({ assignment, submissions, users, onBack, openModal, closeModal, gradeSubmission }) => {
    const getStudentName = (studentId) => users.find(u => u.id === studentId)?.name || 'Unknown Student';
    const handleGrade = (submission) => { openModal(`Grade Submission for ${getStudentName(submission.studentId)}`, <GradeSubmissionForm onCancel={closeModal} onSave={(grade) => { gradeSubmission(submission.id, grade); closeModal(); }} />); };
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-6">&larr; Back to Assignments</button>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Submissions for "{assignment.title}"</h3>
                <ul className="divide-y divide-gray-200">{submissions.length > 0 ? submissions.map(sub => (<li key={sub.id} className="py-4 flex items-center justify-between"><div><p className="font-semibold">{getStudentName(sub.studentId)}</p><p className="text-sm text-gray-500">Submitted on: {sub.submittedAt}</p><p className="text-sm mt-2 text-gray-700 italic">"{sub.content}"</p></div><div className="flex items-center space-x-4"><span className="font-bold text-lg text-blue-600">{sub.grade || 'Not Graded'}</span><button onClick={() => handleGrade(sub)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">{sub.grade ? 'Regrade' : 'Grade'}</button></div></li>)) : <p className="text-gray-500">No submissions yet.</p>}</ul>
            </div>
        </div>
    );
};

const FacultyAssignmentsView = ({ assignments, courses, openModal, closeModal, addAssignment, setSelectedAssignment }) => {
    const handleCreateAssignment = () => { openModal('Create New Assignment', <CreateAssignmentForm onCancel={closeModal} onSave={(data) => { addAssignment(data); closeModal(); }} facultyCourses={courses} />); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold text-gray-800">Manage Assignments</h2><button onClick={handleCreateAssignment} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"><PlusCircleIcon className="h-5 w-5 mr-2" /> Create New</button></div>
            <div className="bg-white p-6 rounded-xl shadow-md"><ul className="divide-y divide-gray-200">{assignments.map(a => (<li key={a.id} className="py-4 flex items-center justify-between"><div><p className="font-semibold text-lg">{a.title}</p><p className="text-sm text-gray-500">{courses.find(c => c.id === a.courseId)?.title}</p></div><button onClick={() => setSelectedAssignment(a)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-300">View Submissions</button></li>))}</ul></div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
const FacultyDashboard = ({ onLogout, openModal, closeModal, courses, assignments, submissions, users, addCourse, addAssignment, gradeSubmission, currentUser }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const facultyCourses = courses.filter(course => course.faculty === currentUser.name);

    if (selectedAssignment) {
        return (
            <div className="flex">
                <Sidebar navigation={[]} onLogout={onLogout} activeTab={''} setActiveTab={() => {}} />
                 <main className="flex-1 lg:pl-64">
                    <Header title={`Submissions for ${selectedAssignment.title}`} />
                    <div className="p-4 sm:p-6 lg:p-8">
                        <SubmissionsView assignment={selectedAssignment} submissions={submissions.filter(s => s.assignmentId === selectedAssignment.id)} users={users.students} onBack={() => setSelectedAssignment(null)} {...{ openModal, closeModal, gradeSubmission }} />
                    </div>
                </main>
            </div>
        );
    }
    
    const navigation = [
        { name: 'Dashboard', icon: <HomeIcon /> }, { name: 'My Courses', icon: <BookOpenIcon /> },
        { name: 'Assignments', icon: <FileTextIcon /> }, { name: 'Gradebook', icon: <BarChartIcon /> },
        { name: 'Settings', icon: <SettingsIcon /> },
    ];

    const handleCreateCourse = () => {
        openModal('Create New Course', <CreateCourseForm onCancel={closeModal} onSave={(newCourseData) => { addCourse({ ...newCourseData, faculty: currentUser.name }); closeModal(); }} />);
    };
    
    return (
        <div className="flex">
            <Sidebar navigation={navigation} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 lg:pl-64">
                <Header title={activeTab} />
                <div className="p-4 sm:p-6 lg:p-8">
                    {activeTab === 'Assignments' && (
          <FacultyAssignmentsView
            assignments={assignments}
            courses={facultyCourses}
            openModal={openModal}
            closeModal={closeModal}
            addAssignment={addAssignment}
            setSelectedAssignment={setSelectedAssignment}
          />
        )}
                    {activeTab === 'Dashboard' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                                <button onClick={handleCreateCourse} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">
                                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                                    Create New Course
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {facultyCourses.length > 0 ? facultyCourses.map(course => <CourseCard key={course.id} course={course} role="faculty" />) : <p className="text-gray-500 md:col-span-2">You haven't created any courses yet.</p>}
                            </div>
                        </div>
                    )}
                    {activeTab === 'My Courses' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">Manage My Courses</h2><p className="mt-2 text-gray-600">A detailed list of all your courses would appear here.</p></div>}
                    {activeTab === 'Gradebook' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">Gradebook</h2><p className="mt-2 text-gray-600">A full gradebook for all your students would appear here.</p></div>}
                    {activeTab === 'Settings' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">Faculty Settings</h2><p className="mt-2 text-gray-600">Your personal settings would appear here.</p></div>}
                </div>
            </main>
        </div>
    );
};

export default FacultyDashboard;
