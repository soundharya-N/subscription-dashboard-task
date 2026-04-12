import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { planService } from '../services/api';

const AdminPlans = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await planService.getPlans();
      setPlans(response.data.data || []);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError('Unable to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      features: ''
    });
    setEditingPlan(null);
    setShowCreateModal(false);
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      features: plan.features.join(', ')
    });
    setEditingPlan(plan);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editingPlan) {
        await planService.updatePlan(editingPlan._id, planData);
      } else {
        await planService.createPlan(planData);
      }

      fetchPlans();
      resetForm();
    } catch (err) {
      console.error('Failed to save plan:', err);
      alert('Failed to save plan. Please try again.');
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await planService.deletePlan(planId);
      fetchPlans();
    } catch (err) {
      console.error('Failed to delete plan:', err);
      alert('Failed to delete plan. Please try again.');
    }
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
          <a href="/admin/subscriptions">
            <i className="bi bi-list-ul"></i> All Subscriptions
          </a>
          <a href="/admin/plans" className="active">
            <i className="bi bi-tags-fill"></i> Plans
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

      <div className="main-content">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-0 fw-700" style={{ color: 'var(--text-color)', fontWeight: 700 }}>Plans Management</h4>
            <small className="text-muted">Create, edit, and manage subscription plans</small>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>
            Create Plan
          </button>
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
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Description</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Price</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Features</th>
                      <th className="border-0 fw-bold" style={{ color: 'var(--text-color)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan._id}>
                        <td className="fw-semibold">{plan.name}</td>
                        <td>{plan.description}</td>
                        <td className="fw-bold" style={{ color: 'var(--primary)' }}>${plan.price}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {plan.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="badge bg-light text-dark">
                                {feature}
                              </span>
                            ))}
                            {plan.features.length > 2 && (
                              <span className="badge bg-secondary">
                                +{plan.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(plan)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(plan._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                  </h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Plan Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Features (comma-separated)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Feature 1, Feature 2, Feature 3"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlans;