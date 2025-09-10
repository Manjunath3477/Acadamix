import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EditIcon } from '../icons/Icons';

const QuizBuilder = ({ courseId, onSave, existingQuiz = null }) => {
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        timeLimit: 30,
        attempts: 1,
        showCorrectAnswers: true,
        randomizeQuestions: false,
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 1
    });

    const [editingIndex, setEditingIndex] = useState(-1);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (existingQuiz) {
            setQuiz(existingQuiz);
        }
    }, [existingQuiz]);

    const questionTypes = [
        { value: 'multiple-choice', label: 'Multiple Choice' },
        { value: 'true-false', label: 'True/False' },
        { value: 'short-answer', label: 'Short Answer' },
        { value: 'essay', label: 'Essay' },
        { value: 'fill-blank', label: 'Fill in the Blank' }
    ];

    const addQuestion = () => {
        if (editingIndex >= 0) {
            const updatedQuestions = [...quiz.questions];
            updatedQuestions[editingIndex] = { ...currentQuestion, id: Date.now() };
            setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
            setEditingIndex(-1);
        } else {
            setQuiz(prev => ({
                ...prev,
                questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
            }));
        }
        
        setCurrentQuestion({
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            points: 1
        });
    };

    const editQuestion = (index) => {
        setCurrentQuestion(quiz.questions[index]);
        setEditingIndex(index);
    };

    const deleteQuestion = (index) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const updateQuestionOption = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    };

    const getTotalPoints = () => {
        return quiz.questions.reduce((total, q) => total + q.points, 0);
    };

    const QuestionPreview = ({ question, index }) => (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-800">
                    Question {index + 1} ({question.points} point{question.points !== 1 ? 's' : ''})
                </h4>
                <div className="flex space-x-2">
                    <button
                        onClick={() => editQuestion(index)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                        <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => deleteQuestion(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <p className="text-gray-700 mb-3">{question.question}</p>
            
            {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                        <div
                            key={optIndex}
                            className={`p-2 rounded border ${
                                optIndex === question.correctAnswer
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correctAnswer && (
                                <CheckCircleIcon className="h-4 w-4 text-green-600 inline ml-2" />
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            {question.type === 'true-false' && (
                <div className="space-y-2">
                    <div className={`p-2 rounded border ${
                        question.correctAnswer === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                        True {question.correctAnswer === 0 && <CheckCircleIcon className="h-4 w-4 text-green-600 inline ml-2" />}
                    </div>
                    <div className={`p-2 rounded border ${
                        question.correctAnswer === 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                        False {question.correctAnswer === 1 && <CheckCircleIcon className="h-4 w-4 text-green-600 inline ml-2" />}
                    </div>
                </div>
            )}
            
            {question.explanation && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <strong className="text-blue-800">Explanation:</strong>
                    <p className="text-blue-700 mt-1">{question.explanation}</p>
                </div>
            )}
        </div>
    );

    if (previewMode) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-large p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
                            <p className="text-gray-600">{quiz.description}</p>
                        </div>
                        <button
                            onClick={() => setPreviewMode(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Back to Edit
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
                            <div className="text-sm text-blue-800">Questions</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{getTotalPoints()}</div>
                            <div className="text-sm text-green-800">Total Points</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{quiz.timeLimit}</div>
                            <div className="text-sm text-purple-800">Minutes</div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {quiz.questions.map((question, index) => (
                            <QuestionPreview key={question.id} question={question} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quiz Settings */}
                <div className="bg-white rounded-2xl shadow-large p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quiz Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                            <input
                                type="text"
                                value={quiz.title}
                                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter quiz title"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={quiz.description}
                                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Enter quiz description"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                            <input
                                type="number"
                                value={quiz.timeLimit}
                                onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="1"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
                            <input
                                type="number"
                                value={quiz.attempts}
                                onChange={(e) => setQuiz(prev => ({ ...prev, attempts: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="1"
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={quiz.showCorrectAnswers}
                                    onChange={(e) => setQuiz(prev => ({ ...prev, showCorrectAnswers: e.target.checked }))}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Show correct answers after submission</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={quiz.randomizeQuestions}
                                    onChange={(e) => setQuiz(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Randomize question order</span>
                            </label>
                        </div>
                        
                        <div className="pt-4 space-y-3">
                            <button
                                onClick={() => setPreviewMode(true)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Preview Quiz
                            </button>
                            <button
                                onClick={() => onSave(quiz)}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                disabled={!quiz.title || quiz.questions.length === 0}
                            >
                                Save Quiz
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Question Builder */}
                <div className="bg-white rounded-2xl shadow-large p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        {editingIndex >= 0 ? 'Edit Question' : 'Add Question'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                            <select
                                value={currentQuestion.type}
                                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {questionTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <textarea
                                value={currentQuestion.question}
                                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Enter your question"
                            />
                        </div>
                        
                        {currentQuestion.type === 'multiple-choice' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={currentQuestion.correctAnswer === index}
                                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateQuestionOption(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {currentQuestion.type === 'true-false' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="trueFalse"
                                            checked={currentQuestion.correctAnswer === 0}
                                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 0 }))}
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2">True</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="trueFalse"
                                            checked={currentQuestion.correctAnswer === 1}
                                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: 1 }))}
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2">False</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                <input
                                    type="number"
                                    value={currentQuestion.points}
                                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                            <textarea
                                value={currentQuestion.explanation}
                                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                placeholder="Explain the correct answer"
                            />
                        </div>
                        
                        <button
                            onClick={addQuestion}
                            disabled={!currentQuestion.question.trim()}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusIcon className="h-4 w-4 inline mr-2" />
                            {editingIndex >= 0 ? 'Update Question' : 'Add Question'}
                        </button>
                    </div>
                </div>
                
                {/* Questions List */}
                <div className="bg-white rounded-2xl shadow-large p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Questions ({quiz.questions.length})</h3>
                        <div className="text-sm text-gray-600">
                            Total: {getTotalPoints()} points
                        </div>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {quiz.questions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No questions added yet.</p>
                                <p className="text-sm">Create your first question to get started!</p>
                            </div>
                        ) : (
                            quiz.questions.map((question, index) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 text-sm">
                                                Q{index + 1}: {question.question.substring(0, 50)}...
                                            </h4>
                                            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {questionTypes.find(t => t.value === question.type)?.label}
                                                </span>
                                                <span>{question.points} pts</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1 ml-2">
                                            <button
                                                onClick={() => editQuestion(index)}
                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                            >
                                                <EditIcon className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => deleteQuestion(index)}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                            >
                                                <TrashIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizBuilder;
