import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [jobForm, setJobForm] = useState({ title: '', description: '', company: '', location: '', salary: '', experience: '', requiredSkills: '' });
  const [message, setMessage] = useState('');
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({ queryKey: ['recruiter-stats'], queryFn: fetchDashboard });
  const { data: applications = [], isLoading: appsLoading, error: appsError } = useQuery({ queryKey: ['recruiter-applications'], queryFn: fetchApplications });

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase();
    return applications.filter((application) => {
      const haystack = `${application.jobId?.title || ''} ${application.applicantId?.name || ''} ${application.status}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [applications, search]);

  const handleCreateJob = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...jobForm,
        requiredSkills: jobForm.requiredSkills.split(',').map((value) => value.trim()).filter(Boolean),
      };
      await api.post('/jobs', payload);
      setMessage('Job created successfully.');
      setJobForm({ title: '', description: '', company: '', location: '', salary: '', experience: '', requiredSkills: '' });
      queryClient.invalidateQueries({ queryKey: ['recruiter-stats'] });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create job.');
    }
  };

  const updateStatus = async (applicationId, nextStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: nextStatus });
      queryClient.invalidateQueries({ queryKey: ['recruiter-applications'] });
      setMessage(`Status updated to ${nextStatus}.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update status.');
    }
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 24px 70px rgba(0,0,0,0.22)' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Recruiter dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Track postings, applicants, and hiring progress in one place.</Typography>
        {statsLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {statsError && <Alert severity="error">Could not load recruiter stats.</Alert>}
        {stats && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Paper variant="outlined" sx={{ p: 2.2, flex: 1, bgcolor: 'rgba(120, 184, 255, 0.08)', borderColor: 'rgba(120, 184, 255, 0.2)' }}>
              <Typography variant="subtitle2" color="text.secondary">Jobs</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.jobs}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2.2, flex: 1, bgcolor: 'rgba(159, 124, 255, 0.08)', borderColor: 'rgba(159, 124, 255, 0.2)' }}>
              <Typography variant="subtitle2" color="text.secondary">Applications</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.applications}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2.2, flex: 1, bgcolor: 'rgba(100, 224, 255, 0.08)', borderColor: 'rgba(100, 224, 255, 0.2)' }}>
              <Typography variant="subtitle2" color="text.secondary">Applicants</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.applicants}</Typography>
            </Paper>
          </Stack>
        )}
      </Paper>

      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 42px rgba(0,0,0,0.18)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Create a job</Typography>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
        <Box component="form" onSubmit={handleCreateJob} sx={{ display: 'grid', gap: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Title" value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} required fullWidth />
            <TextField label="Company" value={jobForm.company} onChange={(event) => setJobForm({ ...jobForm, company: event.target.value })} required fullWidth />
          </Stack>
          <TextField label="Description" value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} multiline minRows={3} required fullWidth />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Location" value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} required fullWidth />
            <TextField label="Salary" value={jobForm.salary} onChange={(event) => setJobForm({ ...jobForm, salary: event.target.value })} fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Experience" value={jobForm.experience} onChange={(event) => setJobForm({ ...jobForm, experience: event.target.value })} required fullWidth />
            <TextField label="Required Skills (comma separated)" value={jobForm.requiredSkills} onChange={(event) => setJobForm({ ...jobForm, requiredSkills: event.target.value })} fullWidth />
          </Stack>
          <Button type="submit" variant="contained">Create Job</Button>
        </Box>
      </Paper>

      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 42px rgba(0,0,0,0.18)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Applications pipeline</Typography>
        <TextField label="Search applications" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth sx={{ mb: 2 }} />
        {appsLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {appsError && <Alert severity="error">Could not load applications.</Alert>}
        {filteredApplications.map((application) => (
          <Paper key={application._id} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
              <Box>
                <Typography variant="subtitle1">{application.applicantId?.name || 'Applicant'}</Typography>
                <Typography variant="body2" color="text.secondary">{application.jobId?.title || 'Job'}</Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={application.status} color="primary" sx={{ borderRadius: 999, px: 1 }} />
                {application.aiScore ? <Chip label={`${application.aiScore}% match`} variant="outlined" sx={{ borderRadius: 999, px: 1 }} /> : null}
                <TextField select label="Update status" size="small" value={application.status} onChange={(event) => updateStatus(application._id, event.target.value)} sx={{ minWidth: 160 }}>
                  <MenuItem value="applied">Applied</MenuItem>
                  <MenuItem value="screening">Screening</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                  <MenuItem value="offered">Offered</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </TextField>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Paper>
    </Stack>
  );
}

export default RecruiterDashboardPage;
