import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Chip, CircularProgress, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../services/api';

const fetchJobs = async () => {
  const { data } = await api.get('/jobs');
  return data.jobs || [];
};

function JobsPage() {
  const [query, setQuery] = useState('');
  const { data: jobs = [], isLoading, error } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs });

  const filteredJobs = useMemo(() => {
    const search = query.toLowerCase();
    return jobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [jobs, query]);

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Public job board</Typography>
        <Typography variant="body2" color="text.secondary">Browse active roles, filter by keyword, and apply with confidence.</Typography>
        <TextField label="Search jobs" value={query} onChange={(e) => setQuery(e.target.value)} />

        {isLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {error && <Alert severity="error">Unable to load jobs right now.</Alert>}

        {!isLoading && filteredJobs.length === 0 && <Alert severity="info">No matching jobs found.</Alert>}

        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <Paper variant="outlined" sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
                <Stack spacing={1.2}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.company}</Typography>
                  <Typography variant="body2">{job.location}</Typography>
                  <Typography variant="body2">{job.description}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {job.requiredSkills?.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                  </Stack>
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
