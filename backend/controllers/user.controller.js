import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import sendEmail from "../utils/send-email.js";

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
    console.log("Verifytoken:", verificationUrl);

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
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Include role and email inside the JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        photoUrl: user.photoUrl,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: false, // allow frontend access (for dev)
      secure: false,
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
    console.error(error);
    res.status(500).json({ success: false, message: "Login failed", error });
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

        if (!user)
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        if (user.isVerified)
          return res
            .status(400)
            .json({ success: false, message: "Email already verified" });

        // create new token and resend email
        const newToken = jwt.sign(
          { userId: user._id },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        user.verificationToken = newToken;
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${newToken}`;
        const message = `
          <h2>Hello ${user.firstName}</h2>
          <p>Your previous verification link expired. Click below to verify your email:</p>
          <a href="${verificationUrl}">Verify Email</a>
        `;
        await sendEmail(user.email, "Email Verification - New Link", message);

        return res.status(400).json({
          success: false,
          message: "Token expired. A new verification email has been sent.",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid token" });
      }
    }

    // Normal verification if token is valid
    const user = await User.findById(decoded.userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed", error });
  }
};

// ----------------- UPDATE PROFILE -----------------
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId; // From isAuthenticated middleware
//     const {
//       firstName,
//       lastName,
//       occupation,
//       bio,
//       instagram,
//       facebook,
//       linkedin,
//       github,
//     } = req.body;
//     const file = req.file;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Update fields if provided
//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (occupation) user.occupation = occupation;
//     if (bio) user.bio = bio;
//     if (instagram) user.instagram = instagram;
//     if (facebook) user.facebook = facebook;
//     if (linkedin) user.linkedin = linkedin;
//     if (github) user.github = github;

//     // Upload profile image to cloudinary if provided
//     if (file) {
//       const fileUri = getDataUri(file);
//       const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//       user.photoUrl = cloudResponse.secure_url;
//     }

//     await user.save();

//     // Create new JWT token with updated info
//     const token = jwt.sign(
//       { userId: user._id, role: user.role, firstName: user.firstName, avatar: user.photoUrl },
//       process.env.SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     // Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     // Return updated user (excluding password)
//     const { password, ...userData } = user._doc;

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: userData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile",
//       error,
//     });
//   }
// };
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // <-- fixed
//     const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, github } = req.body;
//     const file = req.file;

//     let cloudResponse;
//     if (file) {
//       const fileUri = getDataUri(file);
//       cloudResponse = await cloudinary.uploader.upload(fileUri);
//     }

//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (occupation) user.occupation = occupation;
//     if (bio) user.bio = bio;
//     if (instagram) user.instagram = instagram;
//     if (facebook) user.facebook = facebook;
//     if (linkedin) user.linkedin = linkedin;
//     if (github) user.github = github;
//     if (cloudResponse) user.photoUrl = cloudResponse.secure_url;

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Profile update error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update profile",
//       error: error.message,
//     });
//   }
// };



// -------
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, github } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update text fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.occupation = occupation || user.occupation;
    user.bio = bio || user.bio;
    user.instagram = instagram || user.instagram;
    user.facebook = facebook || user.facebook;
    user.linkedin = linkedin || user.linkedin;
    user.github = github || user.github;

    // Update photo if uploaded
    if (req.file) {
      const file = getDataUri(req.file);
      const uploadResult = await cloudinary.uploader.upload(file);
      user.photoUrl = uploadResult.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




export const profileDetails = async (req, res) => {
  console.log("User ID in middleware:", req.user?.id); // debug
  const user = await User.findById(req.user?.id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, user });
};

// ----------------- GET ALL USERS -----------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      total: users.length,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error,
    });
  }
};

// ----------------- GET SINGLE USER -----------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch user", error });
  }
};
