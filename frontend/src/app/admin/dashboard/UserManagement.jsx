// blog-application/frontend/src/app/admin/dashboard/UserManagement.jsx
'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteUser } from '@/utils/adminApi';

const UserManagement = ({ initialUsers }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const [users, setUsers] = useState(initialUsers);
    const [error, setError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);

    // ... (Paste the handleDelete logic and the entire table structure from the old page.jsx here) ...
    // NOTE: The logic should be the same as what was in the original page.jsx, 
    // replacing the local `users` state with `initialUsers` as the starting point.

    // --- Delete Handler (FR-2.4) ---
    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to DELETE the account for: ${userName}?`)) {
            try {
                await deleteUser(userId);
                
                setUsers(users.filter(user => user._id !== userId));
                setDeleteSuccess(`User ${userName} deleted successfully.`);

                setTimeout(() => setDeleteSuccess(null), 3000); 

            } catch (err) {
                setError(err);
                setDeleteSuccess(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Registered Users</h2>
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">Error: {error}</div>}
            {deleteSuccess && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{deleteSuccess}</div>}

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id} className={user.role === 'Admin' ? 'bg-indigo-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id.substring(0, 6)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {userInfo._id !== user._id && (
                                        <>
                                            <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button 
                                                onClick={() => handleDelete(user._id, user.name)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;