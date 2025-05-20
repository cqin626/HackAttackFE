import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getJobById } from '../services/jobService';
import type { JobType } from '../models/Job';

const JobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobType | null>(null);

  useEffect(() => {
    if (id) {
      getJobById(id)
        .then(setJob)
        .catch((err) => console.error('Error loading job:', err));
    }
  }, [id]);

  if (!job) return <div className="text-center mt-5"><div className="spinner-border" role="status" /><p>Loading job...</p></div>;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title">{job.title}</h2>
          <h5 className="text-muted mb-3">{job.employmentType}</h5>
          <span className={`badge bg-${job.status === 'Open' ? 'success' : job.status === 'Paused' ? 'warning' : 'secondary'}`}>
            {job.status}
          </span>

          <hr />

          <h5>Description</h5>
          <p>{job.description}</p>

          {job.requirements && job.requirements.length > 0 && (
            <>
              <h5>Requirements</h5>
              <ul className="list-group mb-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="list-group-item">
                    {req}
                  </li>
                ))}
              </ul>
            </>
          )}

          {job.salaryRange && (
            <p>
              <strong>Salary:</strong>{' '}
              {job.salaryRange.currency} {job.salaryRange.min?.toLocaleString()} - {job.salaryRange.max?.toLocaleString()}
            </p>
          )}

          <p className="text-muted">
            Posted on: {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
