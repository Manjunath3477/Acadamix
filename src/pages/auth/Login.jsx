import React, { useState } from 'react';
import AuthCard from '../../components/common/AuthCard';
import { GraduationCapIcon, MailIcon, LockIcon } from '../../components/icons/Icons';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
        }
    };

    return (
        <AuthCard>
            <div className="flex items-center justify-center mb-6"><GraduationCapIcon className="h-10 w-auto text-blue-600" /><h1 className="ml-3 text-3xl font-extrabold text-gray-900">Acadamix</h1></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 mb-6">Sign in to continue to your dashboard.</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative"><MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md" placeholder="Email address" /></div>
                <div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md" placeholder="Password" /></div>
                <div className="text-sm text-right"><a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a></div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg">Sign in</button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-8">Don't have an account?{' '}<button onClick={() => setPage('register')} className="font-medium text-blue-600 hover:text-blue-500">Register here</button></p>
        </AuthCard>
    );
};
export default Login;