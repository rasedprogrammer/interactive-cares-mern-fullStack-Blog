import { Router } from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/add", addComment);
router.get("/:postId", getComments);
router.delete("/:id", deleteComment);

export default router;
