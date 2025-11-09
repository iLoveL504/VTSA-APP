import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ProjectEngineerDashboard.css';
import {useStoreState} from 'easy-peasy'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import 'ldrs/react/Grid.css'

const ProjectEngineerDashboard = ({userId, clearProjectData, clearProjectTasks}) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const navigate = useNavigate();
  const {data: projects, loading: projectsIsLoading} = useAxiosFetch(`${backendURL}/api/projects`)
  const currentUser = useStoreState(state => state.user)

  // Filter projects assigned to the current project engineer
  const assignedProjects = useMemo(() => {
    if (!currentUser || !projects.length) return [];
    
    return projects.filter(project => 
      project.project_engineer_id === currentUser.id || 
      project.pe_fullname === currentUser.name ||
      project.project_engineer === currentUser.username
    );
  }, [projects, currentUser]);

  // Dashboard data calculations
  const dashboardData = useMemo(() => {
    const now = new Date();
    
    return {
      // Basic stats
      totalAssigned: assignedProjects.length,
      activeProjects: assignedProjects.filter(p => 
        p.status && !['Completed', 'Handover Done'].includes(p.status)
      ).length,
      completedProjects: assignedProjects.filter(p => 
        p.status === 'Completed' || p.handover_done
      ).length,
      
      // Installation specific metrics
      installationPhase: assignedProjects.filter(p => 
        p.status === 'Installation'
      ).length,
      structuralPhase: assignedProjects.filter(p => 
        p.status === 'Structural/Manufacturing'
      ).length,
      tncPhase: assignedProjects.filter(p => 
        p.status === 'Test and Comm'
      ).length,
      
      // Critical projects for this engineer
      criticalProjects: assignedProjects.filter(p => {
        if (!p.project_end_date || p.status === 'Completed') return false;
        const daysUntilDue = Math.ceil((new Date(p.project_end_date) - now) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && p.progress < 90;
      }),
      
      // Projects behind schedule
      behindSchedule: assignedProjects.filter(p => p.is_behind === 1),
      
      // Projects on hold
      onHoldProjects: assignedProjects.filter(p => p.on_hold === 1 || p.request_hold === 1),
      
      // Upcoming milestones for assigned projects
      upcomingMilestones: assignedProjects
        .filter(p => p.project_end_date && new Date(p.project_end_date) > now)
        .sort((a, b) => new Date(a.project_end_date) - new Date(b.project_end_date))
        .slice(0, 3)
        .map(project => ({
          id: project.id,
          name: project.lift_name,
          type: 'Project Completion',
          date: project.project_end_date,
          client: project.client,
          progress: project.progress
        })),
      
      // Installation tasks needing attention
      pendingTasks: assignedProjects
        .filter(p => p.current_task && !p.on_hold)
        .map(project => ({
          id: project.id,
          name: project.lift_name,
          currentTask: project.current_task,
          taskEndDate: project.current_task_end_date,
          progress: project.progress,
          status: project.status
        }))
        .slice(0, 5)
    };
  }, [assignedProjects]);

  // Handle project click
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // Handle task update
  const handleUpdateTask = (projectId) => {
    navigate(`/projects/${projectId}/tasks`);
  };

  // Handle team management
  const handleManageTeam = (projectId) => {
    navigate(`/projects/${projectId}/team`);
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (endDate) => {
    if (!endDate) return null;
    const deadline = new Date(endDate);
    const now = new Date();
    const diffTime = deadline - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Installation': return '#17a2b8';
      case 'Structural/Manufacturing': return '#ffc107';
      case 'Test and Comm': return '#28a745';
      case 'Completed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if(projectsIsLoading) {
        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )    
  }

  return (
    <div className="Content ProjectEngineerDashboard">
      <div className="dashboard-header">
        <div className="engineer-welcome">
          <h1>Project Engineer Dashboard</h1>
          <p>Welcome back, {currentUser.name || currentUser.fullname}!</p>
        </div>
        <div className="engineer-stats">
          <span className="stat-badge">
            {dashboardData.totalAssigned} Total Projects
          </span>
          <span className="stat-badge active">
            {dashboardData.activeProjects} Active
          </span>
          <span className="stat-badge completed">
            {dashboardData.completedProjects} Completed
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
            <span style={{color: '#28a745'}}>🔧</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.installationPhase}</h3>
            <p>In Installation</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
            <span style={{color: '#ffc107'}}>🏗️</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.structuralPhase}</h3>
            <p>Structural Phase</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
            <span style={{color: '#17a2b8'}}>⚡</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.tncPhase}</h3>
            <p>Test & Commissioning</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
            <span style={{color: '#dc3545'}}>⚠️</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.criticalProjects.length}</h3>
            <p>Critical Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(108, 117, 125, 0.1)'}}>
            <span style={{color: '#6c757d'}}>⏸️</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.onHoldProjects.length}</h3>
            <p>On Hold</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
            <span style={{color: '#ffc107'}}>📊</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.behindSchedule.length}</h3>
            <p>Behind Schedule</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Left Column - Project Overview */}
        <div className="main-content">
          {/* Critical Projects Alert */}
          {dashboardData.criticalProjects.length > 0 && (
            <div className="content-card critical-alert">
              <div className="card-header">
                <h3 style={{color: '#dc3545'}}>🚨 Critical Projects - Immediate Attention Needed</h3>
                <span className="badge critical">{dashboardData.criticalProjects.length} projects</span>
              </div>
              <div className="projects-list">
                {dashboardData.criticalProjects.map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project} 
                    type="critical" 
                    onProjectClick={handleProjectClick}
                    onUpdateTask={handleUpdateTask}
                    clearProjectData={clearProjectData}
                    clearProjectTasks={clearProjectTasks}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Projects On Hold */}
          {dashboardData.onHoldProjects.length > 0 && (
            <div className="content-card pending-alert">
              <div className="card-header">
                <h3 style={{color: '#6c757d'}}>⏸️ Projects On Hold</h3>
                <span className="badge pending">{dashboardData.onHoldProjects.length} projects</span>
              </div>
              <div className="projects-list">
                {dashboardData.onHoldProjects.slice(0, 3).map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project} 
                    type="pending" 
                    onProjectClick={handleProjectClick}
                    clearProjectData={clearProjectData}
                    clearProjectTasks={clearProjectTasks}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Projects */}
          <div className="content-card">
            <div className="card-header">
              <h3>My Active Projects</h3>
              <span className="badge active">{dashboardData.activeProjects} projects</span>
            </div>
            <div className="projects-list">
              {assignedProjects
                .filter(p => !['Completed', 'Handover Done'].includes(p.status) && !p.on_hold)
                .slice(0, 5)
                .map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project} 
                    type="active" 
                    onProjectClick={handleProjectClick}
                    onUpdateTask={handleUpdateTask}
                    onManageTeam={handleManageTeam}
                    clearProjectData={clearProjectData}
                    clearProjectTasks={clearProjectTasks}
                  />
                ))}
            </div>
          </div>

          {/* Current Tasks */}
          <div className="content-card">
            <div className="card-header">
              <h3>Current Installation Tasks</h3>
            </div>
            <div className="tasks-list">
              {dashboardData.pendingTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4>{task.name}</h4>
                    <p className="task-description">{task.currentTask}</p>
                    <span className="task-status" style={{color: getStatusColor(task.status)}}>
                      {task.status}
                    </span>
                  </div>
                  <div className="task-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span>{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Analytics & Quick Actions */}
        <div className="sidebar">
          {/* Upcoming Milestones */}
          <div className="content-card">
            <div className="card-header">
              <h3>Upcoming Deadlines</h3>
            </div>
            <div className="milestones-list">
              {dashboardData.upcomingMilestones.length > 0 ? (
                dashboardData.upcomingMilestones.map(milestone => {
                  const daysLeft = getDaysUntilDeadline(milestone.date);
                  return (
                    <div key={milestone.id} className="milestone-item">
                      <div className={`milestone-date ${daysLeft <= 7 ? 'urgent' : ''}`}>
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
                        {daysLeft && (
                          <span className={`days-remaining ${daysLeft <= 7 ? 'urgent' : ''}`}>
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <i className="fas fa-flag"></i>
                  <p>No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => {
                clearProjectTasks()
                clearProjectData()
                navigate('/projects')
              }}>
                <i className="fas fa-list"></i>
                <span>View All Projects</span>
              </button>
            </div>
          </div>

          {/* Project Status Distribution */}
          <div className="content-card">
            <div className="card-header">
              <h3>Project Status</h3>
            </div>
            <div className="status-distribution">
              <div className="status-item">
                <span className="status-name">Installation</span>
                <div className="status-count">
                  {dashboardData.installationPhase}
                </div>
              </div>
              <div className="status-item">
                <span className="status-name">Structural</span>
                <div className="status-count">
                  {dashboardData.structuralPhase}
                </div>
              </div>
              <div className="status-item">
                <span className="status-name">Test & Comm</span>
                <div className="status-count">
                  {dashboardData.tncPhase}
                </div>
              </div>
              <div className="status-item">
                <span className="status-name">Completed</span>
                <div className="status-count">
                  {dashboardData.completedProjects}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project Item Component
const ProjectItem = ({ project, type, onProjectClick, onManageTeam, clearProjectData, clearProjectTasks }) => {
  const getDaysUntilDeadline = () => {
    if (!project.project_end_date) return null;
    const deadline = new Date(project.project_end_date);
    const now = new Date();
    const diffTime = deadline - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'critical':
        return {
          background: '#fff5f5',
          borderColor: '#fecaca',
          borderLeft: '4px solid #dc3545'
        };
      case 'active':
        return {
          background: '#f0f9ff',
          borderColor: '#b3e0ff',
          borderLeft: '4px solid #17a2b8'
        };
      case 'pending':
        return {
          background: '#f8f9fa',
          borderColor: '#e9ecef',
          borderLeft: '4px solid #6c757d'
        };
      default:
        return {
          background: '#f8f9fa',
          borderColor: '#e9ecef'
        };
    }
  };

  const daysLeft = getDaysUntilDeadline();

  return (
    <div className="project-item" style={getTypeStyles()}>
      <div className="project-info">
        <h4>{project.lift_name}</h4>
        <div className="project-meta">
          <span className={`status-badge ${type}`}>
            {type === 'pending' ? 'On Hold' : project.status}
          </span>
          <span className="project-id">#{project.id}</span>
          <span className="project-location">{project.city_municipality || project.region}</span>
        </div>
        <p className="project-client">{project.client}</p>
        
        {project.current_task && type !== 'pending' && (
          <div className="current-task">
            <i className="fas fa-tasks"></i>
            Current: {project.current_task}
          </div>
        )}
        
        {type === 'pending' && (
          <div className="current-task">
            <i className="fas fa-pause-circle"></i>
            Project On Hold
          </div>
        )}
        
        {project.project_end_date && (
          <div className="project-deadline">
            <i className="fas fa-calendar"></i>
            Completion: {new Date(project.project_end_date).toLocaleDateString()}
            {daysLeft && (
              <span className={`days-remaining ${daysLeft <= 7 ? 'urgent' : ''}`}>
                ({daysLeft} days)
              </span>
            )}
          </div>
        )}

        {project.has_team === 1 && type !== 'pending' && (
          <div className="team-assigned">
            <i className="fas fa-users"></i>
            Team assigned
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
          className="btn-primary btn-sm"
          onClick={() => {
            clearProjectTasks()
            clearProjectData()
            onProjectClick(project.id)
          }}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ProjectEngineerDashboard;