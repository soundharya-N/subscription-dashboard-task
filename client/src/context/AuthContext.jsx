import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyTheme = (theme) => {
    const themeToApply = theme || localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', themeToApply);
    localStorage.setItem('theme', themeToApply);
  };

  // On mount, restore user from localStorage and apply theme
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    if (storedUser && accessToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      applyTheme(parsedUser.theme || localStorage.getItem('theme'));
    } else {
      applyTheme(localStorage.getItem('theme'));
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    applyTheme(updatedUser.theme);
  };

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { user, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    applyTheme(user.theme);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    // Don't auto-login - just return success
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
