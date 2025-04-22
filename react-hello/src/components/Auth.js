import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import AdminLogin from './AdminLogin';
import './Auth.css';

const Auth = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleAuth = (userData) => {
    onAuth(userData);
  };

  if (isAdminLogin) {
    return <AdminLogin onAuth={handleAuth} onSwitchToRegularLogin={() => setIsAdminLogin(false)} />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-toggle">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      {isLogin ? (
        <>
          <Login onAuth={handleAuth} />
          <button 
            onClick={() => setIsAdminLogin(true)}
            className="admin-toggle-button"
          >
            👑 Admin Login
          </button>
        </>
      ) : (
        <Register onAuth={handleAuth} />
      )}
    </div>
  );
};

export default Auth; 