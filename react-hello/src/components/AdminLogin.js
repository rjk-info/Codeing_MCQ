import React, { useState, useEffect } from 'react';
import './Auth.css';

const AdminLogin = ({ onAuth, onSwitchToRegularLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear form data when component mounts
    setFormData({ username: '', password: '' });
    setError('');
    
    // Clear any stored credentials
    localStorage.removeItem('lastAdminUsername');
    localStorage.removeItem('lastAdminPassword');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'admin') {
          onAuth(data.user);
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>👑 Admin Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="off"
            placeholder="Enter admin username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Enter admin password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
        {error && <div className="error-message">{error}</div>}
        <button 
          type="button" 
          className="back-button"
          onClick={onSwitchToRegularLogin}
        >
          ← Back to Regular Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin; 