import React, { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosFetch from '../hooks/useAxiosFetch.js';
import { Axios } from '../api/axios.js';
import { useStoreState } from 'easy-peasy';
import { useSharedSocket } from '../Context/SocketContext.js';
import '../css/AssignTeam.css';

const ViewProjectEngineers = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const employees = useStoreState(state => state.employees)
  const peProjects = useStoreState(state => state.peProjects)
  
  const { utilitiesSocket } = useSharedSocket()
  const PEs = employees.filter(e => e.job === 'Project Engineer')
  const { projId } = useParams();
  const navigate = useNavigate()
 
  console.log(peProjects)

  const {
    fetchError: availablePEFetchError,
    isLoading: availablePEIsLoading
  } = useAxiosFetch(`${backendURL}/api/teams/not-assigned-PE`);

  useEffect(() => {
    if(utilitiesSocket) {
      console.log('wahhh')
      utilitiesSocket.emit('pe_projects')
    }
  }, [utilitiesSocket])

  const [selectedPE, setSelectedPE] = useState(null);
  const [peCurrentProjects, setPeCurrentProjects] = useState([])

   console.log(selectedPE)
useEffect(() => {
  if (selectedPE) {
    const cp = peProjects.filter(p => p.project_engineer_id === selectedPE.employee_id);
    setPeCurrentProjects(cp);
  } else {
    setPeCurrentProjects([]);
  }
}, [selectedPE, peProjects]);

const handlePESelect = (engineer) => {
  console.log('Selected PE:', engineer);
  setSelectedPE(engineer);
  // peCurrentProjects will be updated automatically by the useEffect
};

const handleSubmit = async () => {
  try {
    const id = selectedPE.employee_id;
    const payload = { id, projId };
    const assignedAt = new Date()
    console.log(selectedPE)
   
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
        body: `Project ${projId} ${selectedPE.last_name} ${selectedPE.first_name} at ${assignedAt.toISOString("en-GB").split('T')[0]}`,
        Ids: [id]
      }, (ack) => {
        clearTimeout(timeout);
        if (ack?.success) {
          resolve();
        } else {
          reject(new Error("Server failed to process notification."));
        }
      });
    });

    utilitiesSocket.emit('refresh_all_projects')
    window.alert("Success!");
    navigate(`/projects/${projId}`);

  } catch (error) {
    console.error("Error in handleSubmit:", error);
    window.alert(`Something went wrong: ${error.message}`);
  }
 };


  if (availablePEIsLoading) {
    return (
      <div className="Content ProjectPage">
        <div className="Loading">
          <p>Loading available project engineers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Content TeamSelection">
      <h2>Available Project Engineers</h2>

      {availablePEFetchError && (
        <div className="error-message">Error loading engineers: {availablePEFetchError}</div>
      )}
    <div className="pe-section">
      <div className="available-pe-container">
        <div className="pe-list-table">
          {PEs && PEs.length > 0 ? (
            <div className="table-container">
              <div className="table-header">

                  <div className="table-cell">Select</div>
                  <div className="table-cell">Name</div>
                  <div className="table-cell">Username</div>
                  <div className="table-cell">Employee ID</div>
                  <div className="table-cell">Status</div>
           
              </div>
              <div className="table-body">
                {PEs.map((engineer) => (
                  <div
                    key={engineer.employee_id}
                    className={`table-row ${selectedPE && selectedPE.employee_id === engineer.employee_id ? 'selected' : ''}`}
                    onClick={() => handlePESelect(engineer)}
                  >
                    <div className="table-cell">
                      <div className="radio-container">
                        <input
                          type="radio"
                          name="selectedPE"
                          checked={selectedPE && selectedPE.employee_id === engineer.employee_id}
                          onChange={() => handlePESelect(engineer)}
                          className="radio-input"
                        />
                      </div>
                    </div>
                    <div className="table-cell name-cell">
                      {engineer.first_name} {engineer.last_name}
                    </div>
                    <div className="table-cell username-cell">
                      @{engineer.username}
                    </div>
                    <div className="table-cell id-cell">
                      {engineer.employee_id}
                    </div>
                    <div className="table-cell status-cell">
                      <span className={`status-badge ${engineer.status || 'active'}`}>
                        {engineer.status || 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-results">No available project engineers</p>
          )}
        </div>
      </div>

<div className='pe-projects-section'>
  <div className='section-header'>
    <h3>Current Projects</h3>
    {selectedPE && (
      <div className='pe-info-badge'>
        {selectedPE.first_name} {selectedPE.last_name}
      </div>
    )}
  </div>
  
  {selectedPE ? (
    <div className='current-projects-container'>
      {peCurrentProjects.length > 0 ? (
        <>
          <div className='projects-stats'>
            <div className='stat-item'>
              <span className='stat-number'>{peCurrentProjects.length}</span>
              <span className='stat-label'>Total Projects</span>
            </div>
            <div className='stat-item'>
              <span className='stat-number'>
                {peCurrentProjects.filter(p => p.status === 'active').length}
              </span>
              <span className='stat-label'>Active</span>
            </div>
            <div className='stat-item'>
              <span className='stat-number'>
                {peCurrentProjects.filter(p => p.status === 'completed').length}
              </span>
              <span className='stat-label'>Completed</span>
            </div>
          </div>
          
          <div className='projects-grid'>
            {peCurrentProjects.map((project, index) => (
              <div key={project.project_id || index} className="project-card">
                <div className='project-card-header'>
                  <h4 className='project-title'>{project.lift_name}</h4>
                  <span className={`project-status ${project.status || 'active'}`}>
                    {project.status || 'Active'}
                  </span>
                </div>
                
                <div className='project-client'>
                  <span className='client-label'>Client</span>
                  <span className='client-name'>{project.client}</span>
                </div>
                
                <div className='project-details'>
                  <div className='detail-item'>
                    <span className='detail-label'>Start Date</span>
                    <span className='detail-value'>
                      {project.operations_start_date ? 
                        new Date(project.operations_start_date).toLocaleDateString() : 
                        'Not set'
                      }
                    </span>
                  </div>
                  
                  <div className='detail-item'>
                    <span className='detail-label'>End Date</span>
                    <span className='detail-value'>
                      {project.project_end_date ? 
                        new Date(project.project_end_date).toLocaleDateString() : 
                        'Not set'
                      }
                    </span>
                  </div>
                  
                  <div className='detail-item'>
                    <span className='detail-label'>Project ID</span>
                    <span className='detail-value project-id'>{project.project_id}</span>
                  </div>
                </div>
                
                {project.description && (
                  <div className='project-description'>
                    <p>{project.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='empty-state'>
          <div className='empty-icon'>📋</div>
          <h4>No Current Projects</h4>
          <p>{selectedPE.first_name} {selectedPE.last_name} has no assigned projects</p>
        </div>
      )}
    </div>
  ) : (
    <div className='selection-prompt'>
      <div className='prompt-icon'>👨‍💼</div>
      <h4>Select a Project Engineer</h4>
      <p>Choose an engineer from the list to view their current projects</p>
    </div>
  )}
</div>     
    </div>

      
      <div className="action-section">
        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={!selectedPE}
        >
          Assign Selected Engineer
        </button>
        
        {selectedPE && (
          <div className="selected-info">
            <strong>Selected:</strong> {selectedPE.first_name} {selectedPE.last_name} (@{selectedPE.username})
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProjectEngineers;