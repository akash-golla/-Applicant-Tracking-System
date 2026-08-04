import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const analyzeFile = async (selectedFile) => {
    if (!selectedFile) {
      setMessage('Please choose a resume file');
      return;
    }

    if (!isAuthenticated) {
      setMessage('Please sign in as an applicant to analyze a resume.');
      return;
    }

    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const ext = `.${selectedFile.name.split('.').pop()?.toLowerCase() || ''}`;

    if (!allowedTypes.includes(ext)) {
      setMessage('Please upload a PDF, DOCX, or TXT resume.');
      return;
    }

    setFile(selectedFile);
    setIsAnalyzing(true);
    setAnalysis(null);
    setMessage('Uploading and analyzing your resume...');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const analysisRes = await api.post('/ai/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysis(analysisRes.data.analysis);
      setMessage(analysisRes.data.message || 'Resume analyzed successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please choose a resume file');
      return;
    }

    await analyzeFile(file);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile) {
      analyzeFile(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFileSelection(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="panel resume-shell" style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.22)' }}>
      <div className="resume-intro">
        <p className="eyebrow">Resume intelligence</p>
        <h2>Upload your resume and get instant insights</h2>
        <p>Drop a PDF, DOCX, or TXT file and receive a clearer, more helpful candidate summary in seconds.</p>
      </div>

      <div className="resume-steps">
        <span className="step-pill">1. Upload</span>
        <span className="step-pill">2. Review</span>
        <span className="step-pill">3. Improve</span>
      </div>

      {!isAuthenticated ? (
        <div className="auth-form">
          <button type="button" onClick={() => navigate('/auth')} style={{ borderRadius: 999 }}>Go to sign in</button>
        </div>
      ) : (
        <div
          className={`upload-card ${dragActive ? 'active' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => handleFileSelection(event.target.files?.[0])}
          />
          <label htmlFor="resume-upload" className="upload-dropzone">
            <span className="upload-icon">⬆️</span>
            <strong>{file ? file.name : 'Drop your resume here'}</strong>
            <span>or click to browse your files</span>
            <small>PDF, DOCX, or TXT • up to 5 MB</small>
          </label>

          <form onSubmit={handleUpload} className="upload-actions">
            <button type="button" onClick={() => document.getElementById('resume-upload')?.click()} style={{ borderRadius: 999 }}>
              Choose resume
            </button>
            <button type="submit" disabled={!file || isAnalyzing} style={{ borderRadius: 999 }}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze now'}
            </button>
          </form>
        </div>
      )}

      {message && <p className={`message ${isAnalyzing ? 'info' : message.toLowerCase().includes('success') ? 'success' : message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') ? 'error' : ''}`}>{message}</p>}

      {analysis && (
        <div className="analysis-card">
          <div className="analysis-header">
            <div>
              <h3>{analysis.name || 'Candidate profile'}</h3>
              <p>Highlights from the uploaded resume and estimated fit.</p>
            </div>
            <span className="score-pill">{analysis.matchScore ?? 0}% match</span>
          </div>

          <div className="analysis-grid">
            <div className="result-card">
              <h4>Skills</h4>
              <div className="pill-row">
                {analysis.skills?.map((skill) => (
                  <span className="pill" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
            <div className="result-card">
              <h4>Experience</h4>
              <p>{analysis.experience}</p>
            </div>
            <div className="result-card">
              <h4>Education</h4>
              <p>{analysis.education}</p>
            </div>
            <div className="result-card">
              <h4>Missing skills</h4>
              <div className="pill-row">
                {analysis.missingSkills?.map((skill) => (
                  <span className="pill muted" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="result-card">
            <h4>Summary</h4>
            <p>{analysis.summary}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResumePage;
