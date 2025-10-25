import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const fileName =
      crypto.randomBytes(5).toString("hex") + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileUpload = multer({ storage });

export const singleUpload = fileUpload.single("image");
