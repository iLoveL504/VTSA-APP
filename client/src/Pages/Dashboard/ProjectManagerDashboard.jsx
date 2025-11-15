import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ProjectManagerDashboard.css'
import 'ldrs/react/Grid.css'
import { Grid } from 'ldrs/react'
import { useStoreState } from 'easy-peasy';
// MUI icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import BoltIcon from '@mui/icons-material/Bolt';
import WarningIcon from '@mui/icons-material/Warning';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import AddIcon from '@mui/icons-material/Add';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// Replacements for react-icons/md
import ErrorIcon from '@mui/icons-material/Error';
import UpdateIcon from '@mui/icons-material/Update';
import InboxIcon from '@mui/icons-material/Inbox';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import BuildIcon from '@mui/icons-material/Build';

import { 
  MdError,
  MdUpdate,
  MdInbox,
  MdPauseCircleFilled,
  MdBuildCircle,
  MdBuild
} from "react-icons/md";



const ProjectManagerDashboard = ({ onNewProject, clearProjectData, clearProjectTasks }) => {
  const navigate = useNavigate();
  // Project Manager Dashboard Data - Calculated from all projects
  const {projects, isLoading} = useStoreState(state => state)
  const projectManagerData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return {
      // Project Statistics
      totalProjects: projects.length,
      activeProjects: projects.filter(p => 
        p.status && !['Completed', 'Handover Done'].includes(p.status)
      ).length,
      completedProjects: projects.filter(p => 
        p.status === 'Completed' || p.handover_done
      ).length,
      projectsBehindSchedule: projects.filter(p => p.is_behind).length,
      
      // New Categories
      criticalProjects: projects.filter(p => {
        if (!p.project_end_date || p.status === 'Completed') return false;
        const daysUntilDue = Math.ceil((new Date(p.project_end_date) - now) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 14 && p.progress < 90;
      }),
      
      laggingProjects: projects.filter(p => p.is_behind === 1 && p.status && !['Completed', 'Handover Done'].includes(p.status) && !p.on_hold),
      
      pendingProjects: projects.filter(p => p.on_hold === 1 || p.request_hold === 1),
      incomingProjects: projects.filter(p => p.status === 'Incoming' && !p.handover_done),
      // TNC Projects for this month and next month
      tncProjectsThisMonth: projects.filter(p => {
        if (!p.tnc_start_date) return false;
        const tncDate = new Date(p.project_end_date);
        return tncDate.getMonth() === currentMonth && tncDate.getFullYear() === currentYear;
      }),
      
      tncProjectsNextMonth: projects.filter(p => {
        if (!p.tnc_start_date) return false;
        const tncDate = new Date(p.project_end_date);
        return tncDate.getMonth() === nextMonth && tncDate.getFullYear() === nextMonthYear;
      }),
      
      // Financial Overview
      totalContractValue: projects.reduce((sum, p) => 
        sum + (parseFloat(p.contract_amount) || 0), 0
      ),
      averageProgress: projects.length > 0 
        ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
        : 0,
      
      // Upcoming Milestones
      upcomingMilestones: projects
        .filter(p => p.project_end_date && new Date(p.project_end_date) > now)
        .sort((a, b) => new Date(a.project_end_date) - new Date(b.project_end_date))
        .slice(0, 5)
        .map(project => ({
          id: project.id,
          name: project.lift_name,
          type: 'Project Completion',
          date: project.project_end_date,
          client: project.client,
          progress: project.progress
        })),
      
      // Status Distribution
      statusDistribution: {
        'Structural/Manufacturing': projects.filter(p => p.status === 'Structural/Manufacturing').length,
        'Installation': projects.filter(p => p.status === 'Installation').length,
        'Test and Comm': projects.filter(p => p.status === 'Test and Comm').length,
        'Preliminaries': projects.filter(p => p.status === 'Preliminaries').length,
        'Planning': projects.filter(p => p.status === 'Planning').length
      },
      
      // Project Engineer Workload
      engineerWorkload: Object.entries(
        projects.reduce((acc, project) => {
          const engineer = project.pe_fullname || 'Unassigned';
          acc[engineer] = (acc[engineer] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, count]) => ({ name, count }))
    };
  }, [projects]);

  // Recent Activities based on project updates
  const recentActivities = useMemo(() => {
    const activities = [];
    
    projects.forEach(project => {
      if (project.updated_at) {
        activities.push({
          id: project.id,
          project: project.lift_name,
          action: `Project updated - ${project.status}`,
          time: 'Recently',
          type: 'update'
        });
      }
      
      if (project.progress > 0) {
        activities.push({
          id: project.id + '-progress',
          project: project.lift_name,
          action: `Progress reached ${project.progress}%`,
          time: 'Recently',
          type: 'progress'
        });
      }
    });
    
    return activities.slice(0, 5);
  }, [projects]);

  const handleProjectClick = (projectId) => {
    clearProjectTasks()
    clearProjectData()
    navigate(`/projects/${projectId}`);
  };

  const handleViewAllProjects = () => {
    navigate('/projects');
  };



  // Helper function to format month name
  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // if(projectsIsLoading) {
  //       return (

  //       )    
  // }

  return (
    <div className="Content ProjectManagerDashboard">
      <div className="dashboard-header">
        <h1>Project Manager Dashboard</h1>
        <p>Complete overview of all project activities and performance metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="stats-grid">
<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(49, 90, 149, 0.1)'}}>
    <AssessmentIcon style={{color: '#315a95'}} /> {/* total projects */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.totalProjects}</h3>
    <p>Total Projects</p>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
    <BoltIcon style={{color: '#28a745'}} /> {/* active */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.activeProjects}</h3>
    <p>Active Projects</p>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
    <ReportProblemIcon style={{color: '#dc3545'}} /> {/* critical */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.criticalProjects.length}</h3>
    <p>Critical</p>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(206, 155, 2, 0.1)'}}>
    <AutorenewIcon style={{color: '#e2b324ff'}} /> {/* lagging */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.laggingProjects.length}</h3>
    <p>Lagging</p>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(108, 117, 125, 0.1)'}}>
    <PauseCircleIcon style={{color: '#6c757d'}} /> {/* on hold */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.pendingProjects.length}</h3>
    <p>On Hold</p>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(81, 21, 165, 0.1)'}}>
    <InboxIcon style={{color: '#7862b4ff'}} /> {/* incoming */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.incomingProjects.length}</h3>
    <p>Incoming</p>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
    <CheckCircleIcon style={{color: '#17a2b8'}} /> {/* completed */}
  </div>
  <div className="stat-content">
    <h3>{projectManagerData.completedProjects}</h3>
    <p>Completed</p>
  </div>
</div>


      </div>

      <div className="dashboard-content">
        {/* Left Column - Project Overview */}
        <div className="main-content">
          {isLoading ? (
                  <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
          ) : (
            <>
              {projectManagerData.criticalProjects.length > 0 && (
                <div className="content-card critical-alert">
                  <div className="card-header">
                    <h3 style={{color: '#dc3545'}}>
  <MdError size={22} style={{marginRight: '6px'}} /> Critical Projects
</h3>

                    <span className="badge critical">{projectManagerData.criticalProjects.length} projects</span>
                  </div>
                  <div className="projects-list">
                    {projectManagerData.criticalProjects.map(project => (
                      <ProjectItem key={project.id} project={project} type="critical" onProjectClick={handleProjectClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* Lagging Projects */}
              {projectManagerData.laggingProjects.length > 0 && (
                <div className="content-card lagging-alert">
                  <div className="card-header">
                    <h3 style={{color: '#ffc107'}}>
  <MdUpdate size={22} style={{marginRight: '6px'}} /> Lagging Projects
</h3>

                    <span className="badge lagging">{projectManagerData.laggingProjects.length} projects</span>
                  </div>
                  <div className="projects-list">
                    {projectManagerData.laggingProjects.slice(0, 5).map(project => (
                      <ProjectItem key={project.id} project={project} type="lagging" onProjectClick={handleProjectClick} />
                    ))}
                  </div>
                </div>
              )}
              {/* Incoming Projects */}
            {projectManagerData.incomingProjects.length > 0 && (
              <div className="content-card incoming-alert">
                <div className="card-header">
                  <h3 style={{color: '#6f42c1'}}>
  <MdInbox size={22} style={{marginRight: '6px'}} /> Incoming Projects
</h3>

                  <span className="badge incoming">{projectManagerData.incomingProjects.length} projects</span>
                </div>
                <div className="projects-list">
                  {projectManagerData.incomingProjects.map(project => (
                    <ProjectItem key={project.id} project={project} type="incoming" onProjectClick={handleProjectClick} />
                  ))}
                </div>
              </div>
            )}

              {/* Pending Projects (On Hold) */}
              {projectManagerData.pendingProjects.length > 0 && (
                <div className="content-card pending-alert">
                  <div className="card-header">
                    <h3 style={{color: '#6c757d'}}>
  <MdPauseCircleFilled size={22} style={{marginRight: '6px'}} /> Pending Projects
</h3>

                    <span className="badge pending">{projectManagerData.pendingProjects.length} projects</span>
                  </div>
                  <div className="projects-list">
                    {projectManagerData.pendingProjects.slice(0, 3).map(project => (
                      <ProjectItem key={project.id} project={project} type="pending" onProjectClick={handleProjectClick} />
                    ))}
                  </div>
                </div>
              )}
              {/* TNC Projects This Month */}
              {projectManagerData.tncProjectsThisMonth.length > 0 && (
                <div className="content-card tnc-alert">
                  <div className="card-header">
                    <h3 style={{color: '#17a2b8'}}>
                      <MdBuildCircle size={22} style={{marginRight: '6px'}} />Upcoming Hand overs This Month ({getMonthName(new Date().toISOString())})
                    </h3>
                    <span className="badge tnc">{projectManagerData.tncProjectsThisMonth.length} projects</span>
                  </div>
                  <div className="projects-list">
                    {projectManagerData.tncProjectsThisMonth.map(project => (
                      <ProjectItem key={project.id} project={project} type="tnc" onProjectClick={handleProjectClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* TNC Projects Next Month */}
              {projectManagerData.tncProjectsNextMonth.length > 0 && (
                <div className="content-card tnc-next-alert">
                  <div className="card-header">
                    <h3 style={{color: '#20c997'}}>
                      <MdBuild size={22} style={{marginRight: '6px'}} /> Upcoming Next Month ({getMonthName(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString())})
                      </h3>
                    <span className="badge tnc-next">{projectManagerData.tncProjectsNextMonth.length} projects</span>
                  </div>
                  <div className="projects-list">
                    {projectManagerData.tncProjectsNextMonth.map(project => (
                      <ProjectItem key={project.id} project={project} type="tnc-next" onProjectClick={handleProjectClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Projects Overview */}
              <div className="content-card">
                <div className="card-header">
                  <h3>All Projects Overview</h3>
                  <button className="view-all-btn" onClick={handleViewAllProjects}>
                    View All Projects
                  </button>
                </div>
                <div className="projects-list">
                  {projects.slice(0, 15).map(project => (
                    <ProjectItem key={project.id} project={project} type="normal" onProjectClick={handleProjectClick} />
                  ))}
                </div>
              </div>

              {/* Project Status Distribution */}
      
            </>            
          )}

          {/* Critical Projects Alert */}

        </div>

        {/* Right Column - Analytics & Quick Actions */}
        <div className="sidebar">
          {/* Upcoming Milestones */}
          <div className="content-card">
            <div className="card-header">
              <h3>Upcoming Milestones</h3>
            </div>
            <div className="milestones-list">
              {projectManagerData.upcomingMilestones.length > 0 ? (
                projectManagerData.upcomingMilestones.map(milestone => (
                  <div key={milestone.id} className="milestone-item">
                    <div className="milestone-date">
                      <span className="date-day">
                        {new Date(milestone.date).getDate()}
                      </span>
                      <span className="date-month">
                        {new Date(milestone.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div className="milestone-details">
                      <h4>{milestone.name}</h4>
                      <p>{milestone.client}</p>
                      <span className="milestone-type">{milestone.type}</span>
                      <div className="progress-bar small">
                        <div 
                          className="progress-fill"
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-flag"></i>
                  <p>No upcoming milestones</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Engineer Workload */}
          <div className="content-card">
            <div className="card-header">
              <h3>Team Workload</h3>
            </div>
            <div className="workload-list">
              {projectManagerData.engineerWorkload.map(engineer => (
                <div key={engineer.name} className="workload-item">
                  <span className="engineer-name">{engineer.name}</span>
                  <div className="workload-bar-container">
                    <div 
                      className="workload-bar"
                      style={{ 
                        width: `${(engineer.count / Math.max(...projectManagerData.engineerWorkload.map(e => e.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="project-count">{engineer.count} projects</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={onNewProject}>
                <i className="fas fa-plus"></i>
                <span>New Project</span>
              </button>
              {/* <button className="quick-action-btn" onClick={handleViewGanttChart}>
                <i className="fas fa-chart-line"></i>
                <span>Gantt Chart</span>
              </button>
              <button className="quick-action-btn">
                <i className="fas fa-file-export"></i>
                <span>Export Reports</span>
              </button>
              <button className="quick-action-btn">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </button> */}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Activities</h3>
            </div>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p><strong>{activity.project}</strong> - {activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

                        <div className="content-card">
                <div className="card-header">
                  <h3>Project Status Distribution</h3>
                </div>
                <div className="status-distribution">
                  {Object.entries(projectManagerData.statusDistribution).map(([status, count]) => (
                    <div key={status} className="status-item">
                      <span className="status-name">{status}</span>
                      <div className="status-bar-container">
                        <div 
                          className="status-bar"
                          style={{ 
                            width: `${(count / projectManagerData.totalProjects) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="status-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>    
        </div>
      </div>
    </div>
  );
};

// Project Item Component for reusability
const ProjectItem = ({ project, type, onProjectClick }) => {
  const getDaysUntilTNC = () => {
    if (!project.tnc_start_date) return null;
    const tncDate = new Date(project.tnc_start_date);
    const now = new Date();
    const diffTime = tncDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'critical':
        return {
          background: '#fff5f5',
          borderColor: '#fecaca',
          borderLeft: '4px solid #dc3545'
        };
      case 'lagging':
        return {
          background: '#fffbf0',
          borderColor: '#ffeeba',
          borderLeft: '4px solid #ffc107'
        };
      case 'pending':
        return {
          background: '#f8f9fa',
          borderColor: '#e9ecef',
          borderLeft: '4px solid #6c757d'
        };
      case 'tnc':
        return {
          background: '#f0f9ff',
          borderColor: '#b3e0ff',
          borderLeft: '4px solid #17a2b8'
        };
      case 'tnc-next':
        return {
          background: '#f0fff4',
          borderColor: '#c6f6d5',
          borderLeft: '4px solid #20c997'
        };
      case 'incoming':
        return {
          background: '#f8f9fa',
          borderColor: '#e9ecef',
          borderLeft: '4px solid #6f42c1'
        };
      default:
        return {
          background: '#f8f9fa',
          borderColor: '#e9ecef'
        };
    }
  };

  return (
    <div className="project-item" style={getTypeStyles()}>
      <div className="project-info">
        <h4>{project.lift_name}</h4>
        <div className="project-meta">
          <span className={`status-badge ${type}`}>
            {type === 'critical' ? 'Critical' : 
             type === 'lagging' ? 'Lagging' :
             type === 'pending' ? 'On Hold' :
             type === 'tnc' ? 'TNC This Month' :
             type === 'tnc-next' ? 'TNC Next Month' : project.status}
          </span>
          <span className="project-id">#{project.id}</span>
          <span className="project-engineer">{project.pe_fullname || 'Unassigned'}</span>
        </div>
        <p className="project-client">{project.client}</p>
        
        {/* TNC Date Display for TNC projects */}
        {(type === 'tnc' || type === 'tnc-next') && project.tnc_start_date && (
          <div className="project-deadline">
            <i className="fas fa-calendar-check"></i>
            TNC Start: {new Date(project.tnc_start_date).toLocaleDateString()}
            {getDaysUntilTNC() > 0 && (
              <span className="days-remaining"> ({getDaysUntilTNC()} days)</span>
            )}
          </div>
        )}
        
        {/* Regular deadline display for other projects */}
        {!['tnc', 'tnc-next'].includes(type) && project.project_end_date && (
          <div className="project-deadline">
            <i className="fas fa-calendar"></i>
            Completion: {new Date(project.project_end_date).toLocaleDateString()}
            {type === 'critical' && (
              <span className="days-remaining">
                ({Math.ceil((new Date(project.project_end_date) - new Date()) / (1000 * 60 * 60 * 24))} days)
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="project-progress">
        <div className="progress-bar">
          <div 
            className={`progress-fill ${type}`}
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
        <span>{project.progress || 0}% Complete</span>
      </div>
      
      <div className="project-actions">
        <button 
          className="btn-primary"
          onClick={() => onProjectClick(project.id)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;