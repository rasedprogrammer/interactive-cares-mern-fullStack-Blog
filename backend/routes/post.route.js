import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  createPostController,
  updatePostController,
  deletePostController,
  getAllPostsController,
  getSinglePostController,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create-post", isAuthenticated, singleUpload, createPostController);
router.put("/update-post/:id", isAuthenticated, singleUpload, updatePostController);
router.delete("/delete-post/:id", isAuthenticated, deletePostController);
router.get("/all-posts", getAllPostsController);
router.get("/single-post/:id", getSinglePostController);

export default router;
