import express from "express";
import {
  addComment,
  createPostController,
  deletePost,
  dislikePost,
  getMyPosts,
  getRecentPosts,
  getSinglePostController,
  likePost,
  updatePost,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/fileUpload.js";

const router = express.Router();

// Create post
router.post(
  "/create-post",
  isAuthenticated,
  singleUpload,
  createPostController
);

// Recent posts
router.get("/recent", getRecentPosts);

// My posts
router.get("/my-blogs", isAuthenticated, getMyPosts);

// Update / Delete
router.put("/:id", isAuthenticated, singleUpload, updatePost);
router.delete("/:id", isAuthenticated, deletePost);

// Single post by ID (after /recent)
router.get("/:id", isAuthenticated, getSinglePostController);

// Like / Dislike / Comment
router.put("/like/:id", isAuthenticated, likePost);
router.put("/dislike/:id", isAuthenticated, dislikePost);
router.post("/comment/:id", isAuthenticated, addComment);

export default router;
