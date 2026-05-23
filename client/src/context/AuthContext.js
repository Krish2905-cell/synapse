import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged in user on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me', {
          withCredentials: true,
        });

        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post(
      '/auth/login',
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    // Store JWT token
    localStorage.setItem('token', res.data.token);

    // Set user
    setUser(res.data.user);

    return res.data;
  };

  // Signup
  const signup = async (name, email, password) => {
    const res = await api.post(
      '/auth/signup',
      {
        name,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    // Store JWT token
    localStorage.setItem('token', res.data.token);

    // Set user
    setUser(res.data.user);

    return res.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post(
        '/auth/logout',
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }

    // Remove token
    localStorage.removeItem('token');

    // Clear user state
    setUser(null);
  };

  // Update avatar URL in user state after a successful upload
  const updateAvatar = (avatarUrl) => {
    setUser((prev) =>
      prev ? { ...prev, avatar: avatarUrl } : prev
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);