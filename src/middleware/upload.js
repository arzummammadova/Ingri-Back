import multer from "multer";
import path from "path";
import fs from "fs";

const destination = path.join(process.cwd(), "uploads", "avatars");
fs.mkdirSync(destination, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, destination),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : "";
    cb(null, `${req.user._id}-${Date.now()}${safe || ".img"}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("INVALID_FILE"), ok);
  },
});

export function avatarUpload(req, res, next) {
  upload.single("avatar")(req, res, (error) => {
    if (error) return res.status(400).json({ code: "INVALID_FILE" });
    if (req.file && ![".jpg", ".jpeg", ".png", ".webp"].includes(path.extname(req.file.filename))) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ code: "INVALID_FILE" });
    }
    next();
  });
}
