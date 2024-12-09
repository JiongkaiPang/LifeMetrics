import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/FirebaseContext';
import './LoginDialog.css';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      onClose();
      window.location.href = '/dashboard'; // Force a full page reload
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    }
  };

  return (
    <div className="login-dialog-overlay">
      <div className="login-dialog">
        <button className="close-button" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="signup-link">
            <Link to="/signup" onClick={onClose}>
              Sign Up ❯
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginDialog; 