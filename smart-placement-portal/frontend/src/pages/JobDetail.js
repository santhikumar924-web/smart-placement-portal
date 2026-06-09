import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ coverNote: '', resumeUrl: '', expectedCtc: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    API.get(`/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setError(''); setApplying(true);
    try {
      await API.post('/applications/apply', { jobId: id, ...form });
      setMsg('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(false); }
  };

  if (!job) return <div className="loading">Loading job details...</div>;

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      {/* Job info card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 600 }}>{job.title}</h1>
            <p style={{ color: 'var(--text2)', marginTop: '4px' }}>{job.company} · {job.location}</p>
          </div>
          <span className={`badge ${job.type === 'Internship' ? 'badge-blue' : 'badge-green'}`}>{job.type}</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--text2)', marginBottom: '12px' }}>
          <span>💰 {job.ctc || '—'}</span>
          <span>📍 {job.location}</span>
          <span>🏷 {job.domain}</span>
        </div>

        {job.description && <p style={{ fontSize: '14px', color: 'var(--text1)', lineHeight: 1.7, marginBottom: '12px' }}>{job.description}</p>}

        <div className="tag-row">
          {(job.skills || []).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
        </div>
      </div>

      {/* Apply form */}
      <div className="card">
        <h2 style={{ fontWeight: 600, fontSize: '17px', marginBottom: '1.25rem' }}>Apply for this role</h2>
        {msg   && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {!msg && (
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Cover note</label>
              <textarea className="form-control" name="coverNote" rows={4} placeholder="Tell us why you're a great fit..." value={form.coverNote} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Resume URL or filename</label>
              <input className="form-control" name="resumeUrl" placeholder="https://drive.google.com/... or resume.pdf" value={form.resumeUrl} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Expected stipend / CTC</label>
              <input className="form-control" name="expectedCtc" placeholder="e.g. ₹20,000/month or 8 LPA" value={form.expectedCtc} onChange={handle} />
            </div>
            <button className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={applying}>
              {applying ? 'Submitting...' : user ? 'Submit application' : 'Login to apply'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
