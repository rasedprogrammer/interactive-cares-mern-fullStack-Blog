'use client';

import { useState, useEffect } from 'react';
import { fetchPosts } from '@/utils/postApi';
import PostCard from '@/components/PostCard';
import CategoryList from '@/components/CategoryList';
import Pagination from '@/components/Pagination';
import { useSearchParams } from 'next/navigation';
import { Sparkles, TrendingUp, Clock, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  const loadPosts = async (keyword = '', category = '', currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts(keyword, category, currentPage, 6);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch posts.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchKeyword, category]);

  useEffect(() => {
    loadPosts(searchKeyword, category, page);
  }, [searchKeyword, category, page]);

  // Mock stats for design enhancement
  const blogStats = [
    { icon: Users, value: '10K+', label: 'Active Readers' },
    { icon: TrendingUp, value: '500+', label: 'Articles Published' },
    { icon: Clock, value: '5min', label: 'Avg Read Time' },
    { icon: Sparkles, value: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-brrom-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Discover Amazing Content</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              {searchKeyword ? (
                <>
                  Search Results for
                  <span className="block bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    "{searchKeyword}"
                  </span>
                </>
              ) : (
                <>
                  Welcome to
                  <span className="block bg-linear-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
                    BlogSpace
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {searchKeyword 
                ? "Explore our curated collection of articles matching your search"
                : "Discover insightful articles, tutorials, and stories from our amazing community of writers"
              }
            </p>
          </div>
        </div>
        
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  opacity=".25" className="fill-current text-white"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  opacity=".5" className="fill-current text-white"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                  className="fill-current text-white"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      {!searchKeyword && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {blogStats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl mb-3">
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        {/* Content Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-8 bg-linear-to-b from-green-500 to-emerald-500 rounded-full mr-3"></span>
                {searchKeyword ? 'Search Results' : 'Featured Articles'}
                <span className="ml-4 bg-linear-to-rrom-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
                </span>
              </h2>
              <p className="text-gray-600 mt-2">
                {searchKeyword 
                  ? `Found ${posts.length} articles matching your search`
                  : 'Curated selection of our best content'
                }
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center space-y-6">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 text-xl mb-2">Loading Articles</div>
                  <div className="text-gray-500">Fetching the latest content for you...</div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-linear-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 text-center mb-8">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <div className="text-red-600 font-bold text-xl mb-2">Error Loading Content</div>
              <div className="text-red-500 mb-6 max-w-md mx-auto">{error}</div>
              <button className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="text-8xl mb-6">
                {searchKeyword ? '🔍' : '📝'}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {searchKeyword ? 'No Articles Found' : 'No Published Posts Yet'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {searchKeyword 
                  ? `We couldn't find any articles matching "${searchKeyword}". Try different keywords or browse our categories.`
                  : 'Be the first to share your knowledge and start writing amazing content!'
                }
              </p>
              {!searchKeyword && (
                <button className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <span>✏️</span>
                  <span>Write Your First Post</span>
                </button>
              )}
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post, index) => (
                  <div 
                    key={post._id} 
                    className="transform hover:-translate-y-2 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
        {/* Categories Section */}
        {!searchKeyword && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-8 bg-linear-to-brom-blue-500 to-purple-500 rounded-full mr-3"></span>
                Explore Categories
              </h2>
              <p className="text-gray-600 mt-2">Discover content by topics that interest you</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold group">
              <span>View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <CategoryList />
          </div>
        </div>
        )};

        {/* Newsletter CTA */}
        {!searchKeyword && (
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Our Latest</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
              Get the freshest articles, tutorials, and insights delivered directly to your inbox. No spam, ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;