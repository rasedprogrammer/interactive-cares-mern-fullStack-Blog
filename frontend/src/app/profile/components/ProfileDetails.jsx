// blog-application/frontend/src/app/profile/components/ProfileDetails.jsx
'use client';

<<<<<<< HEAD
import { useSelector } from 'react-redux';
import { useState } from 'react';

const ProfileDetails = () => {
    const { userInfo } = useSelector((state) => state.auth);
    
    // Local state for profile form (FR-2.1: User can manage their own profile)
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // NOTE: This requires a PUT /api/users/profile endpoint (we only have GET now)
        setMessage("Update functionality is disabled in this MVP demo. Name/Email are local state only.");
    };

    return (
        <div className="max-w-xl space-y-6">
            <h2 className="text-2xl font-semibold">Update Your Profile (FR-2.1)</h2>
            {message && <div className="p-3 text-sm text-yellow-700 bg-yellow-100 rounded-lg">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
=======
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '@/utils/postApi';
import { authSuccess } from '@/redux/slices/authSlice'; // To update user info in Redux/LS

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProfileDetails = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [fullProfile, setFullProfile] = useState(null);


    
    // State to manage the form data (FR-2.1)
    const [formData, setFormData] = useState({
        name: userInfo.name || '',
        bio: userInfo.bio || '',
        profilePicture: userInfo.profilePicture || '/default-avatar.png',
        website: userInfo.website || '',
        location: userInfo.location || '',
        github: userInfo.github || '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);


    useEffect(() => {
    // Only run if we have userInfo
    if (userInfo && userInfo._id) {
        const fetchLatestProfile = async () => {
            const token = getAuthToken();
            if (!token) {
                // If no token, we can't fetch. Log and return, or redirect.
                console.error("Authorization Token Missing.");
                return; 
            }
            
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                // Hitting the GET /api/users/profile endpoint
                const { data } = await axios.get(`${API_URL}/users/profile`, config); 
                
                // Set the latest fetched data
                setFullProfile(data); 

                // Use the fetched data to initialize the form
                setFormData({
                    name: data.name || '',
                    bio: data.bio || '',
                    profilePicture: data.profilePicture || '/default-avatar.png',
                    website: data.website || '',
                    location: data.location || '',
                    github: data.github || '',
                });
            } catch (error) {
                console.error("Failed to fetch latest profile data:", error);
            }
        };

        fetchLatestProfile();
    }
}, [userInfo]);



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        
        try {
            const token = getAuthToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            
            // PUT request to /api/users/profile
            const { data } = await axios.put(`${API_URL}/users/profile`, formData, config);
            
            // Success: Update Redux store (and localStorage) with the new data
            dispatch(authSuccess(data)); 
            
            setMessage("Profile updated successfully!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };


    return (
        <div className="max-w-xl space-y-6">
            <h2 className="text-2xl font-semibold border-b pb-2">Your Profile (FR-2.1)</h2>
            {message && <div className="p-3 text-sm text-yellow-700 bg-yellow-100 rounded-lg">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Profile Picture Display (Placeholder) */}
                <div className="flex items-center space-x-4">
                    <img src={formData.profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300" />
                    <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="Profile Picture URL" className="grow px-3 py-2 border rounded-md" />
                </div>
                
                {/* Name */}
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
<<<<<<< HEAD
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email (Cannot Change)</label>
                    <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full px-3 py-2 mt-1 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
                    />
                </div>
=======
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
                
                {/* Bio */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Bio (Max 500 chars)</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        maxLength="500"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
                
                {/* Website */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Website/Portfolio URL</label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>

                {/* GitHub Profile */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
                    <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="https://github.com/yourusername"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Role (Read-Only) */}
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Role</label>
                    <input
                        type="text"
                        value={userInfo.role}
                        readOnly
<<<<<<< HEAD
                        className="w-full px-3 py-2 mt-1 border border-gray-300 bg-gray-100 rounded-md font-semibold"
=======
                        className="w-full px-3 py-2 mt-1 border border-gray-300 bg-gray-100 rounded-md font-semibold cursor-not-allowed"
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
<<<<<<< HEAD
                    Update Profile (Disabled)
=======
                    {loading ? 'Saving...' : 'Update Profile'}
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
                </button>
            </form>
        </div>
    );
};

export default ProfileDetails;