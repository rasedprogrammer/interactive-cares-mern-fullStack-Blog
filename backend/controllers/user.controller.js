import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed To Register", error });
  }
};

export const login = async (req, res) => {
  try {
    // Destructure Data Form req.Body
    const { email, password } = req.body;
    // If any Field are not given by user then trow this error
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Field Is Required",
      });
    }
    // Find the email from the db
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email and Password",
      });
    }
    //  Compare The User Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // Set JWT Token
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameStie: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.firstName}`,
        user,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed To Login", error });
  }
};

export const logout = async (__, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
