import { useMemo } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, Container, Chip, Stack, Toolbar, Typography } from '@mui/material';
import AuthPage from './pages/AuthPage';
import JobsPage from './pages/JobsPage';
import ResumePage from './pages/ResumePage';
import RankingPage from './pages/RankingPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import ApplicantDashboardPage from './pages/ApplicantDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => (
  <Box sx={{ display: 'grid', gap: 3 }}>
    <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="primary">AI-powered HR Recruitment</Typography>
          <Typography variant="h3" sx={{ mt: 1, mb: 2 }}>Recruit faster with intelligent workflows.</Typography>
          <Typography variant="body1" color="text.secondary">Manage applicants, analyze resumes, score candidates, and keep your hiring pipeline moving from one place.</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button component={Link} to="/jobs" variant="contained">Browse jobs</Button>
            <Button component={Link} to="/resume" variant="outlined">Analyze resume</Button>
            <Button component={Link} to="/ranking" variant="outlined">View ranking</Button>
          </Stack>
        </Box>
        <Box sx={{ minWidth: { xs: '100%', md: 260 }, p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Stack spacing={1.2}>
            <Typography variant="subtitle2" color="text.secondary">Platform highlights</Typography>
            <Chip label="Role-based auth" color="primary" variant="outlined" />
            <Chip label="Resume parsing" color="primary" variant="outlined" />
            <Chip label="Candidate ranking" color="primary" variant="outlined" />
            <Chip label="Pipeline tracking" color="primary" variant="outlined" />
          </Stack>
        </Box>
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
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(7, 17, 31, 0.7)', backdropFilter: 'blur(18px)' }}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Avatar sx={{ bgcolor: 'primary.main', color: 'background.default', fontWeight: 700 }}>AI</Avatar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
            AI-HR Platform
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
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
