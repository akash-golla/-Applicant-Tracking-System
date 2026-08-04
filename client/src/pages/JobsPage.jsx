import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, CircularProgress, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../services/api';

const fetchJobs = async () => {
  const { data } = await api.get('/jobs');
  return data.jobs || [];
};

function JobsPage() {
  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [message, setMessage] = useState('');
  const { data: jobs = [], isLoading, error } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs });

  const filteredJobs = useMemo(() => {
    const search = query.toLowerCase();
    const skillList = skillFilter.toLowerCase().split(',').map((value) => value.trim()).filter(Boolean);
    return jobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
      const matchesQuery = haystack.includes(search);
      const matchesSkill = skillList.length === 0 || skillList.every((skill) => job.requiredSkills?.some((value) => value.toLowerCase().includes(skill))); 
      return matchesQuery && matchesSkill;
    });
  }, [jobs, query, skillFilter]);

  const applyToJob = async (jobId) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!localStorage.getItem('token') || user?.role !== 'applicant') {
      setMessage('Please sign in as an applicant to apply.');
      return;
    }

    try {
      const { data } = await api.post('/applications', { jobId });
      setMessage(data.success ? `Applied successfully to ${jobId}` : 'Application could not be created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to apply right now.');
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 24px 70px rgba(0,0,0,0.22)' }}>
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Public job board</Typography>
        <Typography variant="body2" color="text.secondary">Browse active roles, filter by keyword, and apply with confidence.</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Search jobs" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
          <TextField label="Filter by skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
        </Stack>

        {isLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {error && <Alert severity="error">Unable to load jobs right now.</Alert>}
        {message && <Alert severity="info">{message}</Alert>}

        {!isLoading && filteredJobs.length === 0 && <Alert severity="info">No matching jobs found.</Alert>}

        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <Paper variant="outlined" sx={{ p: 2.5, height: '100%', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', boxShadow: '0 16px 42px rgba(0,0,0,0.16)' }}>
                <Stack spacing={1.2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{job.title}</Typography>
                    <Chip label="Featured" size="small" color="primary" sx={{ borderRadius: 999 }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Typography variant="body2">📍 {job.location}</Typography>
                    <Typography variant="body2">💼 {job.experience}</Typography>
                    <Typography variant="body2">💰 {job.salary}</Typography>
                  </Stack>
                  <Typography variant="body2">{job.description}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {job.requiredSkills?.map((skill) => <Chip key={skill} label={skill} size="small" sx={{ borderRadius: 999 }} />)}
                  </Stack>
                  <Button variant="contained" onClick={() => applyToJob(job._id)} sx={{ borderRadius: 999, mt: 0.5 }}>Apply</Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
}

export default JobsPage;
