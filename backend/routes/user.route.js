import express from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  profileDetails,
  updateProfile,
  getAllUsers,
  getUserById,
  forgotPassword,
  resetPassword,
  getUserStats, // ✅ make sure this function exists in your controller
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// -------------------- PUBLIC ROUTES -------------------- //
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// -------------------- PROTECTED ROUTES -------------------- //
// ✅ Dashboard stats: number of blogs, comments, likes, dislikes
router.get("/stats", isAuthenticated, getUserStats);

// ✅ Get logged-in user's profile
router.get("/profile/me", isAuthenticated, profileDetails);

// ✅ Update profile (with optional image upload)
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);

// ✅ Admin or authorized user - Get all users
router.get("/all-users", isAuthenticated, getAllUsers);

// ✅ Get single user by ID
router.get("/:id", isAuthenticated, getUserById);

export default router;
