import { useQuery } from '@tanstack/react-query';
import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import api from '../services/api';

const fetchDashboard = async () => {
  const { data } = await api.get('/dashboard/applicant');
  return data.stats;
};

const fetchApplications = async () => {
  const { data } = await api.get('/applications');
  return data.applications || [];
};

function ApplicantDashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({ queryKey: ['applicant-stats'], queryFn: fetchDashboard });
  const { data: applications = [], isLoading: appsLoading, error: appsError } = useQuery({ queryKey: ['applicant-applications'], queryFn: fetchApplications });

  return (
    <Stack spacing={3}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}>
        <Typography variant="h5">Applicant dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Review your applications and stay updated on status changes.</Typography>
        {statsLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {statsError && <Alert severity="error">Could not load dashboard stats.</Alert>}
        {stats && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Applications</Typography>
              <Typography variant="h4">{stats.applications}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Open jobs</Typography>
              <Typography variant="h4">{stats.jobs}</Typography>
            </Paper>
          </Stack>
        )}
      </Paper>

      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Application history</Typography>
        {appsLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {appsError && <Alert severity="error">Could not load application history.</Alert>}
        {applications.map((application) => (
          <Paper key={application._id} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <Typography variant="subtitle1">{application.jobId?.title || 'Job'}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {application.status}</Typography>
            {application.aiSummary ? <Typography variant="body2">AI summary: {application.aiSummary}</Typography> : null}
          </Paper>
        ))}
      </Paper>
    </Stack>
  );
}

export default ApplicantDashboardPage;