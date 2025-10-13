import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Axios } from '../api/axios.js';
import useAxiosFetch from '../hooks/useAxiosFetch.js';
import 'ldrs/react/Grid.css'
import '../css/AssignTeam.css'

const AssignTeam = () => {
  const navigate = useNavigate()
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const { projId } = useParams();
  const {data: foundProject, fetchError: createdFetchError, isLoading: createdIsLoading} = useAxiosFetch(`${backendURL}/projects/${Number(projId)}`);
  const {data: availableTeams, fetchError: availableFetchError, isLoading: availableIsLoading} = useAxiosFetch(`${backendURL}/teams/no-project`);
  const {data: availablePE, fetchError: availablePEFetchError, isLoading: availablePEIsLoading} = useAxiosFetch(`${backendURL}/teams/not-assigned-PE`);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPE, setSelectedPE] = useState(null);
  const [error, setError] = useState('');
  console.log(Number(projId))
  // Group team members by team
  const groupTeams = (data) => {
    const teams = {};
    
    data.forEach(member => {
      if (!teams[member.team_id]) {
        teams[member.team_id] = {
          team_id: member.team_id,
          foreman_name: member.Foreman,
          foreman_id: member.foreman_id,
          project_id: member.project_id,
          members: []
        };
      }
      
      // Add member to the team (including the foreman)
      teams[member.team_id].members.push({
        employee_id: member.employee_id,
        full_name: member.full_name,
        job: member.job,
        username: member.username
      });
    });
    console.log(teams)
    return Object.values(teams);
  };

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!availableIsLoading && !availablePEIsLoading && !createdIsLoading) {
      console.log(foundProject)
      const groupedTeams = groupTeams(availableTeams);
      setTeams(groupedTeams);
    }
  }, [availableTeams, availablePE, availableIsLoading, availablePEIsLoading, foundProject, createdIsLoading]);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setError('');
  };

  const handlePESelect = (engineer) => {
    setSelectedPE(engineer);
    setError('');
  };

  const handleSubmit = async () => {
    console.log(projId)
    console.log(selectedPE)
    console.log(selectedTeam)
    const payload = {
      projId: projId,
      ProjectEngineer: selectedPE,
      Team: selectedTeam
    }
    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }
    
    // Submit the selected team to the project
    alert(`Team ${selectedTeam.foreman_name} assigned to project ${foundProject.lift_name}`);
    const response = await Axios.post('/api/teams/assign', payload)
        if (response.data?.success) {
            alert('Team Assigned')
            setTimeout(() => {
              navigate(`/projects`);
            }, 3000);
        } else {
            alert("Unexpected server response. Please try again.");
        }
    navigate('/projects')
  };

  if (availableIsLoading || availablePEIsLoading || createdFetchError) {
    return (
      <div className="Content ProjectPage">
        <div className="Loading">
          <p>Loading available teams...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="Content TeamSelection">
      {createdFetchError && (
        <div className="error-message">Project Not Found: {createdFetchError}</div>
      )}
      <h2>Assign Team to {foundProject.lift_name}</h2>
      <p className="instructions">
        Select a team by clicking on the foreman's name. The team members will be displayed below.
        You can also assign an available project engineer to the project.
      </p>
      
      {availableFetchError && (
        <div className="error-message">Error loading teams: {availableFetchError}</div>
      )}
      
      {/* Available Project Engineers Section */}
      <div className="available-pe-container">
        <h3>Available Project Engineers</h3>
        {availablePEFetchError && (
          <div className="error-message">Error loading engineers: {availablePEFetchError}</div>
        )}
        <div className="pe-list">
          {availablePE && availablePE.length > 0 ? (
            availablePE.map(engineer => (
              <div 
                key={engineer.employee_id} 
                className={`pe-card ${selectedPE && selectedPE.employee_id === engineer.employee_id ? 'selected' : ''}`}
                onClick={() => handlePESelect(engineer)}
              >
                <div className="pe-info">
                  <div className="pe-name">{engineer.first_name} {engineer.last_name}</div>
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
      
      <div className="teams-container">
        <h3>Available Teams</h3>
        <div className="teams-list">
          {teams.map(team => (
            <div 
              key={team.team_id} 
              className={`team-card ${selectedTeam && selectedTeam.team_id === team.team_id ? 'selected' : ''}`}
              onClick={() => handleTeamSelect(team)}
            >
              <div className="foreman-info">
                <h4>{team.foreman_name}</h4>
                <span className="job-tag foreman">Foreman</span>
                <span className="team-size">{team.members.length} members</span>
              </div>
              
              <div className="team-members">
                <h5>Team Members:</h5>
                <ul>
                  {team.members.map(member => (
                    <li key={member.employee_id} className="member-item">
                      <span className="member-name">{member.full_name}</span>
                      <span className={`job-tag ${member.job.replace(' ', '-').toLowerCase()}`}>
                        {member.job}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedTeam && (
        <div className="selected-team">
          <h3>Selected Team</h3>
          <div className="selected-team-card">
            <h4>{selectedTeam.foreman_name}'s Team</h4>
            <div className="team-composition">
              <div className="composition-item">
                <span className="count">{selectedTeam.members.filter(m => m.job === 'Foreman').length}</span>
                <span className="label">Foremen</span>
              </div>
              <div className="composition-item">
                <span className="count">{selectedTeam.members.filter(m => m.job === 'Project Engineer').length}</span>
                <span className="label">Engineers</span>
              </div>
              <div className="composition-item">
                <span className="count">{selectedTeam.members.filter(m => m.job === 'Technician').length}</span>
                <span className="label">Technicians</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedPE && (
        <div className="selected-pe">
          <h3>Selected Engineer</h3>
          <div className="selected-pe-card">
            <h4>{selectedPE.first_name} {selectedPE.last_name}</h4>
            <div className="pe-details-list">
              <div className="pe-detail">
                <span className="label">Username:</span>
                <span className="value">@{selectedPE.username}</span>
              </div>
              <div className="pe-detail">
                <span className="label">Employee ID:</span>
                <span className="value">{selectedPE.employee_id}</span>
              </div>
              <div className="pe-detail">
                <span className="label">Status:</span>
                <span className={`value status ${selectedPE.is_active ? 'active' : 'inactive'}`}>
                  {selectedPE.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="submit-btn" 
        onClick={handleSubmit}
        disabled={!selectedTeam}
      >
        Assign Selected Team
      </button>
    </div>
  );
};

export default AssignTeam;