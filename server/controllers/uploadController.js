import { uploadResumeToStorage } from '../services/storageService.js';
import { resumeUpload } from '../utils/fileUpload.js';

export const uploadResume = async (req, res) => {
  try {
    resumeUpload.single('resume')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Resume file is required' });
      }

      const storageResult = await uploadResumeToStorage(req.file.path, req.file.originalname, req.file.mimetype);
      res.status(200).json({ success: true, filePath: `/uploads/${req.file.filename}`, url: storageResult.url, storage: storageResult.storage });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
