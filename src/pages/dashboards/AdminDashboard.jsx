import React, { useState, useEffect } from 'react';
import { 
    UsersIcon, BookOpenIcon, FileTextIcon, ChartBarIcon, 
    CalendarIcon, BellIcon, TrendingUpIcon, CheckCircleIcon,
    ExclamationTriangleIcon, UserIcon, InformationCircleIcon,
    HomeIcon, BarChartIcon, GraduationCapIcon, PlusCircleIcon, SettingsIcon
} from '../../components/icons/Icons';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/common/Header';
import DashboardCard from '../../components/common/DashboardCard';
import AdminAnalytics from '../../components/analytics/AdminAnalytics';
import CourseManagement from '../../components/courses/CourseManagement';
import Calendar from '../../components/common/Calendar';
import UsersList from '../../components/common/UsersList';
import NotificationCenter from '../../components/common/NotificationCenter';
import { mockQuizzes } from '../../data/mockData';

const AddUserForm = ({ userType, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onSave({ name, email }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Add {userType}</button></div>
        </form>
    );
};
const DeleteUserConfirm = ({ user, onConfirm, onCancel }) => (
    <div>
        <p className="text-gray-700">Are you sure you want to delete <span className="font-bold">{user.name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3 pt-6"><button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button type="button" onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">Delete</button></div>
    </div>
);
const UserTable = ({ users, userType, openModal, closeModal, addUser, deleteUser }) => {
    const handleAdd = () => { const userTypeName = userType === 'student' ? 'Student' : 'Faculty'; openModal(`Add New ${userTypeName}`, <AddUserForm userType={userTypeName} onCancel={closeModal} onSave={(newUser) => { addUser(userType, newUser); closeModal(); }} />); };
    const handleDelete = (user) => { openModal(`Delete ${user.name}`, <DeleteUserConfirm user={user} onCancel={closeModal} onConfirm={() => { deleteUser(user.id); closeModal(); }} />); };
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800">Manage {userType === 'student' ? 'Students' : 'Faculty'}</h3><button onClick={handleAdd} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"><PlusCircleIcon className="h-5 w-5 mr-2" /> Add New</button></div>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 border-b"><tr><th className="p-4 font-semibold text-gray-600">Name</th><th className="p-4 font-semibold text-gray-600">ID</th><th className="p-4 font-semibold text-gray-600">Email</th><th className="p-4 font-semibold text-gray-600">Actions</th></tr></thead><tbody>{users.map(user => (<tr key={user.id} className="border-b hover:bg-gray-50"><td className="p-4 flex items-center"><img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full mr-4"/><span className="font-medium text-gray-800">{user.name}</span></td><td className="p-4 text-gray-600 truncate" style={{maxWidth: '100px'}}>{user.id}</td><td className="p-4 text-gray-600">{user.email}</td><td className="p-4 space-x-4"><button onClick={() => alert('Edit functionality would be here.')} className="text-blue-600 hover:underline font-medium">Edit</button><button onClick={() => handleDelete(user)} className="text-red-600 hover:underline font-medium">Delete</button></td></tr>))}</tbody></table></div>
        </div>
    );
};

const AdminDashboard = ({ onLogout, openModal, closeModal, users, courses, assignments = [], submissions = [], addUser, deleteUser }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [systemStats, setSystemStats] = useState({});

    useEffect(() => {
        calculateSystemStats();
    }, [courses, assignments, submissions, users]);

    const calculateSystemStats = () => {
        const totalUsers = (users.students?.length || 0) + (users.faculty?.length || 0) + 1; // +1 for admin
        const totalCourses = courses.length;
        const totalAssignments = assignments.length;
        const pendingSubmissions = submissions.filter(s => !s.grade).length;
        const systemHealth = 98.5; // Simulated
        const storageUsed = Math.floor(Math.random() * 40) + 60; // 60-100GB simulated

        setSystemStats({
            totalUsers,
            totalCourses,
            totalAssignments,
            pendingSubmissions,
            systemHealth,
            storageUsed,
            activeUsers: Math.floor(totalUsers * 0.75),
            newRegistrations: Math.floor(Math.random() * 20) + 5,
            courseCompletions: Math.floor(Math.random() * 50) + 20,
            avgGrade: (submissions.filter(s => s.grade).reduce((sum, s) => {
                const gradeMap = {
                    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
                    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
                    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
                    'F': 0.0
                };
                return sum + (gradeMap[s.grade] || 0);
            }, 0) / submissions.filter(s => s.grade).length || 0).toFixed(2)
        });
    };

    const QuickStatsCard = ({ title, value, subtitle, icon, color, trend }) => (
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
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
            )}
        </div>
    );

    const SystemHealthCard = () => (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Overall Health</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${systemStats.systemHealth}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">{systemStats.systemHealth}%</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Storage Used</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${
                                    systemStats.storageUsed > 90 ? 'bg-red-500' : 
                                    systemStats.storageUsed > 75 ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${systemStats.storageUsed}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-semibold">{systemStats.storageUsed}%</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-green-800">Database</p>
                        <p className="text-xs text-green-600">Healthy</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-green-800">API</p>
                        <p className="text-xs text-green-600">Operational</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-yellow-800">Email</p>
                        <p className="text-xs text-yellow-600">Maintenance</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const RecentActivityCard = () => {
        const recentActivities = [
            { id: 1, type: 'user', message: 'New user registration: John Doe', time: '2 minutes ago', icon: UserIcon, color: 'text-blue-500' },
            { id: 2, type: 'course', message: 'Course "Advanced React" was published', time: '15 minutes ago', icon: BookOpenIcon, color: 'text-green-500' },
            { id: 3, type: 'assignment', message: '25 new submissions received', time: '1 hour ago', icon: FileTextIcon, color: 'text-purple-500' },
            { id: 4, type: 'system', message: 'Database backup completed successfully', time: '3 hours ago', icon: CheckCircleIcon, color: 'text-green-500' },
            { id: 5, type: 'alert', message: 'Server CPU usage above 80%', time: '5 hours ago', icon: ExclamationTriangleIcon, color: 'text-yellow-500' }
        ];

        return (
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recentActivities.map(activity => {
                        const IconComponent = activity.icon;
                        return (
                            <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                <IconComponent className={`h-5 w-5 ${activity.color} mt-0.5`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const navigation = [
        { name: 'Dashboard', icon: <HomeIcon /> },
        { name: 'Analytics', icon: <ChartBarIcon /> },
        { name: 'Manage Users', icon: <UsersIcon /> },
        { name: 'Courses', icon: <BookOpenIcon /> },
        { name: 'Calendar', icon: <CalendarIcon /> },
        { name: 'Notifications', icon: <BellIcon /> },
        { name: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
        <div className="flex">
            <Sidebar navigation={navigation} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 lg:pl-64">
                <Header title={activeTab} />
                <div className="p-4 sm:p-6 lg:p-8">
                    {activeTab === 'Dashboard' && (
                        <div className="space-y-8">
                            {/* Enhanced Dashboard Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <QuickStatsCard
                                    title="Total Users"
                                    value={systemStats.totalUsers || 0}
                                    subtitle={`${systemStats.activeUsers || 0} active`}
                                    icon={<UsersIcon className="h-6 w-6" />}
                                    color="text-blue-600"
                                    trend="+12%"
                                />
                                <QuickStatsCard
                                    title="Total Courses"
                                    value={systemStats.totalCourses || 0}
                                    subtitle={`${Math.floor((systemStats.totalCourses || 0) * 0.8)} active`}
                                    icon={<BookOpenIcon className="h-6 w-6" />}
                                    color="text-green-600"
                                    trend="+8%"
                                />
                                <QuickStatsCard
                                    title="Assignments"
                                    value={systemStats.totalAssignments || 0}
                                    subtitle={`${systemStats.pendingSubmissions || 0} pending review`}
                                    icon={<FileTextIcon className="h-6 w-6" />}
                                    color="text-purple-600"
                                    trend="+15%"
                                />
                                <QuickStatsCard
                                    title="Average Grade"
                                    value={systemStats.avgGrade || '0.00'}
                                    subtitle="Overall GPA"
                                    icon={<BarChartIcon className="h-6 w-6" />}
                                    color="text-orange-600"
                                    trend="+0.2"
                                />
                            </div>

                            {/* System Health and Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SystemHealthCard />
                                <RecentActivityCard />
                            </div>

                            {/* Original User Tables */}
                            <UserTable users={users.students} userType="student" {...{ openModal, closeModal, addUser, deleteUser }} />
                        </div>
                    )}
                    
                    {activeTab === 'Analytics' && (
                        <AdminAnalytics 
                            users={users}
                            courses={courses}
                            assignments={assignments || []}
                            submissions={submissions || []}
                        />
                    )}

                    {activeTab === 'Manage Users' && (
                        <div className="space-y-8">
                            <UserTable users={users.students} userType="student" {...{ openModal, closeModal, addUser, deleteUser }} />
                            <UserTable users={users.faculty} userType="faculty" {...{ openModal, closeModal, addUser, deleteUser }} />
                        </div>
                    )}
                    
                    {activeTab === 'Courses' && (
                        <CourseManagement
                            courses={courses}
                            setCourses={() => {}} // You may need to pass actual setCourses
                            assignments={assignments || []}
                            submissions={submissions || []}
                            users={users}
                            userRole="admin"
                            userId="admin-1"
                        />
                    )}
                    
                    {activeTab === 'Calendar' && (
                        <Calendar
                            assignments={assignments || []}
                            courses={courses}
                            userRole="admin"
                            userId="admin-1"
                        />
                    )}
                    
                    {activeTab === 'Notifications' && (
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Management</h2>
                            <NotificationCenter 
                                userId="admin-1"
                                userRole="admin"
                                courses={courses}
                                assignments={assignments || []}
                                submissions={submissions || []}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'Settings' && (
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 border border-gray-200 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Settings</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Email Notifications</span>
                                            <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Enabled</button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Auto Backup</span>
                                            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Active</button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Maintenance Mode</span>
                                            <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Disabled</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border border-gray-200 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Two-Factor Auth</span>
                                            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Required</button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Session Timeout</span>
                                            <span className="text-gray-800 font-medium">30 minutes</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Password Policy</span>
                                            <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Strong</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default AdminDashboard;
