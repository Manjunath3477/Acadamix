import React, { useState } from 'react';
import { 
    UploadCloudIcon, FileTextIcon, CalendarIcon, CheckCircleIcon, 
    ClockIcon, BookOpenIcon, ExclamationTriangleIcon 
} from '../icons/Icons';

const StudentAssignmentUpload = ({ 
    assignments = [], 
    courses = [], 
    userId, 
    onSubmission 
}) => {
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Get assignment details
    const getAssignmentDetails = (assignmentId) => {
        return assignments.find(a => a.id === parseInt(assignmentId));
    };

    // Get course title
    const getCourseTitle = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.title : 'Unknown Course';
    };

    // Check if assignment is overdue
    const isOverdue = (dueDate) => {
        return new Date() > new Date(dueDate);
    };

    // Get time remaining
    const getTimeRemaining = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;
        
        if (diff < 0) return 'Overdue';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
        return 'Due soon';
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async () => {
        if (!selectedAssignment) {
            alert('Please select an assignment');
            return;
        }

        if (!content.trim() && files.length === 0) {
            alert('Please provide either text content or upload files');
            return;
        }

        setUploading(true);

        try {
            // Create submission object
            const submission = {
                assignmentId: parseInt(selectedAssignment),
                studentId: userId,
                content: content.trim(),
                submittedAt: new Date().toISOString(),
                files: files.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            };

            // Call the submission handler
            if (onSubmission) {
                onSubmission(submission);
            }

            // Reset form
            setSelectedAssignment('');
            setContent('');
            setFiles([]);
            
            alert('Assignment submitted successfully!');
        } catch (error) {
            alert('Failed to submit assignment. Please try again.');
            console.error('Submission error:', error);
        } finally {
            setUploading(false);
        }
    };

    const selectedAssignmentDetails = selectedAssignment ? getAssignmentDetails(selectedAssignment) : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Assignment</h2>
                <p className="text-gray-600">Upload your completed assignments and submit them to your instructors.</p>
            </div>

            {/* Assignment Selection */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Assignment</h3>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose Assignment</label>
                    <select
                        value={selectedAssignment}
                        onChange={(e) => setSelectedAssignment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select an assignment...</option>
                        {assignments.map(assignment => (
                            <option key={assignment.id} value={assignment.id}>
                                {assignment.title} - {getCourseTitle(assignment.courseId)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assignment Details */}
                {selectedAssignmentDetails && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 flex items-center">
                                    <FileTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                                    {selectedAssignmentDetails.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 flex items-center">
                                    <BookOpenIcon className="h-4 w-4 mr-1" />
                                    {getCourseTitle(selectedAssignmentDetails.courseId)}
                                </p>
                                {selectedAssignmentDetails.description && (
                                    <p className="text-sm text-gray-700 mt-2">{selectedAssignmentDetails.description}</p>
                                )}
                            </div>
                            <div className="ml-4 text-right">
                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    Due: {new Date(selectedAssignmentDetails.dueDate).toLocaleDateString()}
                                </div>
                                <div className={`text-sm font-medium ${
                                    isOverdue(selectedAssignmentDetails.dueDate) 
                                        ? 'text-red-600' 
                                        : 'text-green-600'
                                }`}>
                                    {isOverdue(selectedAssignmentDetails.dueDate) ? (
                                        <span className="flex items-center">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                            Overdue
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {getTimeRemaining(selectedAssignmentDetails.dueDate)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Submission Form */}
            {selectedAssignment && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Your Work</h3>
                    
                    {/* Text Content */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your assignment content here... (Optional if uploading files)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can either type your submission here or upload files below (or both).
                        </p>
                    </div>

                    {/* File Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Files (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <UploadCloudIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP (Max 10MB per file)
                            </p>
                        </div>
                        
                        {/* Selected Files */}
                        {files.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                                <div className="space-y-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center">
                                                <FileTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submission Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={uploading || (!content.trim() && files.length === 0)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                        >
                            {uploading ? (
                                <>
                                    <ClockIcon className="h-5 w-5 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="h-5 w-5" />
                                    <span>Submit Assignment</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Warning for overdue */}
                    {selectedAssignmentDetails && isOverdue(selectedAssignmentDetails.dueDate) && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-sm text-red-700 font-medium">
                                    This assignment is overdue. Late submissions may be penalized.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Submission Guidelines</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Make sure to submit your work before the deadline</li>
                    <li>• You can provide text content, upload files, or both</li>
                    <li>• Supported file formats: PDF, DOC, DOCX, TXT, images, ZIP</li>
                    <li>• Maximum file size: 10MB per file</li>
                    <li>• Once submitted, you may not be able to edit your submission</li>
                    <li>• Contact your instructor if you need to make changes after submission</li>
                </ul>
            </div>
        </div>
    );
};

export default StudentAssignmentUpload;