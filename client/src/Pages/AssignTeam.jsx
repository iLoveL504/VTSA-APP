import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosFetch from '../hooks/useAxiosFetch.js';
import { Axios } from '../api/axios.js';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useSharedSocket } from '../Context/SocketContext.js';
import '../css/AssignTeam.css';

// Material-UI Icons
import {
  LocationOn as LocationIcon,
  Engineering as EngineerIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const formatLocalDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  date.setDate(date.getDate());
  return date.toLocaleDateString("en-GB", { timeZone: "Asia/Manila" });
};

const ViewProjectEngineers = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const employees = useStoreState(state => state.employees);
  const peProjects = useStoreState(state => state.peProjects);
  const projects = useStoreState(state => state.projects);
  const { fetchProjects } = useStoreActions(action => action);

  const { utilitiesSocket } = useSharedSocket();
  const PEs = employees.filter(e => e.job === 'Project Engineer');
  const { projId } = useParams();
  const navigate = useNavigate();
  const [dProject, setDProject] = useState(null);

  const {
    fetchError: availablePEFetchError,
    isLoading: availablePEIsLoading
  } = useAxiosFetch(`${backendURL}/api/teams/not-assigned-PE`);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (utilitiesSocket) {
      utilitiesSocket.emit('pe_projects');
    }
  }, [utilitiesSocket]);

  useEffect(() => {
    if (projects) {
      setDProject(projects.find(p => p.id === Number(projId)));
    }
  }, [projects]);

  const [selectedPE, setSelectedPE] = useState(null);
  const [peCurrentProjects, setPeCurrentProjects] = useState([]);

  useEffect(() => {
    if (selectedPE) {
      const cp = peProjects.filter(p => p.project_engineer_id === selectedPE.employee_id);
      setPeCurrentProjects(cp);
    } else {
      setPeCurrentProjects([]);
    }
  }, [selectedPE, peProjects]);

  const handlePESelect = (engineer) => {
    setSelectedPE(engineer);
  };

  const handleSubmit = async () => {
    try {
      const id = selectedPE.employee_id;
      const payload = { id, projId };
      const assignedAt = new Date();

      const response = await Axios.post(`/api/teams/assign/${projId}`, payload);

      if (!response.data?.success) {
        window.alert("Something went wrong during assignment.");
        return;
      }

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Socket emit timeout"));
        }, 5000);

        utilitiesSocket.emit("new_notification", {
          subject: 'Project Created',
          body: `Project ${projId} ${selectedPE.last_name} ${selectedPE.first_name} at ${formatLocalDate(assignedAt)}`,
          Ids: [id],
          functionality: {
            function: "projects-navigate",
            "project-id": projId
          }
        }, (ack) => {
          clearTimeout(timeout);
          if (ack?.success) {
            resolve();
          } else {
            reject(new Error("Server failed to process notification."));
          }
        });
      });

      utilitiesSocket.emit('refresh_all_projects');
      window.alert("Success!");
      navigate(`/projects/${projId}`);

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      window.alert(`Something went wrong: ${error.message}`);
    }
  };

  if (availablePEIsLoading || dProject === null || dProject === undefined) {
    return (
      <div className="assign-engineer-loading">
        <div className="loading-spinner"></div>
        <p>Loading available project engineers...</p>
      </div>
    );
  }

  return (
    <div className="assign-engineer-container">
      {/* Header Section */}
      <div className="assign-engineer-header">
        <div className="header-icon">
          <EngineerIcon />
        </div>
        <div className="header-content">
          <h1>Assign Project Engineer</h1>
          <p>{dProject.lift_name} • {dProject.island_group}</p>
          <span>Select a project engineer to manage this project</span>
        </div>
      </div>

      {availablePEFetchError && (
        <div className="error-message">
          Error loading engineers: {availablePEFetchError}
        </div>
      )}

      <div className="assign-engineer-content">
        {/* Available Engineers Section */}
        <div className="engineers-section">
          <div className="section-header">
            <h2>Available Project Engineers</h2>
            <span className="engineer-count">{PEs.length} engineer(s) available</span>
          </div>

          <div className="engineers-list">
            {PEs && PEs.length > 0 ? (
              PEs.map((engineer) => (
                <div
                  key={engineer.employee_id}
                  className={`engineer-card ${selectedPE?.employee_id === engineer.employee_id ? 'selected' : ''}`}
                  onClick={() => handlePESelect(engineer)}
                >
                  <div className="engineer-avatar">
                    <PersonIcon />
                    <div className={`status-indicator ${engineer.status || 'active'}`}></div>
                  </div>
                  
                  <div className="engineer-info">
                    <h3>{engineer.first_name} {engineer.last_name}</h3>
                    <p className="engineer-username">@{engineer.username} • ID: {engineer.employee_id}</p>
                    {engineer.branch && (
                      <div className="engineer-branch">
                        <LocationIcon className="branch-icon" />
                        <span>{engineer.branch}</span>
                      </div>
                    )}
                  </div>

                  <div className="engineer-radio">
                    <input
                      type="radio"
                      name="selectedEngineer"
                      checked={selectedPE?.employee_id === engineer.employee_id}
                      onChange={() => handlePESelect(engineer)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <WorkIcon className="empty-icon" />
                <p>No available project engineers</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Projects Section */}
        <div className="projects-section">
          <div className="section-header">
            <h2>Current Projects</h2>
            {selectedPE && (
              <div className="selected-engineer-badge">
                <PersonIcon />
                {selectedPE.first_name} {selectedPE.last_name}
              </div>
            )}
          </div>

          <div className="projects-content">
            {selectedPE ? (
              peCurrentProjects.length > 0 ? (
                <>
                  {/* Statistics */}
                  <div className="projects-stats">
                    <div className="stat-card total">
                      <span className="stat-number">{peCurrentProjects.length}</span>
                      <span className="stat-label">Total Projects</span>
                    </div>
                    <div className="stat-card active">
                      <span className="stat-number">
                        {peCurrentProjects.filter(p => p.status === 'active').length}
                      </span>
                      <span className="stat-label">Active</span>
                    </div>
                  </div>

                  {/* Projects List */}
                  <div className="projects-list">
                    {peCurrentProjects.map((project, index) => (
                      <div key={project.project_id || index} className="project-card">
                        <div className="project-header">
                          <h4>{project.lift_name}</h4>
                          <span className={`project-status ${project.status || 'active'}`}>
                            {project.status || 'Active'}
                          </span>
                        </div>
                        
                        <div className="project-client">
                          <span className="client-label">Client:</span>
                          <span className="client-name">{project.client}</span>
                        </div>
                        
                        <div className="project-details">
                          <div className="detail-item">
                            <ScheduleIcon className="detail-icon" />
                            <span className="detail-label">Start:</span>
                            <span className="detail-value">
                              {project.operations_start_date ? 
                                new Date(project.operations_start_date).toLocaleDateString() : 
                                'Not set'
                              }
                            </span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">Project ID:</span>
                            <span className="detail-value project-id">#{project.project_id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <WorkIcon className="empty-icon" />
                  <h4>No Current Projects</h4>
                  <p>{selectedPE.first_name} {selectedPE.last_name} has no assigned projects</p>
                </div>
              )
            ) : (
              <div className="empty-state">
                <AssignmentIcon className="empty-icon" />
                <h4>Select an Engineer</h4>
                <p>Choose a project engineer from the list to view their current projects</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="action-section">
        <div className="selection-info">
          {selectedPE ? (
            <div className="selected-engineer-info">
              <CheckCircleIcon className="success-icon" />
              <div className="engineer-details">
                <h4>Engineer Selected</h4>
                <p>
                  {selectedPE.first_name} {selectedPE.last_name} • @{selectedPE.username}
                  {selectedPE.branch && (
                    <span className="branch-tag">
                      <LocationIcon />
                      {selectedPE.branch}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <h4>No engineer selected</h4>
            </div>
          )}
        </div>

        <button
          className="assign-button"
          onClick={handleSubmit}
          disabled={!selectedPE}
        >
          <AssignmentIcon className="button-icon" />
          Assign Engineer
        </button>
      </div>
    </div>
  );
};

export default ViewProjectEngineers;