import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="card" style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{job.title}</div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '2px' }}>{job.company} · {job.domain}</div>
        </div>
        <span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-green'}`}>{job.type}</span>
      </div>
      <div className="tag-row">
        {(job.skills || []).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text2)' }}>
          <span>📍 {job.location}</span>
          <span>💰 {job.ctc || '—'}</span>
        </div>
        <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">View & Apply</Link>
      </div>
    </div>
  );
}
