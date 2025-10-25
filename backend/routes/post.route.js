import express from "express";
import {
  createPostController,
  deletePost,
  getMyPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/fileUpload.js";

const router = express.Router();

// Create post (auth + optional image upload)
router.post(
  "/create-post",
  isAuthenticated,
  singleUpload,
  createPostController
);
router.get("/my-blogs", isAuthenticated, getMyPosts);

// Update a post by ID
router.put("/:id", isAuthenticated, updatePost);

// Delete a post by ID
router.delete("/:id", isAuthenticated, deletePost);

export default router;
