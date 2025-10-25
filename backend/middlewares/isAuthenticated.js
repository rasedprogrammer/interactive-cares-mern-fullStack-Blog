// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// export const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token)
//       return res
//         .status(401)
//         .json({ success: false, message: "User not authenticated" });

//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     if (!decoded)
//       return res.status(401).json({ success: false, message: "Invalid token" });

//     // Attach full user to req.user
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user)
//       return res
//         .status(401)
//         .json({ success: false, message: "User not found" });

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ success: false, message: "Authentication failed" });
//   }
// };

// // Role-based access middleware
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role))
//       return res.status(403).json({ success: false, message: "Access denied" });
//     next();
//   };
// };

// middlewares/isAuthenticated.js
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token; // JWT stored in cookies
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user info to request
    req.user = {
      id: decoded.userId,       // userId must be stored in JWT during login
      role: decoded.role || "user",
      email: decoded.email || null, // optional
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};


