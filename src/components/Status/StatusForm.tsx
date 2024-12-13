import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StatusThresholds, RangeNames } from '../../services/firestore';
import './StatusForm.css';

interface StatusFormProps {
  onSubmit: (name: string, thresholds: StatusThresholds) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface StatusFormInputs {
  name: string;
  normalThreshold: string;
  elevatedThreshold: string;
  highThreshold: string;
  rangeNames: RangeNames;
}

const StatusForm: React.FC<StatusFormProps> = ({ onSubmit, onCancel, loading }) => {
  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setError,
    clearErrors 
  } = useForm<StatusFormInputs>({
    defaultValues: {
      name: '',
      normalThreshold: '',
      elevatedThreshold: '',
      highThreshold: '',
      rangeNames: {
        normal: 'Normal',
        elevated: 'Elevated',
        high: 'High'
      }
    }
  });

  const onFormSubmit = async (data: StatusFormInputs) => {
    clearErrors();

    const normal = parseFloat(data.normalThreshold);
    const elevated = parseFloat(data.elevatedThreshold);
    const high = parseFloat(data.highThreshold);

    if (normal >= elevated || elevated >= high) {
      setError('root', {
        type: 'manual',
        message: 'Thresholds must be in ascending order: First < Second < Third'
      });
      return;
    }

    const thresholds: StatusThresholds = {
      normal,
      elevated,
      high,
      ranges: data.rangeNames
    };

    try {
      await onSubmit(data.name, thresholds);
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: 'Failed to create status'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="status-form">
      {errors.root && <div className="error-message">{errors.root.message}</div>}
      
      <div className="form-section">
        <h4>Status Name</h4>
        <div className="form-group">
          <input
            type="text"
            disabled={loading}
            placeholder="Enter status name"
            {...register("name", {
              required: "Please enter a status name",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>
      </div>

      <div className="thresholds-group">
        <div className="form-section">
          <h4>Range Names</h4>
          <Controller
            name="rangeNames"
            control={control}
            rules={{
              validate: (value) => {
                if (!value.normal.trim() || !value.elevated.trim() || !value.high.trim()) {
                  return "Please enter names for all ranges";
                }
                return true;
              }
            }}
            render={({ field }) => (
              <>
                <div className="form-group">
                  <label>First Range Name</label>
                  <input
                    type="text"
                    value={field.value.normal}
                    onChange={(e) => field.onChange({ ...field.value, normal: e.target.value })}
                    placeholder="e.g., Normal"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Second Range Name</label>
                  <input
                    type="text"
                    value={field.value.elevated}
                    onChange={(e) => field.onChange({ ...field.value, elevated: e.target.value })}
                    placeholder="e.g., Elevated"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Third Range Name</label>
                  <input
                    type="text"
                    value={field.value.high}
                    onChange={(e) => field.onChange({ ...field.value, high: e.target.value })}
                    placeholder="e.g., High"
                    disabled={loading}
                  />
                </div>
              </>
            )}
          />
        </div>

        <div className="form-section">
          <h4>Thresholds</h4>
          <div className="threshold-row">
            <div className="form-group">
              <label>First Threshold</label>
              <input
                type="number"
                step="any"
                disabled={loading}
                placeholder="Value"
                {...register("normalThreshold", {
                  required: "Please enter a value",
                  validate: value => !isNaN(parseFloat(value)) || "Please enter a valid number"
                })}
              />
              <span className="helper-text">Values below this are in first range</span>
              {errors.normalThreshold && <span className="error-message">{errors.normalThreshold.message}</span>}
            </div>
          </div>

          <div className="threshold-row">
            <div className="form-group">
              <label>Second Threshold</label>
              <input
                type="number"
                step="any"
                disabled={loading}
                placeholder="Value"
                {...register("elevatedThreshold", {
                  required: "Please enter a value",
                  validate: value => !isNaN(parseFloat(value)) || "Please enter a valid number"
                })}
              />
              <span className="helper-text">Values between first and this are in second range</span>
              {errors.elevatedThreshold && <span className="error-message">{errors.elevatedThreshold.message}</span>}
            </div>
          </div>

          <div className="threshold-row">
            <div className="form-group">
              <label>Third Threshold</label>
              <input
                type="number"
                step="any"
                disabled={loading}
                placeholder="Value"
                {...register("highThreshold", {
                  required: "Please enter a value",
                  validate: value => !isNaN(parseFloat(value)) || "Please enter a valid number"
                })}
              />
              <span className="helper-text">Values between second and this are in third range</span>
              {errors.highThreshold && <span className="error-message">{errors.highThreshold.message}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default StatusForm;