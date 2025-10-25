import { Router } from "express";
import { getLikes, toggleLike } from "../controllers/like.controller.js";

const router = Router();

router.post("/toggle", toggleLike);
router.get("/count/:postId", getLikes);

export default router;
