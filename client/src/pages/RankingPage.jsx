import { useMemo, useState } from 'react';
import { Alert, Chip, Paper, Stack, TextField, Typography } from '@mui/material';

const sampleCandidates = [
  { id: 1, name: 'Ava Chen', skills: ['React', 'Node.js', 'MongoDB'], score: 94, summary: 'Strong full-stack candidate' },
  { id: 2, name: 'Mohamed Ali', skills: ['JavaScript', 'Express'], score: 81, summary: 'Solid backend experience' },
  { id: 3, name: 'Sofia Patel', skills: ['TypeScript', 'React'], score: 87, summary: 'Great frontend fit' },
];

function RankingPage() {
  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const filteredCandidates = useMemo(() => {
    return sampleCandidates.filter((candidate) => {
      const matchesQuery = `${candidate.name} ${candidate.summary}`.toLowerCase().includes(query.toLowerCase());
      const matchesSkill = !skillFilter || candidate.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()));
      return matchesQuery && matchesSkill;
    });
  }, [query, skillFilter]);

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Candidate ranking</Typography>
        <Typography variant="body2" color="text.secondary">Filter by keywords and skills to shortlist the strongest applicants.</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Search candidate" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth />
          <TextField label="Filter by skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} fullWidth />
        </Stack>

        {filteredCandidates.length === 0 ? <Alert severity="info">No candidates match those filters.</Alert> : null}

        {filteredCandidates.map((candidate) => (
          <Paper key={candidate.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack spacing={1.2}>
              <Typography variant="h6">{candidate.name}</Typography>
              <Typography variant="body2">Score: {candidate.score}%</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {candidate.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
              </Stack>
              <Typography variant="body2" color="text.secondary">{candidate.summary}</Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export default RankingPage;
