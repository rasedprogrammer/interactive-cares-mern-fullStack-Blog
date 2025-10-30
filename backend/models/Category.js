// blog-application/backend/models/Category.js

<<<<<<< HEAD
const mongoose = require('mongoose');
const slugify = require('slugify');
=======
// const mongoose = require('mongoose');
// const slugify = require('slugify');
import mongoose from 'mongoose';
import slugify from 'slugify';
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: { // For clean URLs and SEO
            type: String,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to automatically generate the slug before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

<<<<<<< HEAD
module.exports = Category;
=======
export default Category;
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
