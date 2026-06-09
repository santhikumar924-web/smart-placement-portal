import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: '', year: '2025', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ maxWidth: 500, paddingTop: '3rem' }}>
      <div className="card">
        <h2 style={{ fontWeight: 600, fontSize: '20px', marginBottom: '1.5rem' }}>Create account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-control" name="name" placeholder="Revanth Kumar" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">College email</label>
            <input className="form-control" name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} required minLength={6} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Branch</label>
              <select className="form-control" name="branch" value={form.branch} onChange={handle}>
                <option value="">Select branch</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Graduation year</label>
              <select className="form-control" name="year" value={form.year} onChange={handle}>
                <option>2025</option><option>2026</option><option>2027</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-control" name="role" value={form.role} onChange={handle}>
              <option value="student">Student</option>
              <option value="admin">Admin (placement officer)</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: 'var(--text2)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--brand)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
