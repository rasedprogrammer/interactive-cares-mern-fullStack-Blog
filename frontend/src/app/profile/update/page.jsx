"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function ProfileUpdatePage() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    bio: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    github: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/me`, { withCredentials: true });
        if (res.data.user) {
          setFormData({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            occupation: res.data.user.occupation || "",
            bio: res.data.user.bio || "",
            instagram: res.data.user.instagram || "",
            facebook: res.data.user.facebook || "",
            linkedin: res.data.user.linkedin || "",
            github: res.data.user.github || "",
            photo: null,
          });
          setPhotoPreview(res.data.user.photoUrl || "");
        }
      } catch (err) {
        toast.error("Failed to load profile");
        console.error(err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          if (key === "photo") data.append("photo", formData.photo);
          else data.append(key, formData[key]);
        }
      });

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/update`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setUser((prev) => ({
          ...prev,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          photoUrl: res.data.user.photoUrl,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-5">
          <img
            src={photoPreview || "/default-avatar.png"}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <input type="file" name="photo" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded-md w-full" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded-md w-full" />
        </div>

        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" className="border p-2 rounded-md w-full" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio..." className="border p-2 rounded-md w-full h-28" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram URL" className="border p-2 rounded-md" />
          <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Facebook URL" className="border p-2 rounded-md" />
          <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="border p-2 rounded-md" />
          <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" className="border p-2 rounded-md" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
