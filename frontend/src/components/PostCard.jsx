// blog-application/frontend/src/components/PostCard.jsx
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/utils/helpers';

const PostCard = ({ post }) => {
    // Helper function to format date
    

    // Simple reading time calculation (200 words per minute)
    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/g).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min read`;
    };

    return (
        <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Featured Image - Placeholder implementation */}
            <div className="relative h-48 w-full">
                {/* NOTE: In a real app, you'd use the Next.js <Image> component with a secure loader */}
                <img 
                    src={post.featuredImage} 
                    alt={post.title} 
                    className="h-full w-full object-cover" 
                    onError={(e) => { e.target.src = '/placeholder.jpg' }} // Fallback
                />
            </div>

            <div className="p-6">
                {/* Category/Tags */}
                <div className="flex space-x-2 mb-2 text-xs font-semibold uppercase">
                    <span className="text-indigo-600">{post.category}</span>
                    {post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-gray-500">#{tag}</span>
                    ))}
                </div>

                {/* Post Title */}
                <Link href={`/posts/${post.slug}`} className="block">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                {/* Author, Date, Read Time (FR-3.9) */}
                <div className="flex items-center text-sm text-gray-500 space-x-3">
                    {/* Author is populated: post.user.name */}
                    <p>By <span className="font-semibold text-gray-700">{post.user && post.user.name ? post.user.name : 'Deleted Author'} </span></p> 
                    <p>•</p>
                    <p>{formatDate(post.createdAt)}</p>
                    <p>•</p>
                    <p>{calculateReadTime(post.content)}</p>
                </div>
            </div>
        </article>
    );
};

export default PostCard;