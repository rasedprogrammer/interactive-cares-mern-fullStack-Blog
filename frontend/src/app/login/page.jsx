// blog-application/frontend/src/app/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { authRequest, authSuccess, authFailure } from '@/redux/slices/authSlice';
import { login } from '@/utils/authApi';
import Link from 'next/link';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Get state from Redux
    const { loading, error, userInfo } = useSelector((state) => state.auth);

    // Redirect if already logged in
    useEffect(() => {
        if (userInfo) {
            router.push('/'); // Redirect to homepage
        }
    }, [userInfo, router]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            dispatch(authFailure('Please fill in all fields.'));
            return;
        }

        dispatch(authRequest());
        
        try {
            // Call the backend API
            const userData = await login(email, password);
            
            // Dispatch success to Redux (saves token/info to local storage)
            dispatch(authSuccess(userData));
            
            // Redirect happens via the useEffect hook
        } catch (err) {
            // Error message from backend (e.g., 'Invalid email or password')
            const errorMessage = err.response?.data?.message || err.message;
            dispatch(authFailure(errorMessage));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Sign In</h2>
                
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="text-sm text-center">
                    New User? <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">Register Here</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;