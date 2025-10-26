"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, token } = useAuth(); // ✅ Get token + user from context
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (values) => {
    if (!user || !token) {
      toast.error("Please login first!");
      return;
    }

    if (!values.image?.[0]) {
      toast.error("Please select an image!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("content", values.content);
      formData.append("image", values.image[0]);
      formData.append("author", user.id);
      // if (imageFile) formData.append("image", imageFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/create-post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ use token from AuthContext
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "✅ Blog created successfully!");
      reset();
      router.push("/my-blogs");
    } catch (err) {
      console.error("Create Blog Error:", err);
      const message =
        err.response?.data?.message || "❌ Failed to create blog!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">Create a New Blog ✍️</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input
              {...register("title", { required: true })}
              placeholder="Enter blog title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              {...register("description", { required: true })}
              placeholder="Short description"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-1 font-medium">Content</label>
            <Textarea
              {...register("content", { required: true })}
              placeholder="Write your blog content..."
              rows={6}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Blog Image</label>
            <Input
              type="file"
              {...register("image", { required: true })}
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
