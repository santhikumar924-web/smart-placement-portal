import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const active = (path) => loc.pathname === path ? 'active' : '';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-dot"></span>SmartPlacement
        </Link>
        <div className="nav-links">
          <Link to="/"     className={active('/')}>Home</Link>
          <Link to="/jobs" className={active('/jobs')}>Jobs</Link>
          {user && user.role === 'student' && <Link to="/dashboard" className={active('/dashboard')}>Dashboard</Link>}
          {user && user.role === 'admin'   && <Link to="/admin"     className={active('/admin')}>Admin Panel</Link>}
        </div>
        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-sm">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-username">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-sm" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
