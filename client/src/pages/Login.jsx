import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <i className="bi bi-layers-fill"></i>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your dashboard</p>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '0.5rem 0 0 0.5rem', borderRight: 'none' }}>
                <i className="bi bi-envelope text-secondary"></i>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control border-start-0"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                <i className="bi bi-lock text-secondary"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-control border-start-0 border-end-0"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
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
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-custom btn"
            disabled={loading || !form.email || !form.password}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-divider mt-4">or</div>

        <p className="text-center mb-0" style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
