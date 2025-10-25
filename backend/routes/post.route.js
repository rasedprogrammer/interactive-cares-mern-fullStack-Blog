import { Router } from "express";
import {
  createPostController,
  deletePostController,
  updatePostController,
  getAllPostsController,
  getSinglePostController,
  getUserPostsController,
} from "../controllers/post.controller.js";
import fileUpload from "../middlewares/fileUpload.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const postRouter = Router();

postRouter.post("/create-post", isAuthenticated, fileUpload.single("image"), createPostController);
postRouter.put("/update-post/:id", isAuthenticated, fileUpload.single("image"), updatePostController);
postRouter.delete("/delete-post/:id", isAuthenticated, deletePostController);
postRouter.get("/all-posts", getAllPostsController);
postRouter.get("/post/:id", getSinglePostController);
postRouter.get("/my-posts", isAuthenticated, getUserPostsController);

export default postRouter;
