import React from 'react';
import { XIcon } from '../icons/Icons';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-all duration-500"
        >
            {/* Enhanced Modal Panel */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-large w-full max-w-lg transform transition-all animate-bounce-in overflow-hidden"
                style={{ animation: 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' }}
            >
                {/* Enhanced Header with Gradient */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white/70 transition-all duration-200 hover:scale-110"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                
                {/* Enhanced Content */}
                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    {children}
                </div>
                
                {/* Decorative Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </div>
            <style>
                {`
                @keyframes fade-in-scale {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                `}
            </style>
        </div>
    );
};

export default Modal;