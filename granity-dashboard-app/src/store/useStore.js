import { create } from 'zustand';
import { teamAData, teamBData, teamCData } from '../data/sampleData';

const useStore = create((set, get) => ({
  // Authentication
  currentUser: null,
  isAuthenticated: false,

  // Data for each team
  teamAProjects: teamAData,
  teamBProjects: teamBData,
  teamCProjects: teamCData,

  // Actions
  login: (user) => set({ currentUser: user, isAuthenticated: true }),

  logout: () => set({ currentUser: null, isAuthenticated: false }),

  // Get all projects combined
  getAllProjects: () => {
    const state = get();
    return [
      ...state.teamAProjects.map(p => ({ ...p, team: 'A' })),
      ...state.teamBProjects.map(p => ({ ...p, team: 'B' })),
      ...state.teamCProjects.map(p => ({ ...p, team: 'C' }))
    ];
  },

  // Get projects for a specific team
  getTeamProjects: (team) => {
    const state = get();
    if (team === 'A') return state.teamAProjects;
    if (team === 'B') return state.teamBProjects;
    if (team === 'C') return state.teamCProjects;
    return [];
  },

  // Update project
  updateProject: (team, projectNumber, updatedData) => {
    set((state) => {
      const teamKey = `team${team}Projects`;
      const projects = state[teamKey];
      const updatedProjects = projects.map(p =>
        p.projectNumber === projectNumber ? { ...p, ...updatedData } : p
      );
      return { [teamKey]: updatedProjects };
    });
  },

  // Add new project
  addProject: (team, newProject) => {
    set((state) => {
      const teamKey = `team${team}Projects`;
      return {
        [teamKey]: [...state[teamKey], newProject]
      };
    });
  },

  // Delete project
  deleteProject: (team, projectNumber) => {
    set((state) => {
      const teamKey = `team${team}Projects`;
      const updatedProjects = state[teamKey].filter(
        p => p.projectNumber !== projectNumber
      );
      return { [teamKey]: updatedProjects };
    });
  },

  // Calculate statistics
  getTeamStats: (team) => {
    const projects = get().getTeamProjects(team);
    return calculateStats(projects);
  },

  getAllStats: () => {
    const allProjects = get().getAllProjects();
    return calculateStats(allProjects);
  },
}));

// Helper function to calculate statistics
function calculateStats(projects) {
  const totalProjects = projects.length;

  const totalValue = projects.reduce((sum, p) => {
    const value = parseFloat(p.submittedValueEstimator.replace(/[$,]/g, '')) || 0;
    return sum + value;
  }, 0);

  const statusCounts = projects.reduce((acc, p) => {
    acc[p.projectStatus] = (acc[p.projectStatus] || 0) + 1;
    return acc;
  }, {});

  const salesRepCounts = projects.reduce((acc, p) => {
    acc[p.salesRep] = (acc[p.salesRep] || 0) + 1;
    return acc;
  }, {});

  const salesRepValues = projects.reduce((acc, p) => {
    const value = parseFloat(p.submittedValueEstimator.replace(/[$,]/g, '')) || 0;
    acc[p.salesRep] = (acc[p.salesRep] || 0) + value;
    return acc;
  }, {});

  return {
    totalProjects,
    totalValue,
    statusCounts,
    salesRepCounts,
    salesRepValues,
  };
}

export default useStore;
