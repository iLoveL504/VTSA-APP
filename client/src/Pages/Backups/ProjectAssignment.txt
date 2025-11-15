import {useRef, useState, useEffect} from 'react'
import { useSharedSocket } from '../../Context/SocketContext.js';
import { useStoreState } from 'easy-peasy';
import { Axios } from '../../api/axios.js';
import '../../css/ProjectAssignment.css';

const SaveTeamModal = ({ isOpen, onClose, project, forecastSocket, utilitiesSocket, team }) => {
    if (!isOpen) return null;
    const teamIds = team.map(p => p.emp_id === null ? p.foreman_id : p.emp_id)
    const Ids = [...teamIds, ...[project.project_engineer_id]]
    
    const handleSave = () => {
        forecastSocket.emit('save', project, (ack) => {
            if (ack?.success) {
                window.alert('Team saved successfully!');
                utilitiesSocket.emit('pe_projects', null, () => {
                    window.location.reload();
                });
                utilitiesSocket.emit("new_notification", {
                    subject: `Project Assigned`,
                    body: `Project Assigned for ${project.lift_name} (${project.client})`,
                    Ids
                }, (ack) => {
                    if (ack?.success) {
                        utilitiesSocket.emit("refresh_project_data");
                    } else {
                      console.log('error');
                    }
                });
            } else {
                window.alert(ack?.error || 'Failed to save team');
            }
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Save Team for {project?.lift_name}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to save this team assignment? This action cannot be undone.</p>
                    <div className="project-info">
                        <strong>Project:</strong> {project?.lift_name}<br/>
                        <strong>ID:</strong> #{project?.id}
                    </div>
                    <h3>Team Composition</h3>
                    <div className="team-info">
                      {team.map((t, i)=> (
                        <div key={i}>{t.foreman_full_name ? 
                          (`${t.foreman_full_name} ID#${t.foreman_id} (Foreman)`) : 
                          (`${t.full_name} ID#${t.emp_id} (${t.job})`)}</div>
                      ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave}>Save Team</button>
                </div>
            </div>
        </div>
    );
};

const ProjectAssignment = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamView, setTeamView] = useState('pending');
    const {forecastSocket, utilitiesSocket} = useSharedSocket()

    const forecastData = useStoreState(state => state.forecastData)
    const teamsNoProject = useStoreState(state => state.teamsNoProject)
    const tentativeProjectTeams = useStoreState(state => state.tentativeProjectTeams)
    const installationTeams = useStoreState(state => state.installationTeams)
    const [selectedProject, setSelectedProject] = useState({})
    const [activeRoleTab, setActiveRoleTab] = useState('all')
    const [teamToSave, setTeamToSave] = useState([])
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editTeamSelection, setEditTeamSelection] = useState([])
    const [editedTeam, setEditedTeam] = useState([])

    const [selectedTab, setSelectedTab] = useState('preliminaries')

    // Filter personnel based on active tab
    const filteredPersonnel = teamsNoProject.concat(forecastData).filter(person => {
        if (activeRoleTab === 'all') return true
        return person.group === activeRoleTab
    })

    const itemRefs = useRef([]);
    const projects = useStoreState(state => state.projects)
    
    // Simplified project filtering by phase
    const getProjectsByPhase = (phase) => {
        switch(phase) {
            case 'preliminaries':
                return projects.filter(p => 
                    p.status === 'Structural/Manufacturing' || 
                    p.status === 'Preliminaries' || 
                    p.status === 'Planning'
                );
            case 'installation':
                return projects.filter(p => p.status === 'Installation');
            case 'tnc':
                return projects.filter(p => p.status === 'Test and Comm');
            default:
                return [];
        }
    };

    // Get current phase projects
    const currentPhaseProjects = getProjectsByPhase(selectedTab);
    
    // Separate projects by has_team status for preliminaries only
    const projectsNoTeam = selectedTab === 'preliminaries' 
        ? currentPhaseProjects.filter(p => !p.has_team)
        : [];
    const projectsWithTeam = selectedTab === 'preliminaries' 
        ? currentPhaseProjects.filter(p => p.has_team)
        : currentPhaseProjects;

    // Current projects based on toggle (only for preliminaries)
    const currentProjects = selectedTab === 'preliminaries' 
        ? (teamView === 'pending' ? projectsNoTeam : projectsWithTeam)
        : currentPhaseProjects;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }; 
    console.log(currentProjects)
    const editBlur = () => {
      setEditingProjectId(null)
      setEditTeamSelection([])
      setEditedTeam([])
    }

    useEffect(() => {
        if(forecastSocket) {
            forecastSocket.emit('no_project_team')
            forecastSocket.emit('tentative_project_team')
            utilitiesSocket.emit('refresh_project_data')
            forecastSocket.emit('installation_teams')
        }
    }, [forecastSocket])

    useEffect(() => {
        if (!forecastSocket || !selectedProject.installation_start_date) return 
        forecastSocket.emit('forecast_team', selectedProject.installation_start_date.split("T")[0])
    }, [selectedProject, forecastSocket])

    const handleEditClick = async (projectId) => {
        if (editingProjectId === projectId) {
            // Save logic
            if (editedTeam.length === 0) {
                window.alert('Please provide a team')
                return
            }
            if (editedTeam.filter(e => e.job === 'Foreman').length > 1) {
                window.alert('Maximum of one (1) foreman allowed')
                return      
            }
            if (!editedTeam.find(e =>  e.job === 'Foreman')) {
                window.alert('Team requires foreman')
                return
            }
            if (!editedTeam.find(e =>  e.job === 'Installer')) {
                window.alert('Team requires at least one (1) Installer')
                return
            }
            if (!editedTeam.find(e =>  e.job === 'Skilled Installer')) {
                window.alert('Team requires at least one (1) Skilled Installer')
                return
            }
            try {
                const payload = { editedTeam }
                const response = await Axios.post(`api/teams/edit/${projectId}`, payload)
                if (!response?.data.success) {
                    window.alert('Error in editing team')
                }     
            } catch (err) {
                console.error(err)
            }
            window.location.reload()
            setEditingProjectId(null);
        } else {
            // Start editing    
           console.log(installationTeams[projectId] === undefined)
            if(installationTeams[projectId] === undefined) {
                setEditTeamSelection(teamsNoProject)
                setEditedTeam([])
            } else {
                console.log(installationTeams)
                 console.log(Object.keys(installationTeams).length === 0)
                const projInstallationTeam = [...installationTeams[projectId].team, ...teamsNoProject]
                setEditTeamSelection(projInstallationTeam)
                setEditedTeam(installationTeams[projectId].team)                
            }
            setEditingProjectId(projectId);
        }
    };

    const handlePhaseClick = (phase) => {
        setSelectedTab(phase);
        editBlur();
    }

    const projectOnClick = (project, team) => {
        editBlur();
        project.team = team;
        setSelectedProject(project);
    }

    const ProjectCard = ({ project, index, hasTeam = false, phase = 'preliminaries' }) => {
        const fTeam = tentativeProjectTeams.filter(t => t.project_id === project.id);
        
        const projectTeams = hasTeam 
            ? installationTeams[project.id]?.team || []
            : tentativeProjectTeams.filter(t => Number(t.project_id) === Number(project.id));
        
        const foreman = hasTeam 
            ? projectTeams.find(p => p.job === "Foreman")
            : projectTeams.find(p => p.foreman_id !== null);
            
        const installers = hasTeam
            ? projectTeams.filter(t => t.job !== "Foreman")
            : projectTeams.filter(t => t.emp_id && t.job && t.job !== "Foreman");

        return (
            <div 
                key={index} 
                className={`project-card 
                  ${selectedProject.id === project.id ? 'selected' : ''} 
                  ${editingProjectId === project.id ? 'editing' : ''}
                `}
                ref={(el) => (itemRefs.current[index] = {project, el})}
                onClick={() => projectOnClick(project, fTeam)}
                style={{ cursor: 'pointer' }}
            >
                <div className="project-card-header">
                    <div className="project-basic-info">
                        <h3>{project.lift_name}</h3>
                        <span className="project-id">Project #{project.id}</span>
                    </div>
                    <div className="project-status">
                        <span className={`status-badge ${phase}`}>{project.current_task}</span>
                    </div>
                    {phase === 'preliminaries' && (
                        <div className="project-status">
                            <span className={`status-badge ${hasTeam ? 'finalized' : 'tentative'}`}>
                                {hasTeam ? 'Team Finalized' : 'Team Pending'}
                            </span>
                        </div>
                    )}
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
                        <span className="timeline-date">{project.installation_start_date ? formatDate(project.installation_start_date) : 'no date'}</span>
                    </div>
                    <div className="timeline-item">
                        <span className="timeline-label">Testing and Commissioning Start:</span>
                        <span className="timeline-date">{project.tnc_start_date ? formatDate(project.tnc_start_date) : 'no date'}</span>
                    </div>
                    <div className="timeline-item">
                        <span className="timeline-label">Project End:</span>
                        <span className="timeline-date">{project.project_end_date ? formatDate(project.project_end_date) : 'no date'}</span>
                    </div>
                </div>

                {phase === 'preliminaries' && !hasTeam && (
                    <button onClick={(e) => {
                        const fTeam = tentativeProjectTeams.filter(t => t.project_id === project.id)
                        setTeamToSave(fTeam)
                        e.stopPropagation();
                        setSelectedProject(project);
                        setIsModalOpen(true);
                    }}>
                        Save Team
                    </button>
                )}

                {/* Edit button available for ALL phases if project has team */}
                {(hasTeam || installationTeams[project.id]?.team) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(project.id);
                        }}
                        className="btn-edit-save"
                    >
                        {editingProjectId === project.id ? 'Save Changes' : 'Edit Team'}
                    </button>
                )}

                <h4>Project Engineer: {project.pe_fullname}</h4>
                
                {(phase === 'preliminaries' || (phase !== 'preliminaries' && projectTeams.length > 0)) && (
                   <div className="project-team-info">
    <div>
        <h4>Foreman</h4>
        <div className="team-member-list">
            {foreman ? (
                <div 
                    className={`team-member role-foreman ${!hasTeam ? 'editable' : ''}`}
                    onClick={(e) => {
                        if (!hasTeam) {
                            e.stopPropagation();
                            const employee_id = foreman.foreman_id || foreman.employee_id;
                            const projectId = project.id;
                            const date = project.installation_start_date?.split("T")[0];
                            forecastSocket.emit("remove_forecast_member", { projectId, employee_id, date });
                        }
                    }}
                >
                    <span className="team-member-name">
                        {hasTeam ? foreman.full_name : (foreman.foreman_full_name || foreman.full_name)}
                    </span>
                    <span className="team-member-role">Foreman</span>
                    {!hasTeam && <span className="remove-indicator" title="Click to remove">×</span>}
                </div>
            ) : (
                <div className="team-empty-state">No foreman assigned</div>
            )}
        </div>
    </div>

    <div>
        <h4>Installers</h4>
        <div className="team-member-list">
            {installers.length > 0 ? (
                installers.map((installer) => (
                    <div
                        key={hasTeam ? installer.employee_id : installer.emp_id}
                        className={`team-member role-${installer.job.toLowerCase().replace(" ", "-")} ${!hasTeam ? 'editable' : ''}`}
                        onClick={(e) => {
                            if (!hasTeam) {
                                e.stopPropagation();
                                const employee_id = installer.emp_id || installer.employee_id;
                                const projectId = project.id;
                                const date = project.installation_start_date?.split("T")[0];
                                forecastSocket.emit("remove_forecast_member", { projectId, employee_id, date });
                            }
                        }}
                    >
                        <span className="team-member-name">
                            {installer.full_name} 
                        </span>
                        <span className="team-member-role">{installer.job}</span>
                        {!hasTeam && <span className="remove-indicator" title="Click to remove">×</span>}
                    </div>
                ))
            ) : (
                <div className="team-empty-state">No installers assigned</div>
            )}
        </div>
    </div>     
</div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className='Content ProjectAssignment'>
                <div className='project-phase-buttons'>
                    <button 
                        onClick={() => handlePhaseClick('preliminaries')}
                        className={selectedTab === 'preliminaries' ? 'active' : ''}
                    >
                        Preliminaries ({getProjectsByPhase('preliminaries').length})
                    </button>
                    <button 
                        onClick={() => handlePhaseClick('installation')}
                        className={selectedTab === 'installation' ? 'active' : ''}
                    >
                        Installation ({getProjectsByPhase('installation').length})
                    </button>
                    <button 
                        onClick={() => handlePhaseClick('tnc')}
                        className={selectedTab === 'tnc' ? 'active' : ''}
                    >
                        TNC ({getProjectsByPhase('tnc').length})
                    </button>
                </div>  
                
                <div className='project-assignment-layout'>
                    {/* Left Side - Projects */}
                    <div className='projects-container'>
                        {/* Only show team toggle for preliminaries */}
                        {selectedTab === 'preliminaries' && (
                            <div className="team-view-toggle">
                                <button 
                                    className={`toggle-btn ${teamView === 'pending' ? 'active' : ''}`}
                                    onClick={() => setTeamView('pending')}
                                >
                                    Pending Teams ({projectsNoTeam.length})
                                </button>
                                <button 
                                    className={`toggle-btn ${teamView === 'assigned' ? 'active' : ''}`}
                                    onClick={() => setTeamView('assigned')}
                                >
                                    Assigned Teams ({projectsWithTeam.length})
                                </button>
                            </div>
                        )}

                        <div className="projects-list">
                            {currentProjects.length === 0 ? (
                                <div className="no-projects">
                                    <h3>
                                        {selectedTab === 'preliminaries' 
                                            ? (teamView === 'pending' 
                                                ? 'No Projects Pending Team Assignment' 
                                                : 'No Projects with Assigned Teams')
                                            : `No ${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Projects`
                                        }
                                    </h3>
                                </div>
                            ) : (
                                currentProjects.map((project, index) => (
                                    <ProjectCard 
                                        key={index} 
                                        project={project} 
                                        index={index}
                                        hasTeam={selectedTab === 'preliminaries' ? teamView === 'assigned' : true}
                                        phase={selectedTab}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Side - Personnel Selection */}
                    <div className='personnel-container'>
                        {/* Only show personnel selection for preliminaries with pending teams */}
                        {selectedTab === 'preliminaries' && teamView === 'pending' && (
                            <>
                                {selectedProject && selectedProject.lift_name && selectedProject.installation_start_date ? (
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
                                            
                                            {!selectedProject.has_team ? (
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
                                            ) : (
                                                <button className={`group-tab ${activeRoleTab === 'no-project' ? 'active' : ''}`}
                                                        onClick={() => setActiveRoleTab('no-project')}>
                                                    Available Technicians ({teamsNoProject.length})
                                                </button>
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
                                                                
                                                                const alreadyAssigned = tentativeProjectTeams.some(
                                                                    t => Number(t.project_id) === Number(projectId) &&
                                                                        (t.emp_id === employee_id || t.foreman_id === employee_id)
                                                                );

                                                                if (alreadyAssigned) {
                                                                    forecastSocket.emit("remove_forecast_member", { projectId, employee_id, date });
                                                                } else {
                                                                    if (job === "Foreman") {
                                                                        forecastSocket.emit("assign_foreman", { projectId, employee_id, date });
                                                                    } else {
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
                                                            <div>Island: {person.island_group}</div>
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
                                                {!selectedProject.has_team && (
                                                    <div className="summary-stat">
                                                        <span className="stat-label">Forecasted:</span>
                                                        <span className="stat-count">{forecastData.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                <div className='forecasted-team'>
                                    <div className="no-dates-warning">
                                        <div className="warning-icon">
                                            <i className="fas fa-calendar-times"></i>
                                        </div>
                                        <h3>Cannot Make Forecast</h3>
                                        <p>Project <strong>{selectedProject.lift_name}</strong> needs installation dates set before team assignment.</p>
                                        <div className="warning-details">
                                            <p>Please ensure the following dates are set:</p>
                                            <ul>
                                                <li>Installation Start Date</li>
                                                <li>Testing & Commissioning Start Date</li>
                                                <li>Project End Date</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </>
                        )}

                        {/* Show team editing for ALL phases when editing */}
                        {editingProjectId && (
                            <div className='forecasted-team'>
                                <div className="forecasted-team-header">
                                    <h3>Edit Personnel for {selectedProject.lift_name}</h3>
                                    <p>Phase: {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</p>
                                </div>

                                <div className="current-team-display">
                                    <h4>Current Team Composition</h4>
                                    
                                    <div className="team-roles">
                                        {/* Foreman Section */}
                                        <div className="team-role-group">
                                            <div className="role-header">
                                                <span className="role-title">Foreman</span>
                                                <span className="role-count">
                                                    {editedTeam.filter(t => t.job === 'Foreman').length}
                                                </span>
                                            </div>
                                            <div className="role-members">
                                                {editedTeam.filter(t => t.job === 'Foreman').map(member => (
                                                    <div 
                                                        key={member.employee_id} 
                                                        className="team-member-card"
                                                        onClick={() => {
                                                            setEditedTeam(prev => prev.filter(e => e.employee_id !== member.employee_id));
                                                        }}
                                                    >
                                                        <div className="member-info">
                                                            <span className="member-name">{member.full_name}</span>
                                                            <span className="member-id">ID: {member.employee_id}</span>
                                                        </div>
                                                        <div className="remove-indicator" title="Click to remove">
                                                            ×
                                                        </div>
                                                    </div>
                                                ))}
                                                {editedTeam.filter(t => t.job === 'Foreman').length === 0 && (
                                                    <div className="empty-role">No foreman assigned</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Installers Section */}
                                        <div className="team-role-group">
                                            <div className="role-header">
                                                <span className="role-title">Installation Team</span>
                                                <span className="role-count">
                                                    {editedTeam.filter(t => t.job !== 'Foreman').length}
                                                </span>
                                            </div>
                                            <div className="role-members">
                                                {editedTeam.filter(t => t.job !== 'Foreman').map(member => (
                                                    <div 
                                                        key={member.employee_id} 
                                                        className="team-member-card"
                                                        onClick={() => {
                                                            setEditedTeam(prev => prev.filter(e => e.employee_id !== member.employee_id));
                                                        }}
                                                    >
                                                        <div className="member-info">
                                                            <span className="member-name">{member.full_name}</span>
                                                            <div className="member-details">
                                                                <span className="member-job">{member.job}</span>
                                                                <span className="member-id">ID: {member.employee_id}</span>
                                                            </div>
                                                        </div>
                                                        <div className="remove-indicator" title="Click to remove">
                                                            ×
                                                        </div>
                                                    </div>
                                                ))}
                                                {editedTeam.filter(t => t.job !== 'Foreman').length === 0 && (
                                                    <div className="empty-role">No installers assigned</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="group-tabs">
                                    <div className="personnel-list">
                                        {editTeamSelection.length > 0 ? (
                                            <div className="personnel-grid">
                                                {editTeamSelection.map((person, index) => (
                                                    <div 
                                                        style={{cursor: 'pointer'}}
                                                        key={index} 
                                                        className={`personnel-card group-${person.group}`}
                                                        onClick={() => {
                                                            setEditedTeam(prev => {
                                                                const alreadyAdded = prev.some(e => e.employee_id === person.employee_id);
                                                                if (alreadyAdded) {
                                                                    return prev.filter(e => e.employee_id !== person.employee_id);
                                                                } else {
                                                                    return [...prev, person];
                                                                }
                                                            });
                                                        }}
                                                    >   
                                                        <div className="personnel-name">
                                                            {person.full_name}
                                                            {editedTeam.map(e => e.employee_id).includes(person.employee_id) ? ' (Selected)' : ''}
                                                        </div>
                                                        <div className="personnel-id">ID: {person.employee_id}</div>
                                                        <div className={`personnel-job job-${person.job.toLowerCase().replace(' ', '-')}`}>
                                                            {person.job}
                                                        </div>
                                                        <div>Island: {person.island_group}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-personnel">
                                                <p>No personnel available for the selected group</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* For installation and TNC phases when not editing, show project details */}
                        {(selectedTab === 'installation' || selectedTab === 'tnc') && !editingProjectId && (
        <div className="phase-info">
            <div className="phase-header">
                <h3>{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Phase</h3>
                <span className="phase-badge">{selectedTab}</span>
            </div>
            <div className="phase-stats">
                <div className="stat-item">
                    <span className="stat-number">{currentProjects.length}</span>
                    <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">
                        {currentProjects.filter(p => installationTeams[p.id]?.team).length}
                    </span>
                    <span className="stat-label">Teams Assigned</span>
                </div>
            </div>
            
            {selectedProject && (
                <div className="selected-project-info">
                    <h4>Selected Project</h4>
                    <div className="project-detail-card">
                        <div className="project-title">
                            <h5>{selectedProject.lift_name}</h5>
                            <span className="project-id">#{selectedProject.id}</span>
                        </div>
                        <div className="project-meta">
                            <div className="meta-item">
                                <span className="meta-label">Client:</span>
                                <span className="meta-value">{selectedProject.client}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Status:</span>
                                <span className="meta-value status">{selectedProject.current_task}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Installation Start:</span>
                                <span className="meta-value">
                                    {selectedProject.installation_start_date 
                                        ? formatDate(selectedProject.installation_start_date) 
                                        : 'Not scheduled'
                                    }
                                </span>
                            </div>
                        </div>
                        
                        {installationTeams[selectedProject.id]?.team && (
                            <div className="team-assignment-info">
                                <div className="team-header">
                                    <strong>Team Assigned</strong>
                                    <span className="team-count">
                                        {installationTeams[selectedProject.id].team.length} members
                                    </span>
                                </div>
                                {/* <button 
                                    onClick={() => handleEditClick(selectedProject.id)}
                                    className="btn-edit-team"
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit Team
                                </button> */}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {!selectedProject && (
                <div className="no-project-selected">
                    <div className="prompt-icon">
                        <i className="fas fa-mouse-pointer"></i>
                    </div>
                    <p>Select a project to view details</p>
                </div>
            )}
        </div>
                        )}
                    </div>
                </div>
            </div>
            
            <SaveTeamModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
                forecastSocket={forecastSocket}
                utilitiesSocket={utilitiesSocket}
                team={teamToSave}
            />       
        </>
    )
}

export default ProjectAssignment