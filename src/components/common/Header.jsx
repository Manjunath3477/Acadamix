// src/components/common/Header.jsx
import React, { useContext } from 'react';
import { AppStateContext } from '../../context/AppStateContext';
import { MenuIcon } from '../icons/Icons';

const Header = ({ title, subtitle, actions }) => {
    const { setIsSidebarOpen } = useContext(AppStateContext);
    return (
        <header className="bg-gradient-to-r from-white to-gray-50 shadow-soft border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="lg:hidden mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                            <MenuIcon />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 animate-fade-in">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1 animate-slide-in-right">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {actions && (
                        <div className="flex items-center space-x-3">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
