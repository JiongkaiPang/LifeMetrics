import React, { useState } from 'react';
import { firestoreService } from '../../services/firestore';
import { useAuth } from '../../contexts/FirebaseContext';
import './EditProfileDialog.css';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar?: string;
  onProfileUpdate: () => void;
}

const AVATAR_OPTIONS = [
  '/LifeMetrics/assets/avatar-1.png',
  '/LifeMetrics/assets/avatar-2.png',
  '/LifeMetrics/assets/avatar-3.png',
  '/LifeMetrics/assets/avatar-4.png'
];

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  currentName,
  currentAvatar,
  onProfileUpdate
}) => {
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, updatePassword, reauthenticateWithCredential, EmailAuthProvider } = useAuth();

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setError('');
    setLoading(true);

    try {
      // Update profile info (name and avatar)
      await firestoreService.user.createUserProfile(currentUser.uid, {
        name,
        avatar: selectedAvatar,
        email: currentUser.email || ''
      });

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match');
        }

        if (currentPassword) {
          const credential = EmailAuthProvider.credential(
            currentUser.email || '',
            currentPassword
          );
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, newPassword);
        } else {
          throw new Error('Current password is required to change password');
        }
      }

      onProfileUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Edit Profile</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <div className="avatar-options">
              {AVATAR_OPTIONS.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Avatar option"
                  className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Change Password (optional)</label>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="dialog-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileDialog; 