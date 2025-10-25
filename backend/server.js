import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin:
      "http://localhost:3000" ||
      "http://localhost:3000" ||
      "http://localhost:5173" ||
      "http://localhost:5174",
    credentials: true,
  })
);
// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
// http://localhost:8000/api/user/register

// Create Post Route
app.use("/api/posts", postRouter); // http://localhost:8000/api/user/create-post

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
