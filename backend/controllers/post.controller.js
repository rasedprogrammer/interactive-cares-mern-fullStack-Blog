import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

export const createPostController = async (req, res) => {
  try {
    // When userid get from authenticated middleware then remove userId from req.body
    const { title, description, content, userId } = req.body;
    // user id get from authenticated middleware
    // const userId = req.user.id;

    if (!title || !description || !content) {
      return res.status(400).json({
        message: "Please Provide all Required Fields!",
        success: false,
      });
    }

    // find user
    const user = await User.findById(userId);

    // if user not exist the throw a message
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Not Found!",
      });
    }

    // Cloudinary upload options
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
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

    // Join The author name
    const author = user.firstName + " " + user.lastName;

    // Create new post
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
      message: "Successfull to Create Post",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to Create Post!",
    });
  }
};
