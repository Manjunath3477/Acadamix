import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AppStateContext } from '../../context/AppStateContext';
import { GraduationCapIcon, LogOutIcon, SettingsIcon } from '../icons/Icons';

const Sidebar = ({ navigation, onLogout, activeTab, setActiveTab }) => {
    const { user } = useContext(AuthContext);
    const { isSidebarOpen, setIsSidebarOpen } = useContext(AppStateContext);

    // --- NEW, MORE ATTRACTIVE STYLES ---
    const baseItemClass = "w-full flex items-center pl-6 pr-4 py-3 text-gray-500 hover:bg-gray-100 transition-colors duration-200 text-left relative";
    const activeItemClass = "w-full flex items-center pl-6 pr-4 py-3 text-blue-600 bg-blue-50 font-semibold transition-colors duration-200 text-left relative";

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

            <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40 lg:flex transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-200 flex-shrink-0">
                    <GraduationCapIcon className="h-8 w-8 text-blue-600" />
                    <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-wider">Acadamix</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={activeTab === item.name ? activeItemClass : baseItemClass}
                        >
                            {/* Active state indicator bar */}
                            {activeTab === item.name && (
                                <span className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r-full"></span>
                            )}
                            <div className="flex-shrink-0 h-6 w-6">
                                {item.icon}
                            </div>
                            <span className="ml-4">{item.name}</span>
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
