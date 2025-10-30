"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "@/utils/postApi";
import { authSuccess } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProfileDetails = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: "/default-avatar.png",
    website: "",
    location: "",
    github: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch latest profile
  useEffect(() => {
    if (!userInfo?._id) return;

    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("Authorization Token Missing.");
        router.push("/login?redirect=/profile");
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "/default-avatar.png",
          website: data.website || "",
          location: data.location || "",
          github: data.github || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [userInfo, router]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage("Authorization Token Missing. Please login again.");
        router.push("/login?redirect=/profile");
        return;
      }

      const { data } = await axios.put(`${API_URL}/users/profile`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(authSuccess(data));
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!userInfo) {
    return <div className="text-center py-10">Loading Profile...</div>;
  }

  return (
    <div className="max-w-xl space-y-6 mt-10">
      <h2 className="text-2xl font-semibold border-b pb-2">Your Profile</h2>
      {message && (
        <div className="p-3 text-sm text-yellow-700 bg-yellow-100 rounded-lg">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img
            src={formData.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300"
          />
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            className="grow px-3 py-2 border rounded-md"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            maxLength="500"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        {/* Website / Location / GitHub */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GitHub
          </label>
          <input
            type="text"
            name="github"
            value={formData.github}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        {/* Role (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Role
          </label>
          <input
            type="text"
            value={userInfo.role}
            readOnly
            className="w-full px-3 py-2 mt-1 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileDetails;
