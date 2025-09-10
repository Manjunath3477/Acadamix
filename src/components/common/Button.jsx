import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    loading = false,
    icon,
    onClick,
    disabled = false,
    ...props 
}) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 hover:scale-105",
        secondary: "bg-white text-gray-700 border border-gray-300 shadow-md hover:bg-gray-50 hover:shadow-lg focus:ring-gray-500",
        success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl focus:ring-green-500 hover:scale-105",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl focus:ring-red-500 hover:scale-105",
        warning: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500 hover:scale-105",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-500",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
    };
    
    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl"
    };
    
    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
    
    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {icon && !loading && (
                <span className="mr-2">{icon}</span>
            )}
            {children}
        </button>
    );
};

// Specialized button components
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;

export default Button;
