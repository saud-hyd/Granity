import { useState, useEffect } from 'react';
import useStore from './store/useStore';
import Login from './components/Login';
import Header from './components/Header';
import ManagerDashboard from './components/ManagerDashboard';
import TeamDashboard from './components/TeamDashboard';

function App() {
  const { isAuthenticated, currentUser } = useStore();
  const [currentView, setCurrentView] = useState('manager');

  // Set initial view based on user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'manager') {
        setCurrentView('manager');
      } else if (currentUser.role === 'teamlead') {
        setCurrentView('team');
      } else if (currentUser.role === 'viewer') {
        setCurrentView('manager');
      }
    }
  }, [currentUser]);

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {currentView === 'manager' && <ManagerDashboard />}
      {currentView === 'team' && <TeamDashboard />}
    </div>
  );
}

export default App;
