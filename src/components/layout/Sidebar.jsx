import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AppStateContext } from '../../context/AppStateContext';
import { GraduationCapIcon, LogOutIcon, SettingsIcon } from '../icons/Icons';

const Sidebar = ({ navigation, onLogout, activeTab, setActiveTab }) => {
    const { user } = useContext(AuthContext);
    const { isSidebarOpen, setIsSidebarOpen } = useContext(AppStateContext);

    // --- ENHANCED MODERN STYLES ---
    const baseItemClass = "w-full flex items-center pl-6 pr-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 text-left relative group rounded-lg mx-2";
    const activeItemClass = "w-full flex items-center pl-6 pr-4 py-3 text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 font-semibold transition-all duration-300 text-left relative shadow-soft rounded-lg mx-2";

    const handleNavClick = (tabName) => {
        setActiveTab(tabName);
        setIsSidebarOpen(false); // Close sidebar on mobile after click
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col z-40 lg:flex transform transition-all duration-300 shadow-large ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600">
                    <GraduationCapIcon className="h-8 w-8 text-white animate-pulse-glow" />
                    <h1 className="ml-3 text-2xl font-bold text-white tracking-wider">Acadamix</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item, index) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={`${activeTab === item.name ? activeItemClass : baseItemClass} animate-slide-in-right`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Active state indicator with gradient */}
                            {activeTab === item.name && (
                                <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></span>
                            )}
                            <div className={`flex-shrink-0 h-6 w-6 transition-all duration-300 ${
                                activeTab === item.name ? 'transform scale-110' : 'group-hover:scale-105'
                            }`}>
                                {item.icon}
                            </div>
                            <span className="ml-4 font-medium">{item.name}</span>
                            
                            {/* Subtle hover effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 transition-opacity duration-200 ${
                                activeTab !== item.name ? 'group-hover:opacity-100' : ''
                            }`}></div>
                        </button>
                    ))}
                </nav>

                <div className="px-4 py-6 border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center mb-4 px-2">
                        <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt="User avatar" />
                        <div className="ml-3">
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center pl-6 pr-4 py-3 text-gray-500 hover:bg-gray-100 transition-colors duration-200 text-left relative mt-2">
                        <div className="flex-shrink-0 h-6 w-6">
                            <LogOutIcon />
                        </div>
                        <span className="ml-4">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
