import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const fileName =
      crypto.randomBytes(5).toString("hex") + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileUpload = multer({
  storage,
});

export default fileUpload;
