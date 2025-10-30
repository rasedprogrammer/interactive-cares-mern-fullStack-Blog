// blog-application/backend/controllers/commentController.js

// const asyncHandler = require('express-async-handler');
// const Comment = require('../models/Comment');
// const Post = require('../models/Post');
import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// @desc    Create a new comment on a post
// @route   POST /api/comments
// @access  Private (Regular User)
const createComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user._id;

  if (!content) {
    res.status(400);
    throw new Error("Comment content cannot be empty.");
  }

  // 1. Verify the post exists
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found.");
  }

  // 2. Create the comment (FR-4.1)
  const comment = await Comment.create({
    post: postId,
    user: userId,
    content: content,
  });

  // NOTE: This is where we would trigger the 'notification' (FR-4.5)
  // to the post author. We will skip the actual email sending for now.

  // 3. Populate the user field for immediate display on the frontend
  const newComment = await Comment.findById(comment._id).populate(
    "user",
    "name"
  ); // Fetch only the author's name

  res.status(201).json(newComment);
});

// @desc    Fetch all comments for a specific post
// @route   GET /api/comments/:postId
// @access  Public (FR-4.1: Anyone can view comments)
const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Fetch comments for the post ID, only returning non-suspended comments (FR-4.3)
  const comments = await Comment.find({
    post: postId,
    isSuspended: false,
  })
    .populate("user", "name") // Fetch only the author's name
    .sort({ createdAt: 1 }); // Oldest comment first

  res.json(comments);
});

// @desc    Admin: Toggle comment suspension (FR-4.3)
// @route   PUT /api/comments/:id/suspend
// @access  Private/Admin
const suspendComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    // Toggle the suspension status
    comment.isSuspended = !comment.isSuspended;
    await comment.save();
    res.json({
      message: `Comment suspension set to ${comment.isSuspended}`,
      isSuspended: comment.isSuspended,
    });
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

// @desc    Admin: Delete a comment (FR-4.3)
// @route   DELETE /api/comments/:id
// @access  Private/Admin
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

// @desc    Admin: Fetch ALL comments (including suspended)
// @route   GET /api/comments/all-admin
// @access  Private/Admin
const getAllCommentsAdmin = asyncHandler(async (req, res) => {
  // Return ALL comments, including suspended ones
  const comments = await Comment.find({})
    .populate("user", "name")
    .populate("post", "title slug") // Include post info for context
    .sort({ createdAt: -1 });

  res.json(comments);
});

export {
  createComment,
  getPostComments,
  suspendComment,
  deleteComment,
  getAllCommentsAdmin,
};
