"use client";
import { useState, useEffect } from "react";
import { fetchPosts, getAuthToken } from "@/utils/postApi";
import PostCard from "@/components/PostCard";
import CategoryList from "@/components/CategoryList";
import { useSearchParams } from "next/navigation";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      setPosts([]);
      setError("Please login or verify your email to see posts.");
      return;
    }

    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts(searchKeyword);
        setPosts(data);
        setError(null);
      } catch (err) {
        setPosts([]);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch posts."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [searchKeyword]);

  return (
    <div className="py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        {searchKeyword ? `Search: "${searchKeyword}"` : "Latest Blog Posts"}
      </h1>
      <CategoryList />
      {loading && (
        <div className="text-center py-12 text-xl font-semibold">
          Loading Posts...
        </div>
      )}
      {!loading && error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12 text-gray-600">No posts found.</div>
      )}
      {!loading && !error && posts.length > 0 && (
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
