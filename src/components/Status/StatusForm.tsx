import React, { useState } from 'react';
import { StatusThresholds, RangeNames } from '../../services/firestore';
import './StatusForm.css';

interface StatusFormProps {
  onSubmit: (name: string, thresholds: StatusThresholds) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const StatusForm: React.FC<StatusFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [name, setName] = useState('');
  const [normalThreshold, setNormalThreshold] = useState('');
  const [elevatedThreshold, setElevatedThreshold] = useState('');
  const [highThreshold, setHighThreshold] = useState('');
  const [rangeNames, setRangeNames] = useState<RangeNames>({
    normal: 'Normal',
    elevated: 'Elevated',
    high: 'High'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a status name');
      return;
    }

    if (!rangeNames.normal.trim() || !rangeNames.elevated.trim() || !rangeNames.high.trim()) {
      setError('Please enter names for all ranges');
      return;
    }

    const normal = parseFloat(normalThreshold);
    const elevated = parseFloat(elevatedThreshold);
    const high = parseFloat(highThreshold);

    if (isNaN(normal) || isNaN(elevated) || isNaN(high)) {
      setError('Please enter valid numbers for all thresholds');
      return;
    }

    if (normal >= elevated || elevated >= high) {
      setError('Thresholds must be in ascending order: First < Second < Third');
      return;
    }

    const thresholds: StatusThresholds = {
      normal,
      elevated,
      high,
      ranges: rangeNames
    };

    try {
      await onSubmit(name, thresholds);
    } catch (err) {
      setError('Failed to create status');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="status-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-section">
        <h4>Status Name</h4>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter status name"
            disabled={loading}
          />
        </div>
      </div>

      <div className="thresholds-group">
        <div className="form-section">
          <h4>Range Names</h4>
          <div className="form-group">
            <label>First Range Name</label>
            <input
              type="text"
              value={rangeNames.normal}
              onChange={(e) => setRangeNames(prev => ({ ...prev, normal: e.target.value }))}
              placeholder="e.g., Normal"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Second Range Name</label>
            <input
              type="text"
              value={rangeNames.elevated}
              onChange={(e) => setRangeNames(prev => ({ ...prev, elevated: e.target.value }))}
              placeholder="e.g., Elevated"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Third Range Name</label>
            <input
              type="text"
              value={rangeNames.high}
              onChange={(e) => setRangeNames(prev => ({ ...prev, high: e.target.value }))}
              placeholder="e.g., High"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Thresholds</h4>
          <div className="threshold-row">
            <div className="form-group">
              <label>First Threshold</label>
              <input
                type="number"
                value={normalThreshold}
                onChange={(e) => setNormalThreshold(e.target.value)}
                placeholder="Value"
                step="any"
                disabled={loading}
              />
              <span className="helper-text">Values below this are in first range</span>
            </div>
          </div>

          <div className="threshold-row">
            <div className="form-group">
              <label>Second Threshold</label>
              <input
                type="number"
                value={elevatedThreshold}
                onChange={(e) => setElevatedThreshold(e.target.value)}
                placeholder="Value"
                step="any"
                disabled={loading}
              />
              <span className="helper-text">Values between first and this are in second range</span>
            </div>
          </div>

          <div className="threshold-row">
            <div className="form-group">
              <label>Third Threshold</label>
              <input
                type="number"
                value={highThreshold}
                onChange={(e) => setHighThreshold(e.target.value)}
                placeholder="Value"
                step="any"
                disabled={loading}
              />
              <span className="helper-text">Values above this are in third range</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Status'}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StatusForm;