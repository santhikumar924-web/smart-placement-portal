import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import JobCard from '../components/JobCard';

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get('/jobs').then(res => setJobs(res.data.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'var(--brand-light)', color: 'var(--brand)', fontSize: '12px', fontWeight: 500, padding: '4px 14px', borderRadius: '20px', marginBottom: '1rem' }}>
          2024–25 Placement Season
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1.2, marginBottom: '12px' }}>
          Find your dream<br />internship or job
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
          Connect with top companies, apply in one click, track every step of the way.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Link to="/jobs"     className="btn btn-primary">Browse all jobs</Link>
          <Link to="/register" className="btn">Create account</Link>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="container">
        <h2 className="page-title" style={{ fontSize: '18px' }}>Featured openings</h2>
        {jobs.length === 0
          ? <p className="empty-state">No jobs available yet.</p>
          : jobs.map(j => <JobCard key={j._id} job={j} />)
        }
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/jobs" className="btn">View all openings →</Link>
        </div>
      </div>
    </div>
  );
}
