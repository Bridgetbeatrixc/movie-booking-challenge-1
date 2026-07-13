import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localSubmitError, setLocalSubmitError] = useState(null);

  const { login, isLoading, authError, clearAuthError, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate(from, { replace: true });
      } else {
        setLocalSubmitError('You are not authorized to access the admin portal.');
      }
    }
  }, [isAuthenticated, role, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    setLocalSubmitError(null);

    try {
      await login(email, password);
    } catch (err) {
      setLocalSubmitError('Admin login failed. Please verify your credentials.');
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="auth-modal">
        <div className="auth-header">
          <span className="auth-badge">Admin Portal</span>
          <h2>Admin Login</h2>
          <p className="subheading">Administrator access only. Please sign in with your admin credentials.</p>
        </div>

        {authError && <div className="error-message">{authError}</div>}
        {localSubmitError && <div className="error-message">{localSubmitError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter admin email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Verifying...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
