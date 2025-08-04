// src/components/common/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition hover:shadow-lg hover:-translate-y-1">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-4 rounded-full bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
    </div>
);

export default DashboardCard;
