import React, { useState, useMemo } from 'react'
import { useStoreState } from 'easy-peasy'
import '../../css/TNCCoordinatorDashboard.css'

// MUI Icons
import EngineeringIcon from '@mui/icons-material/Engineering';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TNCCoordinatorDashboard = () => {
    const {tncTechs, allTeams, projects} = useStoreState(state => state)
    const [activeTab, setActiveTab] = useState('upcoming')
    const [timeframe, setTimeframe] = useState('week') // week, month, all

    // Helper function to determine priority
    const getPriorityLevel = (daysUntilTNC, progress) => {
        if (daysUntilTNC !== null && daysUntilTNC <= 7) return 'critical';
        if (daysUntilTNC !== null && daysUntilTNC <= 14) return 'high';
        if (progress >= 85) return 'medium';
        return 'low';
    };

    // Process projects with TNC information
    const tncProjects = useMemo(() => {
        if (!projects || !Array.isArray(projects)) return [];
        
        return projects.map(project => {
            // Find team information
            const teamInfo = allTeams?.find(team => team.project_id === project.id) || {};
            
            // Find assigned TNC technician
            const assignedTncTech = tncTechs?.find(tech => tech.project_id === project.id);
            
            // Calculate TNC readiness and dates
            const now = new Date();
            const tncStartDate = project.tnc_start_date ? new Date(project.tnc_start_date) : null;
            const projectEndDate = project.project_end_date ? new Date(project.project_end_date) : null;
            
            // Determine TNC status
            let tncStatus = 'not-ready';
            let daysUntilTNC = null;
            let daysUntilCompletion = null;
            
            if (tncStartDate) {
                daysUntilTNC = Math.ceil((tncStartDate - now) / (1000 * 60 * 60 * 24));
                
                if (project.tnc_ongoing) {
                    tncStatus = 'in-progress';
                } else if (project.tnc_is_assigned) {
                    tncStatus = 'assigned';
                } else if (project.tnc_pending) {
                    tncStatus = 'scheduled';
                } else if (project.in_tnc) {
                    tncStatus = 'ready-to-start';
                }
            }
            
            if (projectEndDate) {
                daysUntilCompletion = Math.ceil((projectEndDate - now) / (1000 * 60 * 60 * 24));
            }
            
            // Check if project is nearing TNC (90% progress)
            const isNearingTNC = project.progress >= 85 && project.progress < 100;
            const isReadyForTNC = project.progress >= 90;
            
            return {
                ...project,
                teamInfo,
                assignedTncTech,
                tncStartDate,
                projectEndDate,
                tncStatus,
                daysUntilTNC,
                daysUntilCompletion,
                isNearingTNC,
                isReadyForTNC,
                priority: getPriorityLevel(daysUntilTNC, project.progress)
            };
        });
    }, [projects, allTeams, tncTechs]);
    console.log(tncProjects)


    // Filter projects based on active tab and timeframe
    const filteredProjects = useMemo(() => {
        const timeFilter = {
            week: 7,
            month: 30,
            all: Infinity
        }[timeframe];

        return tncProjects.filter(project => {
            if (activeTab === 'upcoming') {
                return project.daysUntilTNC !== null && project.daysUntilTNC <= timeFilter;
            } else if (activeTab === 'nearing-tnc') {
                console.log(`${project.id}: ${project.tncStartDate}`)
                if (project.isNearingTNC && project.tncStartDate) console.log(`project ${project.id} is nearing tnc`)
                
                return project.isNearingTNC
            } else if (activeTab === 'in-progress') {
                return project.tncStatus === 'in-progress';
            } else if (activeTab === 'assigned') {
                return project.tncStatus === 'assigned';
            } else if (activeTab === 'ready') {
                return project.isReadyForTN
            }
            return true;
        }).sort((a, b) => {
            if (activeTab === 'upcoming') {
                return (a.daysUntilTNC || Infinity) - (b.daysUntilTNC || Infinity);
            } else if (activeTab === 'nearing-tnc') {
                return b.progress - a.progress; // Sort by highest progress first
            }
            return new Date(b.project_end_date) - new Date(a.project_end_date);
        });
    }, [tncProjects, activeTab, timeframe]);

    // Technician workload
    const technicianWorkload = useMemo(() => {
        if (!tncTechs) return [];
        
        const workload = tncTechs.map(tech => {
            const assignedProjects = tncProjects.filter(project => 
                project.assignedTncTech?.employee_id === tech.employee_id
            );
            
            const upcomingTNC = assignedProjects.filter(project => 
                project.daysUntilTNC !== null && project.daysUntilTNC <= 14
            ).length;
            
            const inProgress = assignedProjects.filter(project => 
                project.tncStatus === 'in-progress'
            ).length;
            
            return {
                ...tech,
                assignedProjects: assignedProjects.length,
                upcomingTNC,
                inProgress,
                status: assignedProjects.length > 0 ? 'assigned' : 'available'
            };
        });
        
        return workload.sort((a, b) => b.assignedProjects - a.assignedProjects);
    }, [tncTechs, tncProjects]);

    // Dashboard summary statistics
    const dashboardSummary = useMemo(() => {
        
        const upcomingThisWeek = tncProjects.filter(project => 
            project.daysUntilTNC !== null && project.daysUntilTNC <= 7
        ).length;
        
        const nearingTNC = tncProjects.filter(project => 
            project.isNearingTNC
        ).length;
        
        const inProgress = tncProjects.filter(project => 
            project.tncStatus === 'in-progress'
        ).length;
        
        const readyForTNC = tncProjects.filter(project => 
            project.isReadyForTNC
        ).length;
        
        return { upcomingThisWeek, nearingTNC, inProgress, readyForTNC };
    }, [tncProjects]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PH', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get status badge class
    const getStatusClass = (status) => {
        const statusClasses = {
            'scheduled': 'status-scheduled',
            'assigned': 'status-assigned',
            'in-progress': 'status-in-progress',
            'ready-to-start': 'status-ready',
            'not-ready': 'status-not-ready'
        };
        return statusClasses[status] || 'status-not-ready';
    };

    // Get status display text
    const getStatusText = (status) => {
        const statusTexts = {
            'scheduled': 'Scheduled',
            'assigned': 'Assigned',
            'in-progress': 'In Progress',
            'ready-to-start': 'Ready to Start',
            'not-ready': 'Not Ready'
        };
        return statusTexts[status] || 'Not Ready';
    };

    // Get priority class
    const getPriorityClass = (priority) => {
        const priorityClasses = {
            'critical': 'priority-critical',
            'high': 'priority-high',
            'medium': 'priority-medium',
            'low': 'priority-low'
        };
        return priorityClasses[priority] || 'priority-low';
    };

    // Main Stats Cards
    const renderStatsCards = () => (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
                    <WarningIcon style={{color: '#dc3545'}} />
                </div>
                <div className="stat-content">
                    <h3>{dashboardSummary.upcomingThisWeek}</h3>
                    <p>TNC This Week</p>
                    <span className="stat-trend">7-day schedule</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                    <TrendingUpIcon style={{color: '#ffc107'}} />
                </div>
                {console.log(dashboardSummary)}
                <div className="stat-content">
                    <h3>{dashboardSummary.nearingTNC}</h3>
                    <p>Nearing TNC</p>
                    <span className="stat-trend">85%+ progress</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
                    <BuildIcon style={{color: '#17a2b8'}} />
                </div>
                <div className="stat-content">
                    <h3>{dashboardSummary.inProgress}</h3>
                    <p>In Progress</p>
                    <span className="stat-trend">Active TNC</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
                    <CheckCircleIcon style={{color: '#28a745'}} />
                </div>
                <div className="stat-content">
                    <h3>{dashboardSummary.readyForTNC}</h3>
                    <p>Ready for TNC</p>
                    <span className="stat-trend">90%+ progress</span>
                </div>
            </div>
        </div>
    );

    // Projects List
    const renderProjectsList = () => (
        <div className="projects-section">
            <div className="section-header">
                <h3>
                    {activeTab === 'upcoming' && 'Upcoming TNC'}
                    {activeTab === 'nearing-tnc' && 'Projects Nearing TNC'}
                    {activeTab === 'in-progress' && 'TNC in Progress'}
                    {activeTab === 'assigned' && 'Assigned TNC'}
                    {activeTab === 'ready' && 'Ready for TNC'}
                </h3>
                <div className="timeframe-controls">
                    <label>Timeframe:</label>
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="control-select"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All</option>
                    </select>
                </div>
            </div>

            <div className="projects-grid">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <div key={project.id} className={`project-card ${getPriorityClass(project.priority)}`}>
                            <div className="project-header">
                                <h4>{project.lift_name}</h4>
                                <div className="project-badges">
                                    <span className={`status-badge ${getStatusClass(project.tncStatus)}`}>
                                        {getStatusText(project.tncStatus)}
                                    </span>
                                    <span className="progress-badge">
                                        {project.progress}% Complete
                                    </span>
                                </div>
                            </div>
                            
                            <div className="project-details">
                                <div className="detail-item">
                                    <span className="detail-label">Client:</span>
                                    <span className="detail-value">{project.client}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Location:</span>
                                    <span className="detail-value">{project.city_municipality}, {project.province}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Project Engineer:</span>
                                    <span className="detail-value">{project.pe_fullname}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Current Phase:</span>
                                    <span className="detail-value">{project.status}</span>
                                </div>
                            </div>

                            {/* TNC Dates */}
                            <div className="tnc-dates">
                                <div className="date-group">
                                    <div className="date-label">
                                        <CalendarMonthIcon style={{ fontSize: '14px', marginRight: '6px' }} />
                                        TNC Start Date
                                    </div>
                                    <div className="date-value">
                                        {project.tncStartDate ? formatDate(project.tncStartDate) : 'Not scheduled'}
                                        {project.daysUntilTNC !== null && project.daysUntilTNC > 0 && (
                                            <span className="days-remaining">
                                                (in {project.daysUntilTNC} days)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="date-group">
                                    <div className="date-label">
                                        <ScheduleIcon style={{ fontSize: '14px', marginRight: '6px' }} />
                                        Project Completion
                                    </div>
                                    <div className="date-value">
                                        {project.projectEndDate ? formatDate(project.projectEndDate) : 'Not set'}
                                        {project.daysUntilCompletion !== null && project.daysUntilCompletion > 0 && (
                                            <span className="days-remaining">
                                                (in {project.daysUntilCompletion} days)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Technician */}
                            {project.assignedTncTech && (
                                <div className="assigned-tech">
                                    <div className="tech-info">
                                        <EngineeringIcon style={{ fontSize: '16px', marginRight: '8px' }} />
                                        <span>Assigned TNC Tech: {project.assignedTncTech.full_name}</span>
                                    </div>
                                    {project.tnc_assign_date && (
                                        <span className="assignment-date">
                                            Assigned: {formatDate(project.tnc_assign_date)}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div className="project-progress">
                                <div className="progress-header">
                                    <span>Installation Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                    {project.isNearingTNC && (
                                        <div className="tnc-marker" style={{ left: '85%' }}>
                                            <div className="marker-line"></div>
                                            <div className="marker-label">TNC Ready</div>
                                        </div>
                                    )}
                                </div>
                                <div className="progress-legend">
                                    <span>0%</span>
                                    <span>85% - TNC Prep</span>
                                    <span>100% - Complete</span>
                                </div>
                            </div>

                            {/* Action Required */}
                            {project.isReadyForTNC && !project.tncStartDate && (
                                <div className="action-required">
                                    <WarningIcon style={{ fontSize: '16px', marginRight: '8px', color: '#dc3545' }} />
                                    <span>Action Required: Schedule TNC start date</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <EngineeringIcon style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '16px' }} />
                        <p>No projects found for the selected criteria</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Technicians Panel
    const renderTechniciansPanel = () => (
        <div className="technicians-section">
            <div className="section-header">
                <h3>TNC Technicians</h3>
                <span className="section-badge">{technicianWorkload.length} technicians</span>
            </div>

            <div className="technicians-grid">
                {technicianWorkload.map(tech => (
                    <div key={tech.employee_id} className="technician-card">
                        <div className="tech-header">
                            <h4>{tech.full_name}</h4>
                            <span className={`tech-status ${tech.status}`}>
                                {tech.status === 'available' ? 'Available' : 'Assigned'}
                            </span>
                        </div>
                        
                        <div className="tech-stats">
                            <div className="tech-stat">
                                <span className="stat-label">Assigned Projects</span>
                                <span className="stat-value">{tech.assignedProjects}</span>
                            </div>
                            <div className="tech-stat">
                                <span className="stat-label">Upcoming TNC</span>
                                <span className="stat-value">{tech.upcomingTNC}</span>
                            </div>
                            <div className="tech-stat">
                                <span className="stat-label">In Progress</span>
                                <span className="stat-value">{tech.inProgress}</span>
                            </div>
                        </div>

                        {tech.project_id && (
                            <div className="current-assignment">
                                <span className="assignment-label">Current Project:</span>
                                <span className="assignment-project">{tech.lift_name}</span>
                                {tech.tnc_start_date && (
                                    <span className="assignment-date">
                                        TNC Start: {formatDate(tech.tnc_start_date)}
                                    </span>
                                )}
                            </div>
                        )}

                        {tech.status === 'available' && tech.assignedProjects === 0 && (
                            <div className="availability-indicator">
                                <CheckCircleIcon style={{ fontSize: '16px', color: '#28a745', marginRight: '8px' }} />
                                <span>Available for new assignments</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className='Content TNCCoordinatorDashboard'>
            <div className="dashboard-header">
                <h1>TNC Coordinator Dashboard</h1>
                <p>Manage Testing and Commissioning schedules, technician assignments, and project readiness</p>
            </div>

            {/* Stats Overview */}
            {renderStatsCards()}

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                <div className="tabs-header">
                    <button 
                        className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        <ScheduleIcon style={{marginRight: '8px'}} />
                        Upcoming TNC
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'nearing-tnc' ? 'active' : ''}`}
                        onClick={() => setActiveTab('nearing-tnc')}
                    >
                        <TrendingUpIcon style={{marginRight: '8px'}} />
                        Nearing TNC
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'in-progress' ? 'active' : ''}`}
                        onClick={() => setActiveTab('in-progress')}
                    >
                        <BuildIcon style={{marginRight: '8px'}} />
                        In Progress
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'ready' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ready')}
                    >
                        <CheckCircleIcon style={{marginRight: '8px'}} />
                        Ready for TNC
                    </button>
                </div>

                <div className="dashboard-content">
                    <div className="main-content">
                        {renderProjectsList()}
                    </div>
                    
                    <div className="sidebar">
                        {renderTechniciansPanel()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TNCCoordinatorDashboard