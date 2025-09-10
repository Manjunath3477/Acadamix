import React, { useState } from 'react';
import AuthCard from '../../components/common/AuthCard';
import { GraduationCapIcon, MailIcon, UserIcon } from '../../components/icons/Icons';

const Login = ({ setPage, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            // Real authentication with backend
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.user) {
                // Successful login
                localStorage.setItem('acadamix_user', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                // Failed login
                setError(data.error || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Unable to connect to server. Please try again.');
        }
    };

    const handleQuickLogin = async (userRole) => {
        const testCredentials = {
            admin: { email: 'admin@acadamix.edu', password: 'admin123' },
            faculty: { email: 'faculty@acadamix.edu', password: 'faculty123' },
            student: { email: 'student@acadamix.edu', password: 'student123' }
        };
        
        const credentials = testCredentials[userRole];
        if (!credentials) return;
        
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok && data.user) {
                localStorage.setItem('acadamix_user', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                setError(`Test ${userRole} account not found. Please use the form below to login.`);
            }
        } catch (error) {
            console.error('Quick login error:', error);
            setError('Unable to connect to server for quick login.');
        }
    };

    return (
        <AuthCard>
            <div className="flex items-center justify-center mb-6">
                <GraduationCapIcon className="h-10 w-auto text-blue-600" />
                <h1 className="ml-3 text-3xl font-extrabold text-gray-900">Acadamix</h1>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 mb-6">Sign in to continue to your dashboard.</p>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
            
            {/* Quick Login Buttons */}
            <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Quick Login (Demo):</p>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => handleQuickLogin('admin')}
                        className="px-3 py-2 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Admin
                    </button>
                    <button
                        onClick={() => handleQuickLogin('faculty')}
                        className="px-3 py-2 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Faculty
                    </button>
                    <button
                        onClick={() => handleQuickLogin('student')}
                        className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Student
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    <p>Test credentials:</p>
                    <p>Admin: admin@acadamix.edu / admin123</p>
                    <p>Faculty: faculty@acadamix.edu / faculty123</p>
                    <p>Student: student@acadamix.edu / student123</p>
                </div>
            </div>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        id="email" 
                        type="email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Email address" 
                    />
                </div>
                
                <div className="relative">
                    <input 
                        id="password" 
                        type="password" 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Password" 
                    />
                </div>
                
                <div className="text-sm text-right">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-colors"
                >
                    Sign in
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-600 mt-8">
                Don't have an account?{' '}
                <button 
                    onClick={() => setPage('register')} 
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Register here
                </button>
            </p>
        </AuthCard>
    );
};

export default Login;