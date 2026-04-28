import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticated_user, login, logout, register } from '../api/endpoints';
import { useToast } from './ToastContext';
import Loader from '../components/Loader';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { showToast } = useToast();

  const get_authenticated_user = async () => {
    try {
      const user = await authenticated_user();
      setUser(user);
    } catch (error) {
      setUser(null); // If the request fails, set the user to null
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const loginUser = async (username, password) => {
    const user = await login(username, password);
    if (user.success) {
      setUser(user);
      nav('/');
      const userData = {
        "username":user.user.username,
        "bio":user.user.bio,
        "email":user.user.email,
        "first_name":user.user.first_name,
        "last_name":user.user.last_name,
      }
      localStorage.setItem('userData', JSON.stringify(userData))
    } else {
      showToast(user.error || 'Incorrect username or password', 'error');
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    nav('/login');
  };

  const registerUser = async (username, email, password, confirm_password, otp) => {
    try {
      if (password === confirm_password) {
        const response = await register(username, email, password, otp);
        if (response.username) {
          showToast('Account created successfully! Please log in.', 'success');
          nav('/login');
        } else {
          // Backend returned validation errors
          const errorMsg = response.username?.[0] || response.email?.[0] || response.password?.[0] || response.error || 'Registration failed. Please check your details.';
          showToast(errorMsg, 'error');
        }
      } else {
        showToast('Passwords do not match', 'error');
      }
    } catch (error) {
      const message = error.response?.data?.username?.[0]
        || error.response?.data?.email?.[0]
        || error.response?.data?.password?.[0]
        || error.response?.data?.error
        || error.response?.data?.detail
        || 'Error registering user. Please try again.';
      showToast(message, 'error');
    }
  };

  useEffect(() => {
    get_authenticated_user();
  }, []);

  if (loading) return <Loader size="full" />;

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
