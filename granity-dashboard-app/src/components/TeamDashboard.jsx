import { useState, useMemo, useEffect } from 'react';
import useStore from '../store/useStore';
import KPICard from './KPICard';
import DataTable from './DataTable';
import { StatusPieChart, SalesRepBarChart, MonthlyTrendChart } from './Charts';
import { Briefcase, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/excelUtils';

const TeamDashboard = ({ preselectedTeam }) => {
  const { currentUser, getTeamProjects, updateProject, deleteProject } = useStore();

  // Determine which team to show
  const [selectedTeam, setSelectedTeam] = useState(
    preselectedTeam || (currentUser?.role === 'teamlead' ? currentUser.team : 'A')
  );

  // Update selected team when preselectedTeam changes
  useEffect(() => {
    if (preselectedTeam) {
      setSelectedTeam(preselectedTeam);
    }
  }, [preselectedTeam]);

  // Only team leads can edit their own team's data
  const canEdit = currentUser?.role === 'teamlead' && currentUser?.team === selectedTeam;

  // Only managers can select different teams
  const isManager = currentUser?.role === 'manager';
  const canSelectTeam = isManager;

  // Team members and leads are locked to their team
  const isTeamUser = currentUser?.role === 'teamlead' || currentUser?.role === 'member';

  const teamProjects = useMemo(() => {
    return getTeamProjects(selectedTeam);
  }, [selectedTeam]);

  // Calculate team statistics
  const stats = useMemo(() => {
    const totalProjects = teamProjects.length;
    const totalValue = teamProjects.reduce((sum, p) => sum + parseCurrency(p.submittedValueEstimator), 0);

    const statusCounts = teamProjects.reduce((acc, p) => {
      acc[p.projectStatus] = (acc[p.projectStatus] || 0) + 1;
      return acc;
    }, {});

    const submittedCount = statusCounts['Submitted'] || 0;

    const salesRepCounts = teamProjects.reduce((acc, p) => {
      acc[p.salesRep] = (acc[p.salesRep] || 0) + 1;
      return acc;
    }, {});

    const salesRepValues = teamProjects.reduce((acc, p) => {
      const value = parseCurrency(p.submittedValueEstimator);
      acc[p.salesRep] = (acc[p.salesRep] || 0) + value;
      return acc;
    }, {});

    const avgProjectValue = totalProjects > 0 ? totalValue / totalProjects : 0;

    return {
      totalProjects,
      totalValue,
      statusCounts,
      submittedCount,
      salesRepCounts,
      salesRepValues,
      avgProjectValue
    };
  }, [teamProjects]);

  const handleUpdateProject = (projectNumber, updatedData) => {
    updateProject(selectedTeam, projectNumber, updatedData);
  };

  const handleDeleteProject = (projectNumber) => {
    deleteProject(selectedTeam, projectNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Team {selectedTeam} Dashboard
            </h2>
            <p className="text-gray-600">
              {canEdit
                ? 'Team Lead - You can edit and manage your team\'s projects'
                : isManager
                ? 'Manager - Drill down into individual team performance and projects'
                : 'Team Member - View your team\'s projects and performance (read-only)'}
            </p>
          </div>

          {/* Team Selector for Manager Only */}
          {canSelectTeam && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Select Team:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
              >
                <option value="A">Team A</option>
                <option value="B">Team B</option>
                <option value="C">Team C</option>
              </select>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle={`Team ${selectedTeam}`}
            icon={Briefcase}
            color="blue"
          />
          <KPICard
            title="Total Value"
            value={formatCurrency(stats.totalValue)}
            subtitle="Combined submitted value"
            icon={DollarSign}
            color="green"
          />
          <KPICard
            title="Submitted Projects"
            value={stats.submittedCount}
            subtitle={`${stats.totalProjects > 0 ? Math.round((stats.submittedCount / stats.totalProjects) * 100) : 0}% of total`}
            icon={CheckCircle}
            color="purple"
          />
          <KPICard
            title="Avg Project Value"
            value={formatCurrency(stats.avgProjectValue)}
            subtitle="Per project"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-600 mt-1">{status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusPieChart data={stats.statusCounts} />
          <SalesRepBarChart
            salesRepCounts={stats.salesRepCounts}
            salesRepValues={stats.salesRepValues}
          />
        </div>

        <div className="mb-8">
          <MonthlyTrendChart projects={teamProjects} />
        </div>

        {/* Projects Table */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {canEdit ? 'Manage Projects' : 'Team Projects'}
          </h3>
          <DataTable
            projects={teamProjects}
            canEdit={canEdit}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            teamName={selectedTeam}
          />
        </div>

        {canEdit && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Team Lead Permissions:</strong> You can edit project details, update statuses, and delete projects.
              Click the edit icon on any row to make changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;
