import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extractTextFromResume = async (filePath) => {
  const fullPath = path.resolve(__dirname, '..', filePath.replace(/^\//, ''));
  const ext = path.extname(fullPath).toLowerCase();

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(fullPath);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    return data.text.replace(/\s+/g, ' ').trim();
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: fullPath });
    return result.value.replace(/\s+/g, ' ').trim();
  }

  if (ext === '.txt') {
    const raw = fs.readFileSync(fullPath, 'utf8');
    return raw.replace(/\s+/g, ' ').trim();
  }

  throw new Error('Unsupported resume format. Please upload a PDF, DOCX, or TXT file.');
};

const extractCandidateData = (text) => {
  const lower = text.toLowerCase();
  const skills = [];
  const techKeywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'python', 'typescript', 'aws', 'docker', 'sql', 'redis'];

  techKeywords.forEach((keyword) => {
    if (lower.includes(keyword)) {
      skills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  });

  const nameMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  const experienceMatch = text.match(/(\d+\+?\s*(years|yr|yrs))/i);
  const educationMatch = text.match(/(Bachelor|B\.Sc|BSc|Master|M\.Sc|MBA|Diploma|PhD|High School)/i);

  return {
    name: nameMatch ? nameMatch[1] : 'Unknown Candidate',
    skills: skills.length > 0 ? skills : ['Communication', 'Problem Solving'],
    experience: experienceMatch ? experienceMatch[0] : 'Experience not clearly stated',
    education: educationMatch ? educationMatch[0] : 'Education not clearly stated',
    matchScore: Math.min(95, 70 + skills.length * 4),
    missingSkills: ['TypeScript'],
    summary: 'Resume parsed successfully and summarized from the uploaded document.',
  };
};

export const analyzeResume = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ success: false, message: 'Resume path is required' });
    }

    const absolutePath = path.resolve(__dirname, '..', filePath.replace(/^\//, ''));
    const exists = fs.existsSync(absolutePath);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Resume file not found' });
    }

    const text = await extractTextFromResume(filePath);
    const analysis = extractCandidateData(text);

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
