import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// Status Distribution Pie Chart
export const StatusPieChart = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Sales Rep Performance Bar Chart
export const SalesRepBarChart = ({ salesRepCounts, salesRepValues }) => {
  const chartData = Object.keys(salesRepCounts).map(rep => ({
    name: rep,
    projects: salesRepCounts[rep],
    value: Math.round(salesRepValues[rep] / 1000) // Convert to thousands
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Rep Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="projects" fill="#3b82f6" name="Projects" />
          <Bar yAxisId="right" dataKey="value" fill="#10b981" name="Value ($K)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Team Comparison Bar Chart
export const TeamComparisonChart = ({ teams }) => {
  const chartData = teams.map(team => ({
    name: `Team ${team.name}`,
    projects: team.projects,
    value: Math.round(team.value / 1000), // Convert to thousands
    submitted: team.submitted || 0
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="projects" fill="#3b82f6" name="Total Projects" />
          <Bar dataKey="submitted" fill="#10b981" name="Submitted" />
          <Bar dataKey="value" fill="#f59e0b" name="Value ($K)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Monthly Trend Line Chart
export const MonthlyTrendChart = ({ projects }) => {
  // Group projects by month
  const monthlyData = {};

  projects.forEach(project => {
    const date = project.executedDate;
    if (date) {
      const month = date.split(' ')[0]; // Get month name
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, value: 0 };
      }
      monthlyData[month].count += 1;
      const value = parseFloat(project.submittedValueEstimator.replace(/[$,]/g, '')) || 0;
      monthlyData[month].value += value;
    }
  });

  const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    projects: data.count,
    value: Math.round(data.value / 1000) // Convert to thousands
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} name="Projects" />
          <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Value ($K)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
