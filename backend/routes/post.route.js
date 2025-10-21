import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllPosts,
  getSinglePostById,
  updatePostController,
} from "../controllers/post.controller.js";
import fileUpload from "../middlewares/fileUpload.js";

const postRouter = Router();

// Create Post
postRouter.post(
  "/create-post",
  fileUpload.single("image"),
  createPostController
);

// Update Post
postRouter.put(
  "/update-post/:id",
  fileUpload.single("image"),
  updatePostController
);

// Delete Post
postRouter.delete("/delete-post/:id", deletePostController);

// Get All Posts
postRouter.get("/get-all-posts", getAllPosts);

// Get Single Post
postRouter.get("/get-single-post/:id", getSinglePostById);

export default postRouter;
