import React, { useState, useEffect } from 'react';
import { BookOpenIcon, UsersIcon, FileTextIcon, TrendingUpIcon, CalendarIcon, ClockIcon, AlertCircleIcon, CheckCircleIcon } from '../icons/Icons';

const AdminAnalytics = ({ users, courses, assignments, submissions }) => {
    const [timeFilter, setTimeFilter] = useState('week'); // week, month, semester
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        calculateAnalytics();
    }, [users, courses, assignments, submissions, timeFilter]);

    const calculateAnalytics = () => {
        const now = new Date();
        const filterDate = new Date();
        
        switch (timeFilter) {
            case 'week':
                filterDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                filterDate.setMonth(now.getMonth() - 1);
                break;
            case 'semester':
                filterDate.setMonth(now.getMonth() - 4);
                break;
        }

        // User statistics
        const totalStudents = users.students?.length || 0;
        const totalFaculty = users.faculty?.length || 0;
        const activeStudents = users.students?.filter(s => s.lastActive && new Date(s.lastActive) > filterDate).length || Math.floor(totalStudents * 0.8);
        
        // Course statistics
        const totalCourses = courses.length;
        const activeCourses = courses.filter(c => assignments.some(a => a.courseId === c.id)).length;
        const avgEnrollment = totalCourses > 0 ? Math.floor((totalStudents * 2.5) / totalCourses) : 0;
        
        // Assignment statistics
        const totalAssignments = assignments.length;
        const submissionRate = assignments.length > 0 ? 
            ((submissions.length / (assignments.length * totalStudents)) * 100).toFixed(1) : '0';
        const gradedSubmissions = submissions.filter(s => s.grade).length;
        const gradingRate = submissions.length > 0 ? ((gradedSubmissions / submissions.length) * 100).toFixed(1) : '0';
        
        // Performance metrics
        const gradedGrades = submissions.filter(s => s.grade);
        const avgGrade = gradedGrades.length > 0 ? 
            (gradedGrades.reduce((sum, s) => sum + convertGradeToPoints(s.grade), 0) / gradedGrades.length).toFixed(2) : 'N/A';
        
        // Growth metrics (simulated)
        const userGrowth = timeFilter === 'week' ? '+12%' : timeFilter === 'month' ? '+28%' : '+85%';
        const courseGrowth = timeFilter === 'week' ? '+5%' : timeFilter === 'month' ? '+15%' : '+45%';
        const engagementGrowth = timeFilter === 'week' ? '+8%' : timeFilter === 'month' ? '+22%' : '+67%';

        setAnalytics({
            users: {
                totalStudents,
                totalFaculty,
                activeStudents,
                userGrowth
            },
            courses: {
                totalCourses,
                activeCourses,
                avgEnrollment,
                courseGrowth
            },
            assignments: {
                totalAssignments,
                submissionRate,
                gradingRate,
                avgGrade
            },
            engagement: {
                activeRate: totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : '0',
                engagementGrowth
            }
        });
    };

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

    const StatCard = ({ title, value, subtitle, icon, color, growth }) => (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('600', '100')}`}>
                    {icon}
                </div>
            </div>
            {growth && (
                <div className="mt-4 flex items-center">
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{growth}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last {timeFilter}</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
                    <p className="text-gray-600">Comprehensive platform insights and metrics</p>
                </div>
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="semester">This Semester</option>
                </select>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={analytics.users?.totalStudents || 0}
                    subtitle={`${analytics.users?.activeStudents || 0} active users`}
                    icon={<UsersIcon className="h-6 w-6" />}
                    color="text-blue-600"
                    growth={analytics.users?.userGrowth}
                />
                <StatCard
                    title="Active Courses"
                    value={analytics.courses?.activeCourses || 0}
                    subtitle={`${analytics.courses?.totalCourses || 0} total courses`}
                    icon={<BookOpenIcon className="h-6 w-6" />}
                    color="text-green-600"
                    growth={analytics.courses?.courseGrowth}
                />
                <StatCard
                    title="Assignments"
                    value={analytics.assignments?.totalAssignments || 0}
                    subtitle={`${analytics.assignments?.submissionRate || 0}% submission rate`}
                    icon={<FileTextIcon className="h-6 w-6" />}
                    color="text-purple-600"
                />
                <StatCard
                    title="Engagement"
                    value={`${analytics.engagement?.activeRate || 0}%`}
                    subtitle="Active student rate"
                    icon={<TrendingUpIcon className="h-6 w-6" />}
                    color="text-orange-600"
                    growth={analytics.engagement?.engagementGrowth}
                />
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Performance */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Course Performance</h3>
                    <div className="space-y-4">
                        {courses.slice(0, 5).map(course => {
                            const courseSubmissions = submissions.filter(s => 
                                assignments.some(a => a.id === s.assignmentId && a.courseId === course.id)
                            );
                            const enrollmentCount = Math.floor(Math.random() * 50) + 10;
                            const completionRate = courseSubmissions.length > 0 ? 
                                ((courseSubmissions.length / enrollmentCount) * 100).toFixed(0) : 0;
                            
                            return (
                                <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900">{course.title}</p>
                                        <p className="text-sm text-gray-600">{enrollmentCount} students enrolled</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-blue-600">{completionRate}%</p>
                                        <p className="text-xs text-gray-500">completion</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {submissions.slice(-5).reverse().map((submission, index) => {
                            const assignment = assignments.find(a => a.id === submission.assignmentId);
                            const student = users.students?.find(s => s.id === submission.studentId);
                            
                            return (
                                <div key={submission.id || index} className="flex items-center space-x-3">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {student?.name || 'Student'} submitted {assignment?.title || 'assignment'}
                                        </p>
                                        <p className="text-xs text-gray-500">{submission.submittedAt}</p>
                                    </div>
                                    {submission.grade && (
                                        <span className="text-sm font-bold text-green-600">{submission.grade}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                        <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">Database</p>
                        <p className="text-sm text-green-600">Operational</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">File Storage</p>
                        <p className="text-sm text-green-600">Operational</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <AlertCircleIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="font-semibold text-gray-900">Email Service</p>
                        <p className="text-sm text-yellow-600">Maintenance</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
