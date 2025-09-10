import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, PaperclipIcon, EmojiIcon, UserIcon, OnlineIcon } from '../icons/Icons';

const ChatSystem = ({ courseId, currentUser, users = [] }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState('general');
    const messagesEndRef = useRef(null);

    // Mock messages for demo
    useEffect(() => {
        const mockMessages = [
            {
                id: 1,
                sender: 'Dr. Smith',
                message: 'Welcome to the course discussion! Please feel free to ask any questions.',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                type: 'text',
                avatar: '/avatars/teacher.jpg'
            },
            {
                id: 2,
                sender: 'Alice Johnson',
                message: 'Thank you for the introduction! I have a question about the assignment due date.',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                type: 'text',
                avatar: '/avatars/student1.jpg'
            },
            {
                id: 3,
                sender: 'Bob Wilson',
                message: 'Can someone share the reading materials for Chapter 3?',
                timestamp: new Date(Date.now() - 900000).toISOString(),
                type: 'text',
                avatar: '/avatars/student2.jpg'
            }
        ];
        setMessages(mockMessages);
        setOnlineUsers(['Dr. Smith', 'Alice Johnson', 'You']);
    }, [courseId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now(),
            sender: currentUser?.name || 'You',
            message: newMessage,
            timestamp: new Date().toISOString(),
            type: 'text',
            avatar: currentUser?.avatar || '/avatars/default.jpg'
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const MessageBubble = ({ message, isOwnMessage }) => (
        <div className={`flex items-start space-x-3 mb-4 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <img 
                src={message.avatar} 
                alt={message.sender}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => e.target.src = '/avatars/default.jpg'}
            />
            <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'text-right' : ''}`}>
                <div className={`px-4 py-2 rounded-2xl shadow-soft ${
                    isOwnMessage 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-white border border-gray-200'
                }`}>
                    {!isOwnMessage && (
                        <p className="text-xs font-semibold text-gray-600 mb-1">{message.sender}</p>
                    )}
                    <p className={`text-sm ${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
                        {message.message}
                    </p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex h-96 bg-white rounded-2xl shadow-large overflow-hidden">
            {/* Sidebar - Online Users */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Course Chat</h3>
                
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Online Now ({onlineUsers.length})</h4>
                    <div className="space-y-2">
                        {onlineUsers.map((user, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="relative">
                                    <img 
                                        src={`/avatars/user${index + 1}.jpg`}
                                        alt={user}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => e.target.src = '/avatars/default.jpg'}
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{user}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Chat Channels</h4>
                    <div className="space-y-1">
                        {['general', 'assignments', 'announcements'].map((channel) => (
                            <button
                                key={channel}
                                onClick={() => setSelectedChat(channel)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    selectedChat === channel
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                # {channel}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-lg font-bold text-gray-800">
                        # {selectedChat}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {selectedChat === 'general' ? 'General course discussion' : 
                         selectedChat === 'assignments' ? 'Assignment related questions' : 
                         'Course announcements'}
                    </p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={message.sender === currentUser?.name || message.sender === 'You'}
                        />
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping.length > 0 && (
                        <div className="flex items-center space-x-2 text-gray-500">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm">{isTyping.join(', ')} typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                        <button
                            type="button"
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <PaperclipIcon className="h-5 w-5" />
                        </button>
                        
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                            >
                                <EmojiIcon className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                            <SendIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatSystem;
