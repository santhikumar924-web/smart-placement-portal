import React, { useEffect, useState } from 'react';
import API from '../api';

const STATUS_BADGE = {
  'Applied':      'badge-blue',
  'Under Review': 'badge-warn',
  'Shortlisted':  'badge-blue',
  'Accepted':     'badge-green',
  'Rejected':     'badge-red',
};

const BLANK_JOB = { title: '', company: '', location: '', type: 'Internship', domain: 'Web Dev', ctc: '', description: '', skills: '' };

export default function AdminPanel() {
  const [jobs, setJobs]   = useState([]);
  const [apps, setApps]   = useState([]);
  const [tab,  setTab]    = useState('apps');
  const [form, setForm]   = useState(BLANK_JOB);
  const [msg,  setMsg]    = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadData = () => {
    API.get('/jobs').then(res => setJobs(res.data));
    API.get('/applications').then(res => setApps(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const postJob = async e => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      await API.post('/jobs', payload);
      setMsg('Job posted successfully!');
      setForm(BLANK_JOB);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Remove this job listing?')) return;
    await API.delete(`/jobs/${id}`);
    loadData();
  };

  const updateStatus = async (appId, status) => {
    await API.patch(`/applications/${appId}/status`, { status });
    loadData();
  };

  const counts = {
    jobs:   jobs.length,
    apps:   apps.length,
    offers: apps.filter(a => a.status === 'Accepted').length,
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Admin panel</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Post job'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num">{counts.jobs}</div><div className="stat-lbl">Active listings</div></div>
        <div className="stat-card"><div className="stat-num">{counts.apps}</div><div className="stat-lbl">Total applications</div></div>
        <div className="stat-card"><div className="stat-num">{counts.offers}</div><div className="stat-lbl">Offers extended</div></div>
      </div>

      {/* Post job form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '1rem' }}>Post new job</h2>
          {msg   && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={postJob}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Job title *</label>
                <input className="form-control" name="title" value={form.title} onChange={handle} required placeholder="Frontend Developer Intern" />
              </div>
              <div className="form-group">
                <label className="form-label">Company *</label>
                <input className="form-control" name="company" value={form.company} onChange={handle} required placeholder="Infosys" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-control" name="type" value={form.type} onChange={handle}>
                  <option>Internship</option><option>Full-time</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Domain</label>
                <select className="form-control" name="domain" value={form.domain} onChange={handle}>
                  {['Web Dev','Data Science','Backend','Design','AI/ML','DevOps','Other'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-control" name="location" value={form.location} onChange={handle} required placeholder="Hyderabad / Remote" />
              </div>
              <div className="form-group">
                <label className="form-label">Stipend / CTC</label>
                <input className="form-control" name="ctc" value={form.ctc} onChange={handle} placeholder="₹20,000/month" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Skills required (comma separated)</label>
              <input className="form-control" name="skills" value={form.skills} onChange={handle} placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="form-group">
              <label className="form-label">Job description</label>
              <textarea className="form-control" name="description" rows={3} value={form.description} onChange={handle} placeholder="Describe the role and responsibilities..." />
            </div>
            <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>Post job</button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
        {['apps', 'jobs'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '7px 18px', borderRadius: '20px', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              background: tab === t ? 'var(--brand)' : 'var(--white)', color: tab === t ? '#fff' : 'var(--text2)' }}>
            {t === 'apps' ? 'All Applications' : 'Job Listings'}
          </button>
        ))}
      </div>

      {/* Applications table */}
      {tab === 'apps' && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>Branch</th><th>Job</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {apps.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text2)' }}>No applications yet</td></tr>
                  : apps.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{a.student?.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{a.student?.email}</div>
                      </td>
                      <td>{a.student?.branch} · {a.student?.year}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{a.job?.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{a.job?.company}</div>
                      </td>
                      <td><span className={`badge ${STATUS_BADGE[a.status] || 'badge-gray'}`}>{a.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {['Shortlisted', 'Accepted', 'Rejected'].map(s => (
                            <button key={s} className={`btn btn-sm ${s === 'Accepted' ? 'btn-success' : s === 'Rejected' ? 'btn-danger' : ''}`}
                              onClick={() => updateStatus(a._id, s)} disabled={a.status === s}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs table */}
      {tab === 'jobs' && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Company</th><th>Type</th><th>Location</th><th>Action</th></tr>
              </thead>
              <tbody>
                {jobs.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text2)' }}>No jobs posted yet</td></tr>
                  : jobs.map(j => (
                    <tr key={j._id}>
                      <td style={{ fontWeight: 500 }}>{j.title}</td>
                      <td>{j.company}</td>
                      <td><span className={`badge ${j.type === 'Internship' ? 'badge-blue' : 'badge-green'}`}>{j.type}</span></td>
                      <td>{j.location}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => deleteJob(j._id)}>Remove</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
