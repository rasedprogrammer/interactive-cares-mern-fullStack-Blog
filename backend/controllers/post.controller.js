import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const createPostController = async (req, res) => {
  try {
    const { title, description, image, content, userId } = req.body;
    // const userId = req.user.id;


    if (!title || !description || !image || !content) {
      return res.status(400).json({
        message: "Please Provide all Required Fileds!",
        success: false,
      });
    }

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Not Found!",
      });
    }

    const author = user.firstName + " " + user.lastName;

    const newPost = await Post.create({
      title,
      description,
      author,
      image,
      content,
    });

    res.status(200).json({
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
