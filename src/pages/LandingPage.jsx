import React from 'react';
import { GraduationCapIcon, ShieldCheckIcon, PenToolIcon, UserCheckIcon } from '../components/icons/Icons';

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
    <div className="bg-white text-gray-800 font-sans">
        {/* --- Hero Section --- */}
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/home-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-purple-900/60"></div>
            <div className="relative z-10 w-full px-6 pt-14 lg:px-8">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <a href="#" className="-m-1.5 p-1.5 flex items-center">
                                <GraduationCapIcon className="h-8 w-auto text-white drop-shadow-lg" />
                                <span className="ml-3 text-2xl font-bold text-white drop-shadow-lg">Acadamix</span>
                            </a>
                        </div>
                        <div className="lg:flex lg:flex-1 lg:justify-end">
                            <button onClick={() => setPage('login')} className="text-sm font-semibold leading-6 text-white hover:text-blue-200 transition">Log in <span aria-hidden="true">&rarr;</span></button>
                        </div>
                    </nav>
                </header>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg animate-fade-in">
                        A modern learning experience for a brighter future.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-blue-100 animate-fade-in-slow">
                        Acadamix provides a seamless, intuitive, and powerful platform for students, faculty, and administrators. Elevate education with our next-generation LMS.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <button
                            onClick={() => setPage('register')}
                            className="rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-lg font-semibold text-white shadow-xl hover:from-blue-600 hover:to-purple-600 transition"
                        >
                            Get started
                        </button>
                        <a href="#features" className="text-lg font-semibold leading-6 text-white hover:text-blue-200 transition">Learn more <span aria-hidden="true">→</span></a>
                    </div>
                </div>
                {/* --- Stats Section --- */}
                <div className="flex justify-center gap-10 mt-10">
                    {stats.map(stat => (
                        <div key={stat.label} className="bg-white bg-opacity-20 rounded-xl px-6 py-4 text-center shadow-lg backdrop-blur-md">
                            <div className="text-2xl font-bold text-white drop-shadow">{stat.value}</div>
                            <div className="text-blue-100 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- Features Section --- */}
        <div id="features" className="py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Everything You Need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A Platform Tailored For Everyone</p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Whether you're a student managing your workload, a faculty member designing a curriculum, or an administrator overseeing the institution, Acadamix has you covered.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature, idx) => (
                            <div
                                key={feature.name}
                                className={`flex flex-col p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 duration-300 animate-slide-up`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                                    <div className={`flex-none rounded-lg p-3 ${feature.color} shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>

        {/* --- Call to Action Section --- */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
                    Ready to elevate your learning experience?
                    <br />
                    Start with Acadamix today.
                </h2>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={() => setPage('register')}
                        className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-700 shadow-lg hover:bg-blue-100 transition"
                    >
                        Sign up for free
                    </button>
                    <a href="#" className="text-lg font-semibold leading-6 text-white hover:text-blue-200 transition">
                        Request a demo <span aria-hidden="true">→</span>
                    </a>
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