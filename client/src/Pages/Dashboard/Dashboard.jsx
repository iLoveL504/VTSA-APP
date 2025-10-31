import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import ProjectManagerDashboard from './ProjectManagerDashboard';
import ProjectEngineerDashboard from './ProjectEngineerDashboard';
import '../../css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const projects = useStoreState(state => state.projects);
  const employees = useStoreState(state => state.employees);
  const role = sessionStorage.getItem('roles');
  const userId = sessionStorage.getItem('user_id');

  const handleNewProject = () => {
    navigate('/projects/create');
  };

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (role) {
      case 'Project Manager':
      case 'manager':
        return <ProjectManagerDashboard 
          projects={projects} 
          employees={employees}
          onNewProject={handleNewProject}
        />;
      
      case 'Project Engineer':
        return <ProjectEngineerDashboard 
          projects={projects}
          userId={userId}
          onNewProject={handleNewProject}
        />;
      
      default:
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
    }
  };

  return renderDashboard();
};

export default Dashboard;