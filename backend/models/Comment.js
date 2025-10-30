// blog-application/backend/models/Comment.js

<<<<<<< HEAD
const mongoose = require('mongoose');
=======
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86

const commentSchema = mongoose.Schema(
    {
        post: { // Links the comment to the parent Post
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
        user: { // Links the comment to the author
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        isSuspended: { // For Admin moderation (FR-4.3)
            type: Boolean,
            default: false,
        },
        // We do NOT include a 'parentComment' field, as nested comments are NOT required (FR-4.4)
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);

<<<<<<< HEAD
module.exports = Comment;
=======
export default Comment;
>>>>>>> 6f42eb0e80347aacea666ba624841bb26b06cb86
