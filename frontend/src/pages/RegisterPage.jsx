import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { register, isLoading, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const validateForm = () => {
    if (!name.trim()) {
      return 'Name cannot be empty.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Password confirmation does not match the main password.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    setValidationError('');

    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      await register(name, email, password);
      navigate('/login', { 
        state: { message: 'Registration successfully completed. Please log in using your new credentials.' } 
      });
    } catch (err) {
      setValidationError('Registration process encountered an issue.');
    }
  };

  return (
    <div className="auth-container">
      <h2>New Account Registration</h2>
      
      {validationError && <div className="error-message">{validationError}</div>}
      {authError && <div className="error-message">{authError}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter full name"
          />
        </div>
        
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
            placeholder="Enter password (min. 6 characters)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Retype password"
          />
        </div>
        
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Processing Registration...' : 'Register Account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;