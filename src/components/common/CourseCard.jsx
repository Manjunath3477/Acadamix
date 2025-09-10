// src/components/common/CourseCard.jsx
import React from 'react';

const CourseCard = ({ course, role, onClick }) => (
    <div 
        className="card-modern group overflow-hidden cursor-pointer animate-fade-in hover:scale-105" 
        onClick={() => onClick?.(course)}
    >
        {/* Course Header with Gradient */}
        <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {course.category || 'General'}
                </span>
            </div>
            <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-white font-bold text-lg leading-tight">{course.title}</h3>
                <p className="text-white/80 text-sm">{course.faculty}</p>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute bottom-8 right-4 w-6 h-6 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="p-6">
            {/* Progress Bar for Students */}
            {role === 'student' && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${course.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{course.description}</p>
            
            {/* Course Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {course.modules} Modules
                    </span>
                    <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {course.students} Students
                    </span>
                </div>
                <div className="flex -space-x-2">
                    {/* Student Avatars */}
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                    ))}
                </div>
            </div>
            
            {/* Action Button */}
            <button className="w-full btn-primary group-hover:scale-105 transition-transform duration-300">
                <span className="flex items-center justify-center">
                    {role === 'student' ? '▶ Continue Learning' : '⚙ Manage Course'}
                </span>
            </button>
        </div>
        
        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
);

export default CourseCard;