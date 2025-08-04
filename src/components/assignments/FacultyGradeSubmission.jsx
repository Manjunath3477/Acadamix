import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const FacultyGradeSubmission = ({ submission }) => {
    const [grade, setGrade] = useState(submission.grade || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');

    const handleGrade = async () => {
        await updateDoc(doc(db, 'submissions', submission.id), { grade, feedback });
        alert('Grade submitted!');
    };

    return (
        <div>
            <h3>Submitted Files:</h3>
            <ul>
                {submission.files.map(file => (
                    <li key={file.url}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                    </li>
                ))}
            </ul>
            <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="Grade" className="border px-2 py-1 mr-2" />
            <input type="text" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Feedback" className="border px-2 py-1 mr-2" />
            <button onClick={handleGrade} className="bg-green-600 text-white px-4 py-2 rounded">Submit Grade</button>
        </div>
    );
};

export default FacultyGradeSubmission;