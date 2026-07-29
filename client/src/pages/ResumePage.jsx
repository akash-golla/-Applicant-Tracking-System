import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || user?.role !== 'applicant') {
      setIsAuthenticated(false);
      setMessage('Please sign in as an applicant to analyze a resume.');
      return;
    }

    setIsAuthenticated(true);
    setMessage('');
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please choose a resume file');
      return;
    }

    if (!isAuthenticated) {
      setMessage('Please sign in as an applicant to analyze a resume.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const analysisRes = await api.post('/ai/analyze', {
        filePath: uploadRes.data.filePath,
      });

      setAnalysis(analysisRes.data.analysis);
      setMessage('Resume analyzed successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to analyze resume');
    }
  };

  return (
    <section className="panel">
      <h2>Resume analysis</h2>
      <p>Upload a resume to extract candidate details and AI match insights.</p>
      {!isAuthenticated ? (
        <div className="auth-form">
          <button type="button" onClick={() => navigate('/auth')}>Go to sign in</button>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="auth-form">
          <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit">Analyze resume</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
      {analysis && (
        <div className="job-card">
          <h3>{analysis.name}</h3>
          <p><strong>Skills:</strong> {analysis.skills.join(', ')}</p>
          <p><strong>Experience:</strong> {analysis.experience}</p>
          <p><strong>Education:</strong> {analysis.education}</p>
          <p><strong>Match score:</strong> {analysis.matchScore}%</p>
          <p><strong>Missing skills:</strong> {analysis.missingSkills.join(', ')}</p>
          <p><strong>Summary:</strong> {analysis.summary}</p>
        </div>
      )}
    </section>
  );
}

export default ResumePage;
