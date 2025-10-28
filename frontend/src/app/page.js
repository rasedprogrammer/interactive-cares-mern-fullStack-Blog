// blog-application/frontend/src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import { fetchPosts } from '@/utils/postApi';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Function to load posts (called on mount and on search)
    const loadPosts = async (keyword = '') => {
        setLoading(true);
        setError(null);
        try {
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
    }, [searchKeyword]);

    // Handler for SearchBar submission
    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
    };

    // Popular Posts Data (You can replace this with actual API call)
    const popularPosts = [
        { id: 1, title: 'Getting Started with Next.js', views: 1243 },
        { id: 2, title: 'React Best Practices 2024', views: 987 },
        { id: 3, title: 'Modern CSS Techniques', views: 756 },
        { id: 4, title: 'State Management Made Easy', views: 643 },
    ];

    // Recent Comments Data
    const recentComments = [
        { id: 1, user: 'John Doe', post: 'React Best Practices', comment: 'Great article!' },
        { id: 2, user: 'Jane Smith', post: 'Next.js Guide', comment: 'Very helpful, thanks!' },
        { id: 3, user: 'Mike Johnson', post: 'CSS Techniques', comment: 'Learned a lot from this.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Latest Blog Posts
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover amazing articles, tutorials, and insights from our community
                    </p>
                </div>

                {/* Search Bar - Full Width */}
                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Two Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content - 3/4 width */}
                    <div className="lg:w-3/4">
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center space-x-2 bg-white px-6 py-4 rounded-lg shadow-md">
                                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-lg font-semibold text-gray-700">Loading Posts...</span>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
                                <div className="text-red-600 font-semibold mb-2">Error Loading Posts</div>
                                <div className="text-red-500">{error}</div>
                                <button
                                    onClick={() => loadPosts(searchKeyword)}
                                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Posts Grid */}
                        {!loading && posts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && posts.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {searchKeyword ? 'No posts found' : 'No published posts yet'}
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {searchKeyword 
                                        ? `We couldn't find any posts matching "${searchKeyword}". Try different keywords!`
                                        : 'Be the first to share your knowledge and start writing!'
                                    }
                                </p>
                                {!searchKeyword && (
                                    <button className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                                        Create Your First Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - 1/4 width */}
                    <div className="lg:w-1/4 space-y-6">
                        {/* Categories Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                                Categories
                            </h3>
                            <CategoryList />
                        </div>

                        {/* Popular Posts Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-6 bg-linear-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></span>
                                Popular Posts
                            </h3>
                            <div className="space-y-3">
                                {popularPosts.map((post) => (
                                    <div key={post.id} className="group cursor-pointer">
                                        <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="shrink-0 w-8 h-8 bg-linear-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold">
                                                {post.views > 999 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Comments Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-6 bg-linear-to-b from-green-500 to-emerald-500 rounded-full mr-3"></span>
                                Recent Comments
                            </h3>
                            <div className="space-y-4">
                                {recentComments.map((comment) => (
                                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-linear-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {comment.user.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1 line-clamp-2">"{comment.comment}"</p>
                                        <span className="text-xs text-gray-500">on {comment.post}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                            <p className="text-purple-100 text-sm mb-4">
                                Get the latest posts delivered straight to your inbox.
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-purple-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;