import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/api';

const AdminSubscriptions = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await subscriptionService.getAllSubscriptions();
        setSubscriptions(response.data.data || []);
      } catch (err) {
        console.error('Error loading subscriptions:', err);
        setError('Failed to load subscriptions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="bi bi-shield-x display-4 text-danger mb-3"></i>
          <h4 className="text-muted">Access Denied</h4>
          <p className="text-muted">You don't have permission to access this page.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
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
          <a href="/admin/subscriptions" className="active">
            <i className="bi bi-list-ul"></i> All Subscriptions
          </a>
          {user?.role === 'admin' && (
            <a href="/users">
              <i className="bi bi-people-fill"></i> Users
            </a>
          )}
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

      {/* Main Content */}
      <div className="main-content">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <div className="topbar">
          <div>
            <h4 className="mb-0 fw-700" style={{ color: 'var(--text-color)', fontWeight: 700 }}>All Subscriptions</h4>
            <small className="text-muted">Manage all user subscriptions</small>
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

        {/* Subscriptions Table */}
        <div className="card border-0" style={{ borderRadius: '0.875rem', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive admin-table-responsive">
                <table className="table table-hover mb-0 admin-table">
                  <thead>
                    <tr>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>User</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Plan</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Price</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Start Date</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>End Date</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((subscription) => (
                      <tr key={subscription._id}>
                        <td>
                          <div>
                            <div className="fw-bold" style={{ color: '#000' }}>{subscription.user.name}</div>
                            <small style={{ color: '#000' }}>{subscription.user.email}</small>
                          </div>
                        </td>
                        <td className="fw-semibold" style={{ color: '#000' }}>{subscription.plan.name}</td>
                        <td className="fw-bold" style={{ color: 'var(--primary)' }}>${subscription.plan.price}</td>
                        <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                        <td>{new Date(subscription.endDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${subscription.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                            {subscription.status.toUpperCase()}
                          </span>
                        </td>
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

export default AdminSubscriptions;