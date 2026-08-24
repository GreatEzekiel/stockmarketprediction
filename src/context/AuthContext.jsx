import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, signupApi, preWarmBackend } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ainow_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ainow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    preWarmBackend();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      const userObj = { email, name: email.split('@')[0] };
      const authToken = res.access_token || 'mock_token_' + Date.now();

      setToken(authToken);
      setUser(userObj);
      localStorage.setItem('ainow_token', authToken);
      localStorage.setItem('ainow_user', JSON.stringify(userObj));
      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setLoading(true);
    try {
      const res = await signupApi(fullName, email, password);
      const userObj = { email, name: fullName };
      const authToken = res?.access_token || 'mock_token_' + Date.now();

      setToken(authToken);
      setUser(userObj);
      localStorage.setItem('ainow_token', authToken);
      localStorage.setItem('ainow_user', JSON.stringify(userObj));
      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ainow_token');
    localStorage.removeItem('ainow_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
