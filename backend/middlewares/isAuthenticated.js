import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token; // JWT stored in cookies
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = {
      id: decoded.userId,
      role: decoded.role || "user",
      email: decoded.email || null,
      photoUrl: decoded.photoUrl || null,
      isverified: decoded.isverified || false,
      firstName: decoded.firstName || null,
      lastName: decoded.lastName || null,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
