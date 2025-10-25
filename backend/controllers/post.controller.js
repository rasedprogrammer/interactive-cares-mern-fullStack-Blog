import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "../utils/cloudinary.js";

// ✅ Create Post
export const createPostController = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const userId = req.user?._id; // from isAuthenticated middleware

    if (!title || !description || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all required fields!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image not provided!" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_images",
      use_filename: true,
      unique_filename: true,
    });

    // Clean up local file
    const filePath = path.join(process.cwd(), req.file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const newPost = await Post.create({
      title,
      description,
      content,
      image: result.secure_url,
      author: user._id,
    });

    res.status(201).json({
      success: true,
      post: newPost,
      message: "Post created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error while creating post!",
    });
  }
};

// ✅ Update Post
export const updatePostController = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found!" });
    }

    let imageUrl = post.image;

    // Only update Cloudinary image if a new file is uploaded
    if (req.file) {
      // Delete old image
      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`blog_images/${publicId}`);
      }

      // Upload new one
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
        use_filename: true,
        unique_filename: true,
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description, content, image: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      post: updatedPost,
      message: "Post updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error while updating post!",
    });
  }
};

// ✅ Delete Post
export const deletePostController = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found!" });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blog_images/${publicId}`);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error while deleting post!",
    });
  }
};

// ✅ Get All Posts
export const getAllPostsController = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "firstName lastName email");
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch posts!" });
  }
};

// ✅ Get Single Post
export const getSinglePostController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "firstName lastName email");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found!" });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch post!" });
  }
};

// ✅ Get Posts by Current User
export const getUserPostsController = async (req, res) => {
  try {
    const userId = req.user?._id;
    const posts = await Post.find({ author: userId });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user posts!" });
  }
};
