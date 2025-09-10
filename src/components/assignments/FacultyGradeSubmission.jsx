import React, { useState } from 'react';
import { 
    FileTextIcon, CheckCircleIcon, ClockIcon, UserIcon, 
    CalendarIcon, BookOpenIcon 
} from '../icons/Icons';

const FacultyGradeSubmission = ({ 
    assignments = [], 
    submissions = [], 
    courses = [], 
    users = {}, 
    onGradeSubmission 
}) => {
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [grades, setGrades] = useState({});
    const [feedback, setFeedback] = useState({});
    const [filterStatus, setFilterStatus] = useState('all'); // all, graded, pending

    // Get submissions for selected assignment
    const getAssignmentSubmissions = () => {
        if (!selectedAssignment) return [];
        return submissions.filter(sub => sub.assignmentId === parseInt(selectedAssignment));
    };

    // Get student name
    const getStudentName = (studentId) => {
        const student = users.students?.find(s => s.id === studentId);
        return student ? student.name : 'Unknown Student';
    };

    // Get assignment title
    const getAssignmentTitle = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        return assignment ? assignment.title : 'Unknown Assignment';
    };

    // Get course title
    const getCourseTitle = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.title : 'Unknown Course';
    };

    // Handle grade submission
    const handleGradeSubmit = (submissionId) => {
        const grade = grades[submissionId];
        const feedbackText = feedback[submissionId] || '';
        
        if (!grade) {
            alert('Please enter a grade before submitting');
            return;
        }

        if (onGradeSubmission) {
            onGradeSubmission(submissionId, grade, feedbackText);
        }

        // Clear the form
        setGrades(prev => ({ ...prev, [submissionId]: '' }));
        setFeedback(prev => ({ ...prev, [submissionId]: '' }));
        
        alert('Grade submitted successfully!');
    };

    // Filter submissions based on status
    const filteredSubmissions = getAssignmentSubmissions().filter(sub => {
        if (filterStatus === 'graded') return sub.grade;
        if (filterStatus === 'pending') return !sub.grade;
        return true;
    });

    const GradeOptions = () => (
        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select Grade</option>
            <option value="A+">A+ (97-100)</option>
            <option value="A">A (93-96)</option>
            <option value="A-">A- (90-92)</option>
            <option value="B+">B+ (87-89)</option>
            <option value="B">B (83-86)</option>
            <option value="B-">B- (80-82)</option>
            <option value="C+">C+ (77-79)</option>
            <option value="C">C (73-76)</option>
            <option value="C-">C- (70-72)</option>
            <option value="D+">D+ (67-69)</option>
            <option value="D">D (63-66)</option>
            <option value="D-">D- (60-62)</option>
            <option value="F">F (0-59)</option>
        </select>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Grade Submissions</h2>
                
                {/* Assignment Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Assignment</label>
                        <select
                            value={selectedAssignment}
                            onChange={(e) => setSelectedAssignment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Choose an assignment...</option>
                            {assignments.map(assignment => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.title} - {getCourseTitle(assignment.courseId)}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Submissions</option>
                            <option value="pending">Pending Review</option>
                            <option value="graded">Already Graded</option>
                        </select>
                    </div>
                </div>

                {/* Statistics */}
                {selectedAssignment && (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{getAssignmentSubmissions().length}</div>
                            <div className="text-sm text-blue-800">Total Submissions</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {getAssignmentSubmissions().filter(s => s.grade).length}
                            </div>
                            <div className="text-sm text-green-800">Graded</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {getAssignmentSubmissions().filter(s => !s.grade).length}
                            </div>
                            <div className="text-sm text-orange-800">Pending</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Submissions List */}
            {selectedAssignment && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Submissions for: {getAssignmentTitle(parseInt(selectedAssignment))}
                        </h3>
                    </div>

                    {filteredSubmissions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FileTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No submissions found</p>
                            <p className="text-sm">
                                {filterStatus === 'pending' && 'No pending submissions to grade'}
                                {filterStatus === 'graded' && 'No graded submissions yet'}
                                {filterStatus === 'all' && 'No submissions for this assignment'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredSubmissions.map(submission => (
                                <div key={submission.id} className="p-6 space-y-4">
                                    {/* Student Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <UserIcon className="h-8 w-8 text-gray-400" />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">
                                                    {getStudentName(submission.studentId)}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    Student ID: {submission.studentId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {submission.grade ? (
                                                <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                    Graded: {submission.grade}
                                                </span>
                                            ) : (
                                                <span className="flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                                    <ClockIcon className="h-4 w-4 mr-1" />
                                                    Pending Review
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submission Content */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h5 className="font-medium text-gray-800 mb-2">Submission Content:</h5>
                                        <p className="text-gray-600 text-sm">
                                            {submission.content || 'No content provided'}
                                        </p>
                                        {submission.submittedAt && (
                                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                                <CalendarIcon className="h-3 w-3 mr-1" />
                                                Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Existing Grade/Feedback Display */}
                                    {submission.grade && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h5 className="font-medium text-green-800">Current Grade: {submission.grade}</h5>
                                                    {submission.feedback && (
                                                        <p className="text-sm text-green-700 mt-1">
                                                            Feedback: {submission.feedback}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Grading Form */}
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h5 className="font-medium text-blue-800 mb-3">
                                            {submission.grade ? 'Update Grade' : 'Assign Grade'}
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                                                <select
                                                    value={grades[submission.id] || ''}
                                                    onChange={(e) => setGrades(prev => ({ 
                                                        ...prev, 
                                                        [submission.id]: e.target.value 
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select Grade</option>
                                                    <option value="A+">A+ (97-100)</option>
                                                    <option value="A">A (93-96)</option>
                                                    <option value="A-">A- (90-92)</option>
                                                    <option value="B+">B+ (87-89)</option>
                                                    <option value="B">B (83-86)</option>
                                                    <option value="B-">B- (80-82)</option>
                                                    <option value="C+">C+ (77-79)</option>
                                                    <option value="C">C (73-76)</option>
                                                    <option value="C-">C- (70-72)</option>
                                                    <option value="D+">D+ (67-69)</option>
                                                    <option value="D">D (63-66)</option>
                                                    <option value="D-">D- (60-62)</option>
                                                    <option value="F">F (0-59)</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (Optional)</label>
                                                <textarea
                                                    value={feedback[submission.id] || ''}
                                                    onChange={(e) => setFeedback(prev => ({ 
                                                        ...prev, 
                                                        [submission.id]: e.target.value 
                                                    }))}
                                                    placeholder="Provide feedback for the student..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => handleGradeSubmit(submission.id)}
                                                disabled={!grades[submission.id]}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                            >
                                                <CheckCircleIcon className="h-4 w-4" />
                                                <span>{submission.grade ? 'Update Grade' : 'Submit Grade'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyGradeSubmission;