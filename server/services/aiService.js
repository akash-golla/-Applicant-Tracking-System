import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { fileURLToPath } from 'url';

const getAiProviderConfig = () => {
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (openAiKey) {
    return {
      provider: 'openai',
      apiKey: openAiKey,
      endpoint: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1/chat/completions',
    };
  }

  if (geminiKey) {
    return {
      provider: 'gemini',
      apiKey: geminiKey,
      endpoint: process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    };
  }

  return null;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

const extractTextFromResume = async (filePath) => {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, '..', filePath.replace(/^\//, ''));
  const ext = path.extname(fullPath).toLowerCase();

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(fullPath);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    return normalizeText(data.text);
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: fullPath });
    return normalizeText(result.value);
  }

  if (ext === '.txt') {
    const raw = fs.readFileSync(fullPath, 'utf8');
    return normalizeText(raw);
  }

  throw new Error('Unsupported resume format. Please upload a PDF, DOCX, or TXT file.');
};

const extractSkills = (text) => {
  const lower = text.toLowerCase();
  const keywords = ['javascript', 'react', 'node', 'express', 'mongodb', 'python', 'typescript', 'aws', 'docker', 'sql', 'redis', 'java'];
  return keywords.filter((keyword) => lower.includes(keyword)).map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1));
};

const extractExperience = (text) => {
  const match = text.match(/(\d+\+?\s*(years|yr|yrs))/i);
  return match ? match[0] : 'Experience not clearly stated';
};

const extractEducation = (text) => {
  const match = text.match(/(Bachelor|B\.Sc|BSc|Master|M\.Sc|MBA|Diploma|PhD|High School)/i);
  return match ? match[0] : 'Education not clearly stated';
};

const buildSummary = (name, skills, score) => {
  return `Candidate ${name} demonstrates strong fit with ${skills.join(', ')} and an estimated match score of ${score}%.`;
};

const buildSemanticMatch = (jobDescription, skills) => {
  const jobKeywords = (jobDescription || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const skillKeywords = skills.map((skill) => skill.toLowerCase());
  const overlap = skillKeywords.filter((skill) => jobKeywords.includes(skill));
  return overlap.length > 0 ? overlap : skillKeywords.slice(0, 3);
};

const getProviderAnalysis = async (text, jobDescription, candidateName) => {
  const config = getAiProviderConfig();
  if (!config) {
    return null;
  }

  try {
    if (config.provider === 'openai') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an HR recruiting assistant. Summarize a candidate resume for ATS matching.' },
            { role: 'user', content: `Candidate name: ${candidateName}\nResume text: ${text}\nJob description: ${jobDescription}` },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('AI provider request failed');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return content ? { summary: content, source: 'openai' } : null;
    }

    const response = await fetch(`${config.endpoint}?key=${config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Candidate name: ${candidateName}\nResume text: ${text}\nJob description: ${jobDescription}` }] }],
      }),
    });

    if (!response.ok) {
      throw new Error('AI provider request failed');
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return content ? { summary: content, source: 'gemini' } : null;
  } catch (error) {
    return null;
  }
};

export const analyzeResumeWithAi = async (filePath, jobDescription = '', nameHint = '') => {
  const text = await extractTextFromResume(filePath);
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const nameMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  const fallbackName = nameHint || text.split(/\n+/)[0]?.trim() || 'Unknown Candidate';
  const candidateName = nameMatch ? nameMatch[1] : fallbackName;

  const lowerJob = (jobDescription || '').toLowerCase();
  const matchedSkills = skills.filter((skill) => lowerJob.includes(skill.toLowerCase()));
  const missingSkills = (jobDescription ? ['TypeScript', 'SQL', 'React'] : []).filter((skill) => !matchedSkills.some((item) => item.toLowerCase() === skill.toLowerCase()));
  const score = Math.min(95, Math.max(60, 70 + matchedSkills.length * 6 + skills.length));
  const providerAnalysis = await getProviderAnalysis(text, jobDescription, candidateName);
  const semanticMatch = buildSemanticMatch(jobDescription, skills);

  return {
    name: candidateName,
    skills: skills.length > 0 ? skills : ['Communication', 'Problem Solving'],
    experience,
    education,
    matchScore: score,
    missingSkills,
    summary: providerAnalysis?.summary || buildSummary(candidateName, skills.length > 0 ? skills : ['communication'], score),
    semanticMatch,
    source: providerAnalysis?.source || 'heuristic',
  };
};
