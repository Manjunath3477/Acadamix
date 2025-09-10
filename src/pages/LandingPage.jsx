import React from 'react';
import { GraduationCapIcon, ShieldCheckIcon, PenToolIcon, UserCheckIcon } from '../components/icons/Icons';
import UsersList from '../components/common/UsersList';
import CoursesList from '../components/common/CoursesList';
import AssignmentsList from '../components/common/AssignmentsList';

const stats = [
    { label: 'Students', value: '' },
    { label: 'Faculty', value: '' },
    { label: 'Courses', value: '' },
];

const features = [
    {
        name: 'For Students',
        description: 'Access all your courses, submit assignments, and track your progress in one intuitive dashboard.',
        icon: <UserCheckIcon className="h-8 w-8 text-white" />,
        color: 'bg-blue-500'
    },
    {
        name: 'For Faculty',
        description: 'Effortlessly create and manage courses, design quizzes, and provide valuable feedback to your students.',
        icon: <PenToolIcon className="h-8 w-8 text-white" />,
        color: 'bg-indigo-500'
    },
    {
        name: 'For Admins',
        description: 'Oversee the entire platform with powerful tools to manage users, courses, and system analytics.',
        icon: <ShieldCheckIcon className="h-8 w-8 text-white" />,
        color: 'bg-purple-500'
    }
];

const LandingPage = ({ setPage }) => (
    <div className="bg-white text-gray-800 font-inter">
        {/* --- Enhanced Hero Section --- */}
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('/home-bg.jpg')" }}
        >
            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/50 to-purple-900/70"></div>
            
            {/* Floating LMS Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Educational Icons */}
                <div className="absolute top-20 left-10 text-5xl animate-bounce opacity-70" style={{animationDelay: '0s'}}>📚</div>
                <div className="absolute top-40 right-16 text-4xl animate-float opacity-60" style={{animationDelay: '1s'}}>🎓</div>
                <div className="absolute bottom-32 left-20 text-6xl animate-pulse opacity-50" style={{animationDelay: '2s'}}>⭐</div>
                <div className="absolute top-60 left-1/4 text-3xl animate-spin-slow opacity-70" style={{animationDelay: '0.5s'}}>🚀</div>
                <div className="absolute bottom-40 right-20 text-4xl animate-bounce opacity-60" style={{animationDelay: '1.5s'}}>💡</div>
                <div className="absolute top-1/3 right-1/3 text-5xl animate-float opacity-50" style={{animationDelay: '3s'}}>🎯</div>
                <div className="absolute bottom-60 left-1/3 text-3xl animate-pulse opacity-60" style={{animationDelay: '2.5s'}}>📝</div>
                <div className="absolute top-80 right-40 text-4xl animate-bounce opacity-70" style={{animationDelay: '4s'}}>🌟</div>
                
                {/* Geometric Shapes */}
                <div className="absolute top-20 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg animate-float transform rotate-45" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-10 w-8 h-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20 transform rotate-12 animate-spin-slow" style={{animationDelay: '3s'}}></div>
            </div>
            
            <div className="relative z-10 w-full px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    {/* Animated Title with Emojis */}
                    <div className="mb-8 animate-fade-in">
                        <span className="inline-block text-4xl animate-bounce mr-4" style={{animationDelay: '0.5s'}}>🎪</span>
                        <h1 className="inline text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                            Transform Learning Into
                        </h1>
                    </div>
                    <div className="animate-slide-up">
                        <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text mb-6 hover:animate-pulse">
                            An Amazing Adventure! ✨
                        </h2>
                    </div>
                    <p className="mt-6 text-xl leading-8 text-blue-100 animate-fade-in-slow max-w-2xl mx-auto">
                        🚀 <strong>Join thousands of students</strong> who are already experiencing the future of education! 
                        From interactive courses to real-time collaboration, Acadamix makes learning <em>fun, engaging, and effective</em>.
                    </p>
                    
                    {/* Feature highlights with emojis */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4 animate-slide-up">
                        <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                            📱 Mobile Friendly
                        </span>
                        <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                            ⚡ Real-time Updates
                        </span>
                        <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium backdrop-blur-sm">
                            🎯 Smart Analytics
                        </span>
                    </div>
                    
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => setPage('register')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-lg font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="relative flex items-center gap-2">
                                <span className="animate-bounce">🚀</span>
                                Start Your Journey
                                <span className="group-hover:animate-bounce">✨</span>
                            </span>
                        </button>
                        
                        <button className="group px-8 py-4 border-2 border-white/70 rounded-2xl text-lg font-semibold text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                            <span className="flex items-center gap-2">
                                <span className="animate-pulse">📖</span>
                                Explore Features
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                        </button>
                    </div>
                </div>
                {/* --- Amazing Stats Section --- */}
                <div className="flex flex-wrap justify-center gap-6 mt-16 px-4">
                    <div className="group bg-gradient-to-br from-white/20 to-white/10 rounded-2xl px-8 py-6 text-center shadow-2xl backdrop-blur-lg border border-white/20 hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer">
                        <div className="text-4xl mb-2 animate-bounce">🎓</div>
                        <div className="text-3xl font-bold text-white drop-shadow mb-1">50K+</div>
                        <div className="text-blue-200 text-sm font-medium">Happy Students</div>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-white/20 to-white/10 rounded-2xl px-8 py-6 text-center shadow-2xl backdrop-blur-lg border border-white/20 hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.2s'}}>
                        <div className="text-4xl mb-2 animate-pulse">👨‍🏫</div>
                        <div className="text-3xl font-bold text-white drop-shadow mb-1">2K+</div>
                        <div className="text-blue-200 text-sm font-medium">Expert Teachers</div>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-white/20 to-white/10 rounded-2xl px-8 py-6 text-center shadow-2xl backdrop-blur-lg border border-white/20 hover:scale-110 hover:rotate-2 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.4s'}}>
                        <div className="text-4xl mb-2 animate-bounce">📚</div>
                        <div className="text-3xl font-bold text-white drop-shadow mb-1">1000+</div>
                        <div className="text-blue-200 text-sm font-medium">Courses Available</div>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-white/20 to-white/10 rounded-2xl px-8 py-6 text-center shadow-2xl backdrop-blur-lg border border-white/20 hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer" style={{animationDelay: '0.6s'}}>
                        <div className="text-4xl mb-2 animate-pulse">⭐</div>
                        <div className="text-3xl font-bold text-white drop-shadow mb-1">98%</div>
                        <div className="text-blue-200 text-sm font-medium">Satisfaction Rate</div>
                    </div>
                </div>
            </div>
        </div>

                {/* --- Features Section --- */}
        <div id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float" style={{animationDelay: '0s'}}>🎯</div>
                <div className="absolute top-32 right-20 text-4xl opacity-10 animate-bounce" style={{animationDelay: '1s'}}>💡</div>
                <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}>🚀</div>
                <div className="absolute bottom-32 right-10 text-3xl opacity-10 animate-spin-slow" style={{animationDelay: '1.5s'}}>⚡</div>
            </div>
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                <div className="mx-auto max-w-2xl lg:text-center animate-slide-up">
                    <h2 className="text-base font-semibold leading-7 text-blue-600 flex items-center justify-center gap-2">
                        <span className="animate-bounce">🌟</span>
                        Everything You Need
                        <span className="animate-pulse">✨</span>
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                        A Platform Tailored For Everyone
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                        🎓 Whether you're a <strong>student</strong> managing coursework, a <strong>faculty member</strong> designing curriculum, 
                        or an <strong>administrator</strong> overseeing operations - Acadamix transforms education into an engaging experience!
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature, idx) => (
                            <div
                                key={feature.name}
                                className={`group flex flex-col p-8 bg-white rounded-3xl shadow-xl hover:shadow-3xl transition-all transform hover:-translate-y-6 hover:scale-105 duration-500 animate-slide-up cursor-pointer relative overflow-hidden border border-gray-100`}
                                style={{ animationDelay: `${idx * 0.2}s` }}
                            >
                                {/* Animated background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                
                                {/* Fun emojis that appear on hover */}
                                <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    {idx === 0 && <span className="text-2xl animate-bounce">🎒</span>}
                                    {idx === 1 && <span className="text-2xl animate-bounce">📊</span>}
                                    {idx === 2 && <span className="text-2xl animate-bounce">⚙️</span>}
                                </div>
                                
                                <dt className="relative flex items-center gap-x-4 text-xl font-bold leading-7 text-gray-900 mb-6">
                                    <div className={`relative flex-none rounded-2xl p-4 ${feature.color} shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                                        <div className="relative">{feature.icon}</div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                                        {feature.name}
                                    </span>
                                </dt>
                                <dd className="relative mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto group-hover:text-gray-800 transition-colors duration-300 mb-4">
                                        {feature.description}
                                    </p>
                                    {/* Interactive "Learn More" that appears on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <button className={`inline-flex items-center text-sm font-semibold ${feature.color.replace('bg-', 'text-')}-600 hover:${feature.color.replace('bg-', 'text-')}-800 transition-colors duration-300`}>
                                            Explore more
                                            <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                                        </button>
                                    </div>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>

        {/* --- Footer --- */}
        <footer className="bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-400">
                <div className="flex items-center gap-2">
                    <GraduationCapIcon className="h-6 w-6 text-blue-400" />
                    <span className="font-bold text-white">Acadamix</span>
                </div>
                <div className="mt-4 md:mt-0">
                    &copy; {new Date().getFullYear()} Acadamix. All rights reserved.
                </div>
            </div>
        </footer>

        {/* --- Animations (add to your CSS or Tailwind config) --- */}
        <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 1s ease; }
            .animate-fade-in-slow { animation: fade-in 2s ease; }
            @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
            .animate-slide-up { animation: slide-up 0.7s cubic-bezier(.4,0,.2,1) both; }
        `}</style>
    </div>
);

export default LandingPage;