import { useMemo } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import AuthPage from './pages/AuthPage';
import JobsPage from './pages/JobsPage';
import ResumePage from './pages/ResumePage';
import RankingPage from './pages/RankingPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import ApplicantDashboardPage from './pages/ApplicantDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => (
  <Box sx={{ display: 'grid', gap: 3 }}>
    <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Typography variant="overline" color="primary">AI-powered HR Recruitment</Typography>
      <Typography variant="h3" sx={{ mt: 1, mb: 2 }}>Recruit faster with intelligent workflows.</Typography>
      <Typography variant="body1" color="text.secondary">The platform now includes recruiter and applicant experiences, job posting, applications, resume upload, and AI-based candidate analysis.</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        <Button component={Link} to="/jobs" variant="contained">Browse jobs</Button>
        <Button component={Link} to="/resume" variant="outlined">Analyze resume</Button>
        <Button component={Link} to="/ranking" variant="outlined">View ranking</Button>
      </Stack>
    </Box>
  </Box>
);

const DashboardPage = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  return (
    <Box sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Typography variant="h5">Dashboard</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Welcome back, {user?.name || 'there'}.</Typography>
    </Box>
  );
};

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
            AI-HR Platform
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
            <Button color="inherit" component={Link} to="/resume">Resume</Button>
            <Button color="inherit" component={Link} to="/ranking">Ranking</Button>
            <Button color="inherit" component={Link} to="/auth">Auth</Button>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/recruiter-dashboard">Recruiter</Button>
            <Button color="inherit" component={Link} to="/applicant-dashboard">Applicant</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/resume" element={<ProtectedRoute allowedRoles={['applicant']}><ResumePage /></ProtectedRoute>} />
          <Route path="/ranking" element={<ProtectedRoute allowedRoles={['applicant']}><RankingPage /></ProtectedRoute>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/recruiter-dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboardPage /></ProtectedRoute>} />
          <Route path="/applicant-dashboard" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantDashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App
