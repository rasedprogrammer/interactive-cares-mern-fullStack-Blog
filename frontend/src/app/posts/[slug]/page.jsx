// blog-application/frontend/src/app/posts/[slug]/page.jsx
<<<<<<< HEAD
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchPostBySlug } from "@/utils/postApi";
import ReactionButtons from "@/components/ReactionButtons";
import CommentSection from "./CommentSection";
import SanitizedContent from "@/components/SanitizedContent";
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
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    if (!slug) return; // Wait for the slug to be available

    const loadPost = async () => {
      try {
        const data = await fetchPostBySlug(slug);
        setPost(data);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to load post.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 text-2xl text-red-600">
        404 - Post not found.
      </div>
    );
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
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Author, Date, Read Time (FR-3.9) */}
        <div className="flex items-center text-lg text-gray-500 space-x-4">
          <p>
            By{" "}
            <span className="font-semibold text-gray-700">
              {post?.user?.name}
            </span>
          </p>
          <p>•</p>
          <p>Published on {formatDate(post.createdAt)}</p>
          <p>•</p>
          <p>{calculateReadTime(post.content)}</p>
        </div>

        {/* Category/Tags */}
        <div className="mt-3 space-x-2">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">
            {post.category}
          </span>
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-full"
            >
              #{tag}
            </span>
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

      <hr className="my-10" />

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
=======
// NOTE: REMOVE 'use client' - This is now an async Server Component for better SEO and performance.

import { notFound } from 'next/navigation';
import { fetchPostBySlug, fetchLatestPosts } from '@/utils/postApi';
import SanitizedContent from '@/components/SanitizedContent';
import ReactionButtons from '@/components/ReactionButtons'; // Client Component
import CommentSection from './CommentSection'; // Client Component
import CategoryList from '@/components/CategoryList'; // Client Component
import Link from 'next/link';
// import { getUserSession } from '@/lib/session'; // Placeholder for session data if needed server-side

// --- 1. SEO METADATA GENERATION (FR-6.4, Follow SEO best practices) ---
export async function generateMetadata({ params }) {
    const resolvedParams = await params; // <-- CRITICAL FIX: AWAIT PARAMS
    const slug = resolvedParams.slug;
    
    let post = null;
    try {
        post = await fetchPostBySlug(slug);
    } catch (e) {
        return { title: 'Post Not Found' };
    }

    if (!post) {
        return { title: 'Post Not Found' };
    }

    // Prepare default content/title for fallbacks
    const defaultTitle = post.title;
    const defaultDescription = post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    
    const metaTitle = post.metaTitle || defaultTitle;
    const metaDescription = post.metaDescription || defaultDescription;

    return {
        title: metaTitle,
        description: metaDescription,
        
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            // NOTE: Replace with your actual deployed URL
            url: `http://localhost:3000/posts/${slug}`, 
            type: 'article',
            images: [
                {
                    url: post.featuredImage,
                    width: 800,
                    height: 600,
                    alt: defaultTitle,
                },
            ],
        },
    };
}


// --- 2. MAIN SERVER COMPONENT ---
export default async function PostDetailsPage({ params }) {
    const resolvedParams = await params; // <-- CRITICAL FIX: AWAIT PARAMS
    const slug = resolvedParams.slug;

    // Fetch data directly on the server (No need for useState/useEffect)
    let post = null;
    try {
        post = await fetchPostBySlug(slug);
    } catch (e) {
        // If the fetch fails (e.g., 404), throw notFound()
        notFound(); 
    }

    if (!post) {
        notFound();
    }
    
    // --- Helper Functions (Server-side compatible) ---
    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/g).length;
        return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
    };
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    // Assume user is null on server unless explicitly fetched via getUserSession()
    const currentUserId = null; 

// Fetch Related Posts in parallel
    let latestPosts = [];
    try {
        // Use the ID of the current post to exclude it
        latestPosts = await fetchLatestPosts(post._id); 
    } catch (e) {
        console.error("Failed to fetch related posts:", e);
    }

    // --- Final Render ---
    return (
        <div className="py-10">
            {/* --- LAYOUT FIX: TWO-COLUMN MOBILE-FIRST DESIGN --- */}
            <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 max-w-7xl mx-auto">
                
                {/* 1. Main Content Column (Mobile: Full Width; Desktop: 2/3) */}
                <div className="lg:w-3/4 w-full">
                    <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl">
                        {/* Featured Image */}
                        <img 
                            src={post.featuredImage} 
                            alt={post.title} 
                            className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md"
                            loading="lazy"
                        />
                        
                        {/* Post Header */}
                        <header className="mb-8 border-b pb-4">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                                {post.title}
                            </h1>
                            
                            {/* Author, Date, Read Time (FR-3.9) */}
                            <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-2 md:space-x-4">
                                <p>By <span className="font-semibold text-indigo-600">{post.user && post.user.name ? post.user.name : 'Deleted Author'} </span></p>
                                <p>•</p>
                                <p>Published {formatDate(post.createdAt)}</p>
                                <p>•</p>
                                <p>{calculateReadTime(post.content)}</p>
                                {post.category && (
                                    <>
                                        <p>•</p>
                                        <Link href={`/category/${post.category}`}>
                                            <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors">{post.category}</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Post Content */}
                        <section className="mb-10">
                            {/* NOTE: SanitizedContent is the recommended Client Component for display */}
                            <SanitizedContent 
                                htmlContent={post.content}
                                className="post-content"
                            />
                        </section>
                        
                        {/* Tags */}
                        <div className="mt-6 space-x-2 border-t pt-4">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">#{tag}</span>
                            ))}
                        </div>

                        {/* Reactions (Client Component) */}
                        <div className="mt-8">
                            <ReactionButtons 
                                postId={post._id} 
                                initialLikes={post.likes}
                                initialDislikes={post.dislikes}
                            />
                        </div>
                    </div>

                    {/* Comment Section (Client Component) */}
                    <div className="mt-8">
                        <CommentSection postId={post._id} /> 
                    </div>
                </div>


                {/* 2. Sidebar Column (Mobile: Full Width/Bottom; Desktop: 1/4) */}
                <div className="lg:w-1/4 w-full mb-8 lg:mb-0">
                    <div className="sticky top-20 space-y-6">
                        
                        {/* Author Bio (Placeholder) */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                            <h3 className="font-bold text-lg mb-3">About the Author</h3>
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"><img src={post.user && post.user.profilePicture ? post.user.profilePicture : '/avatar-placeholder.png'}  alt={post.user && post.user.name ? post.user.name : 'Deleted Author'} /></div>
                                <span className="font-semibold text-indigo-600">{post.user && post.user.name ? post.user.name : 'Deleted Author'} </span>
                            </div>
                            <p className="text-sm text-gray-600">{post.user && post.user.bio ? post.user.bio : 'No bio available.'}</p>
                            <Link href={`/author/${post.user && post.user._id ? post.user._id : ''}`} className="mt-3 block text-sm text-indigo-500 hover:text-indigo-700">View All Posts &rarr;</Link>
                        </div>
                        
                        {/* Category List (Client Component) */}
                        <CategoryList />
                        
                        {/* Latest Posts (Placeholder) */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg mb-3 border-b pb-2">Related Articles</h3>
                            {latestPosts.length === 0 ? (
                                <p className="text-sm text-gray-600">No other published posts found.</p>
                            ) : (
                                <ul className="text-sm space-y-2 text-gray-600">
                                    {latestPosts.map(latestPost => (
                                        <li key={latestPost._id}>
                                            <Link 
                                                href={`/posts/${latestPost.slug}`}
                                                className="hover:text-indigo-600 transition-colors"
                                            >
                                                - {latestPost.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
