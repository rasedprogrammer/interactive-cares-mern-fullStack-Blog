// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/dataUri.js";
// import cloudinary from "../utils/cloudinary.js";
// import sendEmail from "../utils/send-email.js";
// import { Post } from "../models/post.model.js";
// import { Comment } from "../models/comment.model.js";
// import { Like } from "../models/like.model.js";
// import { Dislike } from "../models/dislike.model.js";
// import crypto from "crypto";

// // ----------------- REGISTER -----------------
// export const register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;

//     if (!firstName || !lastName || !email || !password)
//       return res.status(400).json({ message: "All fields required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       isVerified: false,
//     });

//     const verificationToken = jwt.sign(
//       { userId: newUser._id },
//       process.env.SECRET_KEY,
//       { expiresIn: "1d" }
//     );
//     newUser.verificationToken = verificationToken;
//     await newUser.save();

//     const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
//     console.log("Verifytoken:", verificationUrl);

//     await sendEmail(
//       newUser.email,
//       "Verify Email",
//       `<a href="${verificationUrl}">Verify Email</a>`
//     );

//     return res
//       .status(201)
//       .json({ message: "Registered successfully. Verify your email." });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Registration failed", error: err.message });
//   }
// };

// // ----------------- LOGIN -----------------
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     if (!user.isVerified) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Please verify your email first" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     // Include role and email inside the JWT
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         email: user.email,
//         role: user.role,
//         firstName: user.firstName,
//         photoUrl: user.photoUrl,
//         isverified: user.isVerified,
//       },
//       process.env.SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     // Set cookie
//     res.cookie("token", token, {
//       httpOnly: false, // allow frontend access (for dev)
//       secure: false,
//       sameSite: "lax",
//       path: "/",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: `Welcome back ${user.firstName}`,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Login failed", error });
//   }
// };

// // ----------------- LOGOUT -----------------
// export const logout = async (req, res) => {
//   try {
//     return res.status(200).cookie("token", "", { maxAge: 0 }).json({
//       success: true,
//       message: "Logout successfully",
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// // ----------------- VERIFY EMAIL -----------------
// export const verifyEmail = async (req, res) => {
//   try {
//     const token = req.query.token;
//     if (!token)
//       return res.status(400).json({ success: false, message: "Invalid token" });

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.SECRET_KEY);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         const expiredToken = jwt.decode(token);
//         const user = await User.findById(expiredToken.userId);

//         if (!user)
//           return res
//             .status(404)
//             .json({ success: false, message: "User not found" });
//         if (user.isVerified)
//           return res
//             .status(400)
//             .json({ success: false, message: "Email already verified" });

//         // create new token and resend email
//         const newToken = jwt.sign(
//           { userId: user._id },
//           process.env.SECRET_KEY,
//           { expiresIn: "1d" }
//         );
//         user.verificationToken = newToken;
//         await user.save();

//         const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${newToken}`;
//         const message = `
//           <h2>Hello ${user.firstName}</h2>
//           <p>Your previous verification link expired. Click below to verify your email:</p>
//           <a href="${verificationUrl}">Verify Email</a>
//         `;
//         await sendEmail(user.email, "Email Verification - New Link", message);

//         return res.status(400).json({
//           success: false,
//           message: "Token expired. A new verification email has been sent.",
//         });
//       } else {
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid token" });
//       }
//     }

//     // Normal verification if token is valid
//     const user = await User.findById(decoded.userId);
//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     if (user.isVerified)
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already verified" });

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     return res
//       .status(200)
//       .json({ success: true, message: "Email verified successfully" });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Verification failed", error });
//   }
// };

// // ----------------- UPDATE PROFILE -----------------
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, github } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // Update text fields
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.occupation = occupation || user.occupation;
//     user.bio = bio || user.bio;
//     user.instagram = instagram || user.instagram;
//     user.facebook = facebook || user.facebook;
//     user.linkedin = linkedin || user.linkedin;
//     user.github = github || user.github;

//     // Update photo if uploaded
//     if (req.file) {
//       const file = getDataUri(req.file);
//       const uploadResult = await cloudinary.uploader.upload(file);
//       user.photoUrl = uploadResult.secure_url;
//     }

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // ----------------- PROFILE DETAILS -----------------
// export const profileDetails = async (req, res) => {
//   console.log("User ID in middleware:", req.user?.id); // debug
//   const user = await User.findById(req.user?.id).select("-password");
//   if (!user) return res.status(404).json({ success: false, message: "User not found" });
//   res.status(200).json({ success: true, user });
// };


// // ----------------- FORGOT PASSWORD -----------------
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ success: false, message: "Email is required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Generate a reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = resetTokenExpiry;
//     await user.save();

//     // Send reset email
//     const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
//     const html = `
//       <h1>Password Reset Request</h1>
//       <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
//       <a href="${resetUrl}">${resetUrl}</a>
//     `;

//     await sendEmail(user.email, "Reset Your Password", html);

//     res.status(200).json({ success: true, message: "Reset password email sent" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send reset email" });
//   }
// };

// // ----------------- RESET PASSWORD -----------------
// export const resetPassword = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     if (!token || !newPassword) {
//       return res.status(400).json({ message: "Token and new password are required" });
//     }

//     // Find user with the reset token and check expiry
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() }, // token not expired
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired reset token" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     // Clear token fields
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     return res.status(200).json({ message: "Password has been reset successfully!" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return res.status(500).json({ message: "Server error while resetting password" });
//   }
// };


// // ----------------- GET ALL USERS -----------------
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     return res.status(200).json({
//       success: true,
//       message: "User list fetched successfully",
//       total: users.length,
//       users,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch users",
//       error,
//     });
//   }
// };

// // ----------------- GET SINGLE USER -----------------
// export const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "User fetched successfully",
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch user", error });
//   }
// };

// // ----------------- GET USER STATS -----------------
// export const getUserStats = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const blogsCount = await Post.countDocuments({ author: userId });
//     const commentsCount = await Comment.countDocuments({ user: userId });
//     const likesCount = await Like.countDocuments({ user: userId });
//     const dislikesCount = await Dislike.countDocuments({ user: userId });

//     res.status(200).json({
//       success: true,
//       data: {
//         blogs: blogsCount,
//         comments: commentsCount,
//         likes: likesCount,
//         dislikes: dislikesCount,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user stats",
//       error: error.message,
//     });
//   }
// };


import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import sendEmail from "../utils/send-email.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Dislike } from "../models/dislike.model.js";
import crypto from "crypto";

import DatauriParser from "datauri/parser.js";
const parser = new DatauriParser();
const getDataUri = (file) => parser.format(file.originalname, file.buffer).content;

// ----------------- REGISTER -----------------
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    newUser.verificationToken = verificationToken;
    await newUser.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      newUser.email,
      "Verify Email",
      `<a href="${verificationUrl}">Verify Email</a>`
    );

    return res
      .status(201)
      .json({ message: "Registered successfully. Verify your email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ----------------- LOGIN -----------------
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "All fields are required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid credentials" });

//     if (!user.isVerified)
//       return res.status(401).json({ success: false, message: "Please verify your email first" });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         email: user.email,
//         role: user.role,
//         firstName: user.firstName,
//         photoUrl: user.photoUrl,
//         isverified: user.isVerified,
//       },
//       process.env.SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: false, // true for prod
//       secure: false, // true for prod (https)
//       sameSite: "lax",
//       path: "/",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: `Welcome back ${user.firstName}`,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Login failed", error });
//   }
// };
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(401).json({ success: false, message: "Please verify your email first" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        photoUrl: user.photoUrl || "",
        isVerified: user.isVerified,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: false, // true for prod
      secure: false, // true for prod (https)
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

// ----------------- LOGOUT -----------------
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Logout failed", error });
  }
};

// ----------------- VERIFY EMAIL -----------------
export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token)
      return res.status(400).json({ success: false, message: "Invalid token" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const expiredToken = jwt.decode(token);
        const user = await User.findById(expiredToken.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified" });

        const newToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        user.verificationToken = newToken;
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${newToken}`;
        const message = `<h2>Hello ${user.firstName}</h2><p>Your previous link expired. Click to verify:</p><a href="${verificationUrl}">Verify Email</a>`;
        await sendEmail(user.email, "Email Verification - New Link", message);

        return res.status(400).json({ success: false, message: "Token expired. A new verification email has been sent." });
      } else {
        return res.status(400).json({ success: false, message: "Invalid token" });
      }
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Verification failed", error });
  }
};

// ----------------- UPDATE PROFILE -----------------
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, github } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.occupation = occupation || user.occupation;
//     user.bio = bio || user.bio;
//     user.instagram = instagram || user.instagram;
//     user.facebook = facebook || user.facebook;
//     user.linkedin = linkedin || user.linkedin;
//     user.github = github || user.github;

//     if (req.file) {
//       const file = getDataUri(req.file);
//       const uploadResult = await cloudinary.uploader.upload(file);
//       user.photoUrl = uploadResult.secure_url;
//     }

//     await user.save();

//     return res.status(200).json({ success: true, message: "Profile updated successfully", user });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
//   }
// };
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      occupation,
      bio,
      instagram,
      facebook,
      linkedin,
      github,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.occupation = occupation || user.occupation;
    user.bio = bio || user.bio;
    user.instagram = instagram || user.instagram;
    user.facebook = facebook || user.facebook;
    user.linkedin = linkedin || user.linkedin;
    user.github = github || user.github;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploadResult = await cloudinary.uploader.upload(fileUri);
      user.photoUrl = uploadResult.secure_url;
    }

    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// ----------------- PROFILE DETAILS -----------------
export const profileDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile details error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
};

// ----------------- FORGOT PASSWORD -----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const html = `<h1>Password Reset Request</h1><p>Click to reset your password. Expires in 15 minutes.</p><a href="${resetUrl}">${resetUrl}</a>`;

    await sendEmail(user.email, "Reset Your Password", html);

    return res.status(200).json({ success: true, message: "Reset password email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to send reset email", error: error.message });
  }
};

// ----------------- RESET PASSWORD -----------------
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: "Token and new password are required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error while resetting password", error: error.message });
  }
};

// ----------------- GET ALL USERS -----------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, message: "User list fetched successfully", total: users.length, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// ----------------- GET SINGLE USER -----------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, message: "User fetched successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
  }
};

// ----------------- GET USER STATS -----------------
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ fixed from _id to id
    const blogsCount = await Post.countDocuments({ author: userId });
    const commentsCount = await Comment.countDocuments({ user: userId });
    const likesCount = await Like.countDocuments({ user: userId });
    const dislikesCount = await Dislike.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      data: { blogs: blogsCount, comments: commentsCount, likes: likesCount, dislikes: dislikesCount },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch user stats", error: error.message });
  }
};
