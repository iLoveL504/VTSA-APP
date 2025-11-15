import {useRef, useState, useEffect} from 'react'
import { useSharedSocket } from '../../Context/SocketContext.js';
import { useStoreState } from 'easy-peasy';
import { Axios } from '../../api/axios.js';
import '../../css/ProjectAssignment.css';

// Material-UI Icons
import {
  Groups as TeamsIcon,
  Groups2 as GroupsIcon,
  Engineering as EngineeringIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Construction as ConstructionIcon,
  Build as BuildIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  GroupAdd as GroupAddIcon
} from '@mui/icons-material';

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
                    <TeamsIcon className="modal-icon" />
                    <h3>Finalize Team Assignment</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="project-summary">
                        <BusinessIcon className="summary-icon" />
                        <div className="summary-content">
                            <h4>{project?.lift_name}</h4>
                            <p>Project #{project?.id} • {project?.client}</p>
                        </div>
                    </div>
                    
                    <div className="team-composition">
                        <h4>Team Composition</h4>
                        <div className="team-members-list">
                            {team.map((t, i) => (
                                <div key={i} className="team-member-summary">
                                    <PersonIcon className="member-icon" />
                                    <div className="member-details">
                                        <span className="member-name">
                                            {t.foreman_full_name || t.full_name}
                                        </span>
                                        <span className="member-role">
                                            {t.foreman_full_name ? 'Foreman' : t.job}
                                        </span>
                                    </div>
                                    <span className="member-id">ID#{t.foreman_id || t.emp_id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="confirmation-message">
                        <WarningIcon className="warning-icon" />
                        <p>Are you sure you want to save this team assignment? This action cannot be undone.</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        <CancelIcon className="btn-icon" />
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        <SaveIcon className="btn-icon" />
                        Confirm & Save
                    </button>
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
    
    // New state for filters
    const [jobFilter, setJobFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filter personnel based on active tab, job filter, and search
    const filteredPersonnel = teamsNoProject.concat(forecastData).filter(person => {
        // Group filter
        if (activeRoleTab !== 'all' && person.group !== activeRoleTab) return false;
        
        // Job filter
        if (jobFilter !== 'all' && person.job !== jobFilter) return false;
        
        // Search filter
        if (searchTerm && !person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !person.employee_id.toString().includes(searchTerm)) {
            return false;
        }
        
        return true;
    });

    const editBlur = () => {
      setEditingProjectId(null)
      setEditTeamSelection([])
      setEditedTeam([])
    }

    useEffect(() => {
        if(forecastSocket && utilitiesSocket) {
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
            if(installationTeams[projectId] === undefined) {
                setEditTeamSelection(teamsNoProject)
                setEditedTeam([])
            } else {
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
            >
                <div className="project-card-header">
                    <div className="project-main-info">
                        <div className="project-title-section">
                            <BusinessIcon className="project-icon" />
                            <div>
                                <h3>{project.lift_name}</h3>
                                <span className="project-id">#{project.id}</span>
                            </div>
                        </div>
                        <div className="project-status-badges">
                            <span className={`status-badge phase-${phase}`}>
                                {phase.charAt(0).toUpperCase() + phase.slice(1)}
                            </span>
                            {phase === 'preliminaries' && (
                                <span className={`status-badge team-${hasTeam ? 'finalized' : 'pending'}`}>
                                    {hasTeam ? 'Team Finalized' : 'Team Pending'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="project-client">
                        <span className="client-name">{project.client}</span>
                    </div>
                </div>

                <div className="project-details-grid">
                    <div className="detail-item">
                        <span className="detail-label">Capacity</span>
                        <span className="detail-value">{project.cap} kg</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Stops</span>
                        <span className="detail-value">{project.stops}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Speed</span>
                        <span className="detail-value">{project.speed} m/min</span>
                    </div>
                </div>

                <div className="project-timeline">
                    <div className="timeline-item">
                        <CalendarIcon className="timeline-icon" />
                        <div className="timeline-content">
                            <span className="timeline-label">Installation Start</span>
                            <span className="timeline-date">
                                {project.installation_start_date ? formatDate(project.installation_start_date) : 'Not scheduled'}
                            </span>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <ScheduleIcon className="timeline-icon" />
                        <div className="timeline-content">
                            <span className="timeline-label">Project End</span>
                            <span className="timeline-date">
                                {project.project_end_date ? formatDate(project.project_end_date) : 'Not scheduled'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="project-engineer">
                    <EngineeringIcon className="engineer-icon" />
                    <span className="engineer-name">{project.pe_fullname || 'No Engineer Assigned'}</span>
                </div>

                {/* Team Display */}
                <div className="project-team-display">
                    <div className="team-role-section">
                        <div className="role-header">
                            <SupervisorAccountIcon className="role-icon" />
                            <span>Foreman</span>
                        </div>
                        <div className="role-members">
                            {foreman ? (
                                <div className={`team-member role-foreman ${!hasTeam ? 'editable' : ''}`}>
                                    <PersonIcon className="member-icon" />
                                    <span className="member-name">
                                        {hasTeam ? foreman.full_name : (foreman.foreman_full_name || foreman.full_name)}
                                    </span>
                                    {!hasTeam && (
                                        <button 
                                            className="remove-member"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const employee_id = foreman.foreman_id || foreman.employee_id;
                                                const projectId = project.id;
                                                const date = project.installation_start_date?.split("T")[0];
                                                forecastSocket.emit("remove_forecast_member", { projectId, employee_id, date });
                                            }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="team-empty">No foreman assigned</div>
                            )}
                        </div>
                    </div>

                    <div className="team-role-section">
                        <div className="role-header">
                            <GroupsIcon className="role-icon" />
                            <span>Installers ({installers.length})</span>
                        </div>
                        <div className="role-members">
                            {installers.length > 0 ? (
                                installers.map((installer) => (
                                    <div
                                        key={hasTeam ? installer.employee_id : installer.emp_id}
                                        className={`team-member role-${installer.job.toLowerCase().replace(" ", "-")} ${!hasTeam ? 'editable' : ''}`}
                                    >
                                        <PersonIcon className="member-icon" />
                                        <span className="member-name">{installer.full_name}</span>
                                        <span className="member-role">{installer.job}</span>
                                        {!hasTeam && (
                                            <button 
                                                className="remove-member"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const employee_id = installer.emp_id || installer.employee_id;
                                                    const projectId = project.id;
                                                    const date = project.installation_start_date?.split("T")[0];
                                                    forecastSocket.emit("remove_forecast_member", { projectId, employee_id, date });
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="team-empty">No installers assigned</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="project-actions">
                    {phase === 'preliminaries' && !hasTeam && (
                        <button 
                            className="btn-save-team"
                            onClick={(e) => {
                                const fTeam = tentativeProjectTeams.filter(t => t.project_id === project.id)
                                setTeamToSave(fTeam)
                                e.stopPropagation();
                                setSelectedProject(project);
                                setIsModalOpen(true);
                            }}
                        >
                            <SaveIcon className="btn-icon" />
                            Save Team
                        </button>
                    )}

                    {(hasTeam || installationTeams[project.id]?.team) && (
                        <button
                            className={`btn-edit ${editingProjectId === project.id ? 'editing' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project.id);
                            }}
                        >
                            {editingProjectId === project.id ? (
                                <>
                                    <CheckCircleIcon className="btn-icon" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <EditIcon className="btn-icon" />
                                    Edit Team
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='Content ProjectAssignment'>
                {/* Header */}
                <div className="assignment-header">
                    <div className="header-content">
                        <TeamsIcon className="header-icon" />
                        <div>
                            <h1>Project Team Assignment</h1>
                            <p>Manage team assignments across different project phases</p>
                        </div>
                    </div>
                </div>

                {/* Phase Navigation */}
                <div className='phase-navigation'>
                    <div className="phase-buttons">
                        <button 
                            onClick={() => handlePhaseClick('preliminaries')}
                            className={`phase-btn ${selectedTab === 'preliminaries' ? 'active' : ''}`}
                        >
                            <AssignmentIcon className="phase-icon" />
                            Preliminaries
                            <span className="project-count">{getProjectsByPhase('preliminaries').length}</span>
                        </button>
                        <button 
                            onClick={() => handlePhaseClick('installation')}
                            className={`phase-btn ${selectedTab === 'installation' ? 'active' : ''}`}
                        >
                            <ConstructionIcon className="phase-icon" />
                            Installation
                            <span className="project-count">{getProjectsByPhase('installation').length}</span>
                        </button>
                        <button 
                            onClick={() => handlePhaseClick('tnc')}
                            className={`phase-btn ${selectedTab === 'tnc' ? 'active' : ''}`}
                        >
                            <BuildIcon className="phase-icon" />
                            Testing & Commissioning
                            <span className="project-count">{getProjectsByPhase('tnc').length}</span>
                        </button>
                    </div>
                </div>  
                
                <div className='assignment-layout'>
                    {/* Left Side - Projects */}
                    <div className='projects-panel'>
                        {/* Team View Toggle - Only for Preliminaries */}
                        {selectedTab === 'preliminaries' && (
                            <div className="view-controls">
                                <div className="view-toggle">
                                    <button 
                                        className={`view-btn ${teamView === 'pending' ? 'active' : ''}`}
                                        onClick={() => setTeamView('pending')}
                                    >
                                        <WarningIcon className="view-icon" />
                                        Pending Teams
                                        <span className="count-badge">{projectsNoTeam.length}</span>
                                    </button>
                                    <button 
                                        className={`view-btn ${teamView === 'assigned' ? 'active' : ''}`}
                                        onClick={() => setTeamView('assigned')}
                                    >
                                        <CheckCircleIcon className="view-icon" />
                                        Assigned Teams
                                        <span className="count-badge">{projectsWithTeam.length}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Projects List */}
                        <div className="projects-list">
                            {currentProjects.length === 0 ? (
                                <div className="empty-state">
                                    <TeamsIcon className="empty-icon" />
                                    <h3>
                                        {selectedTab === 'preliminaries' 
                                            ? (teamView === 'pending' 
                                                ? 'No Projects Pending Team Assignment' 
                                                : 'No Projects with Assigned Teams')
                                            : `No ${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Projects`
                                        }
                                    </h3>
                                    <p>All projects are properly assigned and managed</p>
                                </div>
                            ) : (
                                <div className="projects-grid">
                                    {currentProjects.map((project, index) => (
                                        <ProjectCard 
                                            key={index} 
                                            project={project} 
                                            index={index}
                                            hasTeam={selectedTab === 'preliminaries' ? teamView === 'assigned' : true}
                                            phase={selectedTab}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Personnel Selection */}
                    <div className='personnel-panel'>
                        {/* Personnel Selection for Preliminaries Pending Teams */}
                        {selectedTab === 'preliminaries' && teamView === 'pending' && (
                            <>
                                {selectedProject && selectedProject.lift_name && selectedProject.installation_start_date ? (
                                    <div className='personnel-selection'>
                                        <div className="selection-header">
                                            <div className="header-info">
                                                <h3>Available Personnel</h3>
                                                <p>Assign team members to <strong>{selectedProject.lift_name}</strong></p>
                                            </div>
                                            <div className="project-badge">
                                                <BusinessIcon />
                                                Project #{selectedProject.id}
                                            </div>
                                        </div>
                                        
                                        {/* Filters */}
                                        <div className="filters-section">
                                            <div className="search-box">
                                                <SearchIcon className="search-icon" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name or ID..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="search-input"
                                                />
                                            </div>
                                            
                                            <div className="filter-controls">
                                                <div className="filter-group">
                                                    <FilterIcon className="filter-icon" />
                                                    <select 
                                                        value={jobFilter}
                                                        onChange={(e) => setJobFilter(e.target.value)}
                                                        className="filter-select"
                                                    >
                                                        <option value="all">All Roles</option>
                                                        <option value="Foreman">Foreman</option>
                                                        <option value="Skilled Installer">Skilled Installer</option>
                                                        <option value="Installer">Installer</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="group-tabs">
                                                    <button 
                                                        className={`group-tab ${activeRoleTab === 'all' ? 'active' : ''}`}
                                                        onClick={() => setActiveRoleTab('all')}
                                                    >
                                                        All ({teamsNoProject.concat(forecastData).length})
                                                    </button>
                                                    <button 
                                                        className={`group-tab ${activeRoleTab === 'no-project' ? 'active' : ''}`}
                                                        onClick={() => setActiveRoleTab('no-project')}
                                                    >
                                                        Available ({teamsNoProject.length})
                                                    </button>
                                                    <button 
                                                        className={`group-tab ${activeRoleTab === 'forecasted' ? 'active' : ''}`}
                                                        onClick={() => setActiveRoleTab('forecasted')}
                                                    >
                                                        Forecasted ({forecastData.length})
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personnel Grid */}
                                        <div className="personnel-grid">
                                            {filteredPersonnel.length > 0 ? (
                                                filteredPersonnel.map((person, index) => {
                                                    const alreadyAssigned = tentativeProjectTeams.some(
                                                        t => Number(t.project_id) === Number(selectedProject.id) &&
                                                            (t.emp_id === person.employee_id || t.foreman_id === person.employee_id)
                                                    );

                                                    return (
                                                        <div 
                                                            key={index} 
                                                            className={`personnel-card 
                                                                group-${person.group} 
                                                                ${alreadyAssigned ? 'assigned' : ''}
                                                                role-${person.job.toLowerCase().replace(' ', '-')}
                                                            `}
                                                            onClick={() => {
                                                                const { employee_id, job } = person;
                                                                const projectId = selectedProject.id;
                                                                const date = selectedProject.installation_start_date.split("T")[0];
                                                                
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
                                                            <div className="personnel-header">
                                                                <div className={`availability-badge group-${person.group}`}>
                                                                    {person.group === 'no-project' ? 'Available' : 'Forecasted'}
                                                                </div>
                                                                <div className={`role-badge role-${person.job.toLowerCase().replace(' ', '-')}`}>
                                                                    {person.job}
                                                                </div>
                                                            </div>
                                                            <div className="personnel-body">
                                                                <PersonIcon className="personnel-avatar" />
                                                                <div className="personnel-info">
                                                                    <div className="personnel-name">{person.full_name}</div>
                                                                    <div className="personnel-id">ID: {person.employee_id}</div>
                                                                    <div className="personnel-island">Island: {person.island_group}</div>
                                                                </div>
                                                            </div>
                                                            <div className="personnel-footer">
                                                                {alreadyAssigned ? (
                                                                    <div className="assigned-indicator">
                                                                        <CheckCircleIcon className="assigned-icon" />
                                                                        Assigned
                                                                    </div>
                                                                ) : (
                                                                    <div className="assign-indicator">
                                                                        <GroupAddIcon className="assign-icon" />
                                                                        Click to Assign
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="no-personnel">
                                                    <PersonIcon className="no-personnel-icon" />
                                                    <h4>No personnel found</h4>
                                                    <p>Try adjusting your filters or search terms</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary */}
                                        <div className="selection-summary">
                                            <h4>Selection Summary</h4>
                                            <div className="summary-grid">
                                                <div className="summary-item">
                                                    <span className="summary-label">Total Available</span>
                                                    <span className="summary-count">{teamsNoProject.concat(forecastData).length}</span>
                                                </div>
                                                <div className="summary-item">
                                                    <span className="summary-label">Currently Available</span>
                                                    <span className="summary-count">{teamsNoProject.length}</span>
                                                </div>
                                                <div className="summary-item">
                                                    <span className="summary-label">Forecasted Available</span>
                                                    <span className="summary-count">{forecastData.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='no-project-selected'>
                                        <div className="selection-prompt">
                                            <BusinessIcon className="prompt-icon" />
                                            <h3>Select a Project</h3>
                                            <p>Choose a project from the left panel to assign team members</p>
                                            {selectedProject && !selectedProject.installation_start_date && (
                                                <div className="date-warning">
                                                    <WarningIcon className="warning-icon" />
                                                    <div className="warning-content">
                                                        <strong>Missing Installation Dates</strong>
                                                        <p>Set installation dates in project details to enable team assignment</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Team Editing for All Phases */}
                        {editingProjectId && (
                            <div className='team-editing'>
                                <div className="editing-header">
                                    <EditIcon className="editing-icon" />
                                    <div className="editing-info">
                                        <h3>Edit Team Composition</h3>
                                        <p>Modify the team for {selectedProject.lift_name}</p>
                                    </div>
                                </div>

                                {/* Current Team */}
                                <div className="current-team">
                                    <h4>Current Team</h4>
                                    <div className="team-composition-editor">
                                        <div className="team-role-editor">
                                            <div className="role-header-editor">
                                                <SupervisorAccountIcon className="role-icon" />
                                                <span>Foreman (Required: 1)</span>
                                                <span className="role-count">
                                                    {editedTeam.filter(t => t.job === 'Foreman').length}/1
                                                </span>
                                            </div>
                                            <div className="role-members-editor">
                                                {editedTeam.filter(t => t.job === 'Foreman').map(member => (
                                                    <div 
                                                        key={member.employee_id} 
                                                        className="team-member-editor"
                                                        onClick={() => {
                                                            setEditedTeam(prev => prev.filter(e => e.employee_id !== member.employee_id));
                                                        }}
                                                    >
                                                        <PersonIcon className="member-icon" />
                                                        <div className="member-details">
                                                            <span className="member-name">{member.full_name}</span>
                                                            <span className="member-id">ID: {member.employee_id}</span>
                                                        </div>
                                                        <button className="remove-btn">×</button>
                                                    </div>
                                                ))}
                                                {editedTeam.filter(t => t.job === 'Foreman').length === 0 && (
                                                    <div className="empty-role">No foreman assigned</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="team-role-editor">
                                            <div className="role-header-editor">
                                                <GroupsIcon className="role-icon" />
                                                <span>Installation Team</span>
                                                <span className="role-count">
                                                    {editedTeam.filter(t => t.job !== 'Foreman').length}
                                                </span>
                                            </div>
                                            <div className="role-members-editor">
                                                {editedTeam.filter(t => t.job !== 'Foreman').map(member => (
                                                    <div 
                                                        key={member.employee_id} 
                                                        className="team-member-editor"
                                                        onClick={() => {
                                                            setEditedTeam(prev => prev.filter(e => e.employee_id !== member.employee_id));
                                                        }}
                                                    >
                                                        <PersonIcon className="member-icon" />
                                                        <div className="member-details">
                                                            <span className="member-name">{member.full_name}</span>
                                                            <div className="member-meta">
                                                                <span className="member-job">{member.job}</span>
                                                                <span className="member-id">ID: {member.employee_id}</span>
                                                            </div>
                                                        </div>
                                                        <button className="remove-btn">×</button>
                                                    </div>
                                                ))}
                                                {editedTeam.filter(t => t.job !== 'Foreman').length === 0 && (
                                                    <div className="empty-role">No installers assigned</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Available Personnel */}
                                <div className="available-personnel">
                                    <h4>Available Personnel</h4>
                                    <div className="personnel-grid-editor">
                                        {editTeamSelection.map((person, index) => (
                                            <div 
                                                key={index} 
                                                className={`personnel-card-editor ${
                                                    editedTeam.map(e => e.employee_id).includes(person.employee_id) ? 'selected' : ''
                                                }`}
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
                                                <div className="personnel-header-editor">
                                                    <div className={`role-badge role-${person.job.toLowerCase().replace(' ', '-')}`}>
                                                        {person.job}
                                                    </div>
                                                </div>
                                                <div className="personnel-body-editor">
                                                    <PersonIcon className="personnel-avatar" />
                                                    <div className="personnel-info">
                                                        <div className="personnel-name">{person.full_name}</div>
                                                        <div className="personnel-id">ID: {person.employee_id}</div>
                                                    </div>
                                                </div>
                                                <div className="personnel-footer-editor">
                                                    {editedTeam.map(e => e.employee_id).includes(person.employee_id) ? (
                                                        <div className="selected-indicator">
                                                            <CheckCircleIcon className="selected-icon" />
                                                            Selected
                                                        </div>
                                                    ) : (
                                                        <div className="select-indicator">
                                                            Click to Select
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Phase Info for Installation and TNC */}
                        {(selectedTab === 'installation' || selectedTab === 'tnc') && !editingProjectId && (
                            <div className="phase-info-panel">
                                <div className="phase-header">
                                    <div className="phase-title">
                                        <h3>{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Phase</h3>
                                        <span className="phase-badge">{selectedTab}</span>
                                    </div>
                                    <div className="phase-stats">
                                        <div className="phase-stat">
                                            <span className="stat-number">{currentProjects.length}</span>
                                            <span className="stat-label">Total Projects</span>
                                        </div>
                                        <div className="phase-stat">
                                            <span className="stat-number">
                                                {currentProjects.filter(p => installationTeams[p.id]?.team).length}
                                            </span>
                                            <span className="stat-label">Teams Assigned</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedProject && (
                                    <div className="selected-project-details">
                                        <h4>Selected Project Details</h4>
                                        <div className="project-detail-card">
                                            <div className="project-header">
                                                <BusinessIcon className="project-detail-icon" />
                                                <div className="project-title">
                                                    <h5>{selectedProject.lift_name}</h5>
                                                    <span className="project-id">#{selectedProject.id}</span>
                                                </div>
                                            </div>
                                            <div className="project-meta-grid">
                                                <div className="meta-item">
                                                    <span className="meta-label">Client</span>
                                                    <span className="meta-value">{selectedProject.client}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-label">Status</span>
                                                    <span className="meta-value status">{selectedProject.current_task}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-label">Installation Start</span>
                                                    <span className="meta-value">
                                                        {selectedProject.installation_start_date 
                                                            ? formatDate(selectedProject.installation_start_date) 
                                                            : 'Not scheduled'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {!selectedProject && (
                                    <div className="no-project-prompt">
                                        <BusinessIcon className="prompt-icon" />
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