// src/components/layout/AppContainer.jsx
import React from 'react';

const AppContainer = ({ children }) => (
    <div className="bg-gray-50 font-sans text-gray-900 antialiased min-h-screen">
        {children}
    </div>
);

export default AppContainer;
