// blog-application/frontend/src/app/forgot-password/page.jsx
'use client';

import { useState } from 'react';
import { forgotPassword } from '@/utils/authApi';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            // Note: The backend returns a success message even if the email doesn't exist (for security)
            const successMessage = await forgotPassword(email);
            setMessage(successMessage);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
                <p className="text-sm text-center text-gray-500">
                    Enter your email to receive a password reset link.
                </p>
                
                {message && <div className="p-3 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>
                
                <div className="text-sm text-center">
                    Remember your password? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;