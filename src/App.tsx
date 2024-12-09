import React, { useEffect, useState } from 'react';
import CustomHeader from './components/Navigation/CustomHeader';
import { Outlet, useRouter } from '@tanstack/react-router';
import { useAuth } from './contexts/FirebaseContext';

const App: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    // Adjust path checking to account for base path
    const isDashboard = path.endsWith('/dashboard');
    const shouldShowHeader = !isDashboard || !currentUser;
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