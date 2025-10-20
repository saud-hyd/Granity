import { useState } from 'react';
import { users } from '../data/sampleData';
import useStore from '../store/useStore';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const login = useStore(state => state.login);

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedUser) {
      const user = users.find(u => u.username === selectedUser);
      if (user) {
        login(user);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Granity Dashboard</h1>
          <p className="text-gray-600">Multi-Team Project Tracking System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User Role
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            >
              <option value="">-- Choose a role to demo --</option>
              {users.map(user => (
                <option key={user.id} value={user.username}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">Demo Roles:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li><span className="font-semibold">Manager:</span> View all 3 teams, combined analytics</li>
            <li><span className="font-semibold">Team Lead (A/B/C):</span> Edit team data, view team dashboard</li>
            <li><span className="font-semibold">Viewer:</span> Read-only access to all dashboards</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Password: demo123 (auto-filled for demo)
        </div>
      </div>
    </div>
  );
};

export default Login;
