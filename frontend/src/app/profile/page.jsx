'use client';

import { useEffect, useState } from 'react'; // <-- Import useState
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import UserDashboardTabs from './components/UserDashboardTabs';

const ProfilePage = () => {
    const { userInfo, loading: authLoading } = useSelector((state) => state.auth);
    const router = useRouter();
    
    // NEW: State to track client-side mounting
    const [isMounted, setIsMounted] = useState(false); 

    // Set mounted flag to true after the first client-side render
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Protection: Redirect non-logged-in users (only after mounting)
    useEffect(() => {
        // Only run checks if we are on the client AND the auth state is done loading
        if (isMounted && !authLoading) {
             if (!userInfo) {
                router.push('/login?redirect=/profile');
            }
        }
    }, [userInfo, authLoading, router, isMounted]);

    // Use a unified loading state for SSR and the initial client phase
    if (!isMounted || authLoading || !userInfo) {
         // Show a simple loading div that matches the expected HTML from a Server Component 
         // if it were to suspend, or a simple placeholder.
        return <div className="text-center py-20">Loading Profile...</div>;
    }

    // Now we are guaranteed to be on the client AND to have userInfo
    return (
        <div className="py-10 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome, {userInfo.name}</h1>
            <UserDashboardTabs />
        </div>
    );
};

export default ProfilePage;