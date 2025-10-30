// blog-application/backend/models/Post.js

// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
    {
        user: { // Links the post to the author (Regular User)
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: { // FR-3.5: SEO-friendly URL
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        content: { // The main body of the blog post
            type: String,
            required: true,
        },
        category: {
            type: String, // We'll link this to a separate Category model later
            required: true,
        },
       tags: [ 
            {
                type: String,
            },
        ],
        likes: [ 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [ 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        featuredImage: { // FR-3.3: Post Thumbnail
            type: String,
            required: true, // Will be a URL to the image file
        },
        status: { // FR-3.4: Draft or Published (and Suspended by Admin)
            type: String,
            enum: ['Draft', 'Published', 'Suspended'],
            default: 'Draft',
        },
        metaTitle: { // FR-6.4: Optional SEO field
            type: String,
        },
        metaDescription: { // FR-6.4: Optional SEO field
            type: String,
        },
        // We will add likeCount, dislikeCount, and commentCount fields later
    },
    {
        timestamps: true, // createdAt and updatedAt (FR-3.9: Publish Date)
    }
);

// We'll add a static method to calculate reading time later

const Post = mongoose.model('Post', postSchema);

export default Post;