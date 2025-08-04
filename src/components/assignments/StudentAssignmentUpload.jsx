import React, { useState } from 'react';
import { storage, db } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const StudentAssignmentUpload = ({ assignmentId, studentId }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        setUploading(true);
        const fileURLs = [];
        for (const file of files) {
            const fileRef = ref(storage, `assignments/${assignmentId}/${studentId}/${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            fileURLs.push({ name: file.name, url });
        }
        await addDoc(collection(db, 'submissions'), {
            assignmentId,
            studentId,
            files: fileURLs,
            submittedAt: new Date().toISOString(),
            grade: null
        });
        setUploading(false);
        alert('Files uploaded!');
        setFiles([]);
    };

    return (
        <div>
            <input
                type="file"
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={handleFileChange}
                className="mb-2"
            />
            <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {uploading ? 'Uploading...' : 'Submit Assignment'}
            </button>
        </div>
    );
};

export default StudentAssignmentUpload;