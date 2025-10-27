// blog-application/backend/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Secure file upload endpoint
// @route   POST /api/upload
// @access  Private (Regular User)
router.post(
    '/', 
    protect, // Must be logged in to upload
    uploadToCloudinary, 
    (req, res) => {
        // The URL is now attached to req.body.featuredImageUrl by the middleware
        if (!req.body.featuredImageUrl) {
            res.status(400).json({ message: 'No file uploaded or file upload failed.' });
        } else {
            res.status(201).json({ 
                message: 'File uploaded successfully', 
                url: req.body.featuredImageUrl 
            });
        }
    }
);

module.exports = router;