import React, { useEffect, useState } from 'react';
import CustomHeader from './components/Navigation/CustomHeader';
import { Outlet, useRouter } from '@tanstack/react-router';
import { useAuth } from './contexts/FirebaseContext';

const App: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [showHeader, setShowHeader] = useState(true);  // Set initial state to true

  useEffect(() => {
    const path = window.location.pathname;
    // Show header on home page and other non-dashboard pages when not logged in
    const shouldShowHeader = (path === '/' || (path !== '/dashboard' && !currentUser));
    setShowHeader(shouldShowHeader);
  }, [currentUser, router.state.location.pathname]);

  return (
    <div>
      {showHeader && <CustomHeader />}
      <Outlet />
    </div>
  );
};

export default App;