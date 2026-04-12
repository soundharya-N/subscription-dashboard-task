import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { planService, subscriptionService } from '../services/api';

const Plans = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          planService.getPlans(),
          subscriptionService.getMySubscription().catch(() => ({ data: { data: null } }))
        ]);

        setPlans(plansRes.data?.data || []);
        setSubscription(subRes?.data?.data || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (planId) => {
    setSubscribing(true);
    try {
      await subscriptionService.subscribe(planId);
      const subRes = await subscriptionService.getMySubscription();
      setSubscription(subRes.data?.data);
      alert('Successfully subscribed!');
      navigate('/dashboard');
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
          <a href="/plans" className="active">
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
        <div className="topbar">
          <div>
            <h4 className="mb-0 fw-700" style={{ color: 'var(--text-color)', fontWeight: 700 }}>Available Plans</h4>
            <small className="text-muted">Choose a plan that fits your needs</small>
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
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                fontSize: '1rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Plans Section */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {plans.map((plan) => (
              <div className="col-12 col-md-6 col-lg-4" key={plan._id}>
                <div className="card h-100 border-0" style={{ borderRadius: '0.875rem', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title fw-bold mb-1" style={{ color: 'var(--text-color)' }}>{plan.name}</h5>
                        <div className="text-muted small">{plan.duration} days</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold fs-3" style={{ color: 'var(--primary)' }}>${plan.price}</div>
                      </div>
                    </div>
                    <ul className="list-unstyled mb-4 flex-grow-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="mb-2 small d-flex align-items-center">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {user?.role !== 'admin' && (
                    <button
                      className="btn w-100"
                      style={{
                        background: subscription && subscription.plan._id === plan._id
                          ? 'var(--success)'
                          : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 600,
                      }}
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={subscribing || (subscription && subscription.plan._id === plan._id)}
                    >
                      {subscription && subscription.plan._id === plan._id ? (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Current Plan
                        </>
                      ) : subscribing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;