// import multer from "multer";
// import crypto from "crypto";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // const storage = multer.diskStorage({
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const fileName =
//       crypto.randomBytes(5).toString("hex") + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

// const fileUpload = multer({ storage });

// export const singleUpload = fileUpload.single("image");

// import multer from "multer";
// import crypto from "crypto";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// // Fix __dirname in ES Module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define upload folder path safely
// const uploadDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const fileName =
//       crypto.randomBytes(5).toString("hex") + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage });

// // ✅ Export consistent middleware
// export const singleUpload = upload.single("image");

import multer from "multer";

const storage = multer.memoryStorage(); // store in memory, not disk
const upload = multer({ storage });

export const singleUpload = upload.single("image");
