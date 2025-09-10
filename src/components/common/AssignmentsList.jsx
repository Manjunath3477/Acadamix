import React, { useEffect, useState } from 'react';

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/assignments')
      .then(res => res.json())
      .then(data => setAssignments(data));
  }, []);

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>{assignment.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentsList;
