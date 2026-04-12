import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (user) {
      const initialTheme = user.theme || localStorage.getItem('theme') || 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, [user]);

  const applyTheme = (newTheme) => {
    const themeToApply = newTheme || 'light';
    document.documentElement.setAttribute('data-theme', themeToApply);
    localStorage.setItem('theme', themeToApply);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      const res = await authService.updateTheme(newTheme);
      setTheme(newTheme);
      applyTheme(newTheme);
      if (updateUser) {
        updateUser({ ...user, theme: newTheme });
      }
    } catch (error) {
      console.error('Failed to update theme preference:', error);
      setTheme(newTheme);
      applyTheme(newTheme);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <i className="bi bi-layers-fill"></i>
          SubsManager
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard">
            <i className="bi bi-grid-1x2-fill"></i> Dashboard
          </a>
          <a href="/plans">
            <i className="bi bi-credit-card-2-front-fill"></i> Plans
          </a>
          {user?.role === 'admin' && (
            <a href="/users">
              <i className="bi bi-people-fill"></i> Users
            </a>
          )}
          <a href="/settings" className="active">
            <i className="bi bi-gear-fill"></i> Settings
          </a>
        </nav>
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1rem', right: '1rem' }}>
          <button
            className="btn w-100 text-start d-flex align-items-center gap-2"
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <h4 className="mb-0 fw-700" style={{ color: 'var(--text-color)' }}>Settings</h4>
            <small className="text-muted">Manage your account preferences</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="welcome-badge">
              <i className="bi bi-shield-check me-1"></i>
              {user?.role?.toUpperCase()}
            </span>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                fontSize: '1rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="row g-4">
          <div className="col-12 col-md-8">
            <div className="card border-0" style={{ borderRadius: '0.875rem', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4" style={{ color: 'var(--text-color)' }}>
                  <i className="bi bi-palette-fill me-2 text-primary"></i>
                  Appearance
                </h5>

                <div className="setting-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1" style={{ color: 'var(--text-color)' }}>Theme</h6>
                      <p className="text-muted small mb-0">Choose your preferred theme</p>
                    </div>
                    <div className="theme-toggle">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={toggleTheme}
                        style={{
                          borderRadius: '2rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        <i className={`bi ${theme === 'light' ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
                        {theme === 'light' ? 'Light' : 'Dark'}
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold mb-4" style={{ color: 'var(--text-color)' }}>
                  <i className="bi bi-person-fill me-2 text-primary"></i>
                  Account
                </h5>

                <div className="setting-item">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--text-color)' }}>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.name || ''}
                        readOnly
                        style={{
                          borderRadius: '0.5rem',
                          border: '1.5px solid #e2e8f0',
                          padding: '0.6rem 0.9rem'
                        }}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--text-color)' }}>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={user?.email || ''}
                        readOnly
                        style={{
                          borderRadius: '0.5rem',
                          border: '1.5px solid #e2e8f0',
                          padding: '0.6rem 0.9rem'
                        }}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--text-color)' }}>Role</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.role?.toUpperCase() || ''}
                        readOnly
                        style={{
                          borderRadius: '0.5rem',
                          border: '1.5px solid #e2e8f0',
                          padding: '0.6rem 0.9rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0" style={{ borderRadius: '0.875rem', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
              <div className="card-body p-4 text-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                  style={{
                    width: 80, height: 80,
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    fontSize: '2rem',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h6 className="fw-bold mb-1" style={{ color: 'var(--text-color)' }}>{user?.name}</h6>
                <p className="text-muted small mb-2">{user?.email}</p>
                <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;