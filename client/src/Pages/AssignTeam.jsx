import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosFetch from '../hooks/useAxiosFetch.js';
import { Axios } from '../api/axios.js';
import { useStoreState } from 'easy-peasy';
import '../css/AssignTeam.css'; // You can rename this later if needed

const ViewProjectEngineers = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const employees = useStoreState(state => state.employees)
  const PEs = employees.filter(e => e.job === 'Project Engineer')
  const { projId } = useParams();
  const navigate = useNavigate()
  // Fetch available project engineers
  const {
    fetchError: availablePEFetchError,
    isLoading: availablePEIsLoading
  } = useAxiosFetch(`${backendURL}/api/teams/not-assigned-PE`);

  const [selectedPE, setSelectedPE] = useState(null);

  const handlePESelect = (engineer) => {
    console.log(engineer)
    setSelectedPE(engineer);
  };

  const handleSubmit = async () => {
    console.log(selectedPE.employee_id)
    const id = selectedPE.employee_id
     const payload = {id, projId}
      const response = await Axios.post(`/api/teams/assign/${projId}`, payload)
      if(response.data?.success){
        window.alert('success')
        navigate(`/projects/${projId}`)
      } else {
        console.log(response.data)
        window.alert('something went wrong')
      }
  }

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
          {PEs ? (
            PEs.map((engineer) => (
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
            
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No available project engineers</p>
          )}
        </div>
      </div>
      <button onClick={handleSubmit}>Assign</button>
    </div>
  );
};

export default ViewProjectEngineers;
