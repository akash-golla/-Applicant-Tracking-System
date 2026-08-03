import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Chip, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../services/api';

const fetchApplications = async () => {
  const { data } = await api.get('/applications');
  return data.applications || [];
};

function RankingPage() {
  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const { data: applications = [], isLoading, error } = useQuery({ queryKey: ['ranking-applications'], queryFn: fetchApplications });

  const filteredCandidates = useMemo(() => {
    const skillList = skillFilter.toLowerCase().split(',').map((value) => value.trim()).filter(Boolean);
    return applications.filter((application) => {
      const candidateName = application.applicantId?.name || 'Candidate';
      const summary = application.aiSummary || '';
      const matchesQuery = `${candidateName} ${summary}`.toLowerCase().includes(query.toLowerCase());
      const matchesSkill = skillList.length === 0 || application.aiAnalysis?.skills?.some((skill) => skillList.every((entry) => skill.toLowerCase().includes(entry))) || false;
      const matchesExperience = !experienceFilter || `${application.aiAnalysis?.experience || ''}`.toLowerCase().includes(experienceFilter.toLowerCase());
      return matchesQuery && matchesSkill && matchesExperience;
    }).sort((left, right) => (right.aiScore || 0) - (left.aiScore || 0));
  }, [applications, query, skillFilter, experienceFilter]);

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Candidate ranking</Typography>
        <Typography variant="body2" color="text.secondary">Filter by keywords, skills, and experience to shortlist the strongest applicants.</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Search candidate" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth />
          <TextField label="Filter by skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} fullWidth />
          <TextField label="Filter by experience" value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)} fullWidth />
        </Stack>

        {isLoading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
        {error && <Alert severity="error">Unable to load candidate ranking.</Alert>}
        {filteredCandidates.length === 0 ? <Alert severity="info">No candidates match those filters.</Alert> : null}

        {filteredCandidates.map((application) => (
          <Paper key={application._id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack spacing={1.2}>
              <Typography variant="h6">{application.applicantId?.name || 'Candidate'}</Typography>
              <Typography variant="body2">Score: {application.aiScore || 0}%</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(application.aiAnalysis?.skills || []).map((skill) => <Chip key={skill} label={skill} size="small" />)}
              </Stack>
              <Typography variant="body2" color="text.secondary">{application.aiSummary || 'No analysis summary yet.'}</Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export default RankingPage;
