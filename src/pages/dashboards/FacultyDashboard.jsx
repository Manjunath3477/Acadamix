import React, { useState, useContext } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/common/Header';
import CourseCard from '../../components/common/CourseCard';
import Gradebook from '../../components/gradebook/Gradebook';
import AssignmentTracker from '../../components/gradebook/AssignmentTracker';
import FacultyGradeSubmission from '../../components/assignments/FacultyGradeSubmission';
import CourseManagement from '../../components/courses/CourseManagement';
import Calendar from '../../components/common/Calendar';
import NotificationCenter from '../../components/common/NotificationCenter';
import { AuthContext } from '../../context/AuthContext';
import { 
    HomeIcon, BookOpenIcon, FileTextIcon, BarChartIcon, PlusCircleIcon, 
    SettingsIcon, ClockIcon, CalendarIcon, BellIcon, UsersIcon, CheckCircleIcon,
    TrendingUpIcon, ChartBarIcon
} from '../../components/icons/Icons';

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
    const [feedback, setFeedback] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSave(grade, feedback); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Grade (e.g., A+, B, C-)</label><input type="text" value={grade} onChange={e => setGrade(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Feedback/Comments</label><textarea rows="3" value={feedback} onChange={e => setFeedback(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
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
const FacultyDashboard = ({ onLogout, openModal, closeModal, courses, assignments, submissions, users, addCourse, addAssignment, gradeSubmission, currentUser, editCourse, deleteCourse }) => {
    // Helper functions for editing and deleting courses
    const handleEditCourse = (course) => {
        openModal('Edit Course', <EditCourseForm course={course} onCancel={closeModal} onSave={async (updatedCourse) => {
            try {
                await editCourse(updatedCourse);
            } catch (err) {
                alert('Edit failed: ' + err.message);
                console.log('Edit error:', err);
            }
            closeModal();
        }} />);
    };
    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(courseId);
            } catch (err) {
                alert('Delete failed: ' + err.message);
                console.log('Delete error:', err);
            }
        }
    };

    // EditCourseForm component
    const EditCourseForm = ({ course, onCancel, onSave }) => {
        const [title, setTitle] = useState(course.title);
        const [description, setDescription] = useState(course.description);
        return (
            <form onSubmit={e => { e.preventDefault(); onSave({ ...course, title, description }); }} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700">Course Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Course Description</label><textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea></div>
                <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Save Changes</button></div>
            </form>
        );
    };
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // Show all courses to faculty, but highlight their own
    const facultyCourses = courses.filter(course => course.faculty === currentUser.name);
    const otherCourses = courses.filter(course => course.faculty !== currentUser.name);

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
        { name: 'Dashboard', icon: <HomeIcon /> }, 
        { name: 'Course Management', icon: <BookOpenIcon /> },
        { name: 'My Courses', icon: <BookOpenIcon /> },
        { name: 'Assignments', icon: <FileTextIcon /> }, 
        { name: 'Assignment Tracker', icon: <ClockIcon /> },
        { name: 'Gradebook', icon: <BarChartIcon /> },
        { name: 'Grading', icon: <CheckCircleIcon /> },
        { name: 'Calendar', icon: <CalendarIcon /> },
        { name: 'Notifications', icon: <BellIcon /> },
        { name: 'Settings', icon: <SettingsIcon /> },
    ];

    const handleCreateCourse = () => {
        openModal('Create New Course', <CreateCourseForm onCancel={closeModal} onSave={(newCourseData) => { addCourse({ ...newCourseData, faculty: currentUser.name }); closeModal(); }} />);
    };
    
    // Faculty Dashboard Stats
    const facultyStats = {
        totalCourses: facultyCourses.length,
        totalStudents: facultyCourses.reduce((sum, course) => sum + (course.students?.length || 10), 0),
        totalAssignments: assignments.filter(a => facultyCourses.some(c => c.id === a.courseId)).length,
        pendingGrades: submissions.filter(s => !s.grade && facultyCourses.some(c => c.id === assignments.find(a => a.id === s.assignmentId)?.courseId)).length,
        avgClassGrade: (submissions.filter(s => s.grade && facultyCourses.some(c => c.id === assignments.find(a => a.id === s.assignmentId)?.courseId)).reduce((sum, s) => {
            const gradeMap = {
                'A+': 4.0, 'A': 4.0, 'A-': 3.7,
                'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7,
                'D+': 1.3, 'D': 1.0, 'D-': 0.7,
                'F': 0.0
            };
            return sum + (gradeMap[s.grade] || 0);
        }, 0) / submissions.filter(s => s.grade && facultyCourses.some(c => c.id === assignments.find(a => a.id === s.assignmentId)?.courseId)).length || 0).toFixed(2)
    };

    const FacultyStatsCard = ({ title, value, subtitle, icon, color, trend }) => (
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
                    <span className="text-sm text-gray-500 ml-1">vs last week</span>
                </div>
            )}
        </div>
    );
    
    return (
        <div className="flex">
            <Sidebar navigation={navigation} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 lg:pl-64">
                <Header title={activeTab} />
                <div className="p-4 sm:p-6 lg:p-8">
                    {activeTab === 'Dashboard' && (
                        <div className="space-y-6">
                            {/* Enhanced Faculty Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <FacultyStatsCard
                                    title="My Courses"
                                    value={facultyStats.totalCourses}
                                    subtitle="Active courses"
                                    icon={<BookOpenIcon className="h-6 w-6" />}
                                    color="text-blue-600"
                                    trend="+2 this semester"
                                />
                                <FacultyStatsCard
                                    title="Total Students"
                                    value={facultyStats.totalStudents}
                                    subtitle="Across all courses"
                                    icon={<UsersIcon className="h-6 w-6" />}
                                    color="text-green-600"
                                    trend="+15%"
                                />
                                <FacultyStatsCard
                                    title="Assignments"
                                    value={facultyStats.totalAssignments}
                                    subtitle={`${facultyStats.pendingGrades} need grading`}
                                    icon={<FileTextIcon className="h-6 w-6" />}
                                    color="text-purple-600"
                                    trend="+3 this week"
                                />
                                <FacultyStatsCard
                                    title="Avg Class Grade"
                                    value={facultyStats.avgClassGrade}
                                    subtitle="Overall GPA"
                                    icon={<ChartBarIcon className="h-6 w-6" />}
                                    color="text-orange-600"
                                    trend="+0.1"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <button 
                                        onClick={() => setActiveTab('Course Management')}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <BookOpenIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Create Course</span>
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('Assignments')}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <FileTextIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <span className="text-sm font-medium">New Assignment</span>
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('Grading')}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <CheckCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Grade Work</span>
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('Calendar')}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <CalendarIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                        <span className="text-sm font-medium">View Calendar</span>
                                    </button>
                                </div>
                            </div>

                            {/* My Courses Grid */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">My Courses</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {facultyCourses.map(course => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onClick={() => console.log('Course clicked:', course.id)}
                                            onEdit={() => handleEditCourse(course)}
                                            onDelete={() => handleDeleteCourse(course.id)}
                                            showEditDelete={true}
                                        />
                                    ))}
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 cursor-pointer transition-colors"
                                         onClick={handleCreateCourse}>
                                        <PlusCircleIcon className="h-12 w-12 mb-2" />
                                        <span className="font-medium">Create New Course</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Course Management' && (
                        <CourseManagement
                            courses={facultyCourses}
                            setCourses={() => {}} // Kept for compatibility
                            addCourse={addCourse}
                            editCourse={editCourse}
                            deleteCourse={deleteCourse}
                            assignments={assignments.filter(a => facultyCourses.some(c => c.id === a.courseId))}
                            submissions={submissions}
                            users={users}
                            userRole="faculty"
                            userId={currentUser.id}
                        />
                    )}

                    {activeTab === 'My Courses' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
                                <button onClick={handleCreateCourse} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700">
                                    <PlusCircleIcon className="h-5 w-5 mr-2" /> Create New Course
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {facultyCourses.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onClick={() => console.log('Course clicked:', course.id)}
                                        onEdit={() => handleEditCourse(course)}
                                        onDelete={() => handleDeleteCourse(course.id)}
                                        showEditDelete={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Grading' && (
                        <FacultyGradeSubmission 
                            assignments={assignments.filter(a => facultyCourses.some(c => c.id === a.courseId))}
                            submissions={submissions}
                            courses={facultyCourses}
                            users={users}
                            onGradeSubmission={gradeSubmission}
                        />
                    )}

                    {activeTab === 'Calendar' && (
                        <Calendar
                            assignments={assignments.filter(a => facultyCourses.some(c => c.id === a.courseId))}
                            courses={facultyCourses}
                            userRole="faculty"
                            userId={currentUser.id}
                        />
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Faculty Notifications</h2>
                            <NotificationCenter 
                                userId={currentUser.id}
                                userRole="faculty"
                                courses={facultyCourses}
                                assignments={assignments.filter(a => facultyCourses.some(c => c.id === a.courseId))}
                                submissions={submissions}
                            />
                        </div>
                    )}

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
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-800">Other Courses</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {otherCourses.length > 0 ? otherCourses.map(course => <CourseCard key={course.id} course={course} role="faculty" />) : <p className="text-gray-500 md:col-span-2">No other courses available.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'My Courses' && (
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800">Manage My Courses</h2>
                            <p className="mt-2 text-gray-600">Edit or delete your courses below.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {facultyCourses.length > 0 ? facultyCourses.map(course => (
                                    <div key={course.id} className="border rounded-lg p-4 shadow">
                                        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                                        <p className="text-gray-600 mb-2">{course.description}</p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditCourse(course)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                                            <button onClick={() => handleDeleteCourse(course.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 md:col-span-2">You haven't created any courses yet.</p>}
                            </div>
                        </div>
                    )}
                    {activeTab === 'Assignment Tracker' && (
                        <AssignmentTracker 
                            assignments={assignments}
                            submissions={submissions}
                            courses={courses}
                            users={users}
                            currentUser={currentUser}
                            gradeSubmission={gradeSubmission}
                            openModal={openModal}
                            closeModal={closeModal}
                        />
                    )}
                    {activeTab === 'Gradebook' && (
                        <Gradebook 
                            courses={courses}
                            assignments={assignments}
                            submissions={submissions}
                            users={users}
                            currentUser={currentUser}
                            gradeSubmission={gradeSubmission}
                            openModal={openModal}
                            closeModal={closeModal}
                        />
                    )}
                    {activeTab === 'Settings' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">Faculty Settings</h2><p className="mt-2 text-gray-600">Your personal settings would appear here.</p></div>}
                </div>
            </main>
        </div>
    );
};

export default FacultyDashboard;
