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
// Get the logged-in user's profile
router.get("/profile/me", isAuthenticated, profileDetails);

// Update the logged-in user's profile (with optional image upload)
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);

// Get all users (admin access or protected route)
router.get("/all-users", isAuthenticated, getAllUsers);

// Get a specific user by ID
router.get("/:id", isAuthenticated, getUserById);

export default router;
