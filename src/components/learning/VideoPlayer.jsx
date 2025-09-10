import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, VolumeIcon, SettingsIcon, FullscreenIcon, BookmarkIcon, NotesIcon } from '../icons/Icons';

const VideoPlayer = ({ courseId, lessons = [] }) => {
    const [currentLesson, setCurrentLesson] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // Mock lessons data
    const mockLessons = [
        {
            id: 1,
            title: 'Introduction to React Hooks',
            description: 'Learn the basics of React Hooks and how to use them effectively.',
            duration: '24:30',
            thumbnail: '/thumbnails/lesson1.jpg',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            completed: false,
            bookmarked: false
        },
        {
            id: 2,
            title: 'Advanced State Management',
            description: 'Deep dive into complex state management patterns with useReducer and Context.',
            duration: '35:15',
            thumbnail: '/thumbnails/lesson2.jpg',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            completed: true,
            bookmarked: true
        },
        {
            id: 3,
            title: 'Performance Optimization',
            description: 'Learn how to optimize your React applications for better performance.',
            duration: '28:45',
            thumbnail: '/thumbnails/lesson3.jpg',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            completed: false,
            bookmarked: false
        }
    ];

    const currentLessonData = mockLessons[currentLesson] || mockLessons[0];

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);
        
        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        
        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [currentLesson]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (time) => {
        const video = videoRef.current;
        video.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (newVolume) => {
        const video = videoRef.current;
        video.volume = newVolume;
        setVolume(newVolume);
    };

    const handleSpeedChange = (speed) => {
        const video = videoRef.current;
        video.playbackRate = speed;
        setPlaybackSpeed(speed);
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            playerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const addNote = () => {
        if (!newNote.trim()) return;
        
        const note = {
            id: Date.now(),
            text: newNote,
            timestamp: currentTime,
            lesson: currentLessonData.title
        };
        
        setNotes([...notes, note]);
        setNewNote('');
    };

    const jumpToNote = (timestamp) => {
        handleSeek(timestamp);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Video Player */}
                <div className="lg:col-span-3">
                    <div ref={playerRef} className="bg-black rounded-2xl overflow-hidden shadow-large">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                className="w-full aspect-video"
                                src={currentLessonData.videoUrl}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                poster={currentLessonData.thumbnail}
                            />
                            
                            {/* Video Controls Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="relative h-2 bg-white/20 rounded-full cursor-pointer"
                                         onClick={(e) => {
                                             const rect = e.currentTarget.getBoundingClientRect();
                                             const pos = (e.clientX - rect.left) / rect.width;
                                             handleSeek(pos * duration);
                                         }}>
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Controls */}
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={togglePlay}
                                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                                        </button>
                                        
                                        <div className="flex items-center space-x-2">
                                            <VolumeIcon className="h-5 w-5" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={volume}
                                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                                className="w-20"
                                            />
                                        </div>
                                        
                                        <span className="text-sm">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={playbackSpeed}
                                            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                                            className="bg-white/20 text-white rounded px-2 py-1 text-sm"
                                        >
                                            <option value={0.5}>0.5x</option>
                                            <option value={0.75}>0.75x</option>
                                            <option value={1}>1x</option>
                                            <option value={1.25}>1.25x</option>
                                            <option value={1.5}>1.5x</option>
                                            <option value={2}>2x</option>
                                        </select>
                                        
                                        <button
                                            onClick={() => setShowNotes(!showNotes)}
                                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            <NotesIcon className="h-5 w-5" />
                                        </button>
                                        
                                        <button
                                            onClick={toggleFullscreen}
                                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            <FullscreenIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Lesson Info */}
                    <div className="mt-6 bg-white rounded-2xl shadow-soft p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{currentLessonData.title}</h2>
                                <p className="text-gray-600 mt-2">{currentLessonData.description}</p>
                            </div>
                            <button className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors">
                                <BookmarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Duration: {currentLessonData.duration}</span>
                            <span>•</span>
                            <span>Lesson {currentLesson + 1} of {mockLessons.length}</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                currentLessonData.completed 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {currentLessonData.completed ? 'Completed' : 'In Progress'}
                            </span>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {showNotes && (
                        <div className="mt-6 bg-white rounded-2xl shadow-soft p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">My Notes</h3>
                            
                            {/* Add Note */}
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-sm font-medium text-blue-800">
                                        Add note at {formatTime(currentTime)}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Enter your note..."
                                        className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && addNote()}
                                    />
                                    <button
                                        onClick={addNote}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                            
                            {/* Notes List */}
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {notes.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No notes yet. Add your first note!</p>
                                ) : (
                                    notes.map((note) => (
                                        <div key={note.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-gray-800">{note.text}</p>
                                                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                                                        <button
                                                            onClick={() => jumpToNote(note.timestamp)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            {formatTime(note.timestamp)}
                                                        </button>
                                                        <span>•</span>
                                                        <span>{note.lesson}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Lesson Playlist */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Course Lessons</h3>
                    <div className="space-y-3">
                        {mockLessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                onClick={() => setCurrentLesson(index)}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                    index === currentLesson
                                        ? 'bg-blue-50 border-2 border-blue-200'
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={lesson.thumbnail}
                                        alt={lesson.title}
                                        className="w-16 h-12 object-cover rounded"
                                        onError={(e) => e.target.src = '/thumbnails/default.jpg'}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium truncate ${
                                            index === currentLesson ? 'text-blue-800' : 'text-gray-800'
                                        }`}>
                                            {lesson.title}
                                        </h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                                            {lesson.completed && (
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            )}
                                            {lesson.bookmarked && (
                                                <BookmarkIcon className="h-3 w-3 text-yellow-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full ${
                                        index === currentLesson 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {index === currentLesson && isPlaying ? (
                                            <PauseIcon className="h-4 w-4" />
                                        ) : (
                                            <PlayIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Progress Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Course Progress</span>
                            <span className="text-sm font-bold text-green-600">
                                {Math.round((mockLessons.filter(l => l.completed).length / mockLessons.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${(mockLessons.filter(l => l.completed).length / mockLessons.length) * 100}%` 
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            {mockLessons.filter(l => l.completed).length} of {mockLessons.length} lessons completed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
