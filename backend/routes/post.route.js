import { Router } from "express";
import { createPostController } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post("/create-post", createPostController);

export default postRouter;
