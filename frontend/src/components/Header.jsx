// blog-application/frontend/src/components/Header.jsx
'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchBarComponent from './SearchBarComponent'; 

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
            if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen, isProfileDropdownOpen]);

    const logoutHandler = () => {
        dispatch(logout());
        router.push('/login');
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };


    const NavigationLinks = ({ isMobile = false }) => (
        <>
            <Link 
                href="/" 
                className={`${isMobile ? 'block py-3 border-b border-gray-700' : 'hidden md:block'} hover:text-purple-300 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                Home
            </Link>
            
            {isMounted && userInfo && (
                <Link 
                    href="/create-post" 
                    className={`${isMobile ? 'block py-3 border-b border-gray-700' : 'hidden md:block'} bg-linear-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl`}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    ✏️ Write Post
                </Link>
            )}
        </>
    );

    const UserSection = ({ isMobile = false }) => {
        if (!isMounted) {
            return (
                <div className={`${isMobile ? 'block py-3' : 'hidden md:block'} w-24 h-8 bg-gray-700 rounded animate-pulse`}></div>
            );
        }

        if (!userInfo) {
            return (
                <div className={`${isMobile ? 'flex flex-col space-y-3 py-3' : 'hidden md:flex items-center space-x-3'}`}>
                    <Link 
                        href="/login" 
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center shadow-lg hover:shadow-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link 
                        href="/register" 
                        className="bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors text-center shadow-lg hover:shadow-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Register
                    </Link>
                </div>
            );
        }

        if (isMobile) {
            return (
                <div className="py-3 border-t border-gray-700">
                    <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-750 rounded-lg">
                        <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                            {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium">{userInfo.name || 'User'}</span>
                    </div>
                    
                    <Link
                        href="/profile"
                        className="block py-2 px-4 hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        👤 My Profile
                    </Link>

                    {userInfo?.role === 'Admin' && (
                        <Link
                            href="/admin/dashboard"
                            className="block py-2 px-4 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            ⚡ Admin Dashboard
                        </Link>
                    )}

                    <button
                        onClick={logoutHandler}
                        className="w-full text-left py-2 px-4 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors mt-2"
                    >
                        🚪 Logout
                    </button>
                </div>
            );
        }

        return (
            <div className="profile-dropdown-container relative hidden md:block">
                <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors shadow-lg border border-gray-600"
                >
                    <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-32 truncate">{userInfo.name || 'Profile'}</span>
                    <svg 
                        className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl z-50 border border-gray-700 backdrop-blur-sm">
                        <div className="p-4 border-b border-gray-700">
                            <div className="font-medium truncate">{userInfo.name}</div>
                            <div className="text-sm text-gray-400 truncate">{userInfo.email}</div>
                        </div>
                        
                        <div className="p-2">
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-3 py-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                                onClick={() => setIsProfileDropdownOpen(false)}
                            >
                                <span>👤</span>
                                <span>My Profile</span>
                            </Link>

                            {userInfo?.role === 'Admin' && (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                >
                                    <span>⚡</span>
                                    <span>Admin Dashboard</span>
                                </Link>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-700">
                            <button
                                onClick={logoutHandler}
                                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <header className="bg-linear-to-r from-gray-900 to-gray-800 text-white shadow-2xl sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
            <nav className="container mx-auto px-4 py-3">
                {/* Main Navigation Bar */}
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all"
                    >
                        📝 BlogApp
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavigationLinks />
                        <SearchBarComponent />
                        <UserSection />
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                            <span className={`block h-0.5 w-6 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`block h-0.5 w-6 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-6 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-container md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 animate-slideDown">
                        <SearchBarComponent isMobile={true} /> {/* NEW: Mobile Search Bar */}
                        <div className="flex flex-col space-y-1">
                            <NavigationLinks isMobile={true} />
                            <UserSection isMobile={true} />
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;