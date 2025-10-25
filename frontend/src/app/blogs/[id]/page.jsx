"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/post/${id}`)
      .then((res) => setBlog(res.data.post))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-72 object-cover rounded-md"
      />
      <h1 className="text-4xl font-bold mt-6">{blog.title}</h1>
      <p className="text-gray-600 mt-2">{blog.description}</p>
      <p className="mt-6 whitespace-pre-wrap text-gray-800">{blog.content}</p>
      <p className="mt-4 text-sm text-gray-500">
        ✍️ {blog.author?.firstName} {blog.author?.lastName}
      </p>
    </div>
  );
}
