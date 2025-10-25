import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllPosts,
  getSinglePostById,
  SearchPost,
  updatePostController,
} from "../controllers/post.controller.js";
import fileUpload from "../middlewares/fileUpload.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const postRouter = Router();

// Create Post
postRouter.post(
  "/create-post",
  isAuthenticated,
  fileUpload.single("image"),
  createPostController
);

// Update Post
postRouter.put(
  "/update-post/:id",
  isAuthenticated,
  fileUpload.single("image"),
  updatePostController
);

// Search Post
postRouter.get("/search-posts", SearchPost);

// Delete Post
postRouter.delete("/delete-post/:id", isAuthenticated, deletePostController);

// Get All Posts
postRouter.get("/get-all-posts", getAllPosts);

// Get Single Post
postRouter.get("/get-single-post/:id", getSinglePostById);

export default postRouter;
