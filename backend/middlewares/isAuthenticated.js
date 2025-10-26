import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Try to get token from cookies (if used)
    if (req.cookies?.token) token = req.cookies.token;
    // 2️⃣ Fallback: token from Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3️⃣ If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Token missing.",
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 5️⃣ Attach user info to request
    req.user = {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };

    // 6️⃣ Continue
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
