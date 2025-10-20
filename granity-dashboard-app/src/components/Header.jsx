import { LogOut, LayoutDashboard, Users } from 'lucide-react';
import useStore from '../store/useStore';

const Header = ({ currentView, setCurrentView }) => {
  const { currentUser, logout } = useStore();

  // Only manager can switch between views
  const canAccessManagerView = currentUser?.role === 'manager';
  const canAccessTeamView = currentUser?.role === 'manager';

  // Team members and leads only see their team dashboard (no navigation buttons)

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Granity Dashboard</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {currentUser?.name}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex space-x-2">
              {canAccessManagerView && (
                <button
                  onClick={() => setCurrentView('manager')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'manager'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Manager View
                </button>
              )}

              {canAccessTeamView && (
                <button
                  onClick={() => setCurrentView('team')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'team'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team View
                </button>
              )}
            </nav>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
