"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddBlogForm({ existingPost, onSuccess }) {
  const [formData, setFormData] = useState({
    title: existingPost?.title || "",
    description: existingPost?.description || "",
    content: existingPost?.content || "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("content", formData.content);
      if (image) form.append("image", image);

      const url = existingPost ? `/posts/update-post/${existingPost._id}` : "/posts/create-post";
      const method = existingPost ? "PUT" : "POST";

      const { data } = await api({
        url,
        method,
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        alert(data.message);
        onSuccess && onSuccess();
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error uploading post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 flex flex-col gap-4">
      <Input placeholder="Title" name="title" value={formData.title} onChange={handleChange} />
      <Input placeholder="Description" name="description" value={formData.description} onChange={handleChange} />
      <Input placeholder="Content" name="content" value={formData.content} onChange={handleChange} />
      <label>Main Image:</label>
      <Input type="file" onChange={handleImageChange} />
      {image && <img src={URL.createObjectURL(image)} className="h-24 w-24 object-cover rounded" />}
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : existingPost ? "Update Post" : "Add Post"}</Button>
    </form>
  );
}
