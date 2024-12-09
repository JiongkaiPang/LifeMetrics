import React, { useState } from 'react';
import UserHeader from '../components/Dashboard/UserHeader';
import StatusPanel from '../components/Dashboard/StatusPanel';
import DataDisplay from '../components/Dashboard/DataDisplay';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('blood-pressure');
  
  const userData = {
    name: 'User Name',
    avatar: '/default-avatar.png'
  };

  const handleMetricSelect = (metric: string) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="dashboard-container">
      <UserHeader user={userData} />
      <div className="dashboard-content">
        <div className="left-panel">
          <StatusPanel 
            onMetricSelect={handleMetricSelect}
            selectedMetric={selectedMetric}
          />
        </div>
        <div className="main-panel">
          <DataDisplay 
            metricType={selectedMetric}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 