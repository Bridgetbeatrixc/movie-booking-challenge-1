import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from './api/authApi.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const checkCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCurrentUser();
      const userData = data.user || data;
      setUser(userData);
      setRole(userData.role);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await loginUser(email, password);
      const userData = data.user || data;
      setUser(userData);
      setRole(userData.role);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(
        error.response?.data?.message || 
        error.message || 
        'Invalid credentials or server error.'
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await registerUser(name, email, password);
    } catch (error) {
      setAuthError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      setAuthError('Network error during server session revocation.');
    } finally {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    role,
    isAuthenticated,
    isLoading,
    authError,
    register,
    login,
    logout,
    checkCurrentUser,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};