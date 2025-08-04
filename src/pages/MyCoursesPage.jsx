import React from 'react';
import CourseCard from '../components/common/CourseCard';
import { mockCourses } from '../data/mockData';

const MyCoursesPage = ({ onCourseSelect }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
            <p className="text-gray-600">All your enrolled courses are listed here. Click "Continue" to view the course details and modules.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCourses.map(course => (
                    <div key={course.id} onClick={() => onCourseSelect(course)}>
                        <CourseCard course={course} role="student" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCoursesPage;