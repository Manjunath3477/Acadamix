import React, { useState, useEffect } from 'react';
import { 
    BookOpenIcon, VideoIcon, DocumentIcon, QuizIcon, ClockIcon, 
    PlayIcon, PauseIcon, CheckCircleIcon, LockIcon, UserIcon,
    StarIcon, CommentIcon, ThumbUpIcon, DownloadIcon, LinkIcon
} from '../icons/Icons';

const LearningCenter = ({ courses, assignments, userId, userRole }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState({});
    const [learningPath, setLearningPath] = useState([]);
    const [studyGroups, setStudyGroups] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        loadLearningData();
        generateRecommendations();
        loadStudyGroups();
    }, [userId, courses]);

    const loadLearningData = () => {
        // Generate comprehensive learning content for each course
        const enhancedCourses = courses.map(course => ({
            ...course,
            modules: generateCourseModules(course),
            totalLessons: 0,
            completedLessons: 0,
            estimatedHours: Math.floor(Math.random() * 40) + 20,
            difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
            studentsEnrolled: Math.floor(Math.random() * 200) + 50
        }));

        // Calculate progress
        const userProgress = {};
        enhancedCourses.forEach(course => {
            let totalLessons = 0;
            let completedLessons = 0;
            
            course.modules.forEach(module => {
                totalLessons += module.lessons.length;
                completedLessons += module.lessons.filter(lesson => lesson.completed).length;
            });
            
            course.totalLessons = totalLessons;
            course.completedLessons = completedLessons;
            
            userProgress[course.id] = {
                totalLessons,
                completedLessons,
                completionPercentage: totalLessons > 0 ? (completedLessons / totalLessons * 100).toFixed(1) : 0,
                timeSpent: Math.floor(Math.random() * 50) + 10, // hours
                lastAccessed: generateRandomDate()
            };
        });

        setProgress(userProgress);
        
        // Generate personalized learning path
        const path = generateLearningPath(enhancedCourses);
        setLearningPath(path);

        // Set default selected course if none selected
        if (!selectedCourse && enhancedCourses.length > 0) {
            setSelectedCourse(enhancedCourses[0]);
        }
    };

    const generateCourseModules = (course) => {
        const moduleCount = Math.floor(Math.random() * 4) + 4; // 4-7 modules
        return Array.from({ length: moduleCount }, (_, moduleIndex) => ({
            id: `${course.id}-module-${moduleIndex}`,
            title: [
                'Introduction and Fundamentals',
                'Core Concepts',
                'Practical Applications',
                'Advanced Topics',
                'Case Studies',
                'Project Work',
                'Assessment and Review'
            ][moduleIndex] || `Module ${moduleIndex + 1}`,
            description: `Comprehensive coverage of essential topics in ${course.title}`,
            estimatedHours: Math.floor(Math.random() * 8) + 4,
            isLocked: moduleIndex > 0 && Math.random() > 0.7,
            lessons: generateModuleLessons(course.id, moduleIndex),
            quiz: {
                id: `quiz-${course.id}-${moduleIndex}`,
                title: `Module ${moduleIndex + 1} Quiz`,
                questions: Math.floor(Math.random() * 15) + 10,
                timeLimit: 30,
                attempts: Math.floor(Math.random() * 3),
                maxAttempts: 3,
                bestScore: Math.floor(Math.random() * 40) + 60
            }
        }));
    };

    const generateModuleLessons = (courseId, moduleIndex) => {
        const lessonCount = Math.floor(Math.random() * 6) + 4; // 4-9 lessons
        const lessonTypes = ['video', 'reading', 'interactive', 'assignment', 'discussion'];
        
        return Array.from({ length: lessonCount }, (_, lessonIndex) => {
            const type = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
            return {
                id: `${courseId}-${moduleIndex}-lesson-${lessonIndex}`,
                title: generateLessonTitle(type, lessonIndex),
                type,
                duration: generateLessonDuration(type),
                description: `Detailed exploration of key concepts with practical examples and exercises`,
                completed: Math.random() > 0.6,
                rating: (Math.random() * 2 + 3).toFixed(1),
                views: Math.floor(Math.random() * 500) + 50,
                likes: Math.floor(Math.random() * 100) + 10,
                comments: Math.floor(Math.random() * 25) + 5,
                resources: generateLessonResources(type),
                transcript: type === 'video' ? generateTranscript() : null,
                notes: generateStudentNotes()
            };
        });
    };

    const generateLessonTitle = (type, index) => {
        const titles = {
            video: [
                'Introduction to Key Concepts',
                'Deep Dive: Advanced Techniques',
                'Practical Demonstration',
                'Expert Interview',
                'Case Study Analysis'
            ],
            reading: [
                'Essential Reading: Core Principles',
                'Research Paper Review',
                'Industry Best Practices',
                'Historical Context',
                'Future Trends and Developments'
            ],
            interactive: [
                'Interactive Simulation',
                'Virtual Lab Exercise',
                'Problem-Solving Workshop',
                'Collaborative Exercise',
                'Skill-Building Activity'
            ],
            assignment: [
                'Practical Assignment',
                'Project Milestone',
                'Peer Review Exercise',
                'Portfolio Development',
                'Research Project'
            ],
            discussion: [
                'Discussion Forum',
                'Peer Collaboration',
                'Q&A Session',
                'Group Project Planning',
                'Knowledge Sharing'
            ]
        };
        
        return titles[type][index % titles[type].length] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`;
    };

    const generateLessonDuration = (type) => {
        const durations = {
            video: () => `${Math.floor(Math.random() * 45) + 15} min`,
            reading: () => `${Math.floor(Math.random() * 30) + 10} min`,
            interactive: () => `${Math.floor(Math.random() * 60) + 30} min`,
            assignment: () => `${Math.floor(Math.random() * 120) + 60} min`,
            discussion: () => `${Math.floor(Math.random() * 45) + 15} min`
        };
        
        return durations[type]();
    };

    const generateLessonResources = (type) => {
        const baseResources = [
            { name: 'Lesson Slides', type: 'pdf', size: '2.5 MB' },
            { name: 'Additional Reading', type: 'link', url: 'https://example.com' },
            { name: 'Practice Exercises', type: 'pdf', size: '1.2 MB' }
        ];

        if (type === 'video') {
            baseResources.push(
                { name: 'Video Transcript', type: 'txt', size: '45 KB' },
                { name: 'Closed Captions', type: 'srt', size: '12 KB' }
            );
        }

        return baseResources;
    };

    const generateTranscript = () => {
        return "Welcome to this lesson where we'll explore the fundamental concepts that form the foundation of our subject matter. Throughout this presentation, we'll examine key principles, discuss practical applications, and provide real-world examples to enhance your understanding...";
    };

    const generateStudentNotes = () => {
        return [
            "Key concept: Remember to focus on the practical applications",
            "Important formula covered at 15:30",
            "Good example for assignment reference",
            "Need to review this section for exam"
        ];
    };

    const generateRandomDate = () => {
        const start = new Date(2025, 8, 1); // September 1, 2025
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
    };

    const generateLearningPath = (courses) => {
        return [
            {
                id: 'path-1',
                title: 'Complete Data Structures Module',
                description: 'Finish remaining lessons in Data Structures course',
                estimatedTime: '3 hours',
                priority: 'high',
                courseId: courses[0]?.id,
                progress: 65
            },
            {
                id: 'path-2',
                title: 'Review Algorithm Design Patterns',
                description: 'Study common design patterns before next assignment',
                estimatedTime: '2 hours',
                priority: 'medium',
                courseId: courses[1]?.id,
                progress: 0
            },
            {
                id: 'path-3',
                title: 'Prepare for Midterm Exam',
                description: 'Review key concepts from all modules',
                estimatedTime: '5 hours',
                priority: 'high',
                courseId: courses[0]?.id,
                progress: 25
            }
        ];
    };

    const generateRecommendations = () => {
        setRecommendations([
            {
                id: 'rec-1',
                title: 'Advanced JavaScript Patterns',
                description: 'Based on your progress in web development',
                type: 'course',
                rating: '4.8',
                duration: '12 hours',
                image: 'https://via.placeholder.com/300x200'
            },
            {
                id: 'rec-2',
                title: 'Database Design Workshop',
                description: 'Recommended for your current coursework',
                type: 'workshop',
                rating: '4.6',
                duration: '3 hours',
                image: 'https://via.placeholder.com/300x200'
            },
            {
                id: 'rec-3',
                title: 'Machine Learning Fundamentals',
                description: 'Popular among students in your program',
                type: 'course',
                rating: '4.9',
                duration: '20 hours',
                image: 'https://via.placeholder.com/300x200'
            }
        ]);
    };

    const loadStudyGroups = () => {
        setStudyGroups([
            {
                id: 'group-1',
                name: 'Data Structures Study Group',
                members: 8,
                nextSession: '2025-09-12 15:00',
                topic: 'Binary Trees and Graphs',
                isJoined: true
            },
            {
                id: 'group-2',
                name: 'Algorithm Design Patterns',
                members: 12,
                nextSession: '2025-09-14 18:00',
                topic: 'Dynamic Programming',
                isJoined: false
            },
            {
                id: 'group-3',
                name: 'Exam Prep - CS Fundamentals',
                members: 15,
                nextSession: '2025-09-15 14:00',
                topic: 'Review Session',
                isJoined: false
            }
        ]);
    };

    const handleLessonComplete = (lessonId) => {
        if (selectedModule) {
            const updatedModule = {
                ...selectedModule,
                lessons: selectedModule.lessons.map(lesson =>
                    lesson.id === lessonId ? { ...lesson, completed: true } : lesson
                )
            };
            setSelectedModule(updatedModule);
            
            // Update progress
            const courseProgress = progress[selectedCourse.id];
            if (courseProgress) {
                setProgress(prev => ({
                    ...prev,
                    [selectedCourse.id]: {
                        ...courseProgress,
                        completedLessons: courseProgress.completedLessons + 1,
                        completionPercentage: ((courseProgress.completedLessons + 1) / courseProgress.totalLessons * 100).toFixed(1)
                    }
                }));
            }
        }
    };

    const getLessonIcon = (type) => {
        const icons = {
            video: VideoIcon,
            reading: DocumentIcon,
            interactive: QuizIcon,
            assignment: BookOpenIcon,
            discussion: CommentIcon
        };
        
        const IconComponent = icons[type] || DocumentIcon;
        return <IconComponent className="h-5 w-5" />;
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'Beginner': 'bg-green-100 text-green-800',
            'Intermediate': 'bg-yellow-100 text-yellow-800',
            'Advanced': 'bg-red-100 text-red-800'
        };
        return colors[difficulty] || 'bg-gray-100 text-gray-800';
    };

    // Course Selection View
    if (!selectedCourse) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Learning Center</h2>
                        <p className="text-gray-600">Explore courses and enhance your knowledge</p>
                    </div>
                </div>

                {/* Learning Path */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Your Learning Path</h3>
                    <div className="space-y-3">
                        {learningPath.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                        <span>📚 {item.estimatedTime}</span>
                                        <span className={`px-2 py-1 rounded ${
                                            item.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.priority} priority
                                        </span>
                                    </div>
                                </div>
                                <div className="w-20">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${item.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600">{item.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => {
                        const courseProgress = progress[course.id] || {};
                        return (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                            >
                                <div 
                                    className="h-32 flex items-center justify-center text-white text-2xl font-bold"
                                    style={{ backgroundColor: course.color || '#3B82F6' }}
                                >
                                    {course.code || course.title.substring(0, 3).toUpperCase()}
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(course.difficulty)}`}>
                                            {course.difficulty}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Progress</span>
                                            <span className="font-semibold">{courseProgress.completionPercentage || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full" 
                                                style={{ width: `${courseProgress.completionPercentage || 0}%` }}
                                            ></div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center space-x-1">
                                                    <ClockIcon className="h-4 w-4" />
                                                    <span>{course.estimatedHours}h</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <StarIcon className="h-4 w-4 text-yellow-500" />
                                                    <span>{course.rating}</span>
                                                </span>
                                            </div>
                                            <span>{courseProgress.completedLessons || 0}/{courseProgress.totalLessons || 0} lessons</span>
                                        </div>
                                        
                                        {courseProgress.lastAccessed && (
                                            <p className="text-xs text-gray-500">Last accessed: {courseProgress.lastAccessed}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Recommended for You</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map(rec => (
                            <div key={rec.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center space-x-1">
                                            <StarIcon className="h-4 w-4 text-yellow-500" />
                                            <span>{rec.rating}</span>
                                        </span>
                                        <span className="text-gray-600">{rec.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Study Groups */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Study Groups</h3>
                    <div className="space-y-4">
                        {studyGroups.map(group => (
                            <div key={group.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                                    <p className="text-sm text-gray-600">Next: {group.topic}</p>
                                    <p className="text-xs text-gray-500">{group.nextSession} • {group.members} members</p>
                                </div>
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        group.isJoined 
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {group.isJoined ? 'Joined' : 'Join Group'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Course Detail View
    if (selectedCourse && !selectedModule) {
        return (
            <div className="space-y-6">
                {/* Course Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to Courses
                    </button>
                    
                    <div className="flex items-start space-x-6">
                        <div 
                            className="w-24 h-24 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                            style={{ backgroundColor: selectedCourse.color || '#3B82F6' }}
                        >
                            {selectedCourse.code || selectedCourse.title.substring(0, 3).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h1>
                            <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                    <ClockIcon className="h-4 w-4" />
                                    <span>{selectedCourse.estimatedHours} hours</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <StarIcon className="h-4 w-4 text-yellow-500" />
                                    <span>{selectedCourse.rating} ({selectedCourse.studentsEnrolled} students)</span>
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(selectedCourse.difficulty)}`}>
                                    {selectedCourse.difficulty}
                                </span>
                            </div>
                            
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Overall Progress</span>
                                    <span className="font-semibold">{progress[selectedCourse.id]?.completionPercentage || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-green-500 h-3 rounded-full" 
                                        style={{ width: `${progress[selectedCourse.id]?.completionPercentage || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Modules */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Course Modules</h3>
                    <div className="space-y-4">
                        {selectedCourse.modules?.map((module, index) => {
                            const completedLessons = module.lessons.filter(l => l.completed).length;
                            const completionRate = (completedLessons / module.lessons.length * 100).toFixed(0);
                            
                            return (
                                <div 
                                    key={module.id}
                                    onClick={() => !module.isLocked && setSelectedModule(module)}
                                    className={`border border-gray-200 rounded-lg p-6 transition-all ${
                                        module.isLocked 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:shadow-md cursor-pointer hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            {module.isLocked ? (
                                                <LockIcon className="h-6 w-6 text-gray-400" />
                                            ) : (
                                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">{module.title}</h4>
                                                <p className="text-sm text-gray-600">{module.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">{completedLessons}/{module.lessons.length} lessons</div>
                                            <div className="text-xs text-gray-500">{module.estimatedHours} hours</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 mr-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${completionRate}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">{completionRate}%</span>
                                    </div>
                                    
                                    {module.quiz && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900">{module.quiz.title}</span>
                                                    <span className="text-xs text-gray-600 ml-2">
                                                        {module.quiz.questions} questions • {module.quiz.timeLimit} min
                                                    </span>
                                                </div>
                                                {module.quiz.bestScore && (
                                                    <span className="text-sm font-semibold text-green-600">
                                                        Best: {module.quiz.bestScore}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Module Detail View
    if (selectedModule) {
        return (
            <div className="space-y-6">
                {/* Module Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <button
                        onClick={() => setSelectedModule(null)}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to {selectedCourse.title}
                    </button>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedModule.title}</h1>
                    <p className="text-gray-600 mb-4">{selectedModule.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{selectedModule.estimatedHours} hours</span>
                        </span>
                        <span>{selectedModule.lessons.length} lessons</span>
                        <span>{selectedModule.lessons.filter(l => l.completed).length} completed</span>
                    </div>
                </div>

                {/* Lessons List */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Lessons</h3>
                    <div className="space-y-3">
                        {selectedModule.lessons.map((lesson, index) => (
                            <div 
                                key={lesson.id}
                                onClick={() => setCurrentLesson(lesson)}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${lesson.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        {getLessonIcon(lesson.type)}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>{lesson.duration}</span>
                                            <span className="capitalize">{lesson.type}</span>
                                            {lesson.completed && (
                                                <span className="text-green-600 flex items-center space-x-1">
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    <span>Completed</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center space-x-1">
                                        <StarIcon className="h-4 w-4 text-yellow-500" />
                                        <span>{lesson.rating}</span>
                                    </span>
                                    <span>{lesson.views} views</span>
                                    {!lesson.completed && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLessonComplete(lesson.id);
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Module Quiz */}
                {selectedModule.quiz && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Module Assessment</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900">{selectedModule.quiz.title}</h4>
                                    <p className="text-blue-700">
                                        {selectedModule.quiz.questions} questions • {selectedModule.quiz.timeLimit} minutes
                                    </p>
                                </div>
                                {selectedModule.quiz.bestScore && (
                                    <div className="text-right">
                                        <p className="text-sm text-blue-600">Best Score</p>
                                        <p className="text-2xl font-bold text-blue-900">{selectedModule.quiz.bestScore}%</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-blue-700">
                                    Attempts: {selectedModule.quiz.attempts}/{selectedModule.quiz.maxAttempts}
                                </p>
                                <button 
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={selectedModule.quiz.attempts >= selectedModule.quiz.maxAttempts}
                                >
                                    {selectedModule.quiz.attempts === 0 ? 'Start Quiz' : 'Retake Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default LearningCenter;
