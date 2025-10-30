"use client";

import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import CategoryList from "@/components/CategoryList";
import { useSearchParams } from "next/navigation";
import { fetchPosts, getAuthToken } from "@/utils/postApi";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("keyword") || "";

  // ----------------------------
  // Fetch posts (token-aware)
  // ----------------------------
  const loadPosts = async (keyword = "") => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPosts(keyword); // fetchPosts automatically uses JWT
      setPosts(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch posts.";
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Effect: Run on keyword change OR user login state
  // ----------------------------
  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      loadPosts(searchKeyword);
    } else {
      setLoading(false);
      setPosts([]);
      setError("Please login or verify your email to see posts.");
    }
  }, [searchKeyword]); // dependency: search keyword

  return (
    <div className="py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        {searchKeyword
          ? `Search Results for: "${searchKeyword}"`
          : "Latest Blog Posts"}
      </h1>

      <div className="mb-10">
        <CategoryList />
      </div>

      {loading && (
        <div className="text-center py-12 text-xl font-semibold">
          Loading Posts...
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-xl text-red-500">{error}</div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12 text-xl text-gray-600">
          {searchKeyword
            ? `No posts found matching: "${searchKeyword}"`
            : `No published posts found yet. Start writing!`}
        </div>
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
