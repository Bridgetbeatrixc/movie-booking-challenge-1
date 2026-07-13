import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { forgotPassword } from '../features/auth/api/authApi.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localSubmitError, setLocalSubmitError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  
  const { login, isLoading, authError, clearAuthError, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/');
  const registrationMessage = location.state?.message;

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]); 

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    setLocalSubmitError(null);
    try {
      await login(email, password);
    } catch (err) {
      setLocalSubmitError('Login process denied.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearAuthError();
    setLocalSubmitError(null);
    setResetMessage('');
    try {
      const result = await forgotPassword(email, newPassword);
      setResetMessage(result.message);
      setIsForgotPassword(false);
      setPassword('');
      setNewPassword('');
    } catch (error) {
      setLocalSubmitError(error.response?.data?.message || 'Password reset failed.');
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="auth-modal">
        <div className="auth-header">
          <span className="auth-badge">Member Login</span>
          <h2>User Login Access</h2>
        </div>

        {registrationMessage && !authError && (
          <div className="success-message">{registrationMessage}</div>
        )}
        {authError && <div className="error-message">{authError}</div>}
        {localSubmitError && <div className="error-message">{localSubmitError}</div>}
        {resetMessage && <div className="success-message">{resetMessage}</div>}

        <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter email address"
            />
          </div>

          {!isForgotPassword && <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter password"
            />
          </div>}
          {isForgotPassword && <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength="6" required disabled={isLoading} placeholder="Enter new password" />
          </div>}

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Processing...' : isForgotPassword ? 'Reset Password' : 'Login'}
          </button>
          <button type="button" className="auth-secondary-link" onClick={() => { setIsForgotPassword((value) => !value); setLocalSubmitError(null); }}>
            {isForgotPassword ? 'Back to login' : 'Forgot password?'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
