import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { subscriptionService, planService } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        if (user?.role === 'admin') {
          // Fetch all subscriptions for admin
          const allSubsRes = await subscriptionService.getAllSubscriptions();
          setPlans(allSubsRes.data?.data || []);
        } else {
          // Fetch user's subscription for regular user
          const subRes = await subscriptionService.getMySubscription().catch(() => ({ data: { data: null } }));
          setSubscription(subRes?.data?.data || null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSubscribe = async (planId) => {
    setSubscribing(true);
    try {
      await subscriptionService.subscribe(planId);
      const subRes = await subscriptionService.getMySubscription();
      setSubscription(subRes.data?.data);
      setActiveTab('current'); // Switch to current plan view after subscription
      alert('Successfully subscribed!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
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
          <p>Loading dashboard...</p>
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
          <a href="/dashboard" className="active">
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
            <h4 className="mb-0 fw-700" style={{ color: 'var(--text-color)', fontWeight: 700 }}>
              {user?.role === 'admin' ? 'All Subscriptions' : 'Dashboard'}
            </h4>
            <small className="text-muted">
              {user?.role === 'admin' ? 'Manage all user subscriptions' : `Welcome back, ${user?.name}!`}
            </small>
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

        {/* Current Subscription Section - For Regular Users */}
        {user?.role !== 'admin' ? (
        <div className="row g-4">
          <div className="col-12">
            <div className="card border-0" style={{ borderRadius: '0.875rem', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4" style={{ color: 'var(--text-color)' }}>
                  <i className="bi bi-credit-card-fill me-2 text-primary"></i>
                  Your Current Plan
                </h5>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : subscription ? (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="plan-details-card">
                        <h6 className="fw-bold mb-3" style={{ color: 'var(--text-color)' }}>{subscription.plan.name}</h6>
                        <div className="mb-3">
                          <span className={`badge ${subscription.status === 'active' ? 'bg-success' : 'bg-warning'} fs-6`}>
                            {subscription.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-muted small">Price</div>
                            <div className="fw-bold fs-5" style={{ color: 'var(--primary)' }}>${subscription.plan.price}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted small">Duration</div>
                            <div className="fw-bold">{subscription.plan.duration} days</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted small">Start Date</div>
                            <div className="fw-bold">{new Date(subscription.startDate).toLocaleDateString()}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted small">End Date</div>
                            <div className="fw-bold">{new Date(subscription.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="plan-features-card">
                        <h6 className="fw-bold mb-3" style={{ color: 'var(--text-color)' }}>Plan Features</h6>
                        <ul className="list-unstyled">
                          {subscription.plan.features.map((feature, index) => (
                            <li key={index} className="mb-2 d-flex align-items-center">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-credit-card display-4 text-muted mb-3"></i>
                    <h6 className="text-muted mb-3">No Active Subscription</h6>
                    <p className="text-muted mb-4">You don't have an active subscription. Choose a plan to get started.</p>
                    <a href="/plans" className="btn" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 2rem', fontWeight: 600 }}>
                      View Available Plans
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        ) : (
        /* Admin Dashboard - Show All Subscriptions */
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
                    {plans.map((subscription) => (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
