import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import MyGanttComponent from "../outComponent/GANTT_CHART/GanttChart.jsx";
import '../css/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const projects = useStoreState(state => state.projects);
  const employees = useStoreState(state => state.employees);
  const role = sessionStorage.getItem('roles')
  // Sample data for demonstration
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

  return (
    <div className="Content Dashboard">
      {
        role === 'manager' || role === 'Project Manager' 
        ? (
        <>
          <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
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
};

export default Dashboard;