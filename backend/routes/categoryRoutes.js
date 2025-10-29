// blog-application/backend/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Public GET /api/categories (for post filtering/navigation)
// Admin POST /api/categories (Create)
router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

// Admin PUT/DELETE on /api/categories/:id
router.route('/:id')
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;