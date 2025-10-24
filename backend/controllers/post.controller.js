import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

// Create Post
export const createPostController = async (req, res) => {
  try {
    const { title, description, content, userId } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({
        message: "Please Provide all Required Fields!",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image not provided!" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    // ✅ Always use absolute path
    const filePath = path.join(process.cwd(), req.file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("✅ Local file deleted:", filePath);
    }

    const image = result.secure_url;
    const author = `${user.firstName} ${user.lastName}`;

    const newPost = await Post.create({
      title,
      description,
      author,
      content,
      image,
    });

    res.status(201).json({
      success: true,
      post: newPost,
      message: "Successfully created post!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Create Post!",
    });
  }
};

// Update Post
export const updatePostController = async (req, res) => {
  try {
    // When userid get from authenticated middleware then remove userId from req.body
    const { title, description, content } = req.body;
    const postId = req.params.id;
    // find user
    const post = await Post.findById(postId);

    // if user not exist the throw a message
    if (!post) {
      return res.status(200).json({
        success: false,
        message: "Post Not Found!",
      });
    }

    // Delete old image from Cloudinary (if exists)
    if (post.image) {
      const imageUrl = post.image;
      const urlArr = imageUrl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      await cloudinary.uploader.destroy(imageName);
    }

    // Cloudinary upload options
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, options);

    // Delete local file after upload
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    } else {
      return;
    }

    // Take the secure url
    const image = result.secure_url;

    // Create new post
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        content,
        image,
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      error: false,
      updatePost,
      message: "Successfull to Update Post",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Update Post!",
    });
  }
};

// Delete Post
export const deletePostController = async (req, res) => {
  try {
    const postId = req.params.id;
    // find post
    const post = await Post.findById(postId);

    // if post not exist the throw a message
    if (!post) {
      return res.status(200).json({
        success: false,
        message: "Post Not Found!",
      });
    }
    // Delete old image from Cloudinary (if exists)
    if (post.image) {
      const imageUrl = post.image;
      const urlArr = imageUrl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      await cloudinary.uploader.destroy(imageName);
    }
    // Delete post from database
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully!",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Delete Post!",
    });
  }
};


// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    // Fetch all posts from the database, sorted by publish date in descending order
    const posts = await Post.find().sort({ publishAt: -1 });
    console.log(posts);
    if (!posts || posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Posts Found!",
      });
    }
    res.status(200).json({
      success: true,
      posts,
      message: "Successfull to Get All Posts",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get All Posts!",
    });
  }
};

// Get Single Post by ID
export const getSinglePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    // find post
    const post = await Post.findById(postId);

    // if post not exist the throw a message
    if (!post) {
      return res.status(200).json({
        success: false,
        message: "Post Not Found!",
      });
    }
    res.status(200).json({
      success: true,
      post,
      message: "Successfull to Get Post",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Get Post!",
    });
  }
};