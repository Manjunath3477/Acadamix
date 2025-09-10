import React, { useEffect, useState } from 'react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesList;
