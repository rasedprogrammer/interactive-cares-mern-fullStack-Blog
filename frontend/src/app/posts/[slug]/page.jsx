// blog-application/frontend/src/app/posts/[slug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchPostBySlug } from '@/utils/postApi';
import ReactionButtons from '@/components/ReactionButtons';
import CommentSection from './CommentSection';
import SanitizedContent from '@/components/SanitizedContent';
// We'll import CommentSection and Likes component later
// import { calculateReadTime } from '@/utils/readTime'; // We will create this utility

const PostDetailsPage = () => {
    const params = useParams(); // Get the slug from the URL
    const slug = params.slug;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Read Time Utility (FR-3.9) - Temporary inline until we create the utility file
    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/g).length;
        return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
    };
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    useEffect(() => {
        if (!slug) return; // Wait for the slug to be available

        const loadPost = async () => {
            try {
                const data = await fetchPostBySlug(slug);
                setPost(data);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to load post.';
                setError(errorMessage);
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    if (loading) {
        return <div className="text-center py-20 text-xl font-semibold">Loading Post...</div>;
    }

    if (error || !post) {
        return <div className="text-center py-20 text-2xl text-red-600">404 - Post not found.</div>;
    }

    // Main Post View (FR-6.1)
    return (
        <div className="max-w-4xl mx-auto py-10">
            {/* Featured Image */}
            <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-96 object-cover rounded-lg shadow-xl mb-8"
                loading="lazy"
            />
            
            {/* Post Header */}
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                
                {/* Author, Date, Read Time (FR-3.9) */}
                <div className="flex items-center text-lg text-gray-500 space-x-4">
                    <p>By <span className="font-semibold text-gray-700">{post.user.name}</span></p>
                    <p>•</p>
                    <p>Published on {formatDate(post.createdAt)}</p>
                    <p>•</p>
                    <p>{calculateReadTime(post.content)}</p>
                </div>
                
                {/* Category/Tags */}
                <div className="mt-3 space-x-2">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">{post.category}</span>
                    {post.tags.map((tag, index) => (
                         <span key={index} className="inline-block px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-full">#{tag}</span>
                    ))}
                </div>
            </header>

            {/* Post Content */}
            <section className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-10">
                {/* Replace the <p>{post.content}</p> with the sanitized component */}
                <SanitizedContent 
                    htmlContent={post.content} // Pass the raw content
                     className="post-content"
                />
            </section>
            
            <hr className="my-10"/>

            {/* --- Interaction Section (Placeholder for Likes/Comments) --- */}
            <aside>
                {/* 1. Reaction Buttons (FR-3.3) */}
                <ReactionButtons 
                    postId={post._id} 
                    initialLikes={post.likes} // Array of user IDs
                    initialDislikes={post.dislikes} // Array of user IDs
                />
            
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-6">Comments</h2>
                    <CommentSection postId={post._id} /> 
                </div>
            </aside>
        </div>
    );
};

export default PostDetailsPage;