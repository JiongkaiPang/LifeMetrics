import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/FirebaseContext';
import { firestoreService, StatusType, StatusThresholds } from '../../services/firestore';
import StatusForm from '../Status/StatusForm';
import './StatusPanel.css';

interface StatusPanelProps {
  onMetricSelect: (metric: string) => void;
  selectedMetric: string;
}

const DEFAULT_STATUS_TYPES: StatusType[] = [
  { 
    id: 'blood-pressure', 
    name: 'Blood Pressure',
    thresholds: {
      normal: 120,
      elevated: 129,
      high: 130,
      ranges: {
        normal: 'Normal (<120)',
        elevated: 'Elevated (120-129)',
        high: 'High (>130)'
      }
    }
  },
  { 
    id: 'sleep-quality', 
    name: 'Sleep Quality',
    thresholds: {
      normal: 7,
      elevated: 8,
      high: 9,
      ranges: {
        normal: 'Poor (<7)',
        elevated: 'Good (7-8)',
        high: 'Excellent (>8)'
      }
    }
  }
];

const StatusPanel: React.FC<StatusPanelProps> = ({ onMetricSelect, selectedMetric }) => {
  const [showNewStatusInput, setShowNewStatusInput] = useState(false);
  const [statusTypes, setStatusTypes] = useState<StatusType[]>(DEFAULT_STATUS_TYPES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadStatusTypes();
    }
  }, [currentUser]);

  const loadStatusTypes = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const customTypes = await firestoreService.statusTypes.getStatusTypes(currentUser.uid);
      setStatusTypes([...DEFAULT_STATUS_TYPES, ...customTypes]);
      setError('');
    } catch (err) {
      console.error('Error loading status types:', err);
      setError('Failed to load status types');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStatus = async (name: string, thresholds: StatusThresholds) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      await firestoreService.statusTypes.addStatusType(
        currentUser.uid,
        name,
        thresholds
      );
      await loadStatusTypes();
      setShowNewStatusInput(false);
      setError('');
    } catch (err) {
      console.error('Error adding status type:', err);
      setError('Failed to add status type');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    if (!currentUser) return;
    
    // Prevent deletion of default status types
    if (DEFAULT_STATUS_TYPES.some(type => type.id === statusId)) {
      setError('Cannot delete default status types');
      return;
    }

    try {
      setLoading(true);
      await firestoreService.statusTypes.deleteStatusType(currentUser.uid, statusId);
      await loadStatusTypes();
      setError('');
    } catch (err) {
      console.error('Error deleting status type:', err);
      setError('Failed to delete status type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-panel">
      <div className="status-types">
        <h3>Status Types</h3>
        {error && <div className="error-message">{error}</div>}
        {loading && !showNewStatusInput && <div>Loading...</div>}
        
        {statusTypes.map(type => (
          <div 
            key={type.id} 
            className={`status-type-item ${selectedMetric === type.id ? 'selected' : ''}`}
          >
            <div onClick={() => onMetricSelect(type.id)}>
              • {type.name}
            </div>
            {!DEFAULT_STATUS_TYPES.some(defaultType => defaultType.id === type.id) && (
              <button 
                className="delete-status-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStatus(type.id);
                }}
                disabled={loading}
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {showNewStatusInput ? (
          <StatusForm
            onSubmit={handleAddStatus}
            onCancel={() => setShowNewStatusInput(false)}
            loading={loading}
          />
        ) : (
          <button 
            className="new-status-button"
            onClick={() => setShowNewStatusInput(true)}
            disabled={loading}
          >
            + New Status
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;