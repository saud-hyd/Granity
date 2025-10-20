import { useState, useMemo } from 'react';
import { Search, Download, Edit2, Save, X, Trash2 } from 'lucide-react';
import { exportToExcel } from '../utils/excelUtils';

const DataTable = ({ projects, canEdit = false, onUpdate, onDelete, teamName = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(projects.map(p => p.projectStatus))];
    return ['All', ...uniqueStatuses];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch =
        project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.salesRep.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.genContractor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'All' || project.projectStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  const handleEdit = (project) => {
    setEditingRow(project.projectNumber);
    setEditedData({ ...project });
  };

  const handleSave = () => {
    if (onUpdate && editingRow) {
      onUpdate(editingRow, editedData);
      setEditingRow(null);
      setEditedData({});
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleDelete = (projectNumber) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(projectNumber);
    }
  };

  const handleExport = () => {
    const filename = teamName ? `Team_${teamName}_Projects.xlsx` : 'Projects.xlsx';
    exportToExcel(filteredProjects, filename);
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const renderCell = (project, field, label) => {
    const isEditing = editingRow === project.projectNumber;
    const value = isEditing ? editedData[field] : project[field];

    if (isEditing && canEdit) {
      if (field === 'projectStatus') {
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
          >
            <option>Submitted</option>
            <option>HOD</option>
            <option>Client</option>
            <option>Designer</option>
            <option>Working Progress File</option>
            <option>Partially Submitted</option>
          </select>
        );
      }
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
        />
      );
    }

    return <span className="text-sm text-gray-700">{value}</span>;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Submitted': 'bg-blue-100 text-blue-800',
      'HOD': 'bg-yellow-100 text-yellow-800',
      'Client': 'bg-purple-100 text-purple-800',
      'Designer': 'bg-green-100 text-green-800',
      'Working Progress File': 'bg-gray-100 text-gray-800',
      'Partially Submitted': 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header with Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rep</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contractor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executed Date</th>
              {canEdit && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProjects.map((project) => {
              const isEditing = editingRow === project.projectNumber;
              return (
                <tr key={project.projectNumber} className={isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{project.projectNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    {renderCell(project, 'projectName', 'Project Name')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderCell(project, 'salesRep', 'Sales Rep')}
                  </td>
                  <td className="px-4 py-3">
                    {renderCell(project, 'genContractor', 'Contractor')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isEditing ? renderCell(project, 'projectStatus', 'Status') : getStatusBadge(project.projectStatus)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">{project.submittedValueEstimator}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{project.executedDate}</span>
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.projectNumber)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects found matching your criteria.
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );
};

export default DataTable;
