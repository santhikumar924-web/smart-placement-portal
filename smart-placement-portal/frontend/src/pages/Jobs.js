import React, { useEffect, useState } from 'react';
import API from '../api';
import JobCard from '../components/JobCard';

const DOMAINS = ['Web Dev', 'Data Science', 'Backend', 'Design', 'AI/ML', 'DevOps', 'Other'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (type)   params.type   = type;
    if (domain) params.domain = domain;
    API.get('/jobs', { params })
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  }, [search, type, domain]);

  return (
    <div className="container">
      <h1 className="page-title">All openings</h1>

      {/* Search & filter bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          className="form-control"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="Search by role, company, skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="form-control" style={{ width: '150px' }} value={type} onChange={e => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
        </select>
      </div>

      {/* Domain filter chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setDomain('')}
          style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: domain === '' ? 'var(--brand-light)' : 'var(--white)', color: domain === '' ? 'var(--brand)' : 'var(--text2)' }}>
          All
        </button>
        {DOMAINS.map(d => (
          <button key={d} onClick={() => setDomain(d === domain ? '' : d)}
            style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: domain === d ? 'var(--brand-light)' : 'var(--white)', color: domain === d ? 'var(--brand)' : 'var(--text2)' }}>
            {d}
          </button>
        ))}
      </div>

      {loading
        ? <p className="empty-state">Loading...</p>
        : jobs.length === 0
          ? <p className="empty-state">No jobs found. Try a different filter.</p>
          : jobs.map(j => <JobCard key={j._id} job={j} />)
      }
    </div>
  );
}
