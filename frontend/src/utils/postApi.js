// blog-application/frontend/src/utils/postApi.js

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get the token from the userInfo object (saved in local storage)
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            return JSON.parse(userInfo).token;
        }
    }
    return null;
};

// Function to create a new post (FR-3.3)
export const createPost = async (postData) => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('User not authenticated. Please log in.');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            // Attach the JWT to the Authorization header
            Authorization: `Bearer ${token}`, 
        },
    };

    const { data } = await axios.post(
        `${API_URL}/posts`, // URL: http://localhost:5000/api/posts
        postData,
        config
    );

    return data;
};


// Function to fetch all published posts

// Function to fetch all published posts (FR-6.1) - Now includes search
// Function to fetch all published posts (FR-6.1) - Now includes search
export const fetchPosts = async (keyword = '', category = '') => { // Accept optional keyword
    let url = `${API_URL}/posts`;
    // FIX: Declare the params array
    const params = []; 
    
    // FR-3.6: Append keyword as a query parameter
    if (keyword) {
        params.push(`keyword=${encodeURIComponent(keyword)}`);
    }

    if (category) {
        params.push(`category=${encodeURIComponent(category)}`);
    }

    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    
    const { data } = await axios.get(url); 

    return data;
};

// Function to fetch a single post by slug
export const fetchPostBySlug = async (slug) => {
    // No token/headers needed
    const { data } = await axios.get(`${API_URL}/posts/${slug}`); 

    return data;
};


// Function to toggle a like/dislike reaction
export const toggleReaction = async (postId, action) => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('User not authenticated. Please log in to react.');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
        },
    };

    const { data } = await axios.put(
        `${API_URL}/posts/react/${postId}`,
        { action },
        config
    );

    return data; // Returns { likes: X, dislikes: Y }
};


// Function to fetch a post by ID (Protected)
export const fetchPostById = async (postId) => {
    const token = getAuthToken();

    if (!token) throw new Error('User not authenticated.');

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // Assuming backend has a simple GET /api/posts/:id route for authenticated users
    const { data } = await axios.get(`${API_URL}/posts/edit/${postId}`, config);
    return data;
};

// Function to update an existing post (FR-3.3)
export const updatePost = async (postId, postData) => {
    const token = getAuthToken();

    if (!token) throw new Error('User not authenticated.');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
        },
    };

    const { data } = await axios.put(`${API_URL}/posts/edit/${postId}`, postData, config);

    return data;
};


export const deleteMyPostAPI = async (postId) => {
     const token = getAuthToken();
     if (!token) throw new Error('Not authorized');
    
     const config = { headers: { Authorization: `Bearer ${token}` } };
     // DELETE /api/posts/my-posts/:id (This is the new route)
     await axios.delete(`${API_URL}/posts/my-posts/${postId}`, config);
     return 'Post deleted successfully';
};

export const fetchPostsByAuthor = async (authorId) => {
    // Public route, no token needed
    const { data } = await axios.get(`${API_URL}/posts/author/${authorId}`); 
    return data;
};


// Function to fetch the latest posts excluding the current one
export const fetchLatestPosts = async (excludeId) => {
    // Public route, no token needed
    const { data } = await axios.get(`${API_URL}/posts/latest/${excludeId}`); 
    return data;
};