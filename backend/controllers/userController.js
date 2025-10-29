// blog-application/backend/controllers/userController.js
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler"); // Helper for handling async errors
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
// const jwt = require("jsonwebtoken"); // FR-1.5, NFR-4.1.1: For JWT Auth
const crypto = require("crypto");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   // FR-1.1: Check if user already exists
//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400); // Bad Request
//     throw new Error("User already exists");
//   }

//   // Create the user. The password hashing is handled by the model's pre('save') hook.
//   const user = await User.create({
//     name,
//     email,
//     password,
//     // Default role is 'Regular User'
//   });

//   if (!user) {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }

//   // generate verification token (plain token for URL, stored hashed)
//   const verificationToken = crypto.randomBytes(20).toString("hex");
//   user.verificationToken = crypto
//     .createHash("sha256")
//     .update(verificationToken)
//     .digest("hex");
//   user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   await user.save({ validateBeforeSave: false });

//   // Build verification URL (adjust frontend URL as required)
//   const verifyUrl = `${
//     process.env.CLIENT_URL || "http://localhost:3000"
//   }/verify-email/${verificationToken}`;

//   const message = `
//     <h3>Welcome to Blog Application</h3>
//     <p>Please verify your email by clicking the link below. This link is valid for 24 hours.</p>
//     <a href="${verifyUrl}" clicktracking="off">${verifyUrl}</a>
//     <p>If you did not register, please ignore this email.</p>
//   `;

//   if (user) {
//     // FR-1.1: Registration successful.
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: "Verify your email for Blog Application",
//         message,
//       });

//       // In strict mode do NOT auto-login; just inform frontend to prompt verification
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id), // Send JWT token
//         message:
//           "Registration successful. Please check your email to verify your account.",
//       });
//     } catch (error) {
//       // If email fails, clear token and return error
//       user.verificationToken = undefined;
//       user.verificationExpire = undefined;
//       await user.save({ validateBeforeSave: false });

//       res.status(500);
//       throw new Error(
//         "Verification email failed to send. Please try again later."
//       );
//     }
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// // @desc Verify email
// // @route GET /api/users/verify-email/:token
// const verifyEmail = asyncHandler(async (req, res) => {
//   const token = req.params.token;
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//   const user = await User.findOne({
//     verificationToken: hashedToken,
//     verificationExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     res.status(400);
//     throw new Error("Invalid or expired verification token.");
//   }

//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationExpire = undefined;

//   await user.save();

//   // Optionally return JWT so user is logged in immediately after verifying
//   const tokenJwt = generateToken(user._id);

//   res.status(200).json({
//     message: "Email verified successfully.",
//     token: tokenJwt,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });

// // @desc    Auth user & get token (Login)
// // @route   POST /api/users/login
// // @access  Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }

//   if (!user.isVerified) {
//     res.status(401);
//     throw new Error("Please verify your email before logging in.");
//   }

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401); // Unauthorized
//     throw new Error("Invalid email or password");
//   }
// });

// // @desc    Resend email verification
// // @route   POST /api/users/resend-verification
// // @access  Public
// const resendVerification = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     res.status(400);
//     throw new Error("Email is required");
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(200).json({
//       message:
//         "If a user with that email exists, a verification email has been sent.",
//     });
//   }

//   if (user.isVerified) {
//     return res.status(400).json({ message: "User is already verified" });
//   }

//   // Generate token
//   const verifyToken = crypto.randomBytes(20).toString("hex");
//   user.verifyEmailToken = crypto
//     .createHash("sha256")
//     .update(verifyToken)
//     .digest("hex");
//   user.verifyEmailExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//   await user.save({ validateBeforeSave: false });

//   // Send verification email
//   const verifyUrl = `http://localhost:3000/verify-email/${verifyToken}`;
//   const message = `
//         <h1>Email Verification</h1>
//         <p>Click the link below to verify your account (valid 10 minutes):</p>
//         <a href="${verifyUrl}">${verifyUrl}</a>
//     `;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Verify Your Email - Blog Application",
//       message,
//     });

//     res.status(200).json({ message: "Verification email sent!" });
//   } catch (error) {
//     user.verifyEmailToken = undefined;
//     user.verifyEmailExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     res.status(500);
//     throw new Error("Email could not be sent");
//   }
// });

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires JWT)
// ===== 1. Register User =====
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24h
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${
    process.env.CLIENT_URL || "http://localhost:3000"
  }/verify-email/${verificationToken}`;
  const message = `
    <h3>Welcome to Blog Application</h3>
    <p>Please verify your email by clicking the link below. This link is valid for 24 hours.</p>
    <a href="${verifyUrl}" clicktracking="off">${verifyUrl}</a>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify your email for Blog Application",
      message,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error(
      "Verification email failed to send. Please try again later."
    );
  }
});

// ===== 2. Verify Email =====
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpire = undefined;

  await user.save();
  const tokenJwt = generateToken(user._id);

  res.status(200).json({
    message: "Email verified successfully.",
    token: tokenJwt,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ===== 3. Auth User/Login =====
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error("Please verify your email before logging in.");
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ===== 4. Resend Verification =====
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      message:
        "If a user with that email exists, a verification email has been sent.",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "User is already verified" });
  }

  const verifyToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  user.verificationExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `http://localhost:3000/verify-email/${verifyToken}`;
  const message = `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your account (valid 10 minutes):</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify Your Email - Blog Application",
      message,
    });

    res.status(200).json({ message: "Verification email sent!" });
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error("Email could not be sent");
  }
});
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware (contains the user object without password)
  const user = req.user;

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      // Include other profile fields like bio, profilePicture etc. later
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users (Admin panel list)
// @route   GET /api/users
// @access  Private/Admin (FR-2.4)
const getUsers = asyncHandler(async (req, res) => {
  // Only fetch non-password fields
  const users = await User.find({}).select("-password");

  res.json(users);
});

// @desc    Update/Suspend User (Admin action)
// @route   PUT /api/users/:id
// @access  Private/Admin (FR-2.4)
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Admin can update name, email, or role
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    // Example logic for Suspend: If the Admin passes a 'suspended' field, handle it.
    // For simplicity, we'll just allow role update for now, which implies control.

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete a user (Admin action)
// @route   DELETE /api/users/:id
// @access  Private/Admin (FR-2.4)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  // Prevent Admin from deleting their own account (Safety Check)
  if (user && user._id.toString() !== req.user._id.toString()) {
    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } else if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Cannot delete your own admin account");
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// NOTE: Placeholder function for sending email (replace with actual service later)
// const sendResetEmail = (email, resetUrl) => {
//   console.log(`\n--- EMAIL RESET LINK ---`);
//   console.log(`To: ${email}`);
//   console.log(`Reset URL: ${resetUrl}`);
//   console.log(`--- END EMAIL RESET LINK ---\n`);
//   // In a real app, integrate nodemailer/SendGrid/etc. here
// };

// @desc    Generate password reset token and send email
// @route   POST /api/users/forgot-password
// @access  Public (FR-3.1)
const forgotPassword = asyncHandler(async (req, res) => {
  // 1. FIND THE USER DOCUMENT BY EMAIL
  const user = await User.findOne({ email: req.body.email }); // <--- RESTORED

  if (!user) {
    // IMPORTANT: Always return a success message for security, even if the user isn't found
    return res.status(200).json({
      message:
        "If a user with that email exists, a password reset link has been sent.",
    });
  }

  // 2. TOKEN GENERATION AND SAVING LOGIC (RESTORED FROM PREVIOUS STEP)
  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${
    process.env.CLIENT_URL || "http://localhost:3000"
  }/reset-password/${resetToken}`;

  const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password. This link is valid for 10 minutes:</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

  // 3. CALL sendEmail USING THE DOCUMENT INSTANCE
  try {
    await sendEmail({
      email: user.email, // <--- CORRECT: Using user.email (document instance)
      subject: "Password Reset Request for Blog Application",
      message: message,
    });

    res.status(200).json({
      message: "Password reset link sent successfully to your email.",
    });
  } catch (error) {
    console.error("Email failed to send:", error);
    // Clear token on failure
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error(
      "Password reset email failed to send. Please try again later."
    );
  }
});

// @desc    Reset password using token
// @route   PUT /api/users/reset-password/:token
// @access  Public (FR-3.1)
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // Hash the URL token to search the database
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset token.");
  }

  // Hash the new password (The pre('save') hook in User.js will handle the hashing!)
  user.password = password;

  // Clear the token fields after a successful reset
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save(); // Save triggers the password hash

  res.status(200).json({
    message:
      "Password reset successful. You can now log in with your new password.",
  });
});

module.exports = {
  registerUser,
  verifyEmail,
  resendVerification,
  authUser,
  getUserProfile,
  getUsers,
  updateUserByAdmin,
  deleteUser,
  forgotPassword,
  resetPassword,
};
