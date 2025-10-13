import {useRef, useState, useEffect} from 'react'
import { useSharedSocket } from '../../Context/SocketContext.js';
import { useStoreState } from 'easy-peasy';
import '../../css/ProjectAssignment.css';

const ProjectAssignment = ({teamsByGroup}) => {
    const forecastSocket = useSharedSocket()
    const forecastData = useStoreState(state => state.forecastData)
    const teamsNoProject = useStoreState(state => state.teamsNoProject)
    const tentativeProjectTeams = useStoreState(state => state.tentativeProjectTeams)
    const [selectedProject, setSelectedProject] = useState({})
    const [activeRoleTab, setActiveRoleTab] = useState('all')

// Filter personnel based on active tab
    const filteredPersonnel = teamsNoProject.concat(forecastData).filter(person => {
    if (activeRoleTab === 'all') return true
    return person.group === activeRoleTab
    })

    const itemRefs = useRef([]);
    const projects = useStoreState(state => state.projects)
    const preliminaries = projects.filter(p => p.status === 'Structural/Manufacturing' || p.status === 'Preliminaries' || p.status === 'Planning')
    console.log(projects)
    
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

            }
        }, [forecastSocket])

        useEffect(() => {
            if(forecastData && teamsNoProject && tentativeProjectTeams) {
                // console.log(forecastData)
                // console.log(teamsNoProject)
                console.log(tentativeProjectTeams)
            }
        }, [forecastData, teamsNoProject, tentativeProjectTeams])

    useEffect(() => {
        if (!forecastSocket || !selectedProject.installation_start_date) return 
        console.log(selectedProject.id)

        console.log(teamsNoProject.concat(forecastData))
        forecastSocket.emit('forecast_team', selectedProject.installation_start_date.split("T")[0])
        
    }, [selectedProject, teamsByGroup, forecastData, forecastSocket, teamsNoProject])

    const projectOnClick = (project) => {
    
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


    return (
        <>
            <div className='Content ProjectAssignment'>
                <div className="project-assignment-header">
                    <h2>Projects in Preliminaries Phase</h2>
                    <p>Assign teams and forecast manpower for upcoming projects</p>
                </div>
                <div className='project-assignment-content'>
                    <div className="preliminaries-list">
                        {preliminaries.length === 0 ? (
                            <div className="no-projects">
                                <h3>No Projects in Preliminaries</h3>
                                <p>There are currently no projects in the preliminaries phase.</p>
                            </div>
                        ) : (
                            preliminaries.map((project, index) => (
                                <div 
                                    key={index} 
                                    className={`project-card ${selectedProject.id === project.id ? 'selected' : ''}`}
                                    ref={(el) => (itemRefs.current[index] = {project, el})}
                                    onClick={() => projectOnClick(project)}
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
                                        <div>
                                            Foreman
                                            <ul>

                                            </ul>
                                        </div>
                                        <div>
                                            Installers (Skilled Included)
                                            <ul>

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedProject && selectedProject.lift_name && (
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
                        <button className={`group-tab ${activeRoleTab === 'no-project' ? 'active' : ''}`}
                                onClick={() => setActiveRoleTab('no-project')}>
                            No Project ({teamsNoProject.length})
                        </button>
                        <button className={`group-tab ${activeRoleTab === 'forecasted' ? 'active' : ''}`}
                                onClick={() => setActiveRoleTab('forecasted')}>
                            Forecasted ({forecastData.length})
                        </button>
                        </div>

                        <div className="personnel-list">
                        {filteredPersonnel.length > 0 ? (
                            <div className="personnel-grid">
                            {filteredPersonnel.map((person, index) => (
                                <div key={index} className={`personnel-card group-${person.group}`}>
                                <div className="personnel-group-badge">
                                    {person.group === 'no-project' ? 'Available' : 'Forecasted'}
                                </div>
                                <div className="personnel-name">{person.username}</div>
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
                    )}
                </div>
                
                </div>
       
        </>
    )
}

export default ProjectAssignment