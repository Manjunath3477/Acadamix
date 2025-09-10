import React, { useState, useMemo } from 'react';
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, FileTextIcon, UsersIcon, BookOpenIcon } from '../icons/Icons';

const AssignmentTracker = ({
    assignments,
    submissions,
    courses,
    users,
    currentUser,
    gradeSubmission,
    openModal,
    closeModal
}) => {
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all'); // all, submitted, pending, overdue, graded
    const [sortBy, setSortBy] = useState('dueDate'); // dueDate, title, status, grade

    // Filter assignments by faculty's courses
    const facultyCourses = courses.filter(course => course.faculty === currentUser.name);
    const relevantAssignments = selectedCourse === 'all' 
        ? assignments.filter(a => facultyCourses.some(c => c.id === a.courseId))
        : assignments.filter(a => a.courseId === parseInt(selectedCourse));

    // Process assignment data with submission statistics
    const assignmentData = useMemo(() => {
        return relevantAssignments.map(assignment => {
            const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
            const course = courses.find(c => c.id === assignment.courseId);
            
            // Get enrolled students (simplified - in real app you'd have enrollment data)
            const enrolledStudents = users.students || [];
            const totalStudents = enrolledStudents.length;
            
            const submittedCount = assignmentSubmissions.length;
            const gradedCount = assignmentSubmissions.filter(s => s.grade).length;
            const lateCount = assignmentSubmissions.filter(s => 
                new Date(s.submittedAt) > new Date(assignment.dueDate)
            ).length;
            
            const daysUntilDue = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;
            const isUpcoming = daysUntilDue >= 0 && daysUntilDue <= 7;
            
            let status = 'active';
            if (isOverdue && submittedCount < totalStudents) status = 'overdue';
            else if (gradedCount === submittedCount && submittedCount === totalStudents) status = 'completed';
            else if (isUpcoming) status = 'upcoming';
            
            const completionRate = totalStudents > 0 ? ((submittedCount / totalStudents) * 100).toFixed(1) : '0';
            const gradingRate = submittedCount > 0 ? ((gradedCount / submittedCount) * 100).toFixed(1) : '0';
            
            // Calculate average grade
            const gradedSubmissions = assignmentSubmissions.filter(s => s.grade);
            const averageGrade = gradedSubmissions.length > 0 
                ? (gradedSubmissions.reduce((sum, s) => sum + convertGradeToPoints(s.grade), 0) / gradedSubmissions.length).toFixed(2)
                : 'N/A';

            return {
                assignment,
                course,
                submissions: assignmentSubmissions,
                stats: {
                    totalStudents,
                    submittedCount,
                    gradedCount,
                    lateCount,
                    completionRate,
                    gradingRate,
                    averageGrade
                },
                status,
                daysUntilDue,
                isOverdue,
                isUpcoming
            };
        });
    }, [relevantAssignments, submissions, courses, users]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = assignmentData.filter(item => {
            switch (statusFilter) {
                case 'submitted':
                    return item.stats.submittedCount > 0;
                case 'pending':
                    return item.stats.submittedCount < item.stats.totalStudents;
                case 'overdue':
                    return item.isOverdue;
                case 'graded':
                    return item.stats.gradedCount > 0;
                default:
                    return true;
            }
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.assignment.dueDate) - new Date(b.assignment.dueDate);
                case 'title':
                    return a.assignment.title.localeCompare(b.assignment.title);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'grade':
                    return parseFloat(b.stats.averageGrade) - parseFloat(a.stats.averageGrade);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [assignmentData, statusFilter, sortBy]);

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

    function getStatusColor(status) {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'overdue': return 'text-red-600 bg-red-100';
            case 'upcoming': return 'text-orange-600 bg-orange-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    }

    function getStatusIcon(status) {
        switch (status) {
            case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
            case 'overdue': return <XCircleIcon className="h-4 w-4" />;
            case 'upcoming': return <AlertTriangleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    }

    const handleViewSubmissions = (assignmentItem) => {
        openModal(`Submissions for "${assignmentItem.assignment.title}"`,
            <SubmissionDetailView 
                assignment={assignmentItem.assignment}
                submissions={assignmentItem.submissions}
                students={users.students || []}
                onGrade={gradeSubmission}
                onClose={closeModal}
            />
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Assignment Tracker</h2>
                    <p className="text-gray-600">Monitor assignment progress and student submissions</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All My Courses</option>
                            {facultyCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Assignments</option>
                            <option value="submitted">Has Submissions</option>
                            <option value="pending">Pending Submissions</option>
                            <option value="overdue">Overdue</option>
                            <option value="graded">Graded</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="dueDate">Due Date</option>
                            <option value="title">Title</option>
                            <option value="status">Status</option>
                            <option value="grade">Average Grade</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Assignment Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map(item => (
                    <div key={item.assignment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.assignment.title}</h3>
                                    <p className="text-sm text-gray-600">{item.course?.title}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
                                    {getStatusIcon(item.status)}
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center mb-4 text-sm text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span>Due: {item.assignment.dueDate}</span>
                                {item.daysUntilDue > 0 && (
                                    <span className="ml-2 text-orange-600">({item.daysUntilDue} days remaining)</span>
                                )}
                                {item.isOverdue && (
                                    <span className="ml-2 text-red-600">(Overdue)</span>
                                )}
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{item.stats.submittedCount}</p>
                                    <p className="text-xs text-gray-600">Submitted</p>
                                    <p className="text-xs text-gray-500">{item.stats.completionRate}% complete</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{item.stats.gradedCount}</p>
                                    <p className="text-xs text-gray-600">Graded</p>
                                    <p className="text-xs text-gray-500">{item.stats.gradingRate}% graded</p>
                                </div>
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-2 mb-4">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Submission Progress</span>
                                        <span>{item.stats.submittedCount}/{item.stats.totalStudents}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${item.stats.completionRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Grading Progress</span>
                                        <span>{item.stats.gradedCount}/{item.stats.submittedCount}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${item.stats.gradingRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                                <span>Average Grade: <span className="font-semibold">{item.stats.averageGrade}</span></span>
                                {item.stats.lateCount > 0 && (
                                    <span className="text-orange-600">Late: {item.stats.lateCount}</span>
                                )}
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => handleViewSubmissions(item)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                View Submissions ({item.stats.submittedCount})
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <FileTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No assignments found</p>
                    <p className="text-gray-400">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

// Submission Detail View Component
const SubmissionDetailView = ({ assignment, submissions, students, onGrade, onClose }) => {
    const getStudentName = (studentId) => students.find(s => s.id === studentId)?.name || 'Unknown Student';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                <p className="text-gray-600">Due: {assignment.dueDate}</p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {submissions.length > 0 ? submissions.map(submission => (
                    <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-900">{getStudentName(submission.studentId)}</h4>
                                <p className="text-sm text-gray-600">Submitted: {submission.submittedAt}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-bold ${submission.grade ? 'text-green-600' : 'text-gray-400'}`}>
                                    {submission.grade || 'Not Graded'}
                                </span>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 italic">"{submission.content}"</p>
                        
                        {submission.feedback && (
                            <div className="bg-blue-50 p-3 rounded mb-3">
                                <p className="text-sm font-medium text-blue-800">Feedback:</p>
                                <p className="text-sm text-blue-700">{submission.feedback}</p>
                            </div>
                        )}
                        
                        <button
                            onClick={() => {
                                const grade = prompt('Enter grade:', submission.grade || '');
                                const feedback = prompt('Enter feedback:', submission.feedback || '');
                                if (grade) onGrade(submission.id, grade, feedback);
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                            {submission.grade ? 'Update Grade' : 'Grade Submission'}
                        </button>
                    </div>
                )) : (
                    <p className="text-gray-500 text-center py-8">No submissions yet</p>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AssignmentTracker;
