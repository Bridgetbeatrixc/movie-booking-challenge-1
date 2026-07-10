import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localSubmitError, setLocalSubmitError] = useState(null);
  
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

  return (
    <div className="auth-container">
      <h2>User Login Access</h2>
      
      {registrationMessage && !authError && (
        <div className="success-message">{registrationMessage}</div>
      )}
      {authError && <div className="error-message">{authError}</div>}
      {localSubmitError && <div className="error-message">{localSubmitError}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
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
        
        <div className="form-group">
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
        </div>
        
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;