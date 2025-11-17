import React, { useState, useMemo } from 'react';
import '../../css/TeamsDashboard.css'
import { 
  Groups as GroupsIcon,
  Engineering as EngineeringIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Construction as ConstructionIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  BuildCircle as BuildCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  GroupWork as GroupWorkIcon,
  People as PeopleIcon,
  Badge as BadgeIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Assignment as AssignmentIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  PersonAdd as PersonAddIcon,
  PersonOff as PersonOffIcon
} from '@mui/icons-material';
import { useStoreState } from 'easy-peasy';

const TeamsDashboard = () => {
  const { allTeams, employees } = useStoreState(state => state);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('manpower');
  console.log(allTeams)

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate project duration
  const getProjectDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${duration} days`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Installation': { class: 'status-installation', label: 'Installation' },
      'Preliminaries': { class: 'status-preliminaries', label: 'Preliminaries' },
      'Structural/Manufacturing': { class: 'status-structural', label: 'Structural' },
      'Test and Comm': { class: 'status-testing', label: 'Testing' },
      'Unknown': { class: 'status-unknown', label: 'Unknown' }
    };
    
    const config = statusConfig[status] || { class: 'status-default', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  // Get job badge
  const getJobBadge = (job) => {
    const jobConfig = {
      'Foreman': { class: 'job-foreman', label: 'Foreman' },
      'Skilled Installer': { class: 'job-skilled', label: 'Skilled' },
      'Installer': { class: 'job-installer', label: 'Installer' },
      'Project Engineer': { class: 'job-engineer', label: 'Engineer' },
      'Test and Commission': { class: 'job-technician', label: 'TNC Tech' },
      'QA/QC': { class: 'job-qaqc', label: 'QA/QC' }
    };
    
    const config = jobConfig[job] || { class: 'job-default', label: job };
    return <span className={`job-badge ${config.class}`}>{config.label}</span>;
  };

  // Toggle project expansion
  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  // Calculate comprehensive manpower statistics
  const manpowerStats = useMemo(() => {
    if (!allTeams || !employees) return {};
    
    const assignedPersonnel = new Set();
    const assignedForemen = new Set();
    const assignedSkilledInstallers = new Set();
    const assignedInstallers = new Set();
    const assignedProjectEngineers = new Set();
    const assignedTechnicians = {
      tnc: new Set(),
      qaqc: new Set(),
      pms: new Set()
    };

    // Track all assigned personnel from projects
    allTeams.forEach(project => {
      // Project Engineers
      if (project.project_engineer?.id) {
        assignedProjectEngineers.add(project.project_engineer.id);
        assignedPersonnel.add(`pe-${project.project_engineer.id}`);
      }

      // Foremen
      if (project.foreman?.id) {
        assignedForemen.add(project.foreman.id);
        assignedPersonnel.add(`f-${project.foreman.id}`);
      }

      // Technicians
      if (project.technicians.tnc_tech?.id) {
        assignedTechnicians.tnc.add(project.technicians.tnc_tech.id);
        assignedPersonnel.add(`tnc-${project.technicians.tnc_tech.id}`);
      }
      if (project.technicians.qaqc_tech?.id) {
        assignedTechnicians.qaqc.add(project.technicians.qaqc_tech.id);
        assignedPersonnel.add(`qaqc-${project.technicians.qaqc_tech.id}`);
      }
      if (project.technicians.pms_tech?.id) {
        assignedTechnicians.pms.add(project.technicians.pms_tech.id);
        assignedPersonnel.add(`pms-${project.technicians.pms_tech.id}`);
      }

      // Team members
      project.team.forEach(member => {
        assignedPersonnel.add(`tm-${member.id}`);
        if (member.job === 'Skilled Installer') {
          assignedSkilledInstallers.add(member.id);
        } else if (member.job === 'Installer') {
          assignedInstallers.add(member.id);
        }
      });
    });
    console.log(employees.filter(e => (e.job !== 'Project Manager' && e.job !== 'Admin' && e.job !== 'QAQC Coordinator' || e.job !== 'TNC Coordinator' || e.job !== 'PMS Coordinator')))
    // Categorize all employees
    const allForemen = employees.filter(emp => emp.job === 'Foreman');
    const allSkilledInstallers = employees.filter(emp => emp.job === 'Skilled Installer');
    const allInstallers = employees.filter(emp => emp.job === 'Installer');
    const allProjectEngineers = employees.filter(emp => emp.job === 'Project Engineer');
    const allTechnicians = {
      tnc: employees.filter(emp => emp.job === 'Test and Commission'),
      qaqc: employees.filter(emp => emp.job === 'QA/QC')
    };

    return {
      // Totals
      totalEmployees: employees.filter(e => (e.job !== 'Project Manager' && e.job !== 'Admin' && e.job !== 'QAQC Coordinator' && e.job !== 'TNC Coordinator' && e.job !== 'PMS Coordinator')).length,
      totalAssigned: assignedPersonnel.size,
      
      // Foremen
      foremen: {
        total: allForemen.length,
        assigned: assignedForemen.size,
        available: allForemen.length - assignedForemen.size,
        assignedList: allForemen.filter(f => assignedForemen.has(f.employee_id)),
        availableList: allForemen.filter(f => !assignedForemen.has(f.employee_id))
      },
      
      // Skilled Installers
      skilledInstallers: {
        total: allSkilledInstallers.length,
        assigned: assignedSkilledInstallers.size,
        available: allSkilledInstallers.length - assignedSkilledInstallers.size,
        assignedList: allSkilledInstallers.filter(si => assignedSkilledInstallers.has(si.employee_id)),
        availableList: allSkilledInstallers.filter(si => !assignedSkilledInstallers.has(si.employee_id))
      },
      
      // Installers
      installers: {
        total: allInstallers.length,
        assigned: assignedInstallers.size,
        available: allInstallers.length - assignedInstallers.size,
        assignedList: allInstallers.filter(i => assignedInstallers.has(i.employee_id)),
        availableList: allInstallers.filter(i => !assignedInstallers.has(i.employee_id))
      },
      
      // Project Engineers
      projectEngineers: {
        total: allProjectEngineers.length,
        assigned: assignedProjectEngineers.size,
        available: allProjectEngineers.length - assignedProjectEngineers.size,
        assignedList: allProjectEngineers.filter(pe => assignedProjectEngineers.has(pe.employee_id)),
        availableList: allProjectEngineers.filter(pe => !assignedProjectEngineers.has(pe.employee_id))
      },
      
      // Technicians
      technicians: {
        tnc: {
          total: allTechnicians.tnc.length,
          assigned: assignedTechnicians.tnc.size,
          available: allTechnicians.tnc.length - assignedTechnicians.tnc.size,
          assignedList: allTechnicians.tnc.filter(t => assignedTechnicians.tnc.has(t.employee_id)),
          availableList: allTechnicians.tnc.filter(t => !assignedTechnicians.tnc.has(t.employee_id))
        },
        qaqc: {
          total: allTechnicians.qaqc.length,
          assigned: assignedTechnicians.qaqc.size,
          available: allTechnicians.qaqc.length - assignedTechnicians.qaqc.size,
          assignedList: allTechnicians.qaqc.filter(t => assignedTechnicians.qaqc.has(t.employee_id)),
          availableList: allTechnicians.qaqc.filter(t => !assignedTechnicians.qaqc.has(t.employee_id))
        }
      }
    };
  }, [allTeams, employees]);

  // Filter projects based on status
  const filteredProjects = allTeams ? allTeams.filter(project => {
    if (statusFilter === 'all') return true;
    return project.status === statusFilter;
  }) : [];

  if (!allTeams || !employees) {
    return (
      <div className="Content TeamsDashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading teams data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Content TeamsDashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-main">
          <GroupsIcon className="header-icon" />
          <div>
            <h1>Project Teams Dashboard</h1>
            <p>Comprehensive overview of all projects and manpower allocation</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'manpower' ? 'active' : ''}`}
          onClick={() => setActiveTab('manpower')}
        >
          <PeopleIcon className="tab-icon" />
          Manpower Status
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <BusinessIcon className="tab-icon" />
          Projects Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnel')}
        >
          <GroupWorkIcon className="tab-icon" />
          Personnel Tally
        </button>
        <button 
          className={`tab-btn ${activeTab === 'technicians' ? 'active' : ''}`}
          onClick={() => setActiveTab('technicians')}
        >
          <PrecisionManufacturingIcon className="tab-icon" />
          Specialized Techs
        </button>
      </div>

      {activeTab === 'manpower' ? (
        /* Manpower Status Tab */
        <div className="manpower-overview">
          <div className="tally-header">
            <h2>Manpower Allocation Status</h2>
            <p>Complete overview of personnel assignment across all projects</p>
          </div>

          {/* Overall Statistics */}
          <div className="manpower-stats-grid">
            <div className="manpower-stat-card total">
              <PeopleIcon className="manpower-stat-icon" />
              <div className="manpower-stat-content">
                {console.log(employees)}
                <span className="manpower-stat-number">{manpowerStats.totalEmployees}</span>
                <span className="manpower-stat-label">Total Foremen and Installers</span>
              </div>
            </div>
            <div className="manpower-stat-card assigned">
              <PersonIcon className="manpower-stat-icon" />
              <div className="manpower-stat-content">
                <span className="manpower-stat-number">{manpowerStats.totalAssigned}</span>
                <span className="manpower-stat-label">Assigned to Projects</span>
              </div>
            </div>
            <div className="manpower-stat-card available">
              <PersonAddIcon className="manpower-stat-icon" />
              <div className="manpower-stat-content">
                <span className="manpower-stat-number">
                  {manpowerStats.totalEmployees - manpowerStats.totalAssigned}
                </span>
                <span className="manpower-stat-label">Available Personnel</span>
              </div>
            </div>
          </div>

          {/* Role-wise Breakdown */}
          <div className="role-breakdown">
            {/* Foremen */}
            <div className="role-section">
              <div className="role-section-header">
                <SupervisorAccountIcon className="role-section-icon foreman" />
                <div className="role-section-title">
                  <h3>Foremen</h3>
                  <div className="role-count-badge">
                    <span className="assigned-count">{manpowerStats.foremen?.assigned || 0}</span>
                    <span className="separator">/</span>
                    <span className="total-count">{manpowerStats.foremen?.total || 0}</span>
                    <span className="count-label">Assigned</span>
                  </div>
                </div>
              </div>
              
              <div className="personnel-lists">
                <div className="assigned-list">
                  <h4>
                    <CheckCircleIcon className="list-icon assigned" />
                    Assigned to Projects ({manpowerStats.foremen?.assigned || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.foremen?.assignedList.map(foreman => (
                      <div key={foreman.employee_id} className="personnel-item assigned">
                        <div className="personnel-avatar">
                          <SupervisorAccountIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{foreman.first_name} {foreman.last_name}</span>
                          <span className="personnel-username">@{foreman.username}</span>
                        </div>
                        {getJobBadge('Foreman')}
                      </div>
                    ))}
                    {(!manpowerStats.foremen?.assignedList || manpowerStats.foremen.assignedList.length === 0) && (
                      <div className="no-personnel">No foremen currently assigned</div>
                    )}
                  </div>
                </div>

                <div className="available-list">
                  <h4>
                    <PersonAddIcon className="list-icon available" />
                    Available ({manpowerStats.foremen?.available || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.foremen?.availableList.map(foreman => (
                      <div key={foreman.employee_id} className="personnel-item available">
                        <div className="personnel-avatar">
                          <SupervisorAccountIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{foreman.first_name} {foreman.last_name}</span>
                          <span className="personnel-username">@{foreman.username}</span>
                        </div>
                        {getJobBadge('Foreman')}
                      </div>
                    ))}
                    {(!manpowerStats.foremen?.availableList || manpowerStats.foremen.availableList.length === 0) && (
                      <div className="no-personnel">All foremen are assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skilled Installers */}
            <div className="role-section">
              <div className="role-section-header">
                <BuildIcon className="role-section-icon skilled" />
                <div className="role-section-title">
                  <h3>Skilled Installers</h3>
                  <div className="role-count-badge">
                    <span className="assigned-count">{manpowerStats.skilledInstallers?.assigned || 0}</span>
                    <span className="separator">/</span>
                    <span className="total-count">{manpowerStats.skilledInstallers?.total || 0}</span>
                    <span className="count-label">Assigned</span>
                  </div>
                </div>
              </div>
              
              <div className="personnel-lists">
                <div className="assigned-list">
                  <h4>
                    <CheckCircleIcon className="list-icon assigned" />
                    Assigned to Projects ({manpowerStats.skilledInstallers?.assigned || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.skilledInstallers?.assignedList.map(installer => (
                      <div key={installer.employee_id} className="personnel-item assigned">
                        <div className="personnel-avatar">
                          <BuildIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{installer.first_name} {installer.last_name}</span>
                          <span className="personnel-username">@{installer.username}</span>
                        </div>
                        {getJobBadge('Skilled Installer')}
                      </div>
                    ))}
                    {(!manpowerStats.skilledInstallers?.assignedList || manpowerStats.skilledInstallers.assignedList.length === 0) && (
                      <div className="no-personnel">No skilled installers currently assigned</div>
                    )}
                  </div>
                </div>

                <div className="available-list">
                  <h4>
                    <PersonAddIcon className="list-icon available" />
                    Available ({manpowerStats.skilledInstallers?.available || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.skilledInstallers?.availableList.map(installer => (
                      <div key={installer.employee_id} className="personnel-item available">
                        <div className="personnel-avatar">
                          <BuildIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{installer.first_name} {installer.last_name}</span>
                          <span className="personnel-username">@{installer.username}</span>
                        </div>
                        {getJobBadge('Skilled Installer')}
                      </div>
                    ))}
                    {(!manpowerStats.skilledInstallers?.availableList || manpowerStats.skilledInstallers.availableList.length === 0) && (
                      <div className="no-personnel">All skilled installers are assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Installers */}
            <div className="role-section">
              <div className="role-section-header">
                <ConstructionIcon className="role-section-icon installer" />
                <div className="role-section-title">
                  <h3>Installers</h3>
                  <div className="role-count-badge">
                    <span className="assigned-count">{manpowerStats.installers?.assigned || 0}</span>
                    <span className="separator">/</span>
                    <span className="total-count">{manpowerStats.installers?.total || 0}</span>
                    <span className="count-label">Assigned</span>
                  </div>
                </div>
              </div>
              
              <div className="personnel-lists">
                <div className="assigned-list">
                  <h4>
                    <CheckCircleIcon className="list-icon assigned" />
                    Assigned to Projects ({manpowerStats.installers?.assigned || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.installers?.assignedList.map(installer => (
                      <div key={installer.employee_id} className="personnel-item assigned">
                        <div className="personnel-avatar">
                          <ConstructionIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{installer.first_name} {installer.last_name}</span>
                          <span className="personnel-username">@{installer.username}</span>
                        </div>
                        {getJobBadge('Installer')}
                      </div>
                    ))}
                    {(!manpowerStats.installers?.assignedList || manpowerStats.installers.assignedList.length === 0) && (
                      <div className="no-personnel">No installers currently assigned</div>
                    )}
                  </div>
                </div>

                <div className="available-list">
                  <h4>
                    <PersonAddIcon className="list-icon available" />
                    Available ({manpowerStats.installers?.available || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.installers?.availableList.map(installer => (
                      <div key={installer.employee_id} className="personnel-item available">
                        <div className="personnel-avatar">
                          <ConstructionIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{installer.first_name} {installer.last_name}</span>
                          <span className="personnel-username">@{installer.username}</span>
                        </div>
                        {getJobBadge('Installer')}
                      </div>
                    ))}
                    {(!manpowerStats.installers?.availableList || manpowerStats.installers.availableList.length === 0) && (
                      <div className="no-personnel">All installers are assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Engineers */}
            <div className="role-section">
              <div className="role-section-header">
                <EngineeringIcon className="role-section-icon engineer" />
                <div className="role-section-title">
                  <h3>Project Engineers</h3>
                  <div className="role-count-badge">
                    <span className="assigned-count">{manpowerStats.projectEngineers?.assigned || 0}</span>
                    <span className="separator">/</span>
                    <span className="total-count">{manpowerStats.projectEngineers?.total || 0}</span>
                    <span className="count-label">Assigned</span>
                  </div>
                </div>
              </div>
              
              <div className="personnel-lists">
                <div className="assigned-list">
                  <h4>
                    <CheckCircleIcon className="list-icon assigned" />
                    Assigned to Projects ({manpowerStats.projectEngineers?.assigned || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.projectEngineers?.assignedList.map(engineer => (
                      <div key={engineer.employee_id} className="personnel-item assigned">
                        <div className="personnel-avatar">
                          <EngineeringIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{engineer.first_name} {engineer.last_name}</span>
                          <span className="personnel-username">@{engineer.username}</span>
                        </div>
                        {getJobBadge('Project Engineer')}
                      </div>
                    ))}
                    {(!manpowerStats.projectEngineers?.assignedList || manpowerStats.projectEngineers.assignedList.length === 0) && (
                      <div className="no-personnel">No project engineers currently assigned</div>
                    )}
                  </div>
                </div>

                <div className="available-list">
                  <h4>
                    <PersonAddIcon className="list-icon available" />
                    Available ({manpowerStats.projectEngineers?.available || 0})
                  </h4>
                  <div className="personnel-grid">
                    {manpowerStats.projectEngineers?.availableList.map(engineer => (
                      <div key={engineer.employee_id} className="personnel-item available">
                        <div className="personnel-avatar">
                          <EngineeringIcon />
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{engineer.first_name} {engineer.last_name}</span>
                          <span className="personnel-username">@{engineer.username}</span>
                        </div>
                        {getJobBadge('Project Engineer')}
                      </div>
                    ))}
                    {(!manpowerStats.projectEngineers?.availableList || manpowerStats.projectEngineers.availableList.length === 0) && (
                      <div className="no-personnel">All project engineers are assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'projects' ? (
        // ... (keep the existing projects tab code exactly as it was)
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <BusinessIcon />
              </div>
              <div className="stat-content">
                <span className="stat-number">{manpowerStats.totalProjects}</span>
                <span className="stat-label">Active Projects</span>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon">
                <PersonIcon />
              </div>
              <div className="stat-content">
                <span className="stat-number">{manpowerStats.totalAssigned}</span>
                <span className="stat-label">Total Personnel</span>
              </div>
            </div>

            <div className="stat-card accent">
              <div className="stat-icon">
                <GroupsIcon />
              </div>
              <div className="stat-content">
                <span className="stat-number">
                  {allTeams.filter(p => p.status === 'Installation').length}
                </span>
                <span className="stat-label">In Installation</span>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">
                <TrendingUpIcon />
              </div>
              <div className="stat-content">
                <span className="stat-number">
                  {manpowerStats.foremen?.assigned || 0}
                </span>
                <span className="stat-label">Active Foremen</span>
              </div>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="role-stats-grid">
            <div className="role-stat">
              <SupervisorAccountIcon className="role-icon foreman" />
              <div className="role-info">
                <span className="role-count">{manpowerStats.foremen?.assigned || 0}</span>
                <span className="role-label">Foremen</span>
              </div>
            </div>
            <div className="role-stat">
              <BuildIcon className="role-icon skilled" />
              <div className="role-info">
                <span className="role-count">{manpowerStats.skilledInstallers?.assigned || 0}</span>
                <span className="role-label">Skilled Installers</span>
              </div>
            </div>
            <div className="role-stat">
              <ConstructionIcon className="role-icon installer" />
              <div className="role-info">
                <span className="role-count">{manpowerStats.installers?.assigned || 0}</span>
                <span className="role-label">Installers</span>
              </div>
            </div>
            <div className="role-stat">
              <EngineeringIcon className="role-icon engineer" />
              <div className="role-info">
                <span className="role-count">{manpowerStats.projectEngineers?.assigned || 0}</span>
                <span className="role-label">Project Engineers</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="dashboard-controls">
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>

            <div className="filter-controls">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="Installation">Installation</option>
                <option value="Preliminaries">Preliminaries</option>
                <option value="Structural/Manufacturing">Structural</option>
                <option value="Test and Comm">Testing</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className={`projects-container ${viewMode}`}>
            {filteredProjects.length === 0 ? (
              <div className="no-projects">
                <BusinessIcon className="no-projects-icon" />
                <h3>No Projects Found</h3>
                <p>No projects match the current filters.</p>
              </div>
            ) : (
              filteredProjects.map(project => {
                const isExpanded = expandedProjects.has(project.project_id);
                const skilledInstallers = project.team.filter(member => member.job === 'Skilled Installer');
                const installers = project.team.filter(member => member.job === 'Installer');

                return (
                  <div key={project.project_id} className="project-card">
                    {/* Card Header */}
                    <div 
                      className="project-card-header"
                      onClick={() => toggleProject(project.project_id)}
                    >
                      <div className="project-basic-info">
                        <div className="project-title">
                          <h3>{project.lift_name}</h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="project-meta">
                          <div className="project-client">
                            <BusinessIcon className="meta-icon" />
                            <span>{project.client}</span>
                          </div>
                          <div className="project-id">
                            <AssignmentIcon className="meta-icon" />
                            <span>#{project.project_id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="project-dates">
                        <div className="date-item">
                          <CalendarIcon className="date-icon" />
                          <span>Start: {formatDate(project.operations_start_date)}</span>
                        </div>
                        <div className="date-item">
                          <ScheduleIcon className="date-icon" />
                          <span>End: {formatDate(project.project_end_date)}</span>
                        </div>
                        <div className="project-duration">
                          {getProjectDuration(project.operations_start_date, project.project_end_date)}
                        </div>
                      </div>

                      <div className="project-expand">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="project-card-content">
                        {/* Leadership Section */}
                        <div className="leadership-section">
                          <h4>
                            <StarIcon className="section-icon" />
                            Project Leadership
                          </h4>
                          <div className="leadership-grid">
                            {project.project_engineer?.fullname && (
                              <div className="leadership-item">
                                <div className="personnel-avatar">
                                  <EngineeringIcon />
                                </div>
                                <div className="personnel-info">
                                  <span className="personnel-name">{project.project_engineer.fullname}</span>
                                  <span className="personnel-role">Project Engineer</span>
                                </div>
                                {getJobBadge('Project Engineer')}
                              </div>
                            )}
                            
                            {project.foreman?.name && (
                              <div className="leadership-item">
                                <div className="personnel-avatar">
                                  <SupervisorAccountIcon />
                                </div>
                                <div className="personnel-info">
                                  <span className="personnel-name">{project.foreman.name}</span>
                                  <span className="personnel-role">Team Foreman</span>
                                </div>
                                {getJobBadge('Foreman')}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Specialized Technicians */}
                        <div className="technicians-section">
                          <h4>
                            <PrecisionManufacturingIcon className="section-icon" />
                            Specialized Technicians
                          </h4>
                          <div className="technicians-grid">
                            {project.technicians.tnc_tech && (
                              <div className="technician-item">
                                <div className="personnel-avatar">
                                  <SettingsIcon />
                                </div>
                                <div className="personnel-info">
                                  <span className="personnel-name">{project.technicians.tnc_tech.fullname}</span>
                                  <span className="personnel-role">Testing & Commissioning</span>
                                </div>
                                {getJobBadge(project.technicians.tnc_tech.job)}
                              </div>
                            )}
                            {project.technicians.qaqc_tech && (
                              <div className="technician-item">
                                <div className="personnel-avatar">
                                  <BuildIcon />
                                </div>
                                <div className="personnel-info">
                                  <span className="personnel-name">{project.technicians.qaqc_tech.fullname}</span>
                                  <span className="personnel-role">Quality Assurance</span>
                                </div>
                                {getJobBadge(project.technicians.qaqc_tech.job)}
                              </div>
                            )}
                            {project.technicians.pms_tech && (
                              <div className="technician-item">
                                <div className="personnel-avatar">
                                  <BuildCircleIcon />
                                </div>
                                <div className="personnel-info">
                                  <span className="personnel-name">{project.technicians.pms_tech.fullname}</span>
                                  <span className="personnel-role">Preventive Maintenance</span>
                                </div>
                                {getJobBadge(project.technicians.pms_tech.job)}
                              </div>
                            )}
                            {!project.technicians.tnc_tech && !project.technicians.qaqc_tech && !project.technicians.pms_tech && (
                              <div className="no-technicians">
                                No specialized technicians assigned
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Installation Team */}
                        <div className="team-section">
                          <h4>
                            <GroupsIcon className="section-icon" />
                            Installation Team ({project.team.length} members)
                          </h4>
                          
                          {skilledInstallers.length > 0 && (
                            <div className="role-group">
                              <h5>Skilled Installers ({skilledInstallers.length})</h5>
                              <div className="personnel-grid">
                                {skilledInstallers.map(member => (
                                  <div key={member.id} className="personnel-item">
                                    <div className="personnel-avatar">
                                      <BuildIcon />
                                    </div>
                                    <div className="personnel-info">
                                      <span className="personnel-name">{member.fullname}</span>
                                      <span className="personnel-username">@{member.username}</span>
                                    </div>
                                    {getJobBadge(member.job)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {installers.length > 0 && (
                            <div className="role-group">
                              <h5>Installers ({installers.length})</h5>
                              <div className="personnel-grid">
                                {installers.map(member => (
                                  <div key={member.id} className="personnel-item">
                                    <div className="personnel-avatar">
                                      <ConstructionIcon />
                                    </div>
                                    <div className="personnel-info">
                                      <span className="personnel-name">{member.fullname}</span>
                                      <span className="personnel-username">@{member.username}</span>
                                    </div>
                                    {getJobBadge(member.job)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {project.team.length === 0 && (
                            <div className="no-team">
                              No installation team members assigned
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : activeTab === 'personnel' ? (
        /* Personnel Tally Tab */
        <div className="personnel-tally">
          <div className="tally-header">
            <h2>Personnel Overview</h2>
            <p>Comprehensive breakdown of all installation team members</p>
          </div>

          <div className="tally-stats">
            <div className="tally-stat-card">
              <PeopleIcon className="tally-stat-icon" />
              <div className="tally-stat-content">
                <span className="tally-stat-number">{manpowerStats.totalAssigned}</span>
                <span className="tally-stat-label">Assigned Personnel</span>
              </div>
            </div>
            <div className="tally-stat-card">
              <BusinessIcon className="tally-stat-icon" />
              <div className="tally-stat-content">
                <span className="tally-stat-number">{allTeams.length}</span>
                <span className="tally-stat-label">Active Projects</span>
              </div>
            </div>
          </div>

          <div className="personnel-list">
            <h3>Installation Team Members</h3>
            <div className="personnel-table">
              <div className="table-header">
                <span>Name</span>
                <span>Role</span>
                <span>Projects</span>
                <span>Username</span>
              </div>
              {console.log(manpowerStats)}
              {manpowerStats.personnelDetails?.map(person => (
                <div key={person.id} className="table-row">
                  <span className="person-name">
                    <BadgeIcon className="person-icon" />
                    {person.name}
                  </span>
                  <span>{getJobBadge(person.job)}</span>
                  <span className="project-count">{person.projectCount}</span>
                  <span className="username">@{person.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Technicians Tab */
        <div className="technicians-tally">
          <div className="tally-header">
            <h2>Specialized Technicians</h2>
            <p>Overview of specialized technical roles across all projects</p>
          </div>

          <div className="technicians-stats">
            <div className="technician-stat-card">
              <SettingsIcon className="technician-stat-icon tnc" />
              <div className="technician-stat-content">
                <span className="technician-stat-number">{manpowerStats.technicians?.tnc?.assigned || 0}</span>
                <span className="technician-stat-label">TNC Technicians</span>
              </div>
            </div>
            <div className="technician-stat-card">
              <BuildIcon className="technician-stat-icon qaqc" />
              <div className="technician-stat-content">
                <span className="technician-stat-number">{manpowerStats.technicians?.qaqc?.assigned || 0}</span>
                <span className="technician-stat-label">QA/QC Technicians</span>
              </div>
            </div>
            <div className="technician-stat-card">
              <BuildCircleIcon className="technician-stat-icon pms" />
              <div className="technician-stat-content">
                <span className="technician-stat-number">{manpowerStats.technicians?.pms?.assigned || 0}</span>
                <span className="technician-stat-label">PMS Technicians</span>
              </div>
            </div>
          </div>

          <div className="technicians-list">
            <h3>Assigned Specialized Technicians</h3>
            <div className="technicians-table">
              <div className="table-header">
                <span>Project</span>
                <span>Client</span>
                <span>TNC Tech</span>
                <span>QA/QC Tech</span>
                <span>PMS Tech</span>
              </div>
              {allTeams.map(project => (
                <div key={project.project_id} className="table-row">
                  <span className="project-name">{project.lift_name}</span>
                  <span className="client-name">{project.client}</span>
                  <span className="technician-name">
                    {project.technicians.tnc_tech ? project.technicians.tnc_tech.fullname : '-'}
                  </span>
                  <span className="technician-name">
                    {project.technicians.qaqc_tech ? project.technicians.qaqc_tech.fullname : '-'}
                  </span>
                  <span className="technician-name">
                    {project.technicians.pms_tech ? project.technicians.pms_tech.fullname : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsDashboard;