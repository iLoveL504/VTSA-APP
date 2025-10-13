import React, { useState } from 'react';
//import { useParams } from 'react-router-dom';
import useAxiosFetch from '../hooks/useAxiosFetch.js';
import '../css/AssignTeam.css'; // You can rename this later if needed

const ViewProjectEngineers = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  //const { projId } = useParams();

  // Fetch available project engineers
  const {
    data: availablePE,
    fetchError: availablePEFetchError,
    isLoading: availablePEIsLoading
  } = useAxiosFetch(`${backendURL}/api/teams/not-assigned-PE`);

  const [selectedPE, setSelectedPE] = useState(null);

  const handlePESelect = (engineer) => {
    setSelectedPE(engineer);
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

      <div className="available-pe-container">
        <div className="pe-list">
          {availablePE && availablePE.length > 0 ? (
            availablePE.map((engineer) => (
              <div
                key={engineer.employee_id}
                className={`pe-card ${selectedPE && selectedPE.employee_id === engineer.employee_id ? 'selected' : ''}`}
                onClick={() => handlePESelect(engineer)}
              >
                <div className="pe-info">
                  <div className="pe-name">
                    {engineer.first_name} {engineer.last_name}
                  </div>
                  <span className="pe-username">@{engineer.username}</span>
                </div>
                <div className="pe-details">
                  <span className="pe-id">ID: {engineer.employee_id}</span>
                  <span className={`pe-status ${engineer.is_active ? 'active' : 'inactive'}`}>
                    {engineer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No available project engineers</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProjectEngineers;
