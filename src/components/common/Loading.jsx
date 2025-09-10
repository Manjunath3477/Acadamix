import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };
    
    const colors = {
        blue: 'border-blue-600',
        purple: 'border-purple-600',
        green: 'border-green-600',
        red: 'border-red-600',
        white: 'border-white'
    };
    
    return (
        <div className={`${sizes[size]} ${colors[color]} border-2 border-t-transparent rounded-full animate-spin`}></div>
    );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ className = '', variant = 'text' }) => {
    const variants = {
        text: 'h-4 bg-gray-200 rounded',
        title: 'h-6 bg-gray-200 rounded',
        avatar: 'h-12 w-12 bg-gray-200 rounded-full',
        card: 'h-32 bg-gray-200 rounded-lg',
        button: 'h-10 w-24 bg-gray-200 rounded-lg'
    };
    
    return (
        <div className={`animate-pulse ${variants[variant]} ${className}`}></div>
    );
};

// Page Loading Component
export const PageLoader = () => (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
            <div className="relative">
                <LoadingSpinner size="xl" color="blue" />
                <div className="absolute inset-0 animate-ping">
                    <LoadingSpinner size="xl" color="purple" />
                </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading Acadamix...</p>
        </div>
    </div>
);

// Card Skeleton Component
export const CardSkeleton = () => (
    <div className="bg-white p-6 rounded-2xl shadow-soft animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
            <SkeletonLoader variant="avatar" />
            <div className="flex-1 space-y-2">
                <SkeletonLoader variant="title" className="w-3/4" />
                <SkeletonLoader variant="text" className="w-1/2" />
            </div>
        </div>
        <SkeletonLoader variant="text" className="w-full mb-2" />
        <SkeletonLoader variant="text" className="w-2/3 mb-4" />
        <SkeletonLoader variant="button" />
    </div>
);

// Data Loading States
export const EmptyState = ({ title, description, icon, action }) => (
    <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            {icon || (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L12 0L5 5" />
                </svg>
            )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        {action}
    </div>
);

export default { LoadingSpinner, SkeletonLoader, PageLoader, CardSkeleton, EmptyState };
