// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Always use OS temp folder (/tmp) for file uploads
const uploadDir = "/tmp";

// Ensure the directory exists (safe for local too)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
