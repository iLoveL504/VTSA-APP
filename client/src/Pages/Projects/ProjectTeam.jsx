import React, { useEffect } from 'react'
import '../../css/ProjectTeam.css'
import { Grid } from 'ldrs/react'
import { Axios } from '../../api/axios'
import { useStoreState } from 'easy-peasy'

// Material-UI Icons
import {

  Groups as GroupsIcon,
  Engineering as EngineeringIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Build as BuildIcon,
  Construction as ConstructionIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const ProjectTeam = ({ teamInfo, proj, teamTechs, projId }) => {
    const { allTeams } = useStoreState(state => state)
    
    // Find the project team from allTeams using the new data format
    const projectTeam = allTeams.find(t => t.project_id === Number(projId))
    
    // Use the new data format if available, otherwise fall back to old format
    const teamData = projectTeam || {
        project_engineer: {},
        technicians: {},
        foreman: null,
        team: [],
        status: '',
        operations_start_date: '',
        project_end_date: ''
    }

    // Safe access to arrays and objects
    const teamMembers = Array.isArray(teamData.team) ? teamData.team : []
    const projectEngineer = teamData.project_engineer || {}
    const technicians = teamData.technicians || {}
    const foreman = teamData.foreman

    // Group team members by job role
    const groupedTeamMembers = {
        'Skilled Installer': teamMembers.filter(m => m.job === 'Skilled Installer'),
        'Installer': teamMembers.filter(m => m.job === 'Installer')
    }



    useEffect(() => {
        // Build the list of available PIC candidates
        const picCandidates = []
        
        // Add project engineer if available
        if (projectEngineer.id) {
            picCandidates.push({
                id: projectEngineer.id,
                fullname: projectEngineer.fullname,
                job: 'Project Engineer'
            })
        }
        
        // Add foreman if available
        if (foreman && foreman.id) {
            picCandidates.push({
                id: foreman.id,
                fullname: foreman.name,
                job: 'Foreman'
            })
        }
        
        // Add team members
        teamMembers.forEach(member => {
            picCandidates.push({
                id: member.id,
                fullname: member.fullname,
                job: member.job
            })
        })

    }, [projectEngineer, foreman, teamMembers, proj])

    // Loading state
    if (!projectTeam && !teamInfo && !teamTechs) {
        return (
            <div className='ProjectTeam'>
                <div className="loading-state">
                    <Grid size="60" speed="1.5" color="#315a95"></Grid>
                    <p>Loading team information...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='ProjectTeam'>
            {/* Header */}
            <div className="team-header">
                <GroupsIcon className="header-icon" />
                <div>
                    <h2>Project Team</h2>
                    <p>Team composition and assignments for {teamData.lift_name}</p>
                </div>
            </div>

            {/* Project Status Overview */}
            <div className="project-overview">
                <div className="overview-card">
                    <div className="overview-item">
                        <span className="overview-label">Project Status</span>
                        <span className={`status-badge ${teamData.status?.toLowerCase().replace(' ', '-')}`}>
                            {teamData.status || 'Unknown'}
                        </span>
                    </div>
                    <div className="overview-item">
                        <span className="overview-label">Operations Start</span>
                        <span className="overview-value">
                            {teamData.operations_start_date ? 
                                new Date(teamData.operations_start_date).toLocaleDateString() : 
                                'Not scheduled'
                            }
                        </span>
                    </div>
                    <div className="overview-item">
                        <span className="overview-label">Project End</span>
                        <span className="overview-value">
                            {teamData.project_end_date ? 
                                new Date(teamData.project_end_date).toLocaleDateString() : 
                                'Not scheduled'
                            }
                        </span>
                    </div>
                </div>
            </div>

            <div className="team-content">
                {/* Left Column - Leadership & Technical Roles */}
                <div className="team-column leadership-column">

                    {/* Project Leadership */}
                    <div className="team-section">
                        <div className="section-header">
                            <EngineeringIcon className="section-icon" />
                            <h3>Project Leadership</h3>
                        </div>
                        <div className="leadership-grid">
                            {/* Project Engineer */}
                            <div className="leadership-card">
                                <div className="role-header">
                                    <EngineeringIcon className="role-icon" />
                                    <span className="role-title">Project Engineer</span>
                                </div>
                                <div className="person-info">
                                    {projectEngineer.fullname ? (
                                        <>
                                            <span className="person-name">{projectEngineer.fullname}</span>
                                            <span className="person-id">ID: {projectEngineer.id}</span>
                                        </>
                                    ) : (
                                        <span className="not-assigned">Not assigned</span>
                                    )}
                                </div>
                            </div>

                            {/* Foreman */}
                            <div className="leadership-card">
                                <div className="role-header">
                                    <SupervisorAccountIcon className="role-icon" />
                                    <span className="role-title">Foreman</span>
                                </div>
                                <div className="person-info">
                                    {foreman && foreman.name ? (
                                        <>
                                            <span className="person-name">{foreman.name}</span>
                                            <span className="person-id">ID: {foreman.id}</span>
                                        </>
                                    ) : (
                                        <span className="not-assigned">Not assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specialists */}
                    <div className="team-section">
                        <div className="section-header">
                            <SettingsIcon className="section-icon" />
                            <h3>Technical Specialists</h3>
                        </div>
                        <div className="technicians-grid">
                            {/* TNC Technician */}
                            <div className="technician-card">
                                <div className="technician-header">
                                    <BuildIcon className="tech-icon" />
                                    <span className="tech-role">TNC Technician</span>
                                </div>
                                <div className="technician-info">
                                    {technicians.tnc_tech ? (
                                        <>
                                            <span className="tech-name">{technicians.tnc_tech.fullname}</span>
                                            <span className="tech-id">ID: {technicians.tnc_tech.id}</span>
                                        </>
                                    ) : (
                                        <span className="not-assigned">Not assigned</span>
                                    )}
                                </div>
                            </div>

                            {/* QA/QC Technician */}
                            <div className="technician-card">
                                <div className="technician-header">
                                    <AssignmentIcon className="tech-icon" />
                                    <span className="tech-role">QA/QC Technician</span>
                                </div>
                                <div className="technician-info">
                                    {technicians.qaqc_tech ? (
                                        <>
                                            <span className="tech-name">{technicians.qaqc_tech.fullname}</span>
                                            <span className="tech-id">ID: {technicians.qaqc_tech.id}</span>
                                        </>
                                    ) : (
                                        <span className="not-assigned">Not assigned</span>
                                    )}
                                </div>
                            </div>

                            {/* PMS Technician */}
                            <div className="technician-card">
                                <div className="technician-header">
                                    <BuildIcon className="tech-icon" />
                                    <span className="tech-role">PMS Technician</span>
                                </div>
                                <div className="technician-info">
                                    {technicians.pms_tech ? (
                                        <>
                                            <span className="tech-name">{technicians.pms_tech.fullname}</span>
                                            <span className="tech-id">ID: {technicians.pms_tech.id}</span>
                                        </>
                                    ) : (
                                        <span className="not-assigned">Not assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Installation Team */}
                <div className="team-column installation-column">
                    <div className="team-section">
                        <div className="section-header">
                            <GroupsIcon className="section-icon" />
                            <h3>Installation Team</h3>
                            <span className="team-count">{teamMembers.length} members</span>
                        </div>

                        {/* Skilled Installers */}
                        {groupedTeamMembers['Skilled Installer'].length > 0 && (
                            <div className="role-section">
                                <div className="role-title">
                                    <BuildIcon className="role-title-icon" />
                                    <h4>Skilled Installers</h4>
                                    <span className="role-count">{groupedTeamMembers['Skilled Installer'].length}</span>
                                </div>
                                <div className="members-list">
                                    {groupedTeamMembers['Skilled Installer'].map((member) => (
                                        <div key={member.id} className="team-member-card skilled">
                                            <PersonIcon className="member-avatar" />
                                            <div className="member-details">
                                                <span className="member-name">{member.fullname}</span>
                                                <div className="member-meta">
                                                    <span className="member-username">@{member.username}</span>
                                                    <span className="member-id">ID: {member.id}</span>
                                                </div>
                                            </div>
                                            <div className="member-badge skilled-badge">
                                                Skilled
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Installers */}
                        {groupedTeamMembers['Installer'].length > 0 && (
                            <div className="role-section">
                                <div className="role-title">
                                    <ConstructionIcon className="role-title-icon" />
                                    <h4>Installers</h4>
                                    <span className="role-count">{groupedTeamMembers['Installer'].length}</span>
                                </div>
                                <div className="members-list">
                                    {groupedTeamMembers['Installer'].map((member) => (
                                        <div key={member.id} className="team-member-card installer">
                                            <PersonIcon className="member-avatar" />
                                            <div className="member-details">
                                                <span className="member-name">{member.fullname}</span>
                                                <div className="member-meta">
                                                    <span className="member-username">@{member.username}</span>
                                                    <span className="member-id">ID: {member.id}</span>
                                                </div>
                                            </div>
                                            <div className="member-badge installer-badge">
                                                Installer
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State for Installation Team */}
                        {teamMembers.length === 0 && (
                            <div className="empty-team">
                                <GroupsIcon className="empty-icon" />
                                <h4>No Installation Team Assigned</h4>
                                <p>This project doesn't have an installation team assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Summary */}
            <div className="project-summary">
                <div className="summary-card">
                    <BusinessIcon className="summary-icon" />
                    <div className="summary-content">
                        <h4>{teamData.lift_name}</h4>
                        <p>{teamData.client} • Project #{teamData.project_id}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectTeam