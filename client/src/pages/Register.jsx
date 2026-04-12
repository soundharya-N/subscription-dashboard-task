import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'danger', width: '33%' };
    if (p.length < 10 || !/[0-9]/.test(p) || !/[A-Z]/.test(p)) {
      return { label: 'Fair', color: 'warning', width: '66%' };
    }
    return { label: 'Strong', color: 'success', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-layers-fill"></i>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start managing your subscriptions</p>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                <i className="bi bi-person text-secondary"></i>
              </span>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control border-start-0 ${fieldErrors.name ? 'is-invalid' : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
              />
              {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                <i className="bi bi-envelope text-secondary"></i>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control border-start-0 ${fieldErrors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                <i className="bi bi-lock text-secondary"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-control border-start-0 border-end-0 ${fieldErrors.password ? 'is-invalid' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-group-text bg-white"
                style={{ borderRadius: '0 0.5rem 0.5rem 0', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-secondary`}></i>
              </button>
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>
            {/* Password Strength */}
            {strength && (
              <div className="mt-2">
                <div className="progress" style={{ height: '4px' }}>
                  <div
                    className={`progress-bar bg-${strength.color}`}
                    style={{ width: strength.width, transition: 'width 0.3s' }}
                  ></div>
                </div>
                <small className={`text-${strength.color}`}>Password strength: {strength.label}</small>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                <i className="bi bi-shield-lock text-secondary"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control border-start-0 ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
              />
              {fieldErrors.confirmPassword && (
                <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-custom btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating account...
              </>
            ) : (
              <>
                <i className="bi bi-person-check me-2"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-divider mt-4">or</div>

        <p className="text-center mb-0" style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
