import { useState } from 'react';

const sampleCandidates = [
  { id: 1, name: 'Ava Chen', skills: ['React', 'Node.js', 'MongoDB'], score: 94, summary: 'Strong full-stack candidate' },
  { id: 2, name: 'Mohamed Ali', skills: ['JavaScript', 'Express'], score: 81, summary: 'Solid backend experience' },
  { id: 3, name: 'Sofia Patel', skills: ['TypeScript', 'React'], score: 87, summary: 'Great frontend fit' },
];

function RankingPage() {
  const [candidates] = useState(sampleCandidates);

  return (
    <section className="panel">
      <h2>Candidate ranking</h2>
      <p>Recruiters can view AI-informed ranking and shortlist candidates quickly.</p>
      <div className="job-list">
        {candidates.map((candidate) => (
          <article key={candidate.id} className="job-card">
            <h3>{candidate.name}</h3>
            <p><strong>Score:</strong> {candidate.score}%</p>
            <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
            <p><strong>Summary:</strong> {candidate.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RankingPage;
