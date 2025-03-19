import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, handleApiError } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on initial load and token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', handleApiError(err).message);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      // Set token in local storage
      localStorage.setItem('token', response.token);
      setToken(response.token);
      
      return response;
    } catch (err) {
      setError(handleApiError(err).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password);
      console.log(response);
      // Set token in local storage
      localStorage.setItem('token', response.token);
      console.log(response, "yaman")
      setToken(response.token);
      
      return response;
    } catch (err) {
      setError(handleApiError(err).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole('admin');

  // Check if user is PR Officer
  const isPROfficer = () => hasRole('pr_officer');

  // Check if user is Project Manager
  const isProjectManager = () => hasRole('project_manager');

  // Clear any error messages
  const clearError = () => setError(null);

  // Value object to be provided by the context
  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    hasRole,
    isAdmin,
    isPROfficer,
    isProjectManager,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

