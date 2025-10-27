// blog-application/frontend/src/app/admin/dashboard/PostManagement.jsx
'use client';

import { useState, useEffect } from 'react';
// Note: Assuming suspendPostAdmin is available in adminApi.js now
import { fetchAllPostsAdmin, deletePostAdmin, suspendPostAdmin } from '@/utils/adminApi'; 

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Fetch all posts regardless of status (Draft, Published, Suspended)
    useEffect(() => {
        const loadPosts = async () => {
            try {
                // Assuming Admin API function is working after backend fixes
                const data = await fetchAllPostsAdmin(); 
                setPosts(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    // --- Action Handlers (FR-3.3) ---

    // Handles Suspend, Activate, and Delete actions
    const handleAction = async (postId, action, postTitle) => {
        let confirmation;
        let actionFunc;
        let newStatus = null; // Used for optimistic UI update

        const currentPost = posts.find(p => p._id === postId);
        if (!currentPost) return;

        if (action === 'delete') {
            confirmation = `Are you sure you want to DELETE post: "${postTitle}"? This will delete all comments too.`;
            actionFunc = deletePostAdmin;
            newStatus = 'DELETED';
        } else if (action === 'toggle_suspend') {
            // Determine if we are Suspending (making it Suspended) or Activating (making it Published)
            const isCurrentlySuspended = currentPost.status === 'Suspended';
            
            confirmation = isCurrentlySuspended 
                ? `Are you sure you want to ACTIVATE post: "${postTitle}"? It will become Published.`
                : `Are you sure you want to SUSPEND post: "${postTitle}"? It will be hidden.`;
                
            actionFunc = suspendPostAdmin; // The backend toggles the status
            newStatus = isCurrentlySuspended ? 'Published' : 'Suspended';
        } else {
            return;
        }

        if (window.confirm(confirmation)) {
            try {
                setMessage(null);
                
                await actionFunc(postId); 
                
                // --- OPTIMISTIC UI UPDATE ---
                if (newStatus === 'DELETED') {
                    setPosts(posts.filter(post => post._id !== postId));
                    setMessage(`Post "${postTitle}" deleted successfully.`);
                } else {
                    // Update the status of the post in the local state
                    setPosts(posts.map(post => 
                        post._id === postId ? { ...post, status: newStatus } : post
                    ));
                    setMessage(`Post "${postTitle}" status changed to ${newStatus}.`);
                }

                setTimeout(() => setMessage(null), 3000); 
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setMessage(null);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading Posts for Moderation...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Post Moderation ({posts.length} Total Posts)</h2>
            {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">Error: {error}</div>}


            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post._id} className={post.status === 'Suspended' ? 'bg-red-50' : post.status === 'Draft' ? 'bg-yellow-50' : ''}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {post.title} <br/>
                                    <span className="text-xs text-gray-500">By: {post.user?.name || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        post.status === 'Published' ? 'bg-green-100 text-green-800' : 
                                        post.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    
                                    {/* Suspend/Activate Toggle Button (FR-3.3) */}
                                    <button 
                                        onClick={() => handleAction(post._id, 'toggle_suspend', post.title)}
                                        className={`${post.status === 'Suspended' ? 'text-green-600' : 'text-yellow-600'} hover:text-yellow-800`}
                                    >
                                        {post.status === 'Suspended' ? 'Activate' : 'Suspend'}
                                    </button>
                                    
                                    {/* Delete Button (FR-3.3) */}
                                    <button 
                                        onClick={() => handleAction(post._id, 'delete', post.title)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostManagement;