import express from "express";
import {
  getAllUsers,
  getUserById,
  login,
  logout,
  register,
  updateProfile,
  verifyEmail,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify/:token", verifyEmail);

// Protected routes
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);
router.get("/all-users", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);

export default router;
