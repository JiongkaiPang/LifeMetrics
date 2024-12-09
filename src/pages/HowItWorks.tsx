import React from 'react';
import './InfoPage.css';

const HowItWorks: React.FC = () => {
  return (
    <div className="info-page-container">
      <div className="info-header">
        <h1>How it Works</h1>
      </div>
      <div className="info-content">
        <p>
          LifeMetrics helps you track your personal health data in a seamless and intuitive way.
          Our platform enables you to log your personal editable health metrics, visualize trends 
          over time, and gain insights to improve your well-being. Simply start by creating an 
          account, log your data, and watch your health trends evolve.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;