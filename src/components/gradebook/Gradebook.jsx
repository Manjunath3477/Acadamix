import React, { useState, useMemo } from 'react';
import { FileTextIcon, UsersIcon, BookOpenIcon, DownloadIcon, FilterIcon, SortAscIcon, SortDescIcon, SearchIcon, CalculatorIcon } from '../icons/Icons';

const Gradebook = ({ 
    courses, 
    assignments, 
    submissions, 
    users, 
    currentUser, 
    gradeSubmission,
    openModal,
    closeModal 
}) => {
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterBy, setFilterBy] = useState('all'); // all, graded, ungraded, late
    const [viewMode, setViewMode] = useState('detailed'); // detailed, summary

    // Filter courses for faculty
    const facultyCourses = courses.filter(course => course.faculty === currentUser.name);
    const selectedCourseData = selectedCourse === 'all' ? null : facultyCourses.find(c => c.id === parseInt(selectedCourse));

    // Get relevant assignments
    const relevantAssignments = selectedCourse === 'all' 
        ? assignments.filter(a => facultyCourses.some(c => c.id === a.courseId))
        : assignments.filter(a => a.courseId === parseInt(selectedCourse));

    // Get students enrolled in relevant courses
    const enrolledStudents = useMemo(() => {
        // For now, return all students - in a real app, you'd have enrollment data
        return users.students || [];
    }, [users, selectedCourse]);

    // Calculate gradebook data
    const gradebookData = useMemo(() => {
        return enrolledStudents.map(student => {
            const studentSubmissions = submissions.filter(s => s.studentId === student.id);
            const grades = relevantAssignments.map(assignment => {
                const submission = studentSubmissions.find(s => s.assignmentId === assignment.id);
                return {
                    assignmentId: assignment.id,
                    assignmentTitle: assignment.title,
                    courseId: assignment.courseId,
                    courseName: courses.find(c => c.id === assignment.courseId)?.title || 'Unknown',
                    dueDate: assignment.dueDate,
                    submitted: !!submission,
                    submittedAt: submission?.submittedAt,
                    grade: submission?.grade,
                    feedback: submission?.feedback,
                    isLate: submission ? new Date(submission.submittedAt) > new Date(assignment.dueDate) : false,
                    submissionId: submission?.id
                };
            });

            // Calculate GPA (convert letter grades to numbers)
            const gradePoints = grades
                .filter(g => g.grade)
                .map(g => convertGradeToPoints(g.grade));
            
            const gpa = gradePoints.length > 0 
                ? (gradePoints.reduce((sum, points) => sum + points, 0) / gradePoints.length).toFixed(2)
                : 'N/A';

            const completedAssignments = grades.filter(g => g.submitted).length;
            const totalAssignments = grades.length;
            const completionRate = totalAssignments > 0 ? ((completedAssignments / totalAssignments) * 100).toFixed(1) : '0';

            return {
                student,
                grades,
                gpa,
                completionRate,
                completedAssignments,
                totalAssignments
            };
        });
    }, [enrolledStudents, relevantAssignments, submissions, courses]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = gradebookData.filter(item => {
            const matchesSearch = item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.student.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (!matchesSearch) return false;

            switch (filterBy) {
                case 'graded':
                    return item.grades.some(g => g.grade);
                case 'ungraded':
                    return item.grades.some(g => g.submitted && !g.grade);
                case 'late':
                    return item.grades.some(g => g.isLate);
                default:
                    return true;
            }
        });

        // Sort data
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy) {
                case 'name':
                    aVal = a.student.name;
                    bVal = b.student.name;
                    break;
                case 'gpa':
                    aVal = parseFloat(a.gpa) || 0;
                    bVal = parseFloat(b.gpa) || 0;
                    break;
                case 'completion':
                    aVal = parseFloat(a.completionRate);
                    bVal = parseFloat(b.completionRate);
                    break;
                default:
                    aVal = a.student.name;
                    bVal = b.student.name;
            }

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [gradebookData, searchTerm, filterBy, sortBy, sortOrder]);

    // Helper functions
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

    function getGradeColor(grade) {
        if (!grade) return 'text-gray-400';
        const points = convertGradeToPoints(grade);
        if (points >= 3.7) return 'text-green-600';
        if (points >= 3.0) return 'text-blue-600';
        if (points >= 2.0) return 'text-yellow-600';
        return 'text-red-600';
    }

    const handleQuickGrade = (submissionId, currentGrade) => {
        openModal('Quick Grade', 
            <QuickGradeForm 
                submissionId={submissionId}
                currentGrade={currentGrade}
                onSave={(grade, feedback) => {
                    gradeSubmission(submissionId, grade, feedback);
                    closeModal();
                }}
                onCancel={closeModal}
            />
        );
    };

    const exportGradebook = () => {
        // Create CSV content
        const headers = ['Student Name', 'Email', 'GPA', 'Completion Rate', ...relevantAssignments.map(a => a.title)];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(item => [
                item.student.name,
                item.student.email || '',
                item.gpa,
                `${item.completionRate}%`,
                ...item.grades.map(g => g.grade || 'Not Submitted')
            ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `gradebook_${selectedCourseData?.title || 'all_courses'}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gradebook</h2>
                    <p className="text-gray-600">Manage grades and track student progress</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={exportGradebook}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700"
                    >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Course Filter */}
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

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Students</option>
                            <option value="graded">Has Grades</option>
                            <option value="ungraded">Needs Grading</option>
                            <option value="late">Late Submissions</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="name">Name</option>
                                <option value="gpa">GPA</option>
                                <option value="completion">Completion</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                {sortOrder === 'asc' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <UsersIcon className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <FileTextIcon className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Assignments</p>
                            <p className="text-2xl font-bold text-gray-900">{relevantAssignments.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <CalculatorIcon className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg GPA</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredData.length > 0 
                                    ? (filteredData.reduce((sum, item) => sum + (parseFloat(item.gpa) || 0), 0) / filteredData.length).toFixed(2)
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <BookOpenIcon className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredData.length > 0 
                                    ? (filteredData.reduce((sum, item) => sum + parseFloat(item.completionRate), 0) / filteredData.length).toFixed(1) + '%'
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradebook Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 sticky left-0 bg-gray-50 z-10">Student</th>
                                <th className="p-4 font-semibold text-gray-600">GPA</th>
                                <th className="p-4 font-semibold text-gray-600">Completion</th>
                                {relevantAssignments.map(assignment => (
                                    <th key={assignment.id} className="p-4 font-semibold text-gray-600 min-w-32">
                                        <div className="text-sm">
                                            {assignment.title}
                                            <div className="text-xs text-gray-400 font-normal">
                                                {courses.find(c => c.id === assignment.courseId)?.title}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map(item => (
                                <tr key={item.student.id} className="hover:bg-gray-50">
                                    <td className="p-4 sticky left-0 bg-white z-10">
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.student.name}</p>
                                            <p className="text-sm text-gray-500">{item.student.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`font-bold text-lg ${getGradeColor(item.gpa)}`}>
                                            {item.gpa}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${item.completionRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {item.completedAssignments}/{item.totalAssignments}
                                            </span>
                                        </div>
                                    </td>
                                    {item.grades.map(grade => (
                                        <td key={grade.assignmentId} className="p-4">
                                            <div className="text-center">
                                                {grade.submitted ? (
                                                    <div>
                                                        <button
                                                            onClick={() => handleQuickGrade(grade.submissionId, grade.grade)}
                                                            className={`font-semibold px-2 py-1 rounded text-sm ${
                                                                grade.grade ? getGradeColor(grade.grade) + ' hover:bg-gray-100' : 'text-orange-600 bg-orange-100 hover:bg-orange-200'
                                                            }`}
                                                        >
                                                            {grade.grade || 'Grade'}
                                                        </button>
                                                        {grade.isLate && (
                                                            <div className="text-xs text-red-500 mt-1">Late</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Not Submitted</span>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-12">
                    <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No students found</p>
                    <p className="text-gray-400">Try adjusting your filters or search terms</p>
                </div>
            )}
        </div>
    );
};

// Quick Grade Form Component
const QuickGradeForm = ({ submissionId, currentGrade, onSave, onCancel }) => {
    const [grade, setGrade] = useState(currentGrade || '');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(grade, feedback);
    };

    const quickGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {quickGrades.map(quickGrade => (
                        <button
                            key={quickGrade}
                            type="button"
                            onClick={() => setGrade(quickGrade)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                grade === quickGrade 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {quickGrade}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Or enter custom grade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
                <textarea
                    rows="3"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add feedback for the student..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                    Save Grade
                </button>
            </div>
        </form>
    );
};

export default Gradebook;
