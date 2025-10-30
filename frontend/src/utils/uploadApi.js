// blog-application/frontend/src/utils/uploadApi.js

import axios from 'axios';
import { getAuthToken } from './postApi'; // Re-use the token helper

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to create authenticated config for multipart/form-data
const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authorized, token missing');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            // NOTE: We do NOT set Content-Type here; Axios/Browser sets it automatically 
            // for 'multipart/form-data' with the correct boundary.
        },
    };
};

/**
 * Uploads a file to the backend's Cloudinary endpoint.
 * @param {File} file The image file object.
 * @returns {string} The secure URL of the uploaded image.
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    // 'image' must match the Multer field name in the backend: .single('image')
    formData.append('image', file); 

    try {
        const config = getAuthHeaders();
        const { data } = await axios.post(`${API_URL}/upload`, formData, config);
        
        return data.url; // Return the final secure URL
        
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};