"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

export default function SingleBlogPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch single blog
  const fetchBlog = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res?.data?.post || null);
    } catch (err) {
      console.error("Fetch Blog Error:", err);
      alert("Failed to load blog. Redirecting...");
      router.push("/blogs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    if (!token) {
      setRecentPosts([]);
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/recent`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecentPosts(res?.data?.posts || []);
    } catch (err) {
      console.error("Recent Posts Error:", err);
      setRecentPosts([]);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchRecentPosts();
  }, [id, token]);

  // Like / Dislike
  const handleLike = async () => {
    if (!token) return alert("Login to like");
    if (!blog?._id) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/like/${blog._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlog((prev) => ({
        ...prev,
        likes: res.data?.likes || prev.likes,
        dislikes: res.data?.dislikes || prev.dislikes,
      }));
    } catch (err) {
      console.error("Like error:", err);
      alert(err?.response?.data?.message || "Failed to like post");
    }
  };

  // Dislike
  const handleDislike = async () => {
    if (!token) return alert("Login to dislike");
    if (!blog?._id) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/dislike/${blog._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlog((prev) => ({
        ...prev,
        likes: res.data?.likes || prev.likes,
        dislikes: res.data?.dislikes || prev.dislikes,
      }));
    } catch (err) {
      console.error("Dislike error:", err);
      alert(err?.response?.data?.message || "Failed to dislike post");
    }
  };
  // Add comment
  const handleAddComment = async () => {
    if (!token || !blog?._id) return alert("Login to comment");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/comment/${blog._id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog({ ...blog, comments: res?.data?.comments || [] });
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading blog...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
      {/* Main Blog */}
      <div className="flex-1">
        {blog?.image && (
          <img
            src={blog?.image}
            alt={blog?.title || "Blog Image"}
            className="w-full h-72 object-cover rounded-md"
          />
        )}
        <h1 className="text-4xl font-bold mt-6">{blog?.title}</h1>
        <p className="text-gray-600 mt-2">{blog?.description}</p>
        <p className="mt-6 whitespace-pre-wrap text-gray-800">
          {blog?.content}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          ✍️ {blog?.author?.firstName} {blog?.author?.lastName}
        </p>

        {/* Like / Dislike */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            👍 {blog?.likes?.length || 0}
          </button>
          <button
            onClick={handleDislike}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            👎 {blog?.dislikes?.length || 0}
          </button>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Comments</h3>
          {blog?.comments?.length === 0 && <p>No comments yet.</p>}
          {blog?.comments?.map((c) => (
            <p key={c?._id} className="mb-1">
              <strong>{c?.user?.firstName}:</strong> {c?.text}
            </p>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border p-2 rounded flex-1"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-72">
        <h2 className="text-xl font-bold mb-2">Recent Posts</h2>
        {recentPosts?.length > 0 ? (
          recentPosts?.map((p) => (
            <li key={p?._id}>
              <a
                href={`/blog/${p?._id}`}
                className="text-blue-500 hover:underline"
              >
                {p?.title}
              </a>
            </li>
          ))
        ) : (
          <p>No recent posts.</p>
        )}
      </div>
    </div>
  );
}
