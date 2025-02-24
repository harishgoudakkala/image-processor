import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { handleUpload } from "../controllers/uploadController.js";

const router = express.Router();

// ✅ Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");

// ✅ Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

router.post("/", upload.single("file"), handleUpload);

export default router;
