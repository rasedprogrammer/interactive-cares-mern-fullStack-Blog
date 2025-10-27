// blog-application/frontend/src/components/Header.jsx
'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; // <-- Import useState and useEffect

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    // 1. New state to track client mounting
    const [isMounted, setIsMounted] = useState(false); 

    // 2. Set isMounted to true after the component mounts on the client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <header className="bg-gray-800 text-white shadow-lg">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo / Site Title */}
                <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
                    BlogApp
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-4 items-center">
                    <Link href="/" className="hover:text-gray-300">Home</Link>
                    
                    {/* 3. Conditional Rendering only after mounting */}
                    {isMounted ? (
                        userInfo ? (
                            // --- Logged In User Links ---
                            <div className="relative">
                                
                                <button
                                    className="peer flex items-center space-x-2 text-white bg-gray-700 py-2 px-3 rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    <span>{userInfo.name || 'Profile'}</span>
                                </button>

                                {/* Dropdown menu */}
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 
                                            opacity-0 invisible peer-hover:opacity-100 peer-hover:visible 
                                            hover:opacity-100 hover:visible transition-all duration-300"
                                >   
                                <Link 
                                href="/create-post" 
                                className="bg-purple-600 px-3 py-2 rounded hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                                Write Post
                            </Link>
                                
                                    <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                    My Profile
                                    </Link>

                                    {userInfo?.role === 'Admin' && (
                                        <>
                                        <Link
                                            href="/admin/dashboard"
                                            className="block px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            Admin Dashboard
                                        </Link>
                                        
                                        </>
                                    
                                    )}

                                    <button
                                    onClick={logoutHandler}
                                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 border-t border-gray-200"
                                    >
                                    Logout
                                    </button>
                                </div>
                                </div>
                        ) : (
                            // --- Guest/Logged Out Links ---
                            <>
                                <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors">
                                    Register
                                </Link>
                            </>
                        )
                    ) : (
                        // Optional: A placeholder/skeleton while mounting
                        <div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div> 
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;