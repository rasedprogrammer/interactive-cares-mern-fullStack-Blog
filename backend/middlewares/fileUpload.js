// import multer from "multer";
// import crypto from "crypto";
// import path from "path";
// import fs from "fs";

// // Ensure uploads folder exists
// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const fileName =
//       crypto.randomBytes(5).toString("hex") + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

// // Export single file middleware
// export const singleUpload = multer({ storage }).single("image"); // field name = "image"

// backend/middlewares/fileUpload.js
import multer from "multer";

// Use memory storage to keep file in memory (req.file.buffer)
const storage = multer.memoryStorage();

const fileUpload = multer({ storage });

// Single file upload middleware (field name = "image")
export const singleUpload = fileUpload.single("image");
