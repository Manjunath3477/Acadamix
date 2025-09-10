// src/components/common/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, icon, color, trend, subtitle, gradient = false }) => (
    <div className={`card-modern p-6 flex items-center justify-between group ${gradient ? 'gradient-primary text-white' : 'bg-white'} animate-fade-in hover:scale-105`}>
        <div className="flex-1">
            <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-500'} mb-1`}>{title}</p>
            <p className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-gray-800'} mb-1`}>{value}</p>
            {subtitle && (
                <p className={`text-xs ${gradient ? 'text-white/70' : 'text-gray-400'}`}>{subtitle}</p>
            )}
            {trend && (
                <div className="flex items-center mt-2">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                        trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {trend}
                    </div>
                </div>
            )}
        </div>
        <div className={`p-4 rounded-xl transition-all duration-300 group-hover:scale-110 ${
            gradient ? 'bg-white/20' : `bg-${color}-100`
        }`}>
            <div className={`${gradient ? 'text-white' : `text-${color}-600`} transform transition-transform duration-300 group-hover:rotate-12`}>
                {icon}
            </div>
        </div>
    </div>
);

export default DashboardCard;
