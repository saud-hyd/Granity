# Granity Dashboard - Multi-Team Project Tracking System

A professional React dashboard for tracking and managing construction/design projects across multiple teams. Built with React, Vite, Tailwind CSS, Recharts, and Zustand.

## Features

### Role-Based Access Control
- **Manager**: View combined dashboard with all 3 teams, comprehensive analytics
- **Team Lead (A/B/C)**: Edit team data, manage projects, view team-specific dashboard
- **Viewer**: Read-only access to all dashboards

### Dashboard Views

#### Manager Dashboard
- **Executive KPIs**: Total projects, combined value, submitted count, active sales reps
- **Team Performance Cards**: Individual team metrics and comparisons
- **Visual Analytics**:
  - Team comparison bar charts
  - Status distribution pie charts
  - Sales rep performance charts
  - Monthly trend line charts
- **Combined Project Table**: All projects from all teams with advanced filtering

#### Team Dashboard
- **Team-Specific KPIs**: Project count, total value, submission rate, average project value
- **Status Breakdown**: Quick view of projects by status
- **Team Analytics**:
  - Status distribution charts
  - Sales rep performance
  - Monthly trends
- **Editable Project Table** (for Team Leads):
  - Inline editing of project details
  - Delete projects
  - Update project status
  - Export to Excel

### Key Features
- **Search & Filter**: Search by project name, number, sales rep, contractor
- **Excel Integration**: Export filtered data to Excel with proper formatting
- **Real-time Updates**: Charts update instantly when data changes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

The application is already set up and running! Just navigate to:
```
http://localhost:5173
```

If you need to restart the server:
```bash
cd granity-dashboard-app
npm run dev
```

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Demo Login Credentials

The application has three role types with automatic team assignment:

### User Roles:
- **Manager**: Full access to all teams - can view combined analytics and drill into any team
- **Team Lead**: Can edit and manage their own team's projects
- **Team Member**: Read-only access to their own team's dashboard

### Demo Users:

**Management:**
- Sarah Johnson (Manager) - username: `manager`

**Team A:**
- John Mitchell (Team Lead) - username: `teamAlead`
- Mike Jamestone (Member) - username: `teamAmember1`
- Robert Chen (Member) - username: `teamAmember2`

**Team B:**
- Emily Rodriguez (Team Lead) - username: `teamBlead`
- Carlos Mendez (Member) - username: `teamBmember1`
- Patricia Lee (Member) - username: `teamBmember2`

**Team C:**
- Jennifer Park (Team Lead) - username: `teamClead`
- Robert Kim (Member) - username: `teamCmember1`
- Angela Torres (Member) - username: `teamCmember2`

Password for all users: `demo123` (auto-filled)

**Note:** In production, team assignment will be automatic based on user authentication from your backend system.

## How to Use for Demo Presentation

### 1. Login as Manager
- Select "Sarah Johnson (Manager)" from the dropdown
- Click "Login to Dashboard"
- You'll see the **Manager Dashboard** with:
  - Combined KPIs for all 3 teams
  - Team performance cards with "View Team Details" buttons
  - Team comparison charts
  - Status distribution pie chart
  - Sales rep performance
  - Monthly trends
  - Complete project table with all teams

### 2. Drill Down into Team Details (as Manager)
- **Option A**: Click "View Team Details" button on any team card → Automatically shows that team's detailed dashboard
- **Option B**: Click "Team View" in header → Use dropdown to select any team (A, B, or C)
- Manager can explore all teams but cannot edit data

### 3. Login as Team Lead
- Logout (click Logout button)
- Select a Team Lead (e.g., "John Mitchell (Team A Lead)")
- Automatically directed to their team's dashboard
- **Demonstrate editing capabilities**:
  - Click the edit icon on any project row
  - Modify project details (name, status, contractor, etc.)
  - Click save icon to save changes
  - Charts update in real-time
  - Click delete icon to remove a project
  - Click "Export to Excel" to download the data
- Team Leads are locked to their own team (no team selector)

### 4. Login as Team Member
- Logout and select a Team Member (e.g., "Mike Jamestone (Team A Member)")
- See their team's dashboard
- **Read-only access**:
  - View all KPIs, charts, and project data
  - No edit or delete buttons
  - Can search, filter, and export to Excel
  - Cannot modify any data
- Team Members are locked to their own team

### 5. Demonstrate Features
- **Search**: Type in the search box to filter projects
- **Status Filter**: Use the dropdown to filter by project status
- **Export**: Click "Export to Excel" to download filtered data
- **Interactive Charts**: Hover over charts to see detailed tooltips
- **Real-time Updates**: Edit data as Team Lead and see charts update instantly

## Project Structure

```
granity-dashboard-app/
├── src/
│   ├── components/
│   │   ├── Login.jsx              # Authentication UI
│   │   ├── Header.jsx             # Navigation and user info
│   │   ├── ManagerDashboard.jsx   # Combined team view
│   │   ├── TeamDashboard.jsx      # Individual team view
│   │   ├── KPICard.jsx            # Metric display cards
│   │   ├── DataTable.jsx          # Editable project table
│   │   └── Charts.jsx             # Recharts visualizations
│   ├── data/
│   │   └── sampleData.js          # Sample project data for 3 teams
│   ├── store/
│   │   └── useStore.js            # Zustand state management
│   ├── utils/
│   │   └── excelUtils.js          # Excel import/export functions
│   ├── App.jsx                    # Main application
│   └── main.jsx                   # Entry point
├── public/                        # Static assets
└── package.json                   # Dependencies
```

## Data Structure

Each project contains the following fields (matching your original spreadsheet):
- Project Number
- Project Name
- Drive Link
- Recorded From
- Sales Rep
- Scope of Work
- Gen. Contractor
- Contact Person
- Executed Date
- MM-D-D Date
- MM-OD Date
- Estimator Name
- Designer Name
- Project Status
- Project Submitted Value by Estimator
- Project Submitted Value by STM/Ruch/Pooja
- Bid Submitted
- Project Tracker Link
- Comments/Remarks

## Sample Data

The application comes with realistic sample data for 3 teams:
- **Team A**: 8 projects totaling ~$1.5M
- **Team B**: 7 projects totaling ~$1.1M
- **Team C**: 9 projects totaling ~$2.1M

All projects have realistic names, dates, contractors, and values matching your industry.

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **Zustand** - State management
- **SheetJS (xlsx)** - Excel file handling
- **Lucide React** - Icon library

## Customization for Production

### Adding Real Data
Replace the sample data in `src/data/sampleData.js` with your actual project data, or implement Excel import functionality.

### Adding Authentication
Replace the mock authentication in `src/store/useStore.js` with real authentication (Firebase, Auth0, JWT, etc.).

### Database Integration
Connect to a backend API by modifying the Zustand store actions to make API calls.

### Deployment
Deploy to Vercel, Netlify, or any static hosting service:
```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## Future Enhancements

- Real backend API integration
- User authentication with JWT
- File upload for Excel imports
- Advanced filtering and sorting
- Export to PDF reports
- Email notifications
- Project timeline/Gantt view
- Collaborative real-time editing
- Audit logs and version history
- Mobile app version

## Support

For questions or issues, contact your development team.

---

**Built with** ❤️ **for Granity**
