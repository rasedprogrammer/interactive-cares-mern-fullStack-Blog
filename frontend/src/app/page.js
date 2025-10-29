// blog-application/frontend/src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import { fetchPosts } from '@/utils/postApi';
import PostCard from '@/components/PostCard';
// import SearchBar from '@/components/SearchBar'; // <-- REMOVE: NOT NEEDED
import CategoryList from '@/components/CategoryList';
// NEW: Import necessary hooks for URL params
import { useSearchParams } from 'next/navigation'; 

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // NEW: Get keyword from URL search parameters
    const searchParams = useSearchParams();
    const searchKeyword = searchParams.get('keyword') || ''; // Read keyword from URL

    // Function to load posts (called on mount and whenever the URL changes)
    const loadPosts = async (keyword = '') => {
        setLoading(true);
        setError(null);
        try {
            // Pass the keyword read from the URL
            const data = await fetchPosts(keyword); 
            setPosts(data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch posts.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // CRITICAL FIX: Load posts whenever the URL keyword changes
    useEffect(() => {
        // Pass the keyword read from the URL to loadPosts
        loadPosts(searchKeyword);
    }, [searchKeyword]); // Dependency is the keyword from the URL

    // ... (No need for handleSearch, loadPosts is triggered by useEffect) ...
    
    return (
        <div className="py-10 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                {searchKeyword ? `Search Results for: "${searchKeyword}"` : 'Latest Blog Posts'}
            </h1>
            
            <div className="mb-10">
                <CategoryList /> 
            </div>

            {loading && <div className="text-center py-12 text-xl font-semibold">Loading Posts...</div>}
            
            {/* Display status based on current search */}
            {!loading && posts.length === 0 && (
                 <div className="text-center py-12 text-xl text-gray-600">
                     {searchKeyword 
                         ? `No posts found matching: "${searchKeyword}"`
                         : `No published posts found yet. Start writing!`
                     }
                 </div>
            )}
            
            {!loading && posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} /> 
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;