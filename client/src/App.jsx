import { Routes, Route, Link } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import JobsPage from './pages/JobsPage'
import ResumePage from './pages/ResumePage'
import RankingPage from './pages/RankingPage'
import ProtectedRoute from './components/ProtectedRoute'

const Home = () => (
  <section className="hero-card">
    <p className="eyebrow">AI-powered HR Recruitment</p>
    <h1>Recruit faster with intelligent workflows.</h1>
    <p>
      The platform now includes recruiter and applicant experiences, job posting,
      applications, resume upload, and AI-based candidate analysis.
    </p>
    <div className="actions">
      <Link to="/jobs" className="btn">Browse jobs</Link>
      <Link to="/resume" className="btn btn-secondary">Analyze resume</Link>
      <Link to="/ranking" className="btn">View ranking</Link>
    </div>
  </section>
)

const DashboardPage = () => (
  <section className="panel">
    <h2>Dashboard</h2>
    <p>Recruiters can manage pipelines while applicants can track applications.</p>
  </section>
)

function App() {
  return (
    <div className="app-shell">
      <nav className="topbar">
        <Link to="/" className="brand">AI-HR Platform</Link>
        <div className="nav-links">
          <Link to="/jobs">Jobs</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/ranking">Ranking</Link>
          <Link to="/auth">Auth</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/resume" element={<ProtectedRoute allowedRoles={['applicant']}><ResumePage /></ProtectedRoute>} />
          <Route path="/ranking" element={<ProtectedRoute allowedRoles={['applicant']}><RankingPage /></ProtectedRoute>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
