import React, { useState } from 'react';
import { PlusIcon, XIcon } from '../icons/Icons';

const FloatingActionButton = ({ actions = [], mainAction, position = 'bottom-right' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
    };

    const toggleMenu = () => {
        if (actions.length > 0) {
            setIsOpen(!isOpen);
        } else if (mainAction) {
            mainAction.onClick();
        }
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-40`}>
            {/* Sub Actions */}
            {isOpen && actions.length > 0 && (
                <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
                    {actions.map((action, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 animate-slide-in-right"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                                {action.label}
                            </span>
                            <button
                                onClick={() => {
                                    action.onClick();
                                    setIsOpen(false);
                                }}
                                className={`w-12 h-12 ${action.color || 'bg-blue-500'} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center`}
                            >
                                {action.icon}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Main FAB */}
            <button
                onClick={toggleMenu}
                className={`w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center transform ${
                    isOpen ? 'rotate-45' : ''
                } animate-float`}
            >
                {isOpen ? (
                    <XIcon className="h-6 w-6" />
                ) : (
                    mainAction?.icon || <PlusIcon className="h-6 w-6" />
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 -z-10"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default FloatingActionButton;
