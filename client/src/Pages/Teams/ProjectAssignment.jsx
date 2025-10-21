import {useRef, useState, useEffect} from 'react'
import { useSharedSocket } from '../../Context/SocketContext.js';
import { useStoreState } from 'easy-peasy';
import useFindProjectTask from '../../hooks/useFindProjectTask.js';
import '../../css/ProjectAssignment.css';

const ProjectAssignment = () => {
    const {forecastSocket, utilitiesSocket} = useSharedSocket()

    const forecastData = useStoreState(state => state.forecastData)
    const teamsNoProject = useStoreState(state => state.teamsNoProject)
    const tentativeProjectTeams = useStoreState(state => state.tentativeProjectTeams)
    const installationTeams = useStoreState(state => state.installationTeams)
    const [selectedProject, setSelectedProject] = useState({})
    const [activeRoleTab, setActiveRoleTab] = useState('all')
    const {currentTask} = useFindProjectTask(1)
    console.log(tentativeProjectTeams)
    console.log(teamsNoProject)
    const [selectedTab, setSelectedTab] = useState('preliminaries')
   // console.log(import.meta.env.VITE_BECKEND_URL)
// Filter personnel based on active tab
    const filteredPersonnel = teamsNoProject.concat(forecastData).filter(person => {
        if (activeRoleTab === 'all') return true
        return person.group === activeRoleTab
    })

    const itemRefs = useRef([]);
    const projects = useStoreState(state => state.projects)
    const preliminaries = projects.filter(p => p.status === 'Structural/Manufacturing' || p.status === 'Preliminaries' || p.status === 'Planning')
    const installations = projects.filter(p => p.status === 'Installation')
    const tnc = projects.filter(p => p.status === 'Test and Comm')
    console.log(installations)
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }; 

      useEffect(() => {
            if(forecastSocket) {
                forecastSocket.emit('no_project_team')
                forecastSocket.emit('tentative_project_team')
                utilitiesSocket.emit('refresh_project_data')
                forecastSocket.emit('installation_teams')
            }
        }, [forecastSocket])

        useEffect(() => {
       
            if(forecastData && teamsNoProject && tentativeProjectTeams) {
                console.log('data updated')
         
            }
        }, [forecastData, teamsNoProject, tentativeProjectTeams])

    useEffect(() => {
        if (!forecastSocket || !selectedProject.installation_start_date) return 
        // console.log(selectedProject.id)

        // console.log(teamsNoProject.concat(forecastData))
        forecastSocket.emit('forecast_team', selectedProject.installation_start_date.split("T")[0])
        
    }, [selectedProject, forecastSocket])

    const preliminariesOnClick = () => {
      console.log(currentTask)
        setSelectedTab('preliminaries')
    }
    const installationOnClick = () => {
        setSelectedTab('installation')
    }
    const tncOnClick = () => {
        setSelectedTab('tnc')
    }
    const projectOnClick = (project, team) => {
        project.team = team
        console.log(project)
        setSelectedProject(project)
    }

    // const getRoleDisplayName = (role) => {
    //     const roleNames = {
    //         'foreman': 'Foremen',
    //         'project_engineer': 'Project Engineers',
    //         'skilled_installer': 'Skilled Installers',
    //         'installer': 'Installers'
    //     }
    //     return roleNames[role] || role
    // }

// className={`team-member role-${installer.job.toLowerCase().replace(' ', '-')} selected`}
    return (
        <>
            <div className='Content ProjectAssignment'>
                <div className="project-assignment-header">
                    <h2>Manage Manpower Plan</h2>
                    <p>Assign teams and forecast manpower for upcoming projects</p>
                </div>
                <div className='project-phase-buttons'>
                    <button onClick={preliminariesOnClick}>
                      Preliminaries
                    </button>
                    <button onClick={installationOnClick}>
                      Installation
                    </button>
                    <button onClick={tncOnClick}>
                      TNC
                    </button>
                </div>  
                <div className='project-assignment-content'>
                    <div className="preliminaries-list">
                        {preliminaries.length === 0 ? (
                            <div className="no-projects">
                                <h3>No Projects in Preliminaries</h3>
                                <p>There are currently no projects in the preliminaries phase.</p>
                            </div>
                        ) : selectedTab === 'preliminaries' ? (
                            preliminaries.map((project, index) => (
                                <div 
                                    key={index} 
                                    className={`project-card ${selectedProject.id === project.id ? 'selected' : ''}`}
                                    ref={(el) => (itemRefs.current[index] = {project, el})}
                                    onClick={() => {
                                        const fTeam = tentativeProjectTeams.filter(t => t.project_id === project.id)
                           
                                        projectOnClick(project, fTeam)
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        
                                    }}
                                >
                                    <div className="project-card-header">
                                        <div className="project-basic-info">
                                            <h3>{project.lift_name}</h3>
                                            <span className="project-id">Project #{project.id}</span>
                                        </div>
                                        <div className="project-status">
                                           <span className="status-badge preliminaries">{project.current_task}</span>
                                        </div>
                                        <div className="project-status">
                                            <span className="status-badge preliminaries">{project.status}</span>
                                        </div>
                                    </div>

                                    <div className="project-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Client:</span>
                                            <span className="detail-value">{project.client}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Description:</span>
                                            <span className="detail-value">{project.description}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Capacity:</span>
                                            <span className="detail-value">{project.cap} kg</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Stops:</span>
                                            <span className="detail-value">{project.stops}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Speed:</span>
                                            <span className="detail-value">{project.speed} m/min</span>
                                        </div>
                                    </div>

                                    <div className="project-timeline">
                                        <div className="timeline-item">
                                            <span className="timeline-label">Installation Start:</span>
                                      
                                            <span className="timeline-date">{project.installation_start_date !== null ? formatDate(project.installation_start_date) : 'no date'}</span>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-label">Testing and Commissioning Start:</span>
                                            <span className="timeline-date">{project.tnc_start_date !== null ? formatDate(project.tnc_start_date) : 'no date'}</span>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-label">Project End:</span>
                                            <span className="timeline-date">{project.project_end_date !== null ? formatDate(project.project_end_date) : 'no date'}</span>
                                        </div>
                                    </div>
                                    {(project.status === 'Planning') && (
                                      <>
                                        <button onClick={() => {

                                          if(!project.has_team) forecastSocket.emit('save', project, (ack) => {
                                            if (ack?.success) {
                                              window.alert('Team is saved')
                                              utilitiesSocket.emit('pe_projects', null, () => {
                                                window.location.reload()
                                              })
                                            } else {
                                              window.alert(ack.error)
                                              console.error(ack.error)
                                            }
                                          })
                                            
                                        }}>{!project.has_team ? 'Save' : 'Edit'}</button>
                                        <span>(Finalize)</span>
                                        {project.has_team ? (
                                          <button>Clear Team</button>
                                        ) : (<></>)}
                                      </>
                                      
                                      )}
                                      <h4>Project Engineer: {project.pe_fullname}</h4>
                                    {!project.has_team ? (
                                   <div className="project-team-info">
                                      {(() => {
                                        // ✅ Compute once per project card
                                        const projectTeams = tentativeProjectTeams.filter(
                                          (t) => Number(t.project_id) === Number(project.id)
                                        );
                                        const foreman = projectTeams.find(p => p.foreman_id !== null)// all share same foreman_id
                                        const installers = projectTeams.filter(
                                          (t) => t.emp_id && t.job && t.job !== "Foreman"
                                        );

                                        return (
                                          <>
                                            {/* Foreman Section */}
                                            <div>
                                              <h4>Foreman</h4>
                                              <div className="team-member-list">
                                                {foreman ? (
                                                  <div
                                                    className="team-member role-foreman selected"
                                                    onClick={() => {
                                                      const projectId = project.id;
                                                      const employee_id = foreman.foreman_id;
                                                      const date = project.installation_start_date.split("T")[0];
                                                      console.log(`🗑 Removing foreman ${foreman.foreman_username}`);
                                                      forecastSocket.emit("remove_forecast_member", {
                                                        projectId,
                                                        employee_id,
                                                        date,
                                                      });
                                                    }}
                                                  >
                                                    <span className="team-member-name">
                                                      {console.log(foreman)}
                                                      {foreman.foreman_full_name}
                                                    </span>
                                                    <span className="team-member-role">Foreman</span>
                                                  </div>
                                                ) : (
                                                  <div className="team-empty-state">No foreman assigned</div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Installers Section */}
                                            <div>
                                              <h4>Installers</h4>
                                              <div className="team-member-list">
                                                {installers.length > 0 ? (
                                                  installers.map((installer) => (
                                                    <div
                                                      key={installer.emp_id}
                                                      className={`team-member role-${installer.job
                                                        .toLowerCase()
                                                        .replace(" ", "-")} selected`}
                                                      onClick={() => {
                                                        const projectId = project.id;
                                                        const employee_id = installer.emp_id;
                                                        const date = project.installation_start_date.split("T")[0];
                                                        console.log(
                                                          `🗑 Removing ${installer.username} from project ${projectId}`
                                                        );
                                                        forecastSocket.emit("remove_forecast_member", {
                                                          projectId,
                                                          employee_id,
                                                          date,
                                                        });
                                                      }}
                                                    >
                                                      <span className="team-member-name">
                                                        
                                                        {installer.full_name}
                                                      </span>
                                                      <span className="team-member-role">{installer.job}</span>
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div className="team-empty-state">No installers assigned</div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>                                      
                                    ) : (
                                    <div className="project-team-info">
                                      {(() => {
                     
                                        console.log(installationTeams)
                                        const projectTeams = installationTeams.filter(
                                          (t) => Number(t.project_id) === Number(project.id)
                                        );
                                        const foreman = projectTeams.find(p => p.job === "Foreman");
                                        const installers = projectTeams.filter(
                                          (t) => t.job !== "Foreman"
                                        );

                                        return (
                                          <>
                                            {/* Foreman Section */}
                                            <div>
                                              <h4>Foreman</h4>
                                              <div className="team-member-list">
                                                {foreman ? (
                                                  <div
                                                    className="team-member role-foreman selected"
                                                  >
                                                    <span className="team-member-name">
                                                      {foreman.username}
                                                    </span>
                                                    <span className="team-member-role">Foreman</span>
                                                  </div>
                                                ) : (
                                                  <div className="team-empty-state">No foreman assigned</div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Installers Section */}
                                            <div>
                                              <h4>Installers</h4>
                                              <div className="team-member-list">
                                                {installers.length > 0 ? (
                                                  installers.map((installer) => (
                                                    <div
                                                      key={installer.employee_id}
                                                      className={`team-member role-${installer.job
                                                        .toLowerCase()
                                                        .replace(" ", "-")} selected`}
                                                    >
                                                      <span className="team-member-name">
                                                        {installer.username}
                                                      </span>
                                                      <span className="team-member-role">{installer.job}</span>
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div className="team-empty-state">No installers assigned</div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  )}


                                </div>
                            ))
                        ) :  selectedTab === 'installation' ? (
                           installations.map((project, index) => (
                                <div 
                                    key={index} 
                                    className={`project-card ${selectedProject.id === project.id ? 'selected' : ''}`}
                                    ref={(el) => (itemRefs.current[index] = {project, el})}
                                    onClick={() => {
                                        const fTeam = tentativeProjectTeams.filter(t => t.project_id === project.id)
                           
                                        projectOnClick(project, fTeam)
                                    }}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div className="project-card-header">
                                        <div className="project-basic-info">
                                            <h3>{project.lift_name}</h3>
                                            <span className="project-id">Project #{project.id}</span>
                                        </div>
                                        <div className="project-status">
                                            <span className="status-badge preliminaries">{project.status}</span>
                                        </div>
                                    </div>

                                    <div className="project-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Client:</span>
                                            <span className="detail-value">{project.client}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Description:</span>
                                            <span className="detail-value">{project.description}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Capacity:</span>
                                            <span className="detail-value">{project.cap} kg</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Stops:</span>
                                            <span className="detail-value">{project.stops}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Speed:</span>
                                            <span className="detail-value">{project.speed} m/min</span>
                                        </div>
                                    </div>

                                    <div className="project-timeline">
                                        <div className="timeline-item">
                                            <span className="timeline-label">Installation Start:</span>
                                            <span className="timeline-date">{formatDate(project.installation_start_date)}</span>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-label">Testing and Commissioning Start:</span>
                                            <span className="timeline-date">{formatDate(project.tnc_start_date)}</span>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-label">Project End:</span>
                                            <span className="timeline-date">{formatDate(project.project_end_date)}</span>
                                        </div>
                                    </div>
                              
                                   <div className="project-team-info">
                                      {(() => {
                                        console.log('hii')
                                        // ✅ Compute once per project card
                                        const projectTeams = tentativeProjectTeams.filter(
                                          (t) => Number(t.project_id) === Number(project.id)
                                        );
                                        const foreman = projectTeams.find(p => p.foreman_id !== null)// all share same foreman_id
                                        const installers = projectTeams.filter(
                                          (t) => t.emp_id && t.job && t.job !== "Foreman"
                                        );
                                        
                                        return (
                                          <>
                                            {/* Foreman Section */}
                                            <div>
                                              <h4>Foreman</h4>
                                              <div className="team-member-list">
                                                {foreman ? (
                                                  <div
                                                    className="team-member role-foreman selected"
                                                    onClick={() => {
                                                      const projectId = project.id;
                                                      const employee_id = foreman.foreman_id;
                                                      const date = project.installation_start_date.split("T")[0];
                                                      console.log(`🗑 Removing foreman ${foreman.foreman_username}`);
                                                      forecastSocket.emit("remove_forecast_member", {
                                                        projectId,
                                                        employee_id,
                                                        date,
                                                      });
                                                    }}
                                                  >
                                                    <span className="team-member-name">
                                                      {foreman.foreman_username}
                                                    </span>
                                                    <span className="team-member-role">Foreman</span>
                                                  </div>
                                                ) : (
                                                  <div className="team-empty-state">No foreman assigned</div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Installers Section */}
                                            <div>
                                              <h4>Installers</h4>
                                              <div className="team-member-list">
                                                {installers.length > 0 ? (
                                                  installers.map((installer) => (
                                                    <div
                                                      key={installer.emp_id}
                                                      className={`team-member role-${installer.job
                                                        .toLowerCase()
                                                        .replace(" ", "-")} selected`}
                                                      onClick={() => {
                                                        const projectId = project.id;
                                                        const employee_id = installer.emp_id;
                                                        const date = project.installation_start_date.split("T")[0];
                                                        console.log(
                                                          `🗑 Removing ${installer.full_name} from project ${projectId}`
                                                        );
                                                        forecastSocket.emit("remove_forecast_member", {
                                                          projectId,
                                                          employee_id,
                                                          date,
                                                        });
                                                      }}
                                                    >
                                                      <span className="team-member-name">
                                                        {installer.full_name}
                                                      </span>
                                                      <span className="team-member-role">{installer.job}</span>
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div className="team-empty-state">No installers assigned</div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>

                                </div>
                            ))) : selectedTab === 'tnc' ? (
                                 tnc.map((project, index) => (
                                <div 
                                    key={index} 
                                    className={`project-card ${selectedProject.id === project.id ? 'selected' : ''}`}
                                    ref={(el) => (itemRefs.current[index] = {project, el})}
                                    onClick={() => {
                                        const fTeam = tentativeProjectTeams.filter(t => t.project_id === project.id)
                           
                                        projectOnClick(project, fTeam)
                                    }}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div className="project-card-header">
                                        <div className="project-basic-info">
                                            <h3>{project.lift_name}</h3>
                                            <span className="project-id">Project #{project.id}</span>
                                        </div>
                                        <div className="project-status">
                                            <span className="status-badge preliminaries">{project.status}</span>
                                        </div>
                                    </div>

                                    <div className="project-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Client:</span>
                                            <span className="detail-value">{project.client}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Description:</span>
                                            <span className="detail-value">{project.description}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Capacity:</span>
                                            <span className="detail-value">{project.cap} kg</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Stops:</span>
                                            <span className="detail-value">{project.stops}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Speed:</span>
                                            <span className="detail-value">{project.speed} m/min</span>
                                        </div>
                                    </div>

                                    <div className="project-timeline">
                                        <div className="timeline-item">
                                            <span className="timeline-label">Installation Start:</span>
                                            <span className="timeline-date">{formatDate(project.installation_start_date)}</span>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-label">Testing and Commissioning Start:</span>
                                            <span className="timeline-date">{formatDate(project.tnc_start_date)}</span>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-label">Project End:</span>
                                            <span className="timeline-date">{formatDate(project.project_end_date)}</span>
                                        </div>
                                    </div>

                                   <div className="project-team-info">
                                      {(() => {
                                        // ✅ Compute once per project card
                                        const projectTeams = tentativeProjectTeams.filter(
                                          (t) => Number(t.project_id) === Number(project.id)
                                        );
                                        const foreman = projectTeams.length > 0 ? projectTeams[0] : null; // all share same foreman_id
                                        const installers = projectTeams.filter(
                                          (t) => t.emp_id && t.job && t.job !== "Foreman"
                                        );

                                        return (
                                          <>
                                            {/* Foreman Section */}
                                            <div>
                                              <h4>Foreman</h4>
                                              <div className="team-member-list">
                                                {foreman ? (
                                                  <div
                                                    className="team-member role-foreman selected"
                                                    onClick={() => {
                                                      const projectId = project.id;
                                                      const employee_id = foreman.foreman_id;
                                                      const date = project.installation_start_date.split("T")[0];
                                                      console.log(`🗑 Removing foreman ${foreman.foreman_username}`);
                                                      forecastSocket.emit("remove_forecast_member", {
                                                        projectId,
                                                        employee_id,
                                                        date,
                                                      });
                                                    }}
                                                  >
                                                    <span className="team-member-name">
                                                      {foreman.foreman_username}
                                                    </span>
                                                    <span className="team-member-role">Foreman</span>
                                                  </div>
                                                ) : (
                                                  <div className="team-empty-state">No foreman assigned</div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Installers Section */}
                                            <div>
                                              <h4>Installers</h4>
                                              <div className="team-member-list">
                                                {installers.length > 0 ? (
                                                  installers.map((installer) => (
                                                    <div
                                                      key={installer.emp_id}
                                                      className={`team-member role-${installer.job
                                                        .toLowerCase()
                                                        .replace(" ", "-")} selected`}
                                                      onClick={() => {
                                                        const projectId = project.id;
                                                        const employee_id = installer.emp_id;
                                                        const date = project.installation_start_date.split("T")[0];
                                                        console.log(
                                                          `🗑 Removing ${installer.full_name} from project ${projectId}`
                                                        );
                                                        forecastSocket.emit("remove_forecast_member", {
                                                          projectId,
                                                          employee_id,
                                                          date,
                                                        });
                                                      }}
                                                    >
                                                      <span className="team-member-name">
                                                        {installer.full_name}
                                                      </span>
                                                      <span className="team-member-role">{installer.job}</span>
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div className="team-empty-state">No installers assigned</div>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>

                                </div>
                            ))
                            ) : (
                              <div>Nothing should appear here</div>
                            )
                        }
                    </div>
                    {selectedProject && selectedProject.lift_name && selectedProject.installation_start_date !== null ? (
                    <div className='forecasted-team'>
                        <div className="forecasted-team-header">
                        <h3>Available Personnel for {selectedProject.lift_name}</h3>
                        <p>Team members available by {formatDate(selectedProject.installation_start_date)}</p>
                        </div>
                        
                        <div className="group-tabs">
                        <button className={`group-tab ${activeRoleTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveRoleTab('all')}>
                            All Personnel ({teamsNoProject.concat(forecastData).length})
                        </button>
                        {selectedTab === 'preliminaries' && (
                          <>
                            <button className={`group-tab ${activeRoleTab === 'no-project' ? 'active' : ''}`}
                                    onClick={() => setActiveRoleTab('no-project')}>
                                No Project ({teamsNoProject.length})
                            </button>
                            <button className={`group-tab ${activeRoleTab === 'forecasted' ? 'active' : ''}`}
                                    onClick={() => setActiveRoleTab('forecasted')}>
                                Forecasted ({forecastData.length})
                            </button>                          
                          </>
                        )}

                        </div>

                        <div className="personnel-list">
                        {filteredPersonnel.length > 0 ? (
                            <div className="personnel-grid">
                            {filteredPersonnel.map((person, index) => (
                            <div 
                                style={{cursor: 'pointer'}}
                                key={index} 
                                className={`personnel-card group-${person.group}`}
                               onClick={() => {
                                    const { employee_id, job } = person;
                                    const projectId = selectedProject.id;
                                    const date = selectedProject.installation_start_date.split("T")[0];
                                    console.log(projectId)
                                    // if person is already in tentative project team → remove
                                    const alreadyAssigned = tentativeProjectTeams.some(
                                        t => Number(t.project_id) === Number(projectId) &&
                                            (t.emp_id === employee_id || t.foreman_id === employee_id)
                                    );

                                    if (alreadyAssigned) {
                                        // remove from project
                                        forecastSocket.emit("remove_forecast_member", { projectId, employee_id, date });
                                    } else {
                                        if (job === "Foreman") {
                                        // assign or update foreman
                                        forecastSocket.emit("assign_foreman", { projectId, employee_id, date });
                                        } else {
                                        // normal team member
                                        forecastSocket.emit("insert_forecast_member", { projectId, employee_id, date });
                                        }
                                    }
                                    }}
                            >   
                                <div className="personnel-group-badge">
                                    {person.group === 'no-project' ? 'Available' : 'Forecasted'}
                                </div>
                                <div className="personnel-name">{person.full_name}</div>
                                <div className="personnel-id">ID: {person.employee_id}</div>
                                <div className={`personnel-job job-${person.job.toLowerCase().replace(' ', '-')}`}>
                                    {person.job}
                                </div>
                                <button className="select-person-btn">Select for Team</button>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className="no-personnel">
                            <p>No personnel available for the selected group</p>
                            </div>
                        )}
                        </div>

                        <div className="forecast-summary">
                        <h4>Availability Summary</h4>
                        <div className="summary-stats">
                            <div className="summary-stat">
                            <span className="stat-label">Total Available:</span>
                            <span className="stat-count">{teamsNoProject.concat(forecastData).length}</span>
                            </div>
                            <div className="summary-stat">
                            <span className="stat-label">No Project:</span>
                            <span className="stat-count">{teamsNoProject.length}</span>
                            </div>
                            <div className="summary-stat">
                            <span className="stat-label">Forecasted:</span>
                            <span className="stat-count">{forecastData.length}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    ) : (
                      <div className='forecasted-team'>
                        Cannot make forecast. Need dates
                      </div>
                    )}
                </div>
                
                </div>
       
        </>
    )
}

export default ProjectAssignment