import React, { useState, useMemo } from 'react';
import { BookOpenIcon, FileTextIcon, TrendingUpIcon, TrendingDownIcon, TargetIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from '../icons/Icons';

const StudentGradeAnalysis = ({ 
    assignments, 
    submissions, 
    courses, 
    currentUser,
    deadlineReminders 
}) => {
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [timeFrame, setTimeFrame] = useState('all'); // all, month, semester

    // Get student's courses (assuming enrollment data)
    const studentCourses = courses; // In real app, filter by enrollment

    // Calculate grade analytics
    const gradeAnalytics = useMemo(() => {
        const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);
        
        let relevantAssignments = assignments;
        if (selectedCourse !== 'all') {
            relevantAssignments = assignments.filter(a => a.courseId === parseInt(selectedCourse));
        }

        const gradeData = relevantAssignments.map(assignment => {
            const submission = studentSubmissions.find(s => s.assignmentId === assignment.id);
            const course = courses.find(c => c.id === assignment.courseId);
            
            return {
                assignment,
                course,
                submission,
                grade: submission?.grade,
                submitted: !!submission,
                isLate: submission ? new Date(submission.submittedAt) > new Date(assignment.dueDate) : false,
                daysUntilDue: Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)),
                gradePoints: convertGradeToPoints(submission?.grade)
            };
        });

        // Calculate statistics
        const gradedAssignments = gradeData.filter(g => g.grade);
        const submittedCount = gradeData.filter(g => g.submitted).length;
        const lateCount = gradeData.filter(g => g.isLate).length;
        const upcomingCount = gradeData.filter(g => !g.submitted && g.daysUntilDue > 0 && g.daysUntilDue <= 7).length;
        const overdueCount = gradeData.filter(g => !g.submitted && g.daysUntilDue < 0).length;

        const totalPoints = gradedAssignments.reduce((sum, g) => sum + g.gradePoints, 0);
        const gpa = gradedAssignments.length > 0 ? (totalPoints / gradedAssignments.length).toFixed(2) : 'N/A';
        const completionRate = relevantAssignments.length > 0 ? ((submittedCount / relevantAssignments.length) * 100).toFixed(1) : '0';

        // Grade distribution
        const gradeDistribution = {
            'A': gradedAssignments.filter(g => g.gradePoints >= 3.7).length,
            'B': gradedAssignments.filter(g => g.gradePoints >= 3.0 && g.gradePoints < 3.7).length,
            'C': gradedAssignments.filter(g => g.gradePoints >= 2.0 && g.gradePoints < 3.0).length,
            'D': gradedAssignments.filter(g => g.gradePoints >= 1.0 && g.gradePoints < 2.0).length,
            'F': gradedAssignments.filter(g => g.gradePoints < 1.0).length
        };

        // Performance trend (last 5 assignments)
        const recentGrades = gradedAssignments
            .sort((a, b) => new Date(b.assignment.dueDate) - new Date(a.assignment.dueDate))
            .slice(0, 5)
            .reverse();

        let trend = 'stable';
        if (recentGrades.length >= 3) {
            const firstHalf = recentGrades.slice(0, Math.floor(recentGrades.length / 2));
            const secondHalf = recentGrades.slice(Math.floor(recentGrades.length / 2));
            
            const firstAvg = firstHalf.reduce((sum, g) => sum + g.gradePoints, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, g) => sum + g.gradePoints, 0) / secondHalf.length;
            
            if (secondAvg - firstAvg > 0.3) trend = 'improving';
            else if (firstAvg - secondAvg > 0.3) trend = 'declining';
        }

        return {
            gradeData,
            stats: {
                gpa,
                completionRate,
                submittedCount,
                totalAssignments: relevantAssignments.length,
                lateCount,
                upcomingCount,
                overdueCount,
                gradedCount: gradedAssignments.length
            },
            gradeDistribution,
            trend,
            recentGrades
        };
    }, [assignments, submissions, courses, currentUser, selectedCourse]);

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

    function getStatusColor(status) {
        switch (status) {
            case 'submitted': return 'text-green-600 bg-green-100';
            case 'late': return 'text-orange-600 bg-orange-100';
            case 'overdue': return 'text-red-600 bg-red-100';
            case 'upcoming': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    }

    const getAssignmentStatus = (gradeItem) => {
        if (gradeItem.submitted) {
            return gradeItem.isLate ? 'late' : 'submitted';
        } else if (gradeItem.daysUntilDue < 0) {
            return 'overdue';
        } else if (gradeItem.daysUntilDue <= 7) {
            return 'upcoming';
        }
        return 'pending';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Grade Analysis</h2>
                    <p className="text-gray-600">Track your academic performance and progress</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Courses</option>
                            {studentCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
                        <select
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="month">This Month</option>
                            <option value="semester">This Semester</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <TargetIcon className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Current GPA</p>
                            <p className={`text-2xl font-bold ${getGradeColor(gradeAnalytics.stats.gpa)}`}>
                                {gradeAnalytics.stats.gpa}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{gradeAnalytics.stats.completionRate}%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        {gradeAnalytics.trend === 'improving' ? (
                            <TrendingUpIcon className="h-8 w-8 text-green-500" />
                        ) : gradeAnalytics.trend === 'declining' ? (
                            <TrendingDownIcon className="h-8 w-8 text-red-500" />
                        ) : (
                            <TargetIcon className="h-8 w-8 text-blue-500" />
                        )}
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Performance Trend</p>
                            <p className={`text-lg font-bold capitalize ${
                                gradeAnalytics.trend === 'improving' ? 'text-green-600' :
                                gradeAnalytics.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                                {gradeAnalytics.trend}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <AlertCircleIcon className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {gradeAnalytics.stats.overdueCount + gradeAnalytics.stats.upcomingCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Grade Distribution</h3>
                <div className="grid grid-cols-5 gap-4">
                    {Object.entries(gradeAnalytics.gradeDistribution).map(([grade, count]) => (
                        <div key={grade} className="text-center">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg ${
                                grade === 'A' ? 'bg-green-500' :
                                grade === 'B' ? 'bg-blue-500' :
                                grade === 'C' ? 'bg-yellow-500' :
                                grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                            }`}>
                                {count}
                            </div>
                            <p className="mt-2 font-semibold text-gray-700">{grade} Grade</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Assignment Details */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Assignment Details</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Assignment</th>
                                <th className="p-4 font-semibold text-gray-600">Course</th>
                                <th className="p-4 font-semibold text-gray-600">Due Date</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {gradeAnalytics.gradeData.map(item => {
                                const status = getAssignmentStatus(item);
                                return (
                                    <tr key={item.assignment.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <FileTextIcon className="h-5 w-5 text-blue-500 mr-3" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.assignment.title}</p>
                                                    {item.submission?.feedback && (
                                                        <p className="text-sm text-gray-500 mt-1">"{item.submission.feedback}"</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-600">{item.course?.title}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-600">{item.assignment.dueDate}</span>
                                            {item.daysUntilDue > 0 && item.daysUntilDue <= 7 && (
                                                <p className="text-xs text-orange-600 mt-1">Due in {item.daysUntilDue} days</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-bold text-lg ${getGradeColor(item.grade)}`}>
                                                {item.grade || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {gradeAnalytics.gradeData.length === 0 && (
                <div className="text-center py-12">
                    <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No assignments found</p>
                    <p className="text-gray-400">Start by enrolling in courses and completing assignments</p>
                </div>
            )}
        </div>
    );
};

export default StudentGradeAnalysis;
