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
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // contains userId & role
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
