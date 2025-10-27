// blog-application/frontend/src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import { fetchPosts } from '@/utils/postApi';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar'; // <-- Import the SearchBar
import CategoryList from '@/components/CategoryList';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(''); // NEW state for search

    // Function to load posts (called on mount and on search)
    const loadPosts = async (keyword = '') => {
        setLoading(true);
        setError(null);
        try {
            // Pass the keyword to the fetchPosts function
            const data = await fetchPosts(keyword); 
            setPosts(data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch posts.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and whenever searchKeyword changes
    useEffect(() => {
        loadPosts(searchKeyword);
    }, [searchKeyword]); // Re-fetch when search keyword changes

    // Handler for SearchBar submission
    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
    };

    // Display the list of posts (FR-6.1)
    return (
        <div className="py-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Latest Blog Posts</h1>
            
            {/* NEW: Integrate the SearchBar (FR-3.6) */}
            <SearchBar onSearch={handleSearch} /> 

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