import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Users = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authService.getAllUsers();
        setUsers(response.data.data || []);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Unable to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="bi bi-shield-x display-4 text-danger mb-3"></i>
          <h4 className="text-muted">Access Denied</h4>
          <p className="text-muted">You don't have permission to access this page.</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
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
          <a href="/users" className="active">
            <i className="bi bi-people-fill"></i> Users
          </a>
          <a href="/settings">
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

      <div className="main-content">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <div className="topbar">
          <div>
            <h4 className="mb-0 fw-700" style={{ color: 'var(--text-color)', fontWeight: 700 }}>Users</h4>
            <small className="text-muted">Manage all registered users</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="welcome-badge">
              <i className="bi bi-shield-check me-1"></i>
              {user?.role?.toUpperCase()}
            </span>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                fontSize: '1rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="card border-0" style={{ borderRadius: '0.875rem', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
          <div className="card-body p-4">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 admin-table">
                  <thead>
                    <tr>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Name</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Email</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Role</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td>{userItem.name}</td>
                        <td>{userItem.email}</td>
                        <td>{userItem.role.toUpperCase()}</td>
                        <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
