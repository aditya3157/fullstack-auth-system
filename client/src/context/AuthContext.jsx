import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  // Validate token and fetch current profile on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle Login
  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showNotification(res.message || 'Welcome back!', 'success');
        return { success: true };
      }
      throw new Error(res.message || 'Login failed.');
    } catch (err) {
      showNotification(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Handle Register
  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showNotification('Registration successful! Welcome aboard.', 'success');
        return { success: true };
      }
      throw new Error(res.message || 'Registration failed.');
    } catch (err) {
      showNotification(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Handle Profile Update
  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        showNotification('Profile updated and saved to database!', 'success');
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Profile update failed.');
    } catch (err) {
      showNotification(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Handle Change Password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.success) {
        showNotification('Password updated successfully!', 'success');
        return { success: true };
      }
      throw new Error(res.message || 'Failed to update password.');
    } catch (err) {
      showNotification(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Handle Logout
  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    showNotification('Logged out successfully.', 'info');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    updateProfile,
    changePassword,
    logout,
    notification,
    showNotification,
    clearNotification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
