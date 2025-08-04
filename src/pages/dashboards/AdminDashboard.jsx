import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/common/Header';
import DashboardCard from '../../components/common/DashboardCard';
import { mockQuizzes } from '../../data/mockData';
import { HomeIcon, UsersIcon, BookOpenIcon, BarChartIcon, GraduationCapIcon, FileTextIcon, PlusCircleIcon, SettingsIcon } from '../../components/icons/Icons';

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

const AdminDashboard = ({ onLogout, openModal, closeModal, users, courses, addUser, deleteUser }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const navigation = [
        { name: 'Dashboard', icon: <HomeIcon /> }, { name: 'Manage Users', icon: <UsersIcon /> },
        { name: 'Courses', icon: <BookOpenIcon /> }, { name: 'Analytics', icon: <BarChartIcon /> },
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <DashboardCard title="Total Students" value={users.students.length} icon={<GraduationCapIcon />} color="blue" />
                                <DashboardCard title="Total Faculty" value={users.faculty.length} icon={<UsersIcon />} color="teal" />
                                <DashboardCard title="Total Courses" value={courses.length} icon={<BookOpenIcon />} color="purple" />
                                <DashboardCard title="Active Quizzes" value={mockQuizzes.length} icon={<FileTextIcon />} color="orange" />
                            </div>
                            <UserTable users={users.students} userType="student" {...{ openModal, closeModal, addUser, deleteUser }} />
                        </div>
                    )}
                    {activeTab === 'Manage Users' && (
                        <div className="space-y-8">
                            <UserTable users={users.students} userType="student" {...{ openModal, closeModal, addUser, deleteUser }} />
                            <UserTable users={users.faculty} userType="faculty" {...{ openModal, closeModal, addUser, deleteUser }} />
                        </div>
                    )}
                    {activeTab === 'Courses' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">Manage All Courses</h2></div>}
                    {activeTab === 'Analytics' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">LMS Analytics</h2></div>}
                    {activeTab === 'Settings' && <div className="bg-white p-8 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2></div>}
                </div>
            </main>
        </div>
    );
};
export default AdminDashboard;
