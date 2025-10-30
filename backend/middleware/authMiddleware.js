// blog-application/backend/middleware/authMiddleware.js

<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
=======
// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for a token in the 'Authorization' header (Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (split "Bearer <token>" and take the second part)
            token = req.headers.authorization.split(' ')[1];

            // Verify token (uses the secret from the .env file)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from the decoded payload, but exclude the password field
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401); // Unauthorized
                throw new Error('Not authorized, user not found');
            }

            next(); // Move to the next middleware or route handler

        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});


// Middleware for Admin-only access (NFR-4.1.1)
const admin = (req, res, next) => {
    // Check if the user is authenticated and has the 'Admin' role
    if (req.user && req.user.role === 'Admin') {
        next(); // User is Admin, continue
    } else {
        res.status(403); // Forbidden
        throw new Error('Not authorized as an admin');
    }
};

<<<<<<< HEAD
module.exports = { protect, admin };
=======
export { protect, admin };
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
