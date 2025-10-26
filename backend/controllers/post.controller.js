import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const createPostController = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    if (!title || !description || !content)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "blog_photo" });
    fs.unlinkSync(req.file.path);

    const newPost = await Post.create({
      title,
      description,
      content,
      photo: uploadResult.secure_url,
      author: req.user.id,
    });

    res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating post" });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let imageUrl = post.photo;

    if (req.file) {
      // Delete old image from Cloudinary
      const publicId = post.photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blog_photo/${publicId}`);

      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "blog_images" });
      imageUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path);
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.content = content || post.content;
    post.photo = imageUrl;

    await post.save();
    res.json({ success: true, message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating post" });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const publicId = post.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`blog_images/${publicId}`);

    await Post.findByIdAndDelete(id);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
};

export const getAllPostsController = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "firstName lastName email");
    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};

export const getSinglePostController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "firstName lastName email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching post" });
  }
};
