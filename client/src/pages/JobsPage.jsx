import { useEffect, useState } from 'react';
import api from '../services/api';

function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data.jobs || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="panel">
      <h2>Job board</h2>
      <p>Browse active roles and apply with a resume.</p>
      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <article key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <p>{job.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default JobsPage;
