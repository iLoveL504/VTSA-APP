import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import MyGanttComponent from "../outComponent/GANTT_CHART/GanttChart.jsx";
import '../css/Dashboard.css'
import { useSharedSocket } from '../Context/SocketContext.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const projects = useStoreState(state => state.projects);
  const employees = useStoreState(state => state.employees);
  const role = sessionStorage.getItem('roles');
  const userId = sessionStorage.getItem('user_id'); // Assuming user ID is stored
  const forecastSocket = useSharedSocket()
 

  // Get projects assigned to the current project engineer
  const getAssignedProjects = () => {
    if (role !== 'Project Engineer') return [];
    
    // Assuming projects have an 'assignedEngineer' field or similar
    return projects.filter(project => 
      project.assignedEngineerId === parseInt(userId) || 
      project.assignedEngineer === userId
    );
  };

  const assignedProjects = getAssignedProjects();

  // Project Engineer Dashboard Data
  const [engineerDashboard] = useState({
    assignedProjects: assignedProjects.length,
    activeProjects: assignedProjects.filter(p => p.status === 'active').length,
    completedProjects: assignedProjects.filter(p => p.status === 'completed').length,
    upcomingDeadlines: assignedProjects
      .filter(p => p.status === 'active' && p.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3),
    recentProjectActivities: [
      { id: 1, project: 'TechCorp HQ', action: 'Site inspection completed', time: '2 hours ago' },
      { id: 2, project: 'Skyline Towers', action: 'Progress report submitted', time: '1 day ago' },
      { id: 3, project: 'Metro Mall', action: 'Client meeting scheduled', time: '2 days ago' }
    ],
    projectProgress: assignedProjects.map(project => ({
      name: project.lift_name || project.name,
      progress: Math.floor(Math.random() * 100), // Replace with actual progress data
      deadline: project.deadline,
      status: project.status
    }))
  });

  // Manager Dashboard Data (existing)
  const [dashboardData] = useState({
    ongoingProjects: projects.filter(p => p.status === 'active').length || 4,
    completedProjects: projects.filter(p => p.status === 'completed').length || 12,
    totalEmployees: employees.length || 24,
    availableEmployees: employees.filter(e => e.team_id === null).length || 18,
    upcomingMaintenance: [
      { id: 1, client: 'TechCorp Inc.', date: '2023-10-25', notes: 'Quarterly maintenance for all elevators in main building' },
      { id: 2, client: 'Skyline Towers', date: '2023-10-28', notes: 'Emergency repair for elevator #3 in north tower' },
      { id: 3, client: 'Metro Mall', date: '2023-11-05', notes: 'Scheduled maintenance for escalators in food court' }
    ],
    recentActivities: [
      { id: 1, project: 'Ocean View Residence', action: 'Team assigned', time: '2 hours ago' },
      { id: 2, project: 'TechCorp Inc.', action: 'Maintenance completed', time: '1 day ago' },
      { id: 3, project: 'Central Hospital', action: 'Inspection scheduled', time: '2 days ago' }
    ]
  });

  const handleNewProject = () => {
    navigate('/projects/create')
  }

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateReport = (projectId) => {
    navigate(`/projects/${projectId}/daily-report`);
  };

  // Project Engineer Dashboard View
  if (role === 'Project Engineer') {
    return (
      <div className="Content Dashboard">
        <div className="dashboard-header">
          <h1>Project Engineer Dashboard</h1>
          <p>Welcome back! Here's an overview of your assigned projects.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: 'rgba(49, 90, 149, 0.1)'}}>
              <span style={{color: '#315a95'}}>📋</span>
            </div>
            <div className="stat-content">
              <h3>{engineerDashboard.assignedProjects}</h3>
              <p>Assigned Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
              <span style={{color: '#28a745'}}>⚡</span>
            </div>
            <div className="stat-content">
              <h3>{engineerDashboard.activeProjects}</h3>
              <p>Active Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
              <span style={{color: '#ffc107'}}>✅</span>
            </div>
            <div className="stat-content">
              <h3>{engineerDashboard.completedProjects}</h3>
              <p>Completed Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
              <span style={{color: '#dc3545'}}>⏰</span>
            </div>
            <div className="stat-content">
              <h3>{engineerDashboard.upcomingDeadlines.length}</h3>
              <p>Upcoming Deadlines</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="main-content">
            {/* Assigned Projects List */}
            <div className="content-card">
              <div className="card-header">
                <h3>My Assigned Projects</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="projects-list">
                {assignedProjects.length > 0 ? (
                  assignedProjects.map(project => (
                    <div key={project.id} className="project-item">
                      <div className="project-info">
                        <h4>{project.lift_name || project.name}</h4>
                        <div className="project-meta">
                          <span className={`status-badge ${project.status}`}>
                            {project.status}
                          </span>
                          <span className="project-id">#{project.id}</span>
                        </div>
                        <p className="project-location">
                          {project.location || 'Location not specified'}
                        </p>
                        {project.deadline && (
                          <div className="project-deadline">
                            <i className="fas fa-calendar"></i>
                            Deadline: {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="project-actions">
                        <button 
                          className="btn-primary"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <i className="fas fa-eye"></i>
                          View Details
                        </button>
                        <button 
                          className="btn-outline"
                          onClick={() => handleCreateReport(project.id)}
                        >
                          <i className="fas fa-file-alt"></i>
                          Daily Report
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-projects">
                    <i className="fas fa-clipboard-list"></i>
                    <h4>No Projects Assigned</h4>
                    <p>You don't have any projects assigned to you yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Progress */}
            <div className="content-card">
              <div className="card-header">
                <h3>Project Progress</h3>
              </div>
              <div className="progress-list">
                {engineerDashboard.projectProgress.map((project, index) => (
                  <div key={index} className="progress-item">
                    <div className="progress-header">
                      <span className="project-name">{project.name}</span>
                      <span className="progress-percentage">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-footer">
                      <span className="project-status">{project.status}</span>
                      {project.deadline && (
                        <span className="project-deadline">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar">
            {/* Upcoming Deadlines */}
            <div className="content-card">
              <div className="card-header">
                <h3>Upcoming Deadlines</h3>
              </div>
              <div className="deadlines-list">
                {engineerDashboard.upcomingDeadlines.length > 0 ? (
                  engineerDashboard.upcomingDeadlines.map(project => (
                    <div key={project.id} className="deadline-item">
                      <div className="deadline-date">
                        <span className="date-day">
                          {new Date(project.deadline).getDate()}
                        </span>
                        <span className="date-month">
                          {new Date(project.deadline).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                      <div className="deadline-details">
                        <h4>{project.lift_name || project.name}</h4>
                        <p>{project.location || 'No location specified'}</p>
                        <span className="days-remaining">
                          {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-calendar-check"></i>
                    <p>No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="content-card">
              <div className="card-header">
                <h3>Recent Activities</h3>
              </div>
              <div className="activity-list">
                {engineerDashboard.recentProjectActivities.map(activity => (
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

            {/* Quick Actions */}
            <div className="content-card">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <i className="fas fa-file-alt"></i>
                  <span>Create Report</span>
                </button>
                <button className="quick-action-btn">
                  <i className="fas fa-clipboard-check"></i>
                  <span>Checklists</span>
                </button>
                <button className="quick-action-btn">
                  <i className="fas fa-tasks"></i>
                  <span>Task Updates</span>
                </button>
                <button className="quick-action-btn">
                  <i className="fas fa-chart-line"></i>
                  <span>Progress Tracking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Manager Dashboard View (existing code)
  if (role === 'manager' || role === 'Project Manager') {
    return (
      // ... existing manager dashboard code ...
<div className="Content Dashboard">
      {
        role === 'manager' || role === 'Project Manager' 
        ? (
        <>
          <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>Welcome back! Here's what's happening today.</p>
         <button onClick={() => {
          forecastSocket.emit("test_db_update", 'jii')
        }}>
            Test Emit
        </button>

         
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(49, 90, 149, 0.1)'}}>
            <span style={{color: '#315a95'}}>📊</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.ongoingProjects}</h3>
            <p>Ongoing Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
            <span style={{color: '#28a745'}}>✅</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.completedProjects}</h3>
            <p>Completed Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
            <span style={{color: '#ffc107'}}>👥</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.totalEmployees}</h3>
            <p>Total Active Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
            <span style={{color: '#17a2b8'}}>🔧</span>
          </div>
          <div className="stat-content">
            <h3>{dashboardData.availableEmployees}</h3>
            <p>Available Technicians</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <div className="content-card">
            <div className="card-header">
              <h3>Project Progress</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="project-chart">
              <div className="chart-placeholder">
                <p>Project Timeline Visualization</p>
                <div className="chart-bars">
                  <div className="chart-bar" style={{height: '60%', backgroundColor: '#315a95'}}>
                    <span>TechCorp</span>
                  </div>
                  <div className="chart-bar" style={{height: '40%', backgroundColor: '#4a7cc2'}}>
                    <span>Skyline</span>
                  </div>
                  <div className="chart-bar" style={{height: '80%', backgroundColor: '#315a95'}}>
                    <span>Metro Mall</span>
                  </div>
                  <div className="chart-bar" style={{height: '30%', backgroundColor: '#4a7cc2'}}>
                    <span>Ocean View</span>
                  </div>
                  <div className="chart-bar" style={{height: '65%', backgroundColor: '#315a95'}}>
                    <span>Central Hosp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="card-header">
              <h3>Upcoming Maintenance</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="maintenance-list">
              {dashboardData.upcomingMaintenance.map(item => (
                <div key={item.id} className="maintenance-item">
                  <div className="maintenance-date">
                    <span className="date-day">{new Date(item.date).getDate()}</span>
                    <span className="date-month">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="maintenance-details">
                    <h4>{item.client}</h4>
                    <p>{item.notes}</p>
                  </div>
                  <button className="action-btn">Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {dashboardData.recentActivities.map(activity => (
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
              <h3>Messages</h3>
            </div>
            <div className="messages-content">
              <div className="empty-state">
                <span className="message-icon">💬</span>
                <p>No new messages</p>
                <small>You're all caught up!</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="new-project-button" onClick={handleNewProject}>
        <span>+</span> New Project
      </button>
        </>
      ) : (
            <>
              you see something else here because you are a {role}
            </>
          )
      }
      
    </div>
    );
  }

  // Default view for other roles
  return (
    <div className="Content Dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome! Your role: {role}</p>
      </div>
      <div className="empty-dashboard">
        <i className="fas fa-user"></i>
        <h3>Dashboard Access</h3>
        <p>Your dashboard is being configured for your role.</p>
      </div>
    </div>
  );
};

export default Dashboard;