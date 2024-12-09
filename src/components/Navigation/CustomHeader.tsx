import React, { useState } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';
import LoginDialog from '../Auth/LoginDialog';
import './Header.css'; // Reuse the same styles

const CustomHeader: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <RouterLink to="/" className="logo-link">
            <img src="/LifeMetrics/logo.png" alt="LifeMetrics Logo" className="logo" />
            <span className="brand-name">LifeMetrics</span>
          </RouterLink>
        </div>
        <div className="header-center">
          <nav>
            <RouterLink to="/how-it-works">How it works</RouterLink>
            <p> | </p>
            <RouterLink to="/signup">Sign Up</RouterLink>
            <p> | </p>
            <RouterLink to="/about">About Us</RouterLink>
          </nav>
        </div>
        <div className="header-right">
          <button 
            className="sign-in-button"
            onClick={() => setIsLoginOpen(true)}
          >
            Sign In
          </button>
        </div>
      </header>

      <LoginDialog 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};

export default CustomHeader; 