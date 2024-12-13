import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/FirebaseContext';
import './LoginDialog.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    clearErrors 
  } = useForm<LoginFormInputs>();
  
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      clearErrors();
      await login(data.email, data.password);
      onClose();
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: 'Failed to sign in'
      });
      console.error(err);
    }
  };

  return (
    <div className="login-dialog-overlay">
      <div className="login-dialog">
        <button className="close-button" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="error-message">{errors.root.message}</div>
          )}
          
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="login-input-group">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
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