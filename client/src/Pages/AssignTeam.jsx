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

  const handlePESelect = (engineer) => {
    console.log(engineer)
    setSelectedPE(engineer);
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

      <div>
        Project Engineer Info here
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