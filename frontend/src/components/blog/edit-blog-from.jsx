"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EditBlogForm({ data, blogId }) {
  const [formData, setFormData] = useState({
    title: data.title,
    description: data.description,
    content: data.content,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("content", formData.content);
    if (thumbnail) form.append("thumbnail", thumbnail);
    if (image) form.append("image", image);

    const res = await fetch(
      `http://localhost:8000/api/posts/update/${blogId}`,
      {
        method: "PUT",
        body: form,
      }
    );

    const data = await res.json();
    setLoading(false);
    if (data.success) alert("Blog updated!");
    else alert("Error: " + data.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 flex flex-col gap-4"
    >
      <Input
        placeholder="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      <Input
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <Input
        placeholder="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
      />
      <label>Thumbnail:</label>
      <Input type="file" onChange={(e) => setThumbnail(e.target.files[0])} />
      {data.thumbnail && (
        <img src={data.thumbnail} className="h-24 w-24 object-cover rounded" />
      )}
      {thumbnail && (
        <img
          src={URL.createObjectURL(thumbnail)}
          className="h-24 w-24 object-cover rounded"
        />
      )}
      <label>Main Image:</label>
      <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
      {data.image && (
        <img src={data.image} className="h-24 w-24 object-cover rounded" />
      )}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          className="h-24 w-24 object-cover rounded"
        />
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
