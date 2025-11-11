import React, { useState } from 'react'


const InstallationTeams = ({ teamsByGroup, isLoading, error }) => {

  const [expandedTeams, setExpandedTeams] = useState(new Set());
    console.log(teamsByGroup)
  const toggleTeam = (teamId) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Installation': { class: 'status-installation', label: 'Installation' },
      'Preliminaries': { class: 'status-preliminaries', label: 'Preliminaries' }
    };
    
    const config = statusConfig[status] || { class: 'status-default', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getJobBadge = (job) => {
    const jobConfig = {
      'Foreman': { class: 'job-foreman', label: 'Foreman' },
      'Skilled Installer': { class: 'job-skilled', label: 'Skilled Installer' },
      'Installer': { class: 'job-installer', label: 'Installer' }
    };
    
    const config = jobConfig[job] || { class: 'job-default', label: job };
    return <span className={`job-badge ${config.class}`}>{config.label}</span>;
  };

  if (isLoading) {
    return (
      <div className="teams-loading">
        <div className="loading-spinner"></div>
        <p>Loading teams...</p>
      </div>
    );
  }
const x = Object.entries(teamsByGroup)

    console.log(x)
  if (error) {
    return (
      <div className="teams-error">
        <h3>Error Loading Teams</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="Content installation-teams">
      <div className="teams-stats-header">
        <div className="stats-overview">
          <div className="stat-card">
            {console.log()}
            <span className="stat-number">{Object.keys(teamsByGroup).length}</span>
            <span className="stat-label">Active Teams</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {console.log(teamsByGroup)}
              {Object.values(teamsByGroup).reduce((total, team) => total + team.length, 0)}
            </span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>
      </div>

      <div className="teams-grid">
        {}
        {Object.entries(teamsByGroup).map(([teamId, teamMembers]) => {
          const firstMember = teamMembers[0];     
          //const foreman = teamMembers.find(member => member.job === 'Foreman');
          const skilledInstallers = teamMembers.filter(member => member.job === 'Skilled Installer');
          const installers = teamMembers.filter(member => member.job === 'Installer');
          const isExpanded = expandedTeams.has(teamId);

          return (
            <div key={teamId} className="team-card">
              <div 
                className="team-card-header"
                onClick={() => toggleTeam(teamId)}
              >
                <div className="team-basic-info">
                  <h2>Team {teamId}</h2>
                  <div className="team-project">
                    <strong>{firstMember.lift_name}</strong>
                    <span className="project-id">Project #{firstMember.project_id}</span>
                  </div>
                </div>
                
                <div className="team-meta">
                  {getStatusBadge(firstMember.status)}
                  <div className="team-dates">
                    <span>Start: {formatDate(firstMember.operations_start_date)}</span>
                    <span>End: {formatDate(firstMember.project_end_date)}</span>
                  </div>
                </div>

                <div className="team-expand-icon">
                  {isExpanded ? '▼' : '►'}
                </div>
              </div>

              {isExpanded && (
                <div className="team-card-content">
                  <div className="team-personnel">
                    <div className="personnel-section">
                      <h4>Project Engineer</h4>
                      <div className="personnel-item">
                        <span className="personnel-name">{firstMember.pe_username}</span>
                        <span className="personnel-role">Project Engineer</span>
                      </div>
                    </div>

                    <div className="personnel-section">
                      <h4>Team Leadership</h4>
                      {firstMember.Foreman && (
                        <div className="personnel-item">
                          <span className="personnel-name">{firstMember.Foreman}</span>
                          <span className="personnel-username">@{firstMember.foreman_id}</span>
                          <span>Foreman</span>
                        </div>
                      )}
                    </div>

                    <div className="personnel-section">
                      <h4>Team Members ({teamMembers.length - 1})</h4>
                      
                      {skilledInstallers.length > 0 && (
                        <div className="role-group">
                          <h5>Skilled Installers ({skilledInstallers.length})</h5>
                          {skilledInstallers.map(member => (
                            <div key={member.emp_id} className="personnel-item">
                              <span className="personnel-name">{member.e_username}</span>
                              {getJobBadge(member.job)}
                            </div>
                          ))}
                        </div>
                      )}

                      {installers.length > 0 && (
                        <div className="role-group">
                          <h5>Installers ({installers.length})</h5>
                          {installers.map(member => (
                            <div key={member.emp_id} className="personnel-item">
                              <span className="personnel-name">{member.e_username}</span>
                              {getJobBadge(member.job)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="team-stats">
                    <div className="stat-item">
                      <span className="stat-label">Team Size</span>
                      <span className="stat-value">{teamMembers.length} members</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Project Duration</span>
                      <span className="stat-value">
                        {Math.ceil((new Date(firstMember.project_end_date) - new Date(firstMember.operations_start_date)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(teamsByGroup).length === 0 && !isLoading && (
        <div className="no-teams">
          <h3>No Installation Teams Found</h3>
          <p>There are currently no installation teams assigned to projects.</p>
        </div>
      )}
    </div>
  );
};

export default InstallationTeams;