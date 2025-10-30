// blog-application/backend/routes/userRoutes.js

// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/authMiddleware'); // Import the protect middleware
// const { registerUser, authUser, getUserProfile, getUsers, updateUserByAdmin, deleteUser, forgotPassword, resetPassword } = require('../controllers/userController');
import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js'; // Import the protect middleware
import { registerUser, VerifyEmail, authUser, getUserProfile, getUsers, updateUserByAdmin, deleteUser, forgotPassword, resetPassword } from '../controllers/userController.js';


// GET /api/users - Get all users (Admin Only)
router.route('/').get(protect, admin, getUsers);

// POST /api/users/register (FR-1.1)
router.post('/register', registerUser);


router.post('/verifyEmail',VerifyEmail)

// POST /api/users/login (FR-1.1)
router.post('/login', authUser);

// GET /api/users/profile (FR-3.2 - Get User Profile)
// .route() allows chaining of different HTTP methods on the same path
router
    .route('/profile')
    .get(protect, getUserProfile) // Uses protect middleware
    .put(protect, getUserProfile); 

// PUT/DELETE /api/users/:id - Admin actions on a specific user (FR-2.4)
router
    .route('/:id')
    .put(protect, admin, updateUserByAdmin)
    .delete(protect, admin, deleteUser);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route (Dynamic token parameter)
router.put('/reset-password/:token', resetPassword);


export default router;