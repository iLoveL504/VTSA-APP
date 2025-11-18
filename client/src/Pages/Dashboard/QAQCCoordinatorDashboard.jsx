import React, { useState, useMemo } from 'react'
import { useStoreState } from 'easy-peasy'
import '../../css/QAQCCoordinatorDashboard.css'

// MUI Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const QaqcDashboard = () => {
  const projects = useStoreState(state => state.projects)
  const allTeams = useStoreState(state => state.allTeams)
  const qaqcTechs = useStoreState(state => state.qaqcTechs)

  const [activeTab, setActiveTab] = useState('scheduled')
  const [timeframe, setTimeframe] = useState('week') // week, month, all

  // Process projects with corrected QAQC information
  const qaqcProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return [];
    
    return projects.map(project => {
      // Find team information
      const teamInfo = allTeams?.find(team => team.project_id === project.id) || {};
      
      // Find assigned QAQC technician
      const assignedQaqcTech = qaqcTechs?.find(tech => tech.project_id === project.id);
      
      // Calculate upcoming QAQC milestones (these are project dates, not inspection dates)
      const upcomingMilestones = [];
      const now = new Date();
      
      if (project.template_setting_date) {
        const templateDate = new Date(project.template_setting_date);
        upcomingMilestones.push({
          type: 'Template Setting',
          date: templateDate,
          daysUntil: Math.ceil((templateDate - now) / (1000 * 60 * 60 * 24))
        });
      }
      
      if (project.prep_handover_date) {
        const handoverDate = new Date(project.prep_handover_date);
        upcomingMilestones.push({
          type: 'Handover Inspection',
          date: handoverDate,
          daysUntil: Math.ceil((handoverDate - now) / (1000 * 60 * 60 * 24))
        });
      }
      
      if (project.tnc_start_date) {
        const tncDate = new Date(project.tnc_start_date);
        upcomingMilestones.push({
          type: 'Pre-TNC Inspection',
          date: tncDate,
          daysUntil: Math.ceil((tncDate - now) / (1000 * 60 * 60 * 24))
        });
      }
      
      // Sort upcoming milestones
      upcomingMilestones.sort((a, b) => a.date - b.date);
      
      // Determine QAQC status based on CORRECTED understanding
      let qaqcStatus = 'needs-scheduling';
      let nextInspectionDate = null;
      
      if (project.qaqc_inspection_date) {
        // Inspection is SCHEDULED
        const inspectionDate = new Date(project.qaqc_inspection_date);
        const daysUntilInspection = Math.ceil((inspectionDate - now) / (1000 * 60 * 60 * 24));
        nextInspectionDate = {
          date: inspectionDate,
          daysUntil: daysUntilInspection
        };
        
        if (project.qaqc_ongoing) {
          qaqcStatus = 'in-progress'; // Inspection is happening now
        } else if (project.qaqc_is_assigned) {
          qaqcStatus = 'scheduled-assigned'; // Scheduled and tech assigned
        } else {
          qaqcStatus = 'scheduled-unassigned'; // Scheduled but no tech assigned
        }
      } else {
        // No inspection scheduled - check if we need one based on milestones
        const nextMilestone = upcomingMilestones.find(milestone => milestone.daysUntil <= 14);
        if (nextMilestone) {
          qaqcStatus = 'needs-scheduling'; // Upcoming milestone needs inspection
        } else {
          qaqcStatus = 'no-inspection-needed'; // No upcoming milestones
        }
      }
      
      return {
        ...project,
        teamInfo,
        assignedQaqcTech,
        upcomingMilestones,
        qaqcStatus,
        nextInspectionDate,
        nextMilestone: upcomingMilestones.length > 0 ? upcomingMilestones[0] : null
      };
    });
  }, [projects, allTeams, qaqcTechs]);

  // Filter projects based on active tab and timeframe
  const filteredProjects = useMemo(() => {
    const timeFilter = {
      week: 7,
      month: 30,
      all: Infinity
    }[timeframe];

    return qaqcProjects.filter(project => {
      if (activeTab === 'scheduled') {
        // Show projects with scheduled inspections within timeframe
        return project.nextInspectionDate && project.nextInspectionDate.daysUntil <= timeFilter;
      } else if (activeTab === 'needs-scheduling') {
        // Show projects that need inspections scheduled (upcoming milestones within 14 days)
        return project.qaqcStatus === 'needs-scheduling';
      } else if (activeTab === 'in-progress') {
        // Show inspections currently happening
        return project.qaqcStatus === 'in-progress';
      } else if (activeTab === 'unassigned') {
        // Show scheduled inspections without assigned technicians
        return project.qaqcStatus === 'scheduled-unassigned';
      }
      return true;
    }).sort((a, b) => {
      if (activeTab === 'scheduled') {
        return (a.nextInspectionDate?.daysUntil || Infinity) - (b.nextInspectionDate?.daysUntil || Infinity);
      } else if (activeTab === 'needs-scheduling') {
        return (a.nextMilestone?.daysUntil || Infinity) - (b.nextMilestone?.daysUntil || Infinity);
      }
      return new Date(b.project_end_date) - new Date(a.project_end_date);
    });
  }, [qaqcProjects, activeTab, timeframe]);

  // Technician workload
  const technicianWorkload = useMemo(() => {
    if (!qaqcTechs) return [];
    
    const workload = qaqcTechs.map(tech => {
      const assignedProjects = qaqcProjects.filter(project => 
        project.assignedQaqcTech?.employee_id === tech.employee_id
      );
      
      const scheduledInspections = assignedProjects.filter(project => 
        project.nextInspectionDate
      );
      
      const upcomingInspections = scheduledInspections.filter(project => 
        project.nextInspectionDate.daysUntil <= 7
      );
      
      return {
        ...tech,
        assignedProjects: assignedProjects.length,
        scheduledInspections: scheduledInspections.length,
        upcomingInspections: upcomingInspections.length,
        status: assignedProjects.length > 0 ? 'assigned' : 'available'
      };
    });
    
    return workload.sort((a, b) => b.scheduledInspections - a.scheduledInspections);
  }, [qaqcTechs, qaqcProjects]);

  // Dashboard summary statistics
  const dashboardSummary = useMemo(() => {
    
    const scheduledThisWeek = qaqcProjects.filter(project => 
      project.nextInspectionDate && project.nextInspectionDate.daysUntil <= 7
    ).length;
    
    const needsScheduling = qaqcProjects.filter(project => 
      project.qaqcStatus === 'needs-scheduling'
    ).length;
    
    const inProgress = qaqcProjects.filter(project => 
      project.qaqcStatus === 'in-progress'
    ).length;
    
    const unassigned = qaqcProjects.filter(project => 
      project.qaqcStatus === 'scheduled-unassigned'
    ).length;
    
    return { scheduledThisWeek, needsScheduling, inProgress, unassigned };
  }, [qaqcProjects]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const statusClasses = {
      'scheduled-assigned': 'status-scheduled-assigned',
      'scheduled-unassigned': 'status-scheduled-unassigned',
      'in-progress': 'status-in-progress',
      'needs-scheduling': 'status-needs-scheduling',
      'no-inspection-needed': 'status-no-inspection-needed'
    };
    return statusClasses[status] || 'status-no-inspection-needed';
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusTexts = {
      'scheduled-assigned': 'Scheduled ✓',
      'scheduled-unassigned': 'Scheduled (No Tech)',
      'in-progress': 'In Progress',
      'needs-scheduling': 'Needs Scheduling',
      'no-inspection-needed': 'No Inspection Needed'
    };
    return statusTexts[status] || 'No Inspection Needed';
  };

  // Get priority class for dates
  const getPriorityClass = (daysUntil) => {
    if (daysUntil <= 3) return 'priority-critical';
    if (daysUntil <= 7) return 'priority-high';
    if (daysUntil <= 14) return 'priority-medium';
    return 'priority-low';
  };

  // Main Stats Cards
  const renderStatsCards = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
          <ScheduleIcon style={{color: '#17a2b8'}} />
        </div>
        <div className="stat-content">
          <h3>{dashboardSummary.scheduledThisWeek}</h3>
          <p>Scheduled This Week</p>
          <span className="stat-trend">Next 7 days</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
          <WarningIcon style={{color: '#dc3545'}} />
        </div>
        <div className="stat-content">
          <h3>{dashboardSummary.needsScheduling}</h3>
          <p>Need Scheduling</p>
          <span className="stat-trend">Urgent attention</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
          <EngineeringIcon style={{color: '#ffc107'}} />
        </div>
        <div className="stat-content">
          <h3>{dashboardSummary.inProgress}</h3>
          <p>In Progress</p>
          <span className="stat-trend">Active inspections</span>
        </div>
      </div>

    </div>
  );

  // Projects List
  const renderProjectsList = () => (
    <div className="projects-section">
      <div className="section-header">
        <h3>
          {activeTab === 'scheduled' && 'Scheduled Inspections'}
          {activeTab === 'needs-scheduling' && 'Needs Scheduling'}
          {activeTab === 'in-progress' && 'Inspections in Progress'}
          {activeTab === 'unassigned' && 'Unassigned Inspections'}
        </h3>
        <div className="timeframe-controls">
          <label>Timeframe:</label>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="control-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h4>{project.lift_name}</h4>
                <span className={`status-badge ${getStatusClass(project.qaqcStatus)}`}>
                  {getStatusText(project.qaqcStatus)}
                </span>
              </div>
              
              <div className="project-details">
                <div className="detail-item">
                  <span className="detail-label">Client:</span>
                  <span className="detail-value">{project.client}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{project.city_municipality}, {project.province}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Project Engineer:</span>
                  <span className="detail-value">{project.pe_fullname}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Project Status:</span>
                  <span className="detail-value">{project.status}</span>
                </div>
              </div>

              {/* Next Scheduled Inspection */}
              {project.nextInspectionDate && (
                <div className="scheduled-inspection">
                  <div className="inspection-header">
                    <CalendarMonthIcon style={{ fontSize: '16px', marginRight: '8px' }} />
                    <span>Next Inspection</span>
                  </div>
                  <div className={`date-item ${getPriorityClass(project.nextInspectionDate.daysUntil)}`}>
                    <span className="date-type">QAQC Inspection</span>
                    <div className="date-info">
                      <span className="date-value">{formatDate(project.nextInspectionDate.date)}</span>
                      <span className="days-remaining">
                        {project.nextInspectionDate.daysUntil === 0 ? 'Today' : 
                         project.nextInspectionDate.daysUntil === 1 ? 'Tomorrow' : 
                         `in ${project.nextInspectionDate.daysUntil} days`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Technician */}
              {project.assignedQaqcTech && (
                <div className="assigned-tech">
                  <div className="tech-info">
                    <EngineeringIcon style={{ fontSize: '16px', marginRight: '8px' }} />
                    <span>Assigned Technician: {project.assignedQaqcTech.full_name}</span>
                  </div>
                </div>
              )}

              {/* Upcoming Project Milestones (for reference) */}
              {project.upcomingMilestones.length > 0 && activeTab === 'needs-scheduling' && (
                <div className="upcoming-milestones">
                  <div className="milestones-header">
                    <WarningIcon style={{ fontSize: '16px', marginRight: '8px' }} />
                    <span>Upcoming Milestones Requiring Inspection</span>
                  </div>
                  {project.upcomingMilestones.slice(0, 2).map((milestone, index) => (
                    <div key={index} className="milestone-item">
                      <span className="milestone-type">{milestone.type}</span>
                      <div className="milestone-info">
                        <span className="milestone-date">{formatDate(milestone.date)}</span>
                        <span className="milestone-days">in {milestone.daysUntil} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Project Progress */}
              <div className="project-progress">
                <div className="progress-header">
                  <span>Project Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <AssignmentIcon style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '16px' }} />
            <p>No projects found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );

  // Technicians Panel
  const renderTechniciansPanel = () => (
    <div className="technicians-section">
      <div className="section-header">
        <h3>QAQC Technicians</h3>
        <span className="section-badge">{technicianWorkload.length} technicians</span>
      </div>

      <div className="technicians-grid">
        {technicianWorkload.map(tech => (
          <div key={tech.employee_id} className="technician-card">
            <div className="tech-header">
              <h4>{tech.full_name}</h4>
              <span className={`tech-status ${tech.status}`}>
                {tech.status === 'available' ? 'Available' : 'Assigned'}
              </span>
            </div>
            
            <div className="tech-stats">
              <div className="tech-stat">
                <span className="stat-label">Total Assignments</span>
                <span className="stat-value">{tech.assignedProjects}</span>
              </div>
              <div className="tech-stat">
                <span className="stat-label">Scheduled Inspections</span>
                <span className="stat-value">{tech.scheduledInspections}</span>
              </div>
              <div className="tech-stat">
                <span className="stat-label">This Week</span>
                <span className="stat-value">{tech.upcomingInspections}</span>
              </div>
            </div>

            {tech.project_id && (
              <div className="current-assignment">
                <span className="assignment-label">Current Project:</span>
                <span className="assignment-project">{tech.lift_name}</span>
                {tech.qaqc_inspection_date && (
                  <span className="inspection-date">
                    Scheduled: {formatDate(tech.qaqc_inspection_date)}
                  </span>
                )}
              </div>
            )}

            {tech.status === 'available' && tech.scheduledInspections === 0 && (
              <div className="availability-indicator">
                <CheckCircleIcon style={{ fontSize: '16px', color: '#28a745', marginRight: '8px' }} />
                <span>Available for new assignments</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='Content QaqcDashboard'>
      <div className="dashboard-header">
        <h1>QAQC Coordinator Dashboard</h1>
        <p>Manage inspection scheduling, technician assignments, and project quality milestones</p>
      </div>

      {/* Stats Overview */}
      {renderStatsCards()}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            <ScheduleIcon style={{marginRight: '8px'}} />
            Scheduled
          </button>
          <button 
            className={`tab-button ${activeTab === 'needs-scheduling' ? 'active' : ''}`}
            onClick={() => setActiveTab('needs-scheduling')}
          >
            <WarningIcon style={{marginRight: '8px'}} />
            Needs Scheduling
          </button>
          <button 
            className={`tab-button ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            <EngineeringIcon style={{marginRight: '8px'}} />
            In Progress
          </button>
          <button 
            className={`tab-button ${activeTab === 'unassigned' ? 'active' : ''}`}
            onClick={() => setActiveTab('unassigned')}
          >
            <AssignmentIcon style={{marginRight: '8px'}} />
            Unassigned
          </button>
        </div>

        <div className="dashboard-content">
          <div className="main-content">
            {renderProjectsList()}
          </div>
          
          <div className="sidebar">
            {renderTechniciansPanel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QaqcDashboard;