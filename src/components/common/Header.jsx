// src/components/common/Header.jsx
import React, { useContext } from 'react';
import { AppStateContext } from '../../context/AppStateContext';
import { MenuIcon } from '../icons/Icons';

const Header = ({ title }) => {
    const { setIsSidebarOpen } = useContext(AppStateContext);
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                         <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-500 hover:text-gray-700">
                            <MenuIcon />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
