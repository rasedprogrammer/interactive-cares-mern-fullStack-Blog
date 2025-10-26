import multer from "multer";
import path from "path";

const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const singleUpload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, JPG, and WEBP files are allowed"));
  },
}).single("photo"); // single image field from frontend


// ✅ 2. For post creation (multiple images)
export const uploadPostImages = multer({
  storage: multer.diskStorage({
    destination: "uploads/", // temp folder (auto-created)
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type for post image"));
  },
}).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "thumbnailImage", maxCount: 1 },
]);
