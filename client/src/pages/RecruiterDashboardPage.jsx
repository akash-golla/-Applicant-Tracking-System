import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Chip, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../services/api';

const fetchDashboard = async () => {
  const { data } = await api.get('/dashboard/recruiter');
  return data.stats;
};

const fetchApplications = async () => {
  const { data } = await api.get('/applications');
  return data.applications || [];
};

function RecruiterDashboardPage() {
  const [search, setSearch] = useState('');
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({ queryKey: ['recruiter-stats'], queryFn: fetchDashboard });
  const { data: applications = [], isLoading: appsLoading, error: appsError } = useQuery({ queryKey: ['recruiter-applications'], queryFn: fetchApplications });

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase();
    return applications.filter((application) => {
      const haystack = `${application.jobId?.title || ''} ${application.applicantId?.name || ''} ${application.status}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [applications, search]);

  return (
    <Stack spacing={3}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h5">Recruiter dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Track postings, applicants, and hiring progress in one place.</Typography>
        {statsLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {statsError && <Alert severity="error">Could not load recruiter stats.</Alert>}
        {stats && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Jobs</Typography>
              <Typography variant="h4">{stats.jobs}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Applications</Typography>
              <Typography variant="h4">{stats.applications}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Applicants</Typography>
              <Typography variant="h4">{stats.applicants}</Typography>
            </Paper>
          </Stack>
        )}
      </Paper>

      <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Applications pipeline</Typography>
        <TextField label="Search applications" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth sx={{ mb: 2 }} />
        {appsLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {appsError && <Alert severity="error">Could not load applications.</Alert>}
        {filteredApplications.map((application) => (
          <Paper key={application._id} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
              <Box>
                <Typography variant="subtitle1">{application.applicantId?.name || 'Applicant'}</Typography>
                <Typography variant="body2" color="text.secondary">{application.jobId?.title || 'Job'}</Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={application.status} color="primary" />
                {application.aiScore ? <Chip label={`${application.aiScore}% match`} /> : null}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Paper>
    </Stack>
  );
}

export default RecruiterDashboardPage;
