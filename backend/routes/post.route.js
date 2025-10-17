import { Router } from "express";
import { createPostController } from "../controllers/post.controller.js";
import fileUpload from "../middlewares/fileUpload.js";

const postRouter = Router();

postRouter.post(
  "/create-post",
  fileUpload.single("image"),
  createPostController
);

export default postRouter;
