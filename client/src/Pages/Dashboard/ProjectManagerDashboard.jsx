import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ProjectManagerDashboard.css'
//import { useStoreState } from 'easy-peasy';

const ProjectManagerDashboard = ({ projects, onNewProject }) => {
  const navigate = useNavigate();
 // const dateNow = useStoreState(state => state.dateNow)
  // Project Manager Dashboard Data - Calculated from all projects
  const projectManagerData = useMemo(() => {
    const now = new Date()
    //const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      // Project Statistics
      totalProjects: projects.length,
      activeProjects: projects.filter(p => 
        p.status && !['Completed', 'Handover Done'].includes(p.status)
      ).length,
      completedProjects: projects.filter(p => 
        p.status === 'Completed' || p.handover_done
      ).length,
      projectsBehindSchedule: projects.filter(p => {
        if (!p.project_end_date || p.status === 'Completed') return false;
        return new Date(p.project_end_date) < now && p.progress < 100;
      }).length,
      
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
      
      // Projects Needing Attention
      criticalProjects: projects.filter(p => {
        if (!p.project_end_date || p.status === 'Completed') return false;
        const daysUntilDue = Math.ceil((new Date(p.project_end_date) - now) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 14 && p.progress < 90;
      }),
      
      // Status Distribution
      statusDistribution: {
        'Structural/Manufacturing': projects.filter(p => p.status === 'Structural/Manufacturing').length,
        'Installation': projects.filter(p => p.status === 'Installation').length,
        'Test and Comm': projects.filter(p => p.status === 'Test and Comm').length,
        'Completed': projects.filter(p => p.status === 'Completed').length,
        'Preliminaries': projects.filter(p => p.status === 'Preliminaries').length
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
    navigate(`/projects/${projectId}`);
  };

  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  const handleViewGanttChart = () => {
    navigate('/projects/gantt');
  };

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
            <span style={{color: '#315a95'}}>📊</span>
          </div>
          <div className="stat-content">
            <h3>{projectManagerData.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
            <span style={{color: '#28a745'}}>⚡</span>
          </div>
          <div className="stat-content">
            <h3>{projectManagerData.activeProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        {/* <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
            <span style={{color: '#ffc107'}}>📈</span>
          </div>
          <div className="stat-content">
            <h3>{projectManagerData.averageProgress}%</h3>
            <p>Average Progress</p>
          </div>
        </div> */}

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
            <span style={{color: '#dc3545'}}>⚠️</span>
          </div>
          <div className="stat-content">
            <h3>{projectManagerData.projectsBehindSchedule}</h3>
            <p>Behind Schedule</p>
          </div>
        </div>

        {/* <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(111, 66, 193, 0.1)'}}>
            <span style={{color: '#6f42c1'}}>💰</span>
          </div>
          <div className="stat-content">
            <h3>₱{(projectManagerData.totalContractValue / 1000000).toFixed(1)}M</h3>
            <p>Contract Value</p>
          </div>
        </div> */}

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
            <span style={{color: '#17a2b8'}}>✅</span>
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
          {/* Critical Projects Alert */}
          {projectManagerData.criticalProjects.length > 0 && (
            <div className="content-card critical-alert">
              <div className="card-header">
                <h3 style={{color: '#dc3545'}}>⚠️ Projects Needing Attention</h3>
              </div>
              <div className="projects-list">
                {projectManagerData.criticalProjects.map(project => (
                  <div key={project.id} className="project-item critical">
                    <div className="project-info">
                      <h4>{project.lift_name}</h4>
                      <div className="project-meta">
                        <span className="status-badge critical">Critical</span>
                        <span className="project-id">#{project.id}</span>
                        <span className="project-engineer">{project.pe_fullname}</span>
                      </div>
                      <p className="project-client">{project.client}</p>
                      <div className="project-deadline">
                        <i className="fas fa-exclamation-triangle"></i>
                        Due: {new Date(project.project_end_date).toLocaleDateString()} 
                        ({Math.ceil((new Date(project.project_end_date) - new Date()) / (1000 * 60 * 60 * 24))} days)
                      </div>
                    </div>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill critical"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span>{project.progress}% Complete</span>
                    </div>
                    <div className="project-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
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
              {projects.slice(0, 5).map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-info">
                    <h4>{project.lift_name}</h4>
                    <div className="project-meta">
                      <span className={`status-badge ${project.status?.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                      <span className="project-id">#{project.id}</span>
                      <span className="project-engineer">{project.pe_fullname || 'Unassigned'}</span>
                    </div>
                    <p className="project-client">{project.client}</p>
                    {project.project_end_date && (
                      <div className="project-deadline">
                        <i className="fas fa-calendar"></i>
                        Completion: {new Date(project.project_end_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                    <span>{project.progress || 0}% Complete</span>
                  </div>
                  <div className="project-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Status Distribution */}
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
              <button className="quick-action-btn" onClick={handleViewGanttChart}>
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
              </button>
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
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;