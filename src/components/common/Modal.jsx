import React from 'react';
import { XIcon } from '../icons/Icons';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
        >
            {/* Modal Panel */}
            <div
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-95 opacity-0 animate-fade-in-scale"
                style={{ animation: 'fade-in-scale 0.3s forwards' }}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
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