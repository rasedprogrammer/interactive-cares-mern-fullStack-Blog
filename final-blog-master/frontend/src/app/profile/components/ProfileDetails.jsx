// blog-application/frontend/src/app/profile/components/ProfileDetails.jsx
'use client';

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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Role</label>
                    <input
                        type="text"
                        value={userInfo.role}
                        readOnly
                        className="w-full px-3 py-2 mt-1 border border-gray-300 bg-gray-100 rounded-md font-semibold"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Update Profile (Disabled)
                </button>
            </form>
        </div>
    );
};

export default ProfileDetails;