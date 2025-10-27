// blog-application/backend/controllers/userController.js

const asyncHandler = require('express-async-handler'); // Helper for handling async errors
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // FR-1.5, NFR-4.1.1: For JWT Auth

// Helper function to generate a JWT (used for both register and login)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // FR-1.1: Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User already exists');
    }

    // Create the user. The password hashing is handled by the model's pre('save') hook.
    const user = await User.create({
        name,
        email,
        password,
        // Default role is 'Regular User'
    });

    if (user) {
        // FR-1.1: Registration successful.
        // NOTE: We skip email verification (FR-1.2) for now to keep the flow simple.
        // We will add it back later.
        res.status(201).json({ // 201 Created
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // Send JWT token
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // FR-1.1: Check if user exists AND password matches (using the model method)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires JWT)
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by the protect middleware (contains the user object without password)
    const user = req.user; 

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            // Include other profile fields like bio, profilePicture etc. later
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Get all users (Admin panel list)
// @route   GET /api/users
// @access  Private/Admin (FR-2.4)
const getUsers = asyncHandler(async (req, res) => {
    // Only fetch non-password fields
    const users = await User.find({}).select('-password'); 

    res.json(users);
});


// @desc    Update/Suspend User (Admin action)
// @route   PUT /api/users/:id
// @access  Private/Admin (FR-2.4)
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Admin can update name, email, or role
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role; 
        
        // Example logic for Suspend: If the Admin passes a 'suspended' field, handle it.
        // For simplicity, we'll just allow role update for now, which implies control.

        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Delete a user (Admin action)
// @route   DELETE /api/users/:id
// @access  Private/Admin (FR-2.4)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    // Prevent Admin from deleting their own account (Safety Check)
    if (user && user._id.toString() !== req.user._id.toString()) {
        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } else if (user._id.toString() === req.user._id.toString()) {
         res.status(400);
         throw new Error('Cannot delete your own admin account');
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = { registerUser, authUser, getUserProfile, getUsers, updateUserByAdmin, deleteUser };