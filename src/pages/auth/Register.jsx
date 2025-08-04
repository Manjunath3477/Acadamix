import React, { useState } from 'react';
import AuthCard from '../../components/common/AuthCard';
import { GraduationCapIcon, MailIcon, LockIcon, UserIcon } from '../../components/icons/Icons';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const Register = ({ setPage }) => {
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { return setError('Password must be at least 6 characters long.'); }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                name: name, email: email, role: role,
                avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${name.charAt(0).toUpperCase()}`
            });
        } catch (err) {
            setError('Failed to create an account. The email may already be in use.');
        }
    };

    return (
        <AuthCard>
            <div className="flex items-center justify-center mb-6"><GraduationCapIcon className="h-10 w-auto text-blue-600" /><h1 className="ml-3 text-3xl font-extrabold text-gray-900">Acadamix</h1></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Create Your Account</h2>
            <p className="text-gray-600 mb-6">Join our community of learners and educators.</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
            <form onSubmit={handleRegister} className="space-y-5">
                <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md" placeholder="Full Name" /></div>
                <div className="relative"><MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md" placeholder="Email address" /></div>
                <div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md" placeholder="Password (min. 6 characters)" /></div>
                <div><label htmlFor="role-register" className="block text-sm font-medium text-gray-700">Register as a...</label><select id="role-register" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 rounded-md"><option value="student">Student</option><option value="faculty">Faculty</option><option value="admin">Admin</option></select></div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg">Create Account</button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-8">Already have an account?{' '}<button onClick={() => setPage('login')} className="font-medium text-blue-600 hover:text-blue-500">Sign in</button></p>
        </AuthCard>
    );
};
export default Register;
