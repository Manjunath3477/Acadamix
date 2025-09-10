import React, { useState, useEffect } from 'react';
import { 
    BookOpenIcon, TrendingUpIcon, TrendingDownIcon, CalendarIcon, 
    ClockIcon, AwardIcon, TargetIcon, ChartBarIcon, StarIcon,
    CheckCircleIcon, ExclamationTriangleIcon, ArrowUpIcon, ArrowDownIcon
} from '../icons/Icons';

const StudentProgress = ({ userId, courses, assignments, submissions, userProfile }) => {
    const [progressData, setProgressData] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState('semester'); // week, month, semester, year
    const [showGoals, setShowGoals] = useState(false);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        calculateProgress();
        loadGoals();
    }, [userId, courses, assignments, submissions, selectedPeriod]);

    const calculateProgress = () => {
        const enrolledCourses = courses.filter(course => 
            course.enrolledStudents?.includes(userId) || Math.random() > 0.3
        );

        const studentSubmissions = submissions.filter(s => s.studentId === userId);
        const studentAssignments = assignments.filter(a => 
            enrolledCourses.some(course => course.id === a.courseId)
        );

        // Overall GPA calculation
        const gradedSubmissions = studentSubmissions.filter(s => s.grade);
        const totalGradePoints = gradedSubmissions.reduce((sum, submission) => {
            return sum + convertGradeToPoints(submission.grade);
        }, 0);
        const overallGPA = gradedSubmissions.length > 0 ? 
            (totalGradePoints / gradedSubmissions.length).toFixed(2) : '0.00';

        // Course-wise progress
        const courseProgress = enrolledCourses.map(course => {
            const courseAssignments = studentAssignments.filter(a => a.courseId === course.id);
            const courseSubmissions = studentSubmissions.filter(s => 
                courseAssignments.some(a => a.id === s.assignmentId)
            );
            
            const completedAssignments = courseSubmissions.length;
            const totalAssignments = courseAssignments.length;
            const completionRate = totalAssignments > 0 ? 
                (completedAssignments / totalAssignments * 100).toFixed(1) : '0';
            
            const courseGradedSubmissions = courseSubmissions.filter(s => s.grade);
            const courseGPA = courseGradedSubmissions.length > 0 ? 
                (courseGradedSubmissions.reduce((sum, s) => sum + convertGradeToPoints(s.grade), 0) / courseGradedSubmissions.length).toFixed(2) : '0.00';
            
            return {
                ...course,
                completedAssignments,
                totalAssignments,
                completionRate: parseFloat(completionRate),
                gpa: parseFloat(courseGPA),
                trend: Math.random() > 0.5 ? 'up' : 'down', // Simulated trend
                lastActivity: generateLastActivity()
            };
        });

        // Upcoming deadlines
        const upcomingDeadlines = studentAssignments
            .filter(assignment => {
                const dueDate = new Date(assignment.dueDate);
                const now = new Date();
                const hasSubmission = studentSubmissions.some(s => s.assignmentId === assignment.id);
                return dueDate > now && !hasSubmission;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);

        // Performance metrics
        const performanceMetrics = {
            totalCredits: enrolledCourses.reduce((sum, course) => sum + (course.credits || 3), 0),
            completedCredits: enrolledCourses.reduce((sum, course) => {
                const progress = courseProgress.find(cp => cp.id === course.id);
                return sum + (progress?.completionRate > 70 ? (course.credits || 3) : 0);
            }, 0),
            averageGrade: overallGPA,
            studyStreak: Math.floor(Math.random() * 15) + 1, // Simulated
            totalStudyHours: Math.floor(Math.random() * 200) + 50, // Simulated
            assignmentsCompleted: studentSubmissions.length,
            assignmentsPending: studentAssignments.length - studentSubmissions.length
        };

        // Weekly activity (simulated)
        const weeklyActivity = Array.from({ length: 7 }, (_, i) => ({
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
            hours: Math.floor(Math.random() * 8) + 1,
            activities: Math.floor(Math.random() * 10) + 1
        }));

        // Grade distribution
        const gradeDistribution = {
            'A': gradedSubmissions.filter(s => ['A+', 'A', 'A-'].includes(s.grade)).length,
            'B': gradedSubmissions.filter(s => ['B+', 'B', 'B-'].includes(s.grade)).length,
            'C': gradedSubmissions.filter(s => ['C+', 'C', 'C-'].includes(s.grade)).length,
            'D': gradedSubmissions.filter(s => ['D+', 'D', 'D-'].includes(s.grade)).length,
            'F': gradedSubmissions.filter(s => s.grade === 'F').length
        };

        setProgressData({
            courseProgress,
            upcomingDeadlines,
            performanceMetrics,
            weeklyActivity,
            gradeDistribution,
            overallGPA: parseFloat(overallGPA)
        });
    };

    const loadGoals = () => {
        // Mock student goals - in real app, these would be stored in database
        setGoals([
            {
                id: '1',
                title: 'Maintain 3.5+ GPA',
                description: 'Keep GPA above 3.5 for scholarship eligibility',
                targetValue: 3.5,
                currentValue: progressData.overallGPA || 3.2,
                type: 'gpa',
                deadline: '2025-12-15',
                completed: false
            },
            {
                id: '2',
                title: 'Complete All Assignments On Time',
                description: 'Submit all assignments before deadline',
                targetValue: 100,
                currentValue: 85,
                type: 'completion',
                deadline: '2025-12-15',
                completed: false
            },
            {
                id: '3',
                title: 'Study 25 Hours Per Week',
                description: 'Maintain consistent study schedule',
                targetValue: 25,
                currentValue: 18,
                type: 'study_hours',
                deadline: '2025-09-30',
                completed: false
            }
        ]);
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

    function generateLastActivity() {
        const activities = [
            'Submitted assignment',
            'Attended lecture',
            'Participated in discussion',
            'Completed quiz',
            'Reviewed materials'
        ];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const hoursAgo = Math.floor(Math.random() * 48) + 1;
        return `${activity} ${hoursAgo}h ago`;
    }

    const getGradeColor = (gpa) => {
        if (gpa >= 3.7) return 'text-green-600';
        if (gpa >= 3.0) return 'text-blue-600';
        if (gpa >= 2.0) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getTrendIcon = (trend) => {
        return trend === 'up' ? 
            <TrendingUpIcon className="h-4 w-4 text-green-500" /> : 
            <TrendingDownIcon className="h-4 w-4 text-red-500" />;
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 70) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getDaysUntilDeadline = (dueDate) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Academic Progress</h2>
                    <p className="text-gray-600">Track your academic performance and goals</p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="semester">This Semester</option>
                        <option value="year">This Year</option>
                    </select>
                    <button
                        onClick={() => setShowGoals(!showGoals)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {showGoals ? 'Hide Goals' : 'View Goals'}
                    </button>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Overall GPA</p>
                            <p className={`text-3xl font-bold ${getGradeColor(progressData.overallGPA)}`}>
                                {progressData.overallGPA?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-blue-600">out of 4.00</p>
                        </div>
                        <AwardIcon className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Credits Progress</p>
                            <p className="text-3xl font-bold text-green-600">
                                {progressData.performanceMetrics?.completedCredits || 0}
                            </p>
                            <p className="text-sm text-green-600">
                                of {progressData.performanceMetrics?.totalCredits || 0} credits
                            </p>
                        </div>
                        <BookOpenIcon className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Study Streak</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {progressData.performanceMetrics?.studyStreak || 0}
                            </p>
                            <p className="text-sm text-purple-600">days</p>
                        </div>
                        <TargetIcon className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600">Assignments</p>
                            <p className="text-3xl font-bold text-orange-600">
                                {progressData.performanceMetrics?.assignmentsCompleted || 0}
                            </p>
                            <p className="text-sm text-orange-600">completed</p>
                        </div>
                        <CheckCircleIcon className="h-8 w-8 text-orange-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Course Progress</h3>
                        <div className="space-y-4">
                            {progressData.courseProgress?.map(course => (
                                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                                            <p className="text-sm text-gray-600">
                                                {course.code} • {course.completedAssignments}/{course.totalAssignments} assignments
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getTrendIcon(course.trend)}
                                            <span className={`font-bold ${getGradeColor(course.gpa)}`}>
                                                {course.gpa.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Progress</span>
                                            <span>{course.completionRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${getProgressColor(course.completionRate)}`}
                                                style={{ width: `${Math.min(course.completionRate, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-gray-500">{course.lastActivity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Activity Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity</h3>
                        <div className="grid grid-cols-7 gap-2">
                            {progressData.weeklyActivity?.map(day => (
                                <div key={day.day} className="text-center">
                                    <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                                    <div 
                                        className="bg-blue-500 rounded mx-auto mb-2"
                                        style={{ 
                                            height: `${Math.max(day.hours * 8, 8)}px`,
                                            width: '20px'
                                        }}
                                    ></div>
                                    <div className="text-xs text-gray-800 font-semibold">{day.hours}h</div>
                                    <div className="text-xs text-gray-500">{day.activities} acts</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Deadlines */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
                        <div className="space-y-3">
                            {progressData.upcomingDeadlines?.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                            ) : (
                                progressData.upcomingDeadlines?.map(assignment => {
                                    const daysLeft = getDaysUntilDeadline(assignment.dueDate);
                                    const course = progressData.courseProgress?.find(c => c.id === assignment.courseId);
                                    
                                    return (
                                        <div key={assignment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                                                <p className="text-xs text-gray-600">{course?.title}</p>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded ${
                                                daysLeft <= 1 ? 'bg-red-100 text-red-800' :
                                                daysLeft <= 3 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {daysLeft === 0 ? 'Today' : 
                                                 daysLeft === 1 ? 'Tomorrow' : 
                                                 `${daysLeft} days`}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Grade Distribution */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Grade Distribution</h3>
                        <div className="space-y-3">
                            {Object.entries(progressData.gradeDistribution || {}).map(([grade, count]) => (
                                <div key={grade} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Grade {grade}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${
                                                    grade === 'A' ? 'bg-green-500' :
                                                    grade === 'B' ? 'bg-blue-500' :
                                                    grade === 'C' ? 'bg-yellow-500' :
                                                    grade === 'D' ? 'bg-orange-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ 
                                                    width: `${Math.max((count / Math.max(...Object.values(progressData.gradeDistribution || {}), 1)) * 100, 5)}%` 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-6">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Study Hours</span>
                                <span className="font-semibold">{progressData.performanceMetrics?.totalStudyHours}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pending Assignments</span>
                                <span className="font-semibold">{progressData.performanceMetrics?.assignmentsPending}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Active Courses</span>
                                <span className="font-semibold">{progressData.courseProgress?.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Goals Section */}
            {showGoals && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Academic Goals</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Add Goal
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map(goal => {
                            const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                            const isCompleted = goal.currentValue >= goal.targetValue;
                            
                            return (
                                <div key={goal.id} className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                        </div>
                                        {isCompleted && (
                                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                        )}
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span className="font-semibold">
                                                {goal.currentValue} / {goal.targetValue}
                                                {goal.type === 'gpa' && ' GPA'}
                                                {goal.type === 'completion' && '%'}
                                                {goal.type === 'study_hours' && ' hrs/week'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className={`h-3 rounded-full ${
                                                    isCompleted ? 'bg-green-500' : 
                                                    progress >= 75 ? 'bg-blue-500' : 
                                                    progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Due: {goal.deadline}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            isCompleted ? 'bg-green-100 text-green-800' :
                                            progress >= 75 ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {isCompleted ? 'Completed' : 
                                             progress >= 75 ? 'On Track' : 'Needs Attention'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProgress;
