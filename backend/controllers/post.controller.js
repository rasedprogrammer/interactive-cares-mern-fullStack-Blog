import { User } from "../models/user.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import postModel from "../models/post.model.js";
import getDataUri from "../utils/dataUri.js";

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

// ✅ Delete Post
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

// ✅ Get All Posts
// export const getAllPostsController = async (req, res) => {
//   try {
//     const posts = await postModel
//       .find()
//       .populate("author", "firstName lastName email");
//     res.status(200).json({ success: true, posts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch posts!" });
//   }
// };

// ✅ Get Single Post
// export const getSinglePostController = async (req, res) => {
//   try {
//     const post = await postModel
//       .findById(req.params.id)
//       .populate("author", "firstName lastName email");
//     if (!post) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found!" });
//     }
//     res.status(200).json({ success: true, post });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch post!" });
//   }
// };

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
