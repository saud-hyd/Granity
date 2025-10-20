import { useMemo } from 'react';
import useStore from '../store/useStore';
import KPICard from './KPICard';
import DataTable from './DataTable';
import { StatusPieChart, TeamComparisonChart, SalesRepBarChart, MonthlyTrendChart } from './Charts';
import { Briefcase, DollarSign, CheckCircle, Users } from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/excelUtils';

const ManagerDashboard = () => {
  const { getAllProjects, teamAProjects, teamBProjects, teamCProjects } = useStore();

  const allProjects = useMemo(() => getAllProjects(), [teamAProjects, teamBProjects, teamCProjects]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalProjects = allProjects.length;
    const totalValue = allProjects.reduce((sum, p) => sum + parseCurrency(p.submittedValueEstimator), 0);

    const statusCounts = allProjects.reduce((acc, p) => {
      acc[p.projectStatus] = (acc[p.projectStatus] || 0) + 1;
      return acc;
    }, {});

    const submittedCount = statusCounts['Submitted'] || 0;

    const salesRepCounts = allProjects.reduce((acc, p) => {
      acc[p.salesRep] = (acc[p.salesRep] || 0) + 1;
      return acc;
    }, {});

    const salesRepValues = allProjects.reduce((acc, p) => {
      const value = parseCurrency(p.submittedValueEstimator);
      acc[p.salesRep] = (acc[p.salesRep] || 0) + value;
      return acc;
    }, {});

    return {
      totalProjects,
      totalValue,
      statusCounts,
      submittedCount,
      salesRepCounts,
      salesRepValues,
      uniqueSalesReps: Object.keys(salesRepCounts).length
    };
  }, [allProjects]);

  // Calculate team-specific statistics
  const teamStats = useMemo(() => {
    return [
      {
        name: 'A',
        projects: teamAProjects.length,
        value: teamAProjects.reduce((sum, p) => sum + parseCurrency(p.submittedValueEstimator), 0),
        submitted: teamAProjects.filter(p => p.projectStatus === 'Submitted').length
      },
      {
        name: 'B',
        projects: teamBProjects.length,
        value: teamBProjects.reduce((sum, p) => sum + parseCurrency(p.submittedValueEstimator), 0),
        submitted: teamBProjects.filter(p => p.projectStatus === 'Submitted').length
      },
      {
        name: 'C',
        projects: teamCProjects.length,
        value: teamCProjects.reduce((sum, p) => sum + parseCurrency(p.submittedValueEstimator), 0),
        submitted: teamCProjects.filter(p => p.projectStatus === 'Submitted').length
      }
    ];
  }, [teamAProjects, teamBProjects, teamCProjects]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Manager Dashboard</h2>
          <p className="text-gray-600">Overview of all teams and projects</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="Across all teams"
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
            subtitle={`${Math.round((stats.submittedCount / stats.totalProjects) * 100)}% of total`}
            icon={CheckCircle}
            color="purple"
          />
          <KPICard
            title="Sales Reps"
            value={stats.uniqueSalesReps}
            subtitle="Active team members"
            icon={Users}
            color="orange"
          />
        </div>

        {/* Team Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {teamStats.map(team => (
            <div key={team.name} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Team {team.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-blue-100 text-sm">Total Projects</p>
                  <p className="text-3xl font-bold">{team.projects}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Total Value</p>
                  <p className="text-2xl font-semibold">{formatCurrency(team.value)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Submitted</p>
                  <p className="text-xl font-semibold">{team.submitted} projects</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TeamComparisonChart teams={teamStats} />
          <StatusPieChart data={stats.statusCounts} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesRepBarChart
            salesRepCounts={stats.salesRepCounts}
            salesRepValues={stats.salesRepValues}
          />
          <MonthlyTrendChart projects={allProjects} />
        </div>

        {/* All Projects Table */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">All Projects</h3>
          <DataTable projects={allProjects} canEdit={false} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
