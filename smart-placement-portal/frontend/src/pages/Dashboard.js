import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';

const STATUS_BADGE = {
  'Applied':      'badge-blue',
  'Under Review': 'badge-warn',
  'Shortlisted':  'badge-blue',
  'Accepted':     'badge-green',
  'Rejected':     'badge-red',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/applications/mine').then(res => setApps(res.data)).finally(() => setLoading(false));
  }, []);

  const counts = {
    total:       apps.length,
    shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
    offers:      apps.filter(a => a.status === 'Accepted').length,
  };

  return (
    <div className="container">
      <h1 className="page-title">My dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num">{counts.total}</div><div className="stat-lbl">Applied</div></div>
        <div className="stat-card"><div className="stat-num">{counts.shortlisted}</div><div className="stat-lbl">Shortlisted</div></div>
        <div className="stat-card"><div className="stat-num">{counts.offers}</div><div className="stat-lbl">Offers</div></div>
      </div>

      {/* Profile info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontWeight: 600, fontSize: '16px' }}>My profile</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
          <div><span style={{ color: 'var(--text2)' }}>Name: </span>{user?.name}</div>
          <div><span style={{ color: 'var(--text2)' }}>Email: </span>{user?.email}</div>
          <div><span style={{ color: 'var(--text2)' }}>Branch: </span>{user?.branch || '—'}</div>
          <div><span style={{ color: 'var(--text2)' }}>Year: </span>{user?.year || '—'}</div>
        </div>
      </div>

      {/* Applications tracker */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '16px' }}>Application tracker</h2>
          <Link to="/jobs" className="btn btn-sm btn-primary">Browse more jobs</Link>
        </div>

        {loading
          ? <p className="empty-state">Loading...</p>
          : apps.length === 0
            ? <div className="empty-state">
                <p>You haven't applied to any jobs yet.</p>
                <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Browse jobs</Link>
              </div>
            : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Company</th>
                      <th>Applied on</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map(a => (
                      <tr key={a._id}>
                        <td style={{ fontWeight: 500 }}>{a.job?.title}</td>
                        <td>{a.job?.company}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge ${STATUS_BADGE[a.status] || 'badge-gray'}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        }
      </div>
    </div>
  );
}
