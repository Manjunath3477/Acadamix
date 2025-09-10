import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, BookOpenIcon, ClockIcon, BarChartIcon } from '../icons/Icons';

const AdvancedAnalytics = ({ userRole, userId }) => {
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedMetric, setSelectedMetric] = useState('engagement');
    const [analyticsData, setAnalyticsData] = useState({});

    // Mock analytics data
    useEffect(() => {
        const mockData = {
            overview: {
                totalStudents: 1247,
                activeStudents: 892,
                completionRate: 78.5,
                averageGrade: 3.6,
                trends: {
                    students: +12.5,
                    engagement: +8.3,
                    completion: +15.2,
                    grades: +5.7
                }
            },
            engagement: {
                dailyActive: [45, 52, 48, 61, 55, 67, 72],
                weeklyActive: [245, 267, 289, 312, 298, 334, 356],
                sessionDuration: [22, 25, 28, 24, 30, 27, 31],
                pageViews: [1250, 1340, 1220, 1450, 1380, 1520, 1680]
            },
            performance: {
                courseCompletion: [
                    { course: 'React Fundamentals', completion: 85, students: 234 },
                    { course: 'Advanced JavaScript', completion: 72, students: 198 },
                    { course: 'Node.js Backend', completion: 68, students: 156 },
                    { course: 'Database Design', completion: 91, students: 287 },
                    { course: 'Web Security', completion: 63, students: 134 }
                ],
                gradeDistribution: [
                    { grade: 'A', count: 312, percentage: 25 },
                    { grade: 'B', count: 445, percentage: 36 },
                    { grade: 'C', count: 289, percentage: 23 },
                    { grade: 'D', count: 134, percentage: 11 },
                    { grade: 'F', count: 67, percentage: 5 }
                ]
            },
            predictions: {
                atRiskStudents: 23,
                projectedCompletion: 82.3,
                recommendedActions: [
                    'Increase assignment feedback frequency',
                    'Add more interactive video content',
                    'Implement peer review system',
                    'Schedule additional office hours'
                ]
            }
        };
        setAnalyticsData(mockData);
    }, [timeRange, userId]);

    const MetricCard = ({ title, value, trend, icon, color }) => (
        <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-100`}>
                    <div className={`text-${color}-600`}>
                        {icon}
                    </div>
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                    trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                    {trend >= 0 ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    );

    const ChartContainer = ({ title, children, className = "" }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-soft ${className}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            {children}
        </div>
    );

    const BarChart = ({ data, dataKey, color = 'blue' }) => {
        const maxValue = Math.max(...data.map(item => item[dataKey]));
        
        return (
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className="w-24 text-sm text-gray-600 truncate">
                            {item.course || item.grade || `Item ${index + 1}`}
                        </div>
                        <div className="flex-1 relative">
                            <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full transition-all duration-1000 ease-out`}
                                    style={{ 
                                        width: `${(item[dataKey] / maxValue) * 100}%`,
                                        animationDelay: `${index * 100}ms`
                                    }}
                                />
                            </div>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-700">
                                {item[dataKey]}{dataKey === 'completion' ? '%' : ''}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const LineChart = ({ data, labels, color = 'blue' }) => {
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;
        
        return (
            <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * 40}
                            x2="400"
                            y2={i * 40}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                        />
                    ))}
                    
                    {/* Data line */}
                    <path
                        d={`M ${data.map((value, index) => 
                            `${(index / (data.length - 1)) * 400},${200 - ((value - minValue) / range) * 160}`
                        ).join(' L ')}`}
                        fill="none"
                        stroke={`url(#${color}Gradient)`}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    
                    {/* Data points */}
                    {data.map((value, index) => (
                        <circle
                            key={index}
                            cx={(index / (data.length - 1)) * 400}
                            cy={200 - ((value - minValue) / range) * 160}
                            r="4"
                            fill={color === 'blue' ? '#3b82f6' : '#10b981'}
                            className="hover:r-6 transition-all duration-200 cursor-pointer"
                        />
                    ))}
                    
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id={`${color}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color === 'blue' ? '#3b82f6' : '#10b981'} />
                            <stop offset="100%" stopColor={color === 'blue' ? '#8b5cf6' : '#06d6a0'} />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* Labels */}
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                    {labels.map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
            </div>
        );
    };

    const PredictiveInsights = () => (
        <ChartContainer title="AI-Powered Insights" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h4 className="font-semibold text-red-800">At-Risk Students</h4>
                        </div>
                        <p className="text-2xl font-bold text-red-700 mb-2">
                            {analyticsData.predictions?.atRiskStudents}
                        </p>
                        <p className="text-sm text-red-600">
                            Students showing signs of disengagement
                        </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                            <TrendingUpIcon className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-800">Projected Completion</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-700 mb-2">
                            {analyticsData.predictions?.projectedCompletion}%
                        </p>
                        <p className="text-sm text-green-600">
                            Expected course completion rate
                        </p>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommended Actions</h4>
                    <div className="space-y-2">
                        {analyticsData.predictions?.recommendedActions.map((action, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <span className="text-sm text-blue-800">{action}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ChartContainer>
    );

    if (!analyticsData.overview) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Learning Analytics</h2>
                <div className="flex space-x-2">
                    {[
                        { value: '7d', label: '7 Days' },
                        { value: '30d', label: '30 Days' },
                        { value: '90d', label: '90 Days' },
                        { value: '1y', label: '1 Year' }
                    ].map(range => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                timeRange === range.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Students"
                    value={analyticsData.overview.totalStudents.toLocaleString()}
                    trend={analyticsData.overview.trends.students}
                    icon={<UsersIcon className="h-6 w-6" />}
                    color="blue"
                />
                <MetricCard
                    title="Active Students"
                    value={analyticsData.overview.activeStudents.toLocaleString()}
                    trend={analyticsData.overview.trends.engagement}
                    icon={<TrendingUpIcon className="h-6 w-6" />}
                    color="green"
                />
                <MetricCard
                    title="Completion Rate"
                    value={`${analyticsData.overview.completionRate}%`}
                    trend={analyticsData.overview.trends.completion}
                    icon={<BookOpenIcon className="h-6 w-6" />}
                    color="purple"
                />
                <MetricCard
                    title="Average GPA"
                    value={analyticsData.overview.averageGrade}
                    trend={analyticsData.overview.trends.grades}
                    icon={<BarChartIcon className="h-6 w-6" />}
                    color="yellow"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement Trends */}
                <ChartContainer title="Student Engagement Trends">
                    <div className="mb-4">
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="dailyActive">Daily Active Users</option>
                            <option value="sessionDuration">Session Duration</option>
                            <option value="pageViews">Page Views</option>
                        </select>
                    </div>
                    <LineChart
                        data={analyticsData.engagement[selectedMetric]}
                        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        color="blue"
                    />
                </ChartContainer>

                {/* Course Performance */}
                <ChartContainer title="Course Completion Rates">
                    <BarChart
                        data={analyticsData.performance.courseCompletion}
                        dataKey="completion"
                        color="green"
                    />
                </ChartContainer>

                {/* Grade Distribution */}
                <ChartContainer title="Grade Distribution">
                    <div className="space-y-4">
                        {analyticsData.performance.gradeDistribution.map((grade, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {grade.grade}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{grade.count} students</span>
                                        <span className="text-sm text-gray-500">{grade.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${grade.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartContainer>

                {/* Predictive Insights */}
                <PredictiveInsights />
            </div>

            {/* Detailed Performance Table */}
            <ChartContainer title="Course Performance Details">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Students</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Completion</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trend</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.performance.courseCompletion.map((course, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-800">{course.course}</td>
                                    <td className="py-3 px-4 text-gray-600">{course.students}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                                                    style={{ width: `${course.completion}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{course.completion}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-1 text-green-600">
                                            <TrendingUpIcon className="h-4 w-4" />
                                            <span className="text-sm">+{Math.floor(Math.random() * 10) + 1}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            course.completion >= 80
                                                ? 'bg-green-100 text-green-800'
                                                : course.completion >= 60
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {course.completion >= 80 ? 'Excellent' : course.completion >= 60 ? 'Good' : 'Needs Attention'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartContainer>
        </div>
    );
};

export default AdvancedAnalytics;
