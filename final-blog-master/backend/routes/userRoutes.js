// blog-application/backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // Import the protect middleware
const { registerUser, authUser, getUserProfile, getUsers, updateUserByAdmin, deleteUser } = require('../controllers/userController');

// GET /api/users - Get all users (Admin Only)
router.route('/').get(protect, admin, getUsers);

// POST /api/users/register (FR-1.1)
router.post('/register', registerUser);

// POST /api/users/login (FR-1.1)
router.post('/login', authUser);

// GET /api/users/profile (FR-3.2 - Get User Profile)
// .route() allows chaining of different HTTP methods on the same path
router
    .route('/profile')
    .get(protect, getUserProfile); // Uses protect middleware

// PUT/DELETE /api/users/:id - Admin actions on a specific user (FR-2.4)
router
    .route('/:id')
    .put(protect, admin, updateUserByAdmin)
    .delete(protect, admin, deleteUser);


module.exports = router;