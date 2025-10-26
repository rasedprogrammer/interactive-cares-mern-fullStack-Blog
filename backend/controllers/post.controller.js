import { User } from "../models/user.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import postModel from "../models/post.model.js";
import getDataUri from "../utils/dataUri.js";
import mongoose from "mongoose";

// ✅ Create Post    (COMPLETED)
export const createPostController = async (req, res) => {
  try {
    const { title, content, description } = req.body;

    if (!title || !content || !description) {
      return res
        .status(400)
        .json({ message: "Title, Description and content are required" });
    }

    let imageUrl;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
        folder: "blog_posts",
      });
      imageUrl = uploadResult.secure_url;
    }

    const post = await postModel.create({
      title,
      content,
      description,
      author: req.user.id,
      // image: req.file ? req.file.filename : undefined, // optional image
      image: imageUrl,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Post (COMPLETED)
export const updatePost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, content } = req.body;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
        folder: "blog_posts",
      });

      if (post.image && post.image.includes("cloudinary")) {
        const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`blog_posts/${publicId}`);
      }

      post.image = uploadResult.secure_url;
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Post (COMPLETED)
export const deletePost = async (req, res) => {
  try {
    console.log("Deleting post with id:", req.params.id);
    console.log("Authenticated user:", req.user);

    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne(); // safer than remove()
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Posts by ID (COMPLETED)
export const getSinglePostController = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid post ID" });
  }

  try {
    const post = await postModel
      .findById(id)
      .populate("author", "firstName lastName email");

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Increment views
    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Get Single Post Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get Posts by Current User  (COMPLETED)
export const getMyPosts = async (req, res) => {
  try {
    const posts = await postModel.find({ author: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get My Posts Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Like Post (COMPLETED)
export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id; // ✅ use `id` from middleware

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const post = await postModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Remove user from dislikes if exists
    post.dislikes = post.dislikes?.filter((uid) => uid.toString() !== userId);

    // Toggle like: remove if already liked
    if (post.likes?.some((uid) => uid.toString() === userId)) {
      post.likes = post.likes.filter((uid) => uid.toString() !== userId);
    } else {
      post.likes = post.likes || [];
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    console.error("Like Post Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Dislike Post (COMPLETED)
export const dislikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id; // ✅ use `id` from middleware

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const post = await postModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Remove user from likes if exists
    post.likes = post.likes?.filter((uid) => uid.toString() !== userId);

    // Toggle dislike: remove if already disliked
    if (post.dislikes?.some((uid) => uid.toString() === userId)) {
      post.dislikes = post.dislikes.filter((uid) => uid.toString() !== userId);
    } else {
      post.dislikes = post.dislikes || [];
      post.dislikes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    console.error("Dislike Post Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add comment (COMPLETED)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: req.user.id, text };
    post.comments.push(comment);
    await post.save();

    await post.populate("comments.user", "firstName lastName"); // populate user info
    res.status(201).json({ comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Recent Posts (COMPLETED)
export const getRecentPosts = async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error("Recent posts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
