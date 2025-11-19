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
  PersonOff as PersonOffIcon,
  AccountTree as AccountTreeIcon,
  CorporateFare as CorporateFareIcon
} from '@mui/icons-material';
import { useStoreState } from 'easy-peasy';

const TeamsDashboard = () => {
  const { allTeams, employees } = useStoreState(state => state);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('manpower');
  const [branchFilter, setBranchFilter] = useState('all');
  
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

  // Get branch badge
  const getBranchBadge = (branch) => {
    const branchConfig = {
      'Pasig': { class: 'branch-pasig', label: 'Pasig' },
      'Davao': { class: 'branch-davao', label: 'Davao' },
      'Cebu': { class: 'branch-cebu', label: 'Cebu' },
      'Manila': { class: 'branch-manila', label: 'Manila' }
    };
    
    const config = branchConfig[branch] || { class: 'branch-default', label: branch };
    return <span className={`branch-badge ${config.class}`}>{config.label}</span>;
  };

  // Helper function to get foreman name from ID
  const getForemanName = (foremanId) => {
    if (!foremanId) return 'Not assigned';
    const foreman = employees.find(emp => emp.employee_id === foremanId);
    return foreman ? `${foreman.first_name} ${foreman.last_name}` : 'Unknown foreman';
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

  // Calculate comprehensive manpower statistics with branch information
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

    // Categorize all employees
    const allForemen = employees.filter(emp => emp.job === 'Foreman');
    const allSkilledInstallers = employees.filter(emp => emp.job === 'Skilled Installer');
    const allInstallers = employees.filter(emp => emp.job === 'Installer');
    const allProjectEngineers = employees.filter(emp => emp.job === 'Project Engineer');
    const allTechnicians = {
      tnc: employees.filter(emp => emp.job === 'Test and Commission'),
      qaqc: employees.filter(emp => emp.job === 'QA/QC')
    };

    // Get all unique branches
    const allBranches = [...new Set(employees.map(emp => emp.branch).filter(Boolean))];

    // Calculate branch-wise statistics
    const branchStats = {};
    allBranches.forEach(branch => {
      const branchEmployees = employees.filter(emp => emp.branch === branch);
      const branchForemen = branchEmployees.filter(emp => emp.job === 'Foreman');
      const branchSkilledInstallers = branchEmployees.filter(emp => emp.job === 'Skilled Installer');
      const branchInstallers = branchEmployees.filter(emp => emp.job === 'Installer');
      const branchProjectEngineers = branchEmployees.filter(emp => emp.job === 'Project Engineer');
      
      branchStats[branch] = {
        total: branchEmployees.length,
        foremen: branchForemen.length,
        skilledInstallers: branchSkilledInstallers.length,
        installers: branchInstallers.length,
        projectEngineers: branchProjectEngineers.length,
        assigned: {
          foremen: branchForemen.filter(f => assignedForemen.has(f.employee_id)).length,
          skilledInstallers: branchSkilledInstallers.filter(si => assignedSkilledInstallers.has(si.employee_id)).length,
          installers: branchInstallers.filter(i => assignedInstallers.has(i.employee_id)).length,
          projectEngineers: branchProjectEngineers.filter(pe => assignedProjectEngineers.has(pe.employee_id)).length,
        }
      };
    });

    // Get personnel details with branch information
    const personnelDetails = [
      ...allForemen.map(f => ({
        ...f,
        job: 'Foreman',
        projectCount: allTeams.filter(p => p.foreman?.id === f.employee_id).length,
        branch: f.branch
      })),
      ...allSkilledInstallers.map(si => ({
        ...si,
        job: 'Skilled Installer',
        projectCount: allTeams.filter(p => p.team.some(m => m.id === si.employee_id)).length,
        prevForemanName: getForemanName(si.prev_foreman),
        branch: si.branch
      })),
      ...allInstallers.map(i => ({
        ...i,
        job: 'Installer',
        projectCount: allTeams.filter(p => p.team.some(m => m.id === i.employee_id)).length,
        prevForemanName: getForemanName(i.prev_foreman),
        branch: i.branch
      })),
      ...allProjectEngineers.map(pe => ({
        ...pe,
        job: 'Project Engineer',
        projectCount: allTeams.filter(p => p.project_engineer?.id === pe.employee_id).length,
        branch: pe.branch
      }))
    ];

    return {
      // Totals
      totalEmployees: employees.filter(e => 
        e.job !== 'Project Manager' && 
        e.job !== 'Admin' && 
        e.job !== 'QAQC Coordinator' && 
        e.job !== 'TNC Coordinator' && 
        e.job !== 'PMS Coordinator'
      ).length,
      totalAssigned: assignedPersonnel.size,
      totalProjects: allTeams.length,
      personnelDetails,
      branchStats,
      allBranches,
      
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
        assignedList: allSkilledInstallers.map(si => ({
          ...si,
          prevForemanName: getForemanName(si.prev_foreman)
        })).filter(si => assignedSkilledInstallers.has(si.employee_id)),
        availableList: allSkilledInstallers.map(si => ({
          ...si,
          prevForemanName: getForemanName(si.prev_foreman)
        })).filter(si => !assignedSkilledInstallers.has(si.employee_id))
      },
      
      // Installers
      installers: {
        total: allInstallers.length,
        assigned: assignedInstallers.size,
        available: allInstallers.length - assignedInstallers.size,
        assignedList: allInstallers.map(i => ({
          ...i,
          prevForemanName: getForemanName(i.prev_foreman)
        })).filter(i => assignedInstallers.has(i.employee_id)),
        availableList: allInstallers.map(i => ({
          ...i,
          prevForemanName: getForemanName(i.prev_foreman)
        })).filter(i => !assignedInstallers.has(i.employee_id))
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

  // Filter projects based on status and branch
  const filteredProjects = allTeams ? allTeams.filter(project => {
    if (statusFilter === 'all' && branchFilter === 'all') return true;
    
    let statusMatch = true;
    let branchMatch = true;
    
    if (statusFilter !== 'all') {
      statusMatch = project.status === statusFilter;
    }
    
    if (branchFilter !== 'all') {
      // Check if any team member is from the selected branch
      const hasBranchMember = 
        (project.project_engineer?.branch === branchFilter) ||
        (project.foreman?.branch === branchFilter) ||
        project.team.some(member => member.branch === branchFilter) ||
        (project.technicians.tnc_tech?.branch === branchFilter) ||
        (project.technicians.qaqc_tech?.branch === branchFilter) ||
        (project.technicians.pms_tech?.branch === branchFilter);
      
      branchMatch = hasBranchMember;
    }
    
    return statusMatch && branchMatch;
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
          className={`tab-btn ${activeTab === 'branches' ? 'active' : ''}`}
          onClick={() => setActiveTab('branches')}
        >
          <CorporateFareIcon className="tab-icon" />
          Branch Overview
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
                          <div className="personnel-branch">
                            {getBranchBadge(foreman.branch)}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(foreman.branch)}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(installer.branch)}
                          </div>
                          <div className="prev-foreman-info">
                            Previous Foreman: {installer.prevForemanName}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(installer.branch)}
                          </div>
                          <div className="prev-foreman-info">
                            Previous Foreman: {installer.prevForemanName}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(installer.branch)}
                          </div>
                          <div className="prev-foreman-info">
                            Previous Foreman: {installer.prevForemanName}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(installer.branch)}
                          </div>
                          <div className="prev-foreman-info">
                            Previous Foreman: {installer.prevForemanName}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(engineer.branch)}
                          </div>
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
                          <div className="personnel-branch">
                            {getBranchBadge(engineer.branch)}
                          </div>
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

              <select 
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="branch-filter"
              >
                <option value="all">All Branches</option>
                {manpowerStats.allBranches?.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
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
                                  {project.project_engineer.branch && (
                                    <div className="personnel-branch">
                                      {getBranchBadge(project.project_engineer.branch)}
                                    </div>
                                  )}
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
                                  {project.foreman.branch && (
                                    <div className="personnel-branch">
                                      {getBranchBadge(project.foreman.branch)}
                                    </div>
                                  )}
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
                                  {project.technicians.tnc_tech.branch && (
                                    <div className="personnel-branch">
                                      {getBranchBadge(project.technicians.tnc_tech.branch)}
                                    </div>
                                  )}
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
                                  {project.technicians.qaqc_tech.branch && (
                                    <div className="personnel-branch">
                                      {getBranchBadge(project.technicians.qaqc_tech.branch)}
                                    </div>
                                  )}
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
                                  {project.technicians.pms_tech.branch && (
                                    <div className="personnel-branch">
                                      {getBranchBadge(project.technicians.pms_tech.branch)}
                                    </div>
                                  )}
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
                                      {member.branch && (
                                        <div className="personnel-branch">
                                          {getBranchBadge(member.branch)}
                                        </div>
                                      )}
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
                                      {member.branch && (
                                        <div className="personnel-branch">
                                          {getBranchBadge(member.branch)}
                                        </div>
                                      )}
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
                <span>Branch</span>
                <span>Previous Foreman</span>
                <span>Projects</span>
                <span>Username</span>
              </div>
              {manpowerStats.personnelDetails?.map(person => (
                <div key={person.employee_id} className="table-row">
                  <span className="person-name">
                    <BadgeIcon className="person-icon" />
                    {person.first_name} {person.last_name}
                  </span>
                  <span>{getJobBadge(person.job)}</span>
                  <span>{getBranchBadge(person.branch)}</span>
                  <span className="prev-foreman">
                    {(person.job === 'Skilled Installer' || person.job === 'Installer') 
                      ? person.prevForemanName 
                      : '-'}
                  </span>
                  <span className="project-count">{person.projectCount}</span>
                  <span className="username">@{person.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'branches' ? (
        /* Branch Overview Tab */
        <div className="branch-overview">
          <div className="tally-header">
            <h2>Branch Overview</h2>
            <p>Personnel distribution and allocation across branches</p>
          </div>

          <div className="branch-stats-grid">
            {manpowerStats.allBranches?.map(branch => (
              <div key={branch} className="branch-stat-card">
                <div className="branch-header">
                  <LocationIcon className="branch-icon" />
                  <h3>{branch}</h3>
                </div>
                <div className="branch-content">
                  <div className="branch-total">
                    <span className="branch-total-number">{manpowerStats.branchStats?.[branch]?.total || 0}</span>
                    <span className="branch-total-label">Total Personnel</span>
                  </div>
                  
                  <div className="branch-breakdown">
                    <div className="branch-role">
                      <SupervisorAccountIcon className="role-icon foreman" />
                      <div className="role-info">
                        <span className="role-count">
                          {manpowerStats.branchStats?.[branch]?.assigned.foremen || 0}
                          <span className="role-total">/{manpowerStats.branchStats?.[branch]?.foremen || 0}</span>
                        </span>
                        <span className="role-label">Foremen</span>
                      </div>
                    </div>
                    
                    <div className="branch-role">
                      <BuildIcon className="role-icon skilled" />
                      <div className="role-info">
                        <span className="role-count">
                          {manpowerStats.branchStats?.[branch]?.assigned.skilledInstallers || 0}
                          <span className="role-total">/{manpowerStats.branchStats?.[branch]?.skilledInstallers || 0}</span>
                        </span>
                        <span className="role-label">Skilled Installers</span>
                      </div>
                    </div>
                    
                    <div className="branch-role">
                      <ConstructionIcon className="role-icon installer" />
                      <div className="role-info">
                        <span className="role-count">
                          {manpowerStats.branchStats?.[branch]?.assigned.installers || 0}
                          <span className="role-total">/{manpowerStats.branchStats?.[branch]?.installers || 0}</span>
                        </span>
                        <span className="role-label">Installers</span>
                      </div>
                    </div>
                    
                    <div className="branch-role">
                      <EngineeringIcon className="role-icon engineer" />
                      <div className="role-info">
                        <span className="role-count">
                          {manpowerStats.branchStats?.[branch]?.assigned.projectEngineers || 0}
                          <span className="role-total">/{manpowerStats.branchStats?.[branch]?.projectEngineers || 0}</span>
                        </span>
                        <span className="role-label">Project Engineers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Branch Personnel Details */}
          <div className="branch-personnel-details">
            <h3>Personnel by Branch</h3>
            {manpowerStats.allBranches?.map(branch => (
              <div key={branch} className="branch-personnel-section">
                <h4>
                  <LocationIcon className="branch-section-icon" />
                  {branch} Branch
                  <span className="personnel-count">
                    ({manpowerStats.branchStats?.[branch]?.total || 0} personnel)
                  </span>
                </h4>
                
                <div className="branch-personnel-grid">
                  {manpowerStats.personnelDetails
                    ?.filter(person => person.branch === branch)
                    .map(person => (
                      <div key={person.employee_id} className="branch-personnel-item">
                        <div className="personnel-avatar">
                          {person.job === 'Foreman' && <SupervisorAccountIcon />}
                          {person.job === 'Skilled Installer' && <BuildIcon />}
                          {person.job === 'Installer' && <ConstructionIcon />}
                          {person.job === 'Project Engineer' && <EngineeringIcon />}
                        </div>
                        <div className="personnel-info">
                          <span className="personnel-name">{person.first_name} {person.last_name}</span>
                          <span className="personnel-username">@{person.username}</span>
                          <div className="personnel-meta">
                            <span className="project-count">{person.projectCount} projects</span>
                            {(person.job === 'Skilled Installer' || person.job === 'Installer') && (
                              <span className="prev-foreman">Prev: {person.prevForemanName}</span>
                            )}
                          </div>
                        </div>
                        {getJobBadge(person.job)}
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
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
              <BuildIcon className="technician-stat-icon qaqc" />
              <div className="technician-stat-content">
                <span className="technician-stat-number">{manpowerStats.technicians?.pms?.assigned || 0}</span>
                <span className="technician-stat-label">PMS Technicians (For Joint Inspection)</span>
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
                <span>PMS TECH</span>
              </div>
              {allTeams.map(project => (
                <div key={project.project_id} className="table-row">
                  <span className="project-name">{project.lift_name}</span>
                  <span className="client-name">{project.client}</span>
                  <span className="technician-name">
                    {project.technicians.tnc_tech ? (
                      <div className="technician-with-branch">
                        <span>{project.technicians.tnc_tech.fullname}</span>
                        {project.technicians.tnc_tech.branch && (
                          <div className="technician-branch">
                            {getBranchBadge(project.technicians.tnc_tech.branch)}
                          </div>
                        )}
                      </div>
                    ) : '-'}
                  </span>
                  <span className="technician-name">
                    {project.technicians.qaqc_tech ? (
                      <div className="technician-with-branch">
                        <span>{project.technicians.qaqc_tech.fullname}</span>
                        {project.technicians.qaqc_tech.branch && (
                          <div className="technician-branch">
                            {getBranchBadge(project.technicians.qaqc_tech.branch)}
                          </div>
                        )}
                      </div>
                    ) : '-'}
                  </span>
                  <span className="technician-name">
                    {project.technicians.pms_tech ? (
                      <div className="technician-with-branch">
                        <span>{project.technicians.pms_tech.fullname}</span>
                        {project.technicians.pms_tech.branch && (
                          <div className="technician-branch">
                            {getBranchBadge(project.technicians.pms_tech.branch)}
                          </div>
                        )}
                      </div>
                    ) : '-'}
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