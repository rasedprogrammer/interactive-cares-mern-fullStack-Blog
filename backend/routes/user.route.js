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
  getUserStats,
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
router.get("/stats", isAuthenticated, getUserStats);
router.get("/profile/me", isAuthenticated, profileDetails);

router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);

// Admin-only routes (you can add a role check middleware if needed)
router.get("/all-users", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);

export default router;
