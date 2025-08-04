import React from 'react';

const AuthCard = ({ children }) => (
    <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
        style={{ backgroundImage: "url('/study-bg.jpg')" }}
    >
        {/* Overlay to make the form stand out */}
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>

        {/* The white box for the form, centered on the page */}
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
            {children}
        </div>
    </div>
);

export default AuthCard;