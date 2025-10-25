"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const MyBlogsPage = () => {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editingBlog, setEditingBlog] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch blogs
  const fetchMyBlogs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/my-blogs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(res.data.posts);
    } catch (error) {
      console.error("Fetch My Blogs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyBlogs();
  }, [token]);

  // Delete post
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Open modal
  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditDescription(blog.description);
    setEditContent(blog.content);
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${editingBlog._id}`,
        {
          title: editTitle,
          description: editDescription,
          content: editContent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(
        blogs.map((b) => (b._id === res.data.post._id ? res.data.post : b))
      );
      closeModal();
    } catch (error) {
      console.error("Edit Error:", error);
    }
  };

  const closeModal = () => {
    setEditingBlog(null);
    setEditTitle("");
    setEditDescription("");
    setEditContent("");
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!blogs.length) return <div className="p-4">No blogs yet.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Blogs</h1>
      <div className="grid gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-lg p-4 shadow relative">
            {blog.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
            <p className="text-gray-700 mb-2">{blog.description}</p>
            <p className="text-gray-700 mb-2">{blog.content}</p>
            <p className="text-gray-400 text-sm mb-2">
              Created at: {new Date(blog.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(blog)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="border p-2 rounded"
                required
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                className="border p-2 rounded"
                rows={4}
                required
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                className="border p-2 rounded"
                rows={4}
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
