import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeResumeWithAi } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeResume = async (req, res) => {
  try {
    const { filePath, jobDescription = '' } = req.body;
    const sourcePath = req.file?.path || filePath;

    if (!sourcePath) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    const absolutePath = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(__dirname, '..', sourcePath.replace(/^\//, ''));
    const exists = fs.existsSync(absolutePath);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Resume file not found' });
    }

    const analysis = await analyzeResumeWithAi(absolutePath, jobDescription, req.user?.name);

    res.status(200).json({ success: true, analysis, message: 'Resume analyzed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
