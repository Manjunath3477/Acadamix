import React, { useState, useContext, createContext } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XIcon } from '../icons/Icons';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };
        
        setToasts(prev => [...prev, toast]);
        
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message, duration) => addToast(message, 'success', duration);
    const error = (message, duration) => addToast(message, 'error', duration);
    const warning = (message, duration) => addToast(message, 'warning', duration);
    const info = (message, duration) => addToast(message, 'info', duration);

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { message, type } = toast;
    
    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
                    icon: <CheckCircleIcon className="h-5 w-5 text-white" />,
                    border: 'border-green-200'
                };
            case 'error':
                return {
                    bg: 'bg-gradient-to-r from-red-500 to-pink-600',
                    icon: <XCircleIcon className="h-5 w-5 text-white" />,
                    border: 'border-red-200'
                };
            case 'warning':
                return {
                    bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
                    icon: <ExclamationTriangleIcon className="h-5 w-5 text-white" />,
                    border: 'border-yellow-200'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
                    icon: <InformationCircleIcon className="h-5 w-5 text-white" />,
                    border: 'border-blue-200'
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div className={`${styles.bg} text-white p-4 rounded-lg shadow-large max-w-sm w-full transform transition-all duration-300 animate-slide-in-right`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {styles.icon}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="inline-flex text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full p-1 transition-colors duration-200"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToastProvider;
