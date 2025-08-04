import React from 'react';
import { BookOpenIcon, CheckCircleIcon, PlayCircleIcon } from '../components/icons/Icons';

const CourseDetailPage = ({ course, onBack }) => {
    // Mock data for modules and lessons
    const modules = [
        { name: 'Module 1: Introduction to React', lessons: ['What is React?', 'Setting up your environment', 'Understanding JSX'], completed: true },
        { name: 'Module 2: Components & Props', lessons: ['Functional Components', 'Class Components', 'Passing Props'], completed: true },
        { name: 'Module 3: State & Lifecycle', lessons: ['useState Hook', 'useEffect Hook', 'Component Lifecycle'], completed: false },
        { name: 'Module 4: Handling Events', lessons: ['Event Handling in React', 'Forms and Controlled Components'], completed: false },
    ];

    return (
        <div className="space-y-8">
            <div>
                <button onClick={onBack} className="text-blue-600 hover:underline mb-4">
                    &larr; Back to Dashboard
                </button>
                <h1 className="text-4xl font-bold text-gray-800">{course.title}</h1>
                <p className="text-lg text-gray-600 mt-2">Taught by {course.faculty}</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h2>
                <div className="space-y-6">
                    {modules.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-700">{module.name}</h3>
                                {module.completed ? (
                                    <span className="flex items-center text-sm font-medium text-green-600">
                                        <CheckCircleIcon className="h-5 w-5 mr-1" /> Completed
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-500">In Progress</span>
                                )}
                            </div>
                            <ul className="mt-4 space-y-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <li key={lessonIndex} className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                                        <PlayCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>{lesson}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;