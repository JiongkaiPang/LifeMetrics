import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/FirebaseContext';
import { firestoreService, HealthMetric, StatusType } from '../../services/firestore';
import './DataDisplay.css';
import { Timestamp } from 'firebase/firestore';
import BarChart from '../Charts/BarChart';
import LineGraph from '../Charts/LineGraph';

interface DataDisplayProps {
  metricType: string;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ metricType }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [monthlyData, setMonthlyData] = useState<HealthMetric[]>([]);
  const [yearlyData, setYearlyData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusTypes, setStatusTypes] = useState<StatusType[]>([]);
  const { currentUser } = useAuth();

  const loadStatusTypes = async () => {
    if (!currentUser) return;
    try {
      const types = await firestoreService.statusTypes.getStatusTypes(currentUser.uid);
      setStatusTypes(types);
    } catch (err) {
      console.error('Error loading status types:', err);
    }
  };

  useEffect(() => {
    loadStatusTypes();
  }, [currentUser, metricType, statusTypes.length]);

  const loadMetrics = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');
      
      const [monthData, yearData] = await Promise.all([
        firestoreService.healthMetrics.getLastMonthMetrics(currentUser.uid, metricType),
        firestoreService.healthMetrics.getLastYearMetrics(currentUser.uid, metricType)
      ]);

      setMonthlyData(monthData);
      setYearlyData(yearData);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Failed to load metrics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [currentUser, metricType]);

  const selectedStatus = statusTypes.find(status => status.id === metricType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
  
    try {
      setLoading(true);
      setError('');

      // Create date at the end of the selected day in local time
      const [year, month, day] = selectedDate.split('-').map(Number);
      const selectedDateTime = new Date(year, month - 1, day, 23, 59, 59);
  
      await firestoreService.healthMetrics.addMetric(currentUser.uid, {
        type: metricType,
        value: value,
        timestamp: Timestamp.fromDate(selectedDateTime)
      });
  
      setValue('');
      await loadMetrics();
    } catch (err) {
      console.error('Error saving metric:', err);
      setError('Failed to save metric');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (metricId: string) => {
    if (!currentUser || !metricId) return;
  
    try {
      setLoading(true);
      await firestoreService.healthMetrics.deleteMetric(currentUser.uid, metricId);
      await loadMetrics();
    } catch (err) {
      console.error('Error deleting metric:', err);
      setError('Failed to delete metric');
    } finally {
      setLoading(false);
    }
  };

  const getInputLabel = () => {
    if (selectedStatus) {
      return `Input your ${selectedStatus.name}:`;
    }
    switch (metricType) {
      case 'blood-pressure':
        return "Input your blood pressure:";
      case 'sleep-quality':
        return "Input your sleep quality (1-10):";
      default:
        return `Input your ${metricType.split('-').join(' ')}:`;
    }
  };

  const getPlaceholder = () => {
    if (selectedStatus) {
      return `Enter ${selectedStatus.name.toLowerCase()}`;
    }
    switch (metricType) {
      case 'blood-pressure':
        return "Enter blood pressure";
      case 'sleep-quality':
        return "Enter sleep quality";
      default:
        return `Enter ${metricType.split('-').join(' ')}`;
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: userTimezone
    }).format(date);
  };

  return (
    <div className="data-display">
      <div className="data-input-section">
        <h3>{getInputLabel()}</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getPlaceholder()}
              required
              disabled={loading}
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className="visualization-section">
        <div className="charts-section">
          <div className="chart-container">
            <h4>Distribution</h4>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : monthlyData.length > 0 ? (
              <BarChart 
                data={monthlyData} 
                metricType={metricType} 
                selectedStatus={selectedStatus}
              />
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>

          <div className="chart-container">
            <h4>Trend</h4>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : yearlyData.length > 0 ? (
              <LineGraph 
                data={yearlyData} 
                metricType={metricType}
                selectedStatus={selectedStatus}
              />
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>

        <div className="numbers-section">
          <h4>Recent Records</h4>
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="loading-cell">Loading...</td>
                </tr>
              ) : monthlyData.length > 0 ? (
                monthlyData.slice(0, 5).map((metric) => (
                  <tr key={metric.id}>
                    <td>{formatDate(metric.timestamp)}</td>
                    <td>{metric.value}</td>
                    <td>
                      <button 
                        onClick={() => metric.id && handleDelete(metric.id)}
                        className="delete-button"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="empty-cell">No records available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;