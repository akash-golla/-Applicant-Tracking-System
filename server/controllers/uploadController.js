import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ensureUploadDir } from '../utils/fileUpload.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ensureUploadDir()),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadResume = async (req, res) => {
  try {
    const uploadSingle = upload.single('resume');

    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Resume file is required' });
      }

      const filePath = `/uploads/${req.file.filename}`;
      res.status(200).json({ success: true, filePath });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
