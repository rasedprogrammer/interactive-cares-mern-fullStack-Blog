import express from "express";
import {
  getAllUsers,
  getUserById,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .put(isAuthenticated, singleUpload, updateProfile);
router.get("/all-users", getAllUsers);
router.get("/:id", isAuthenticated, getUserById);

export default router;
