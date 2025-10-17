import { Router } from "express";
import {
  createPostController,
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

export default postRouter;
