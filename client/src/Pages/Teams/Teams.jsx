import React, { useMemo, useState } from 'react'
import useAxiosFetch from "../../hooks/useAxiosFetch";
import '../../css/TeamsPage.css'
import InstallationTeams from './InstallationTeams';
import ProjectAssignment from './ProjectAssignment';

const Teams = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const { data: teamData, isLoading: teamIsLoading, error } = useAxiosFetch(`${backendURL}/api/teams`)
  const [activePage, setActivePage] = useState('installation')

  const teamsByGroup = useMemo(() => {
    if (teamData && !teamIsLoading) {
      return teamData.reduce((acc, entry) => {
         if (entry.team_id == null) return acc;
        const key = entry.team_id;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(entry);
        return acc;
      }, {});
    }
    return {};
  }, [teamData, teamIsLoading]);
  console.log(teamsByGroup)
  const installationOnClick = () => {
    setActivePage('installation');
  };

  const otherTeamsOnClick = () => {
    setActivePage('other');
  };

  return (
    <div className='Content TeamsPage'>
      {/* Header matching ProjectInfo layout */}
      <div className="project-header">
        <div className="project-header-content">
          <h2>Teams Management</h2>
          <div className="action-buttons">
            <button 
              onClick={installationOnClick}
              className={activePage === 'installation' ? 'active' : ''}
            >
              Installation Teams
            </button>
            <button 
              onClick={otherTeamsOnClick}
              className={activePage === 'other' ? 'active' : ''}
            >
              Plan Manpower
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="teams-content">
        {activePage === 'installation' && (
          <InstallationTeams 
            teamsByGroup={teamsByGroup}
            isLoading={teamIsLoading}
            error={error}
          />
        )}
        
        {activePage === 'other' && (
          <ProjectAssignment 
            teamsByGroup={teamsByGroup}
          />
        )}
        {/* <div>
          Some side content right here
        </div> */}
      </div>
    </div>
  )
}

export default Teams