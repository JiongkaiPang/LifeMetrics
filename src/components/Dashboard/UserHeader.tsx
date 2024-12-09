import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/FirebaseContext';
import { firestoreService } from '../../services/firestore';
import EditProfileDialog from '../Profile/EditProfileDialog';
import HelpDialog from './HelpDialog';
import './UserHeader.css';

interface UserHeaderProps {}

const UserHeader: React.FC<UserHeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userData, setUserData] = useState<{ name: string; avatar?: string } | null>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const defaultAvatar = '/assets/default-avatar.png';
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;
      
      try {
        const data = await firestoreService.user.getUserProfile(currentUser.uid);
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/'; // Force a full page reload
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleEditProfile = () => {
    setMenuOpen(false);
    setShowEditProfile(true);
  };

  const handleProfileUpdate = async () => {
    if (currentUser) {
      const data = await firestoreService.user.getUserProfile(currentUser.uid);
      if (data) {
        setUserData(data);
      }
    }
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    setShowHelpDialog(true);
  };

  if (!userData) {
    return <div className="user-header">Loading...</div>;
  }

  return (
    <>
      <div className="user-header">
        <div className="user-info">
          <img 
            src={userData.avatar || defaultAvatar} 
            alt="User avatar" 
            className="user-avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultAvatar;
            }}
          />
          <h2 className="user-name">{userData.name}</h2>
        </div>
        <div className="header-menu">
          <button 
            className="menu-button" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <a href="#" onClick={handleLogout}>Log out</a>
              <a href="#" onClick={handleEditProfile}>Edit Profile</a>
              <a href="#" onClick={handleHelpClick}>Help</a>
            </div>
          )}
        </div>
      </div>

      <EditProfileDialog
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentName={userData.name}
        currentAvatar={userData.avatar}
        onProfileUpdate={handleProfileUpdate}
      />

      <HelpDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
      />
    </>
  );
};

export default UserHeader;