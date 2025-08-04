// src/components/common/CourseCard.jsx
import React from 'react';

const CourseCard = ({ course, role }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-600">{course.faculty}</p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{course.title}</h3>
                </div>
                {role === 'student' && (
                    <div className="relative pt-1 w-1/4 ml-4">
                        <div className="flex mb-2 items-center justify-between">
                            <span className="text-xs font-semibold text-blue-600">Progress</span>
                            <span className="text-xs font-semibold text-blue-600">{course.progress}%</span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                            <div style={{ width: `${course.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        </div>
                    </div>
                )}
            </div>
            <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>{course.modules} Modules</span>
                <span>{course.students} Students</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
                    {role === 'student' ? 'Continue' : 'Manage'}
                </button>
            </div>
        </div>
    </div>
);

export default CourseCard;