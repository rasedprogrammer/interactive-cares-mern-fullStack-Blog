"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/my-blogs`)
      .then((res) => setBlogs(res.data.posts))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 All Blogs</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-3">{blog.title}</h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {blog.description}
            </p>
            <Link
              href={`/blogs/${blog._id}`}
              className="text-blue-600 mt-3 inline-block"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
