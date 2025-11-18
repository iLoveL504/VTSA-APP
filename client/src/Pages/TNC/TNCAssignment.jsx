import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import TNCList from '../../components/QAQCTNC/TNCList.jsx'
import { useSharedSocket } from '../../Context/SocketContext.js';
import '../../css/TNCPage.css'
import { Axios } from '../../api/axios.js'

const TNCAssignment = () => {
    const { utilitiesSocket } = useSharedSocket()
    const navigate = useNavigate()
    const projects = useStoreState(state => state.projects)
    const employees = useStoreState(state => state.employees)
    const {tncTechs} = useStoreState(state => state)
    console.log(tncTechs)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEntry, setSelectedEntry] = useState({})
    const [assignModal, setAssignModal] = useState({ 
        isOpen: false, 
        project: null, 
        mode: 'assign' // 'assign' or 'edit'
    })
    const [selectedTech, setSelectedTech] = useState(null)
    const [assignmentStatus, setAssignmentStatus] = useState('')
    const [availableTechs, setAvailableTechs] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentAssignedTech, setCurrentAssignedTech] = useState(null)

    // Filter TNC technicians from employees
    const tncEmployees = useMemo(() => {
        return employees.filter(e => e.job === 'TNC Technician' || e.job === 'TNC');
    }, [employees]);

    // Filter projects based on search term
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return projects
        
        const term = searchTerm.toLowerCase()
        return projects.filter(project => 
            project.lift_name?.toLowerCase().includes(term) ||
            project.client?.toLowerCase().includes(term) ||
            project.status?.toLowerCase().includes(term) ||
            project.region?.toLowerCase().includes(term) ||
            project.city_municipality?.toLowerCase().includes(term)
        )
    }, [projects, searchTerm])

    // Load available technicians when modal opens
    useEffect(() => {
        if (assignModal.isOpen && assignModal.project) {
            loadAvailableTechnicians();
            loadCurrentAssignment(assignModal.project);
        }
    }, [assignModal.isOpen, assignModal.project])

    // Set initial dates when an entry is selected
    useEffect(() => {
        if (selectedEntry && selectedEntry.id) {
            // Set default dates for new assignments
            const today = new Date();
            const defaultEndDate = new Date();
            defaultEndDate.setDate(today.getDate() + 14); // Default 2-week assignment
            
            setStartDate(today.toISOString().split('T')[0]);
            setEndDate(defaultEndDate.toISOString().split('T')[0]);
        }
    }, [selectedEntry])

    const loadAvailableTechnicians = async () => {
        try {
            console.log(tncTechs)
            // Get technicians not currently assigned to any active project
            const available = tncEmployees.filter(tech => {
                const currentAssignment = tncTechs?.find(t => 
                    t.employee_id === tech.employee_id && 
                    t.project_id && 
                    new Date(t.project_end_date) >= new Date() // Only consider active assignments
                );
                return !currentAssignment;
            });
            console.log(available)
            setAvailableTechs(available);
        } catch (error) {
            console.error('Error loading technicians:', error);
            setAvailableTechs([]);
        }
    };

    const loadCurrentAssignment = async (project) => {
        try {
            // If project already has TNC assigned, load current technician
            if (project.tnc_is_assigned || project.tnc_ongoing) {
                const assignedTech = tncTechs?.find(t => t.project_id === project.id);
                if (assignedTech) {
                    const techDetails = tncEmployees.find(e => e.employee_id === assignedTech.employee_id);
                    setCurrentAssignedTech(techDetails);
                    setSelectedTech(techDetails);
                    
                    // Set current dates
                    if (assignedTech.tnc_start_date) {
                        setStartDate(new Date(assignedTech.tnc_start_date).toISOString().split('T')[0]);
                    }
                    if (assignedTech.project_end_date) {
                        setEndDate(new Date(assignedTech.project_end_date).toISOString().split('T')[0]);
                    }
                }
            } else {
                setCurrentAssignedTech(null);
                setSelectedTech(null);
            }
        } catch (error) {
            console.error('Error loading current assignment:', error);
            setCurrentAssignedTech(null);
        }
    };

    const handleCreateClick = () => {
        navigate('create')
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchTerm('')
    }

    const handleAssignClick = (project) => {
        const isEditMode = project.tnc_is_assigned || project.tnc_ongoing;
        setAssignModal({ 
            isOpen: true, 
            project, 
            mode: isEditMode ? 'edit' : 'assign'
        });
        setAssignmentStatus('');
        
        if (!isEditMode) {
            setSelectedTech(null);
        }
    }

    const handleAssignConfirm = async () => {
        if (!selectedTech) {
            setAssignmentStatus('Please select a TNC technician');
            return;
        }

        if (!startDate || !endDate) {
            setAssignmentStatus('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setAssignmentStatus('End date must be after start date');
            return;
        }

        try {
            const peID = projects.find(p => p.id === assignModal.project.id)?.project_engineer_id;
            const ProjectManagerId = employees.find(e => e.job === 'Project Manager')?.employee_id;
            
            setAssignmentStatus('assigning');
            
            const payload = {
                project_id: assignModal.project.id,
                tnc_technician_id: selectedTech.employee_id,
                assign_date: new Date().toISOString().split('T')[0],
                tnc_start_date: startDate,
                project_end_date: endDate
            };

            let endpoint, method;
            
            if (assignModal.mode === 'edit') {
                // Update existing assignment
                endpoint = `/api/projects/tnc/assign/${assignModal.project.id}`;
                method = 'PUT';
            } else {
                // Create new assignment
                endpoint = `/api/projects/tnc/assign/${assignModal.project.id}`;
                method = 'PUT';
            }

            const response = await Axios({
                method,
                url: endpoint,
                data: payload
            });
            
            if (response.data.success) {
                setAssignmentStatus('success');

                // Make Notification
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error("Socket emit timeout"));
                    }, 5000); 

                    utilitiesSocket.emit("new_notification", {
                        subject: assignModal.mode === 'edit' ? 'TNC Assignment Updated' : 'Assigned for TNC Inspection',
                        body: `TNC Inspection for ${assignModal.project.lift_name} is ${assignModal.mode === 'edit' ? 'updated' : 'assigned'} to ${selectedTech.last_name} ${selectedTech.first_name} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
                        Ids: [selectedTech.employee_id, ProjectManagerId, peID].filter(Boolean)
                    }, (ack) => {
                        clearTimeout(timeout);
                        if (ack?.success) {
                            utilitiesSocket.emit("refresh_project_data");
                            resolve();
                        } else {
                            reject(new Error("Server failed to process notification."));
                        }
                    });
                });

                setTimeout(() => {
                    setAssignModal({ isOpen: false, project: null, mode: 'assign' });
                    utilitiesSocket.emit('refresh_all_projects')
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error assigning TNC technician:', error);
            setAssignmentStatus(error.message || 'Error assigning technician');
        }
    }

    const handleAssignClose = () => {
        setAssignModal({ isOpen: false, project: null, mode: 'assign' });
        setSelectedTech(null);
        setAssignmentStatus('');
        setCurrentAssignedTech(null);
    }

    const handleUnassign = async () => {
        if (!confirm('Are you sure you want to unassign the TNC technician from this project?')) {
            return;
        }

        try {
            setAssignmentStatus('unassigning');
            const response = await Axios.delete(`/api/projects/tnc/assignment/${assignModal.project.id}`);
            
            if (response.data.success) {
                setAssignmentStatus('success');
                setTimeout(() => {
                    setAssignModal({ isOpen: false, project: null, mode: 'assign' });
                    setSelectedTech(null);
                    setCurrentAssignedTech(null);
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error('Failed to unassign technician');
            }
        } catch (error) {
            console.error('Error unassigning technician:', error);
            setAssignmentStatus('Error unassigning technician');
        }
    };

    const handleTechSelection = (tech) => {
        setSelectedTech(tech);
        setAssignmentStatus('');
    };

    // Statistics
    const projectsNeedingAssignment = projects.filter(p => p.tnc_pending && !p.tnc_is_assigned).length;
    const totalAssignedProjects = projects.filter(p => p.tnc_is_assigned || p.tnc_ongoing).length;
    const ongoingTNCAssignments = tncTechs?.filter(t => t.project_id && new Date(t.project_end_date) >= new Date()).length || 0;

    return (
        <div className='Content TNCMenu'>
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>
                            {assignModal.mode === 'edit' ? 'Edit TNC Assignment' : 'Assign TNC Technician'}
                        </h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Location:</strong> {assignModal.project.city_municipality || assignModal.project.region}</p>
                            <p><strong>TNC Status:</strong> {assignModal.project.tnc_is_assigned ? 'Assigned' : assignModal.project.tnc_ongoing ? 'Ongoing' : 'Pending'}</p>
                        </div>
                        
                        {/* Current Assignment Info */}
                        {currentAssignedTech && (
                            <div className="current-assignment">
                                <h4>Current Assignment</h4>
                                <div className="current-tech">
                                    <div className="current-tech-item">
                                        <span>{currentAssignedTech.last_name} {currentAssignedTech.first_name}</span>
                                        <span className="tech-status">Currently Assigned</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Date Selection */}
                        <div className="date-selection">
                            <div className="date-input-group">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="date-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        
                        {/* Technician Selection */}
                        <div className="tech-selection">
                            <label>
                                {assignModal.mode === 'edit' ? 'Update Technician:' : 'Select Technician:'}
                            </label>
                            <span>Available TNC Technicians (Not currently assigned to active projects)</span>
                            
                            <div className="techs-list">
                                {availableTechs.map(tech => {
                                    const isCurrentlyAssigned = currentAssignedTech && currentAssignedTech.employee_id === tech.employee_id;
                                    const isSelected = selectedTech && selectedTech.employee_id === tech.employee_id;
                                    
                                    return (
                                        <div 
                                            key={tech.employee_id}
                                            className={`tech-item ${isSelected ? 'selected' : ''} ${
                                                isCurrentlyAssigned && assignModal.mode === 'edit' ? 'currently-assigned' : ''
                                            }`}
                                            onClick={() => handleTechSelection(tech)}
                                        >
                                            <div className="tech-info">
                                                <strong>{tech.last_name} {tech.first_name}</strong>
                                                <span>{tech.island_group}</span>
                                                {isCurrentlyAssigned && assignModal.mode === 'edit' && (
                                                    <span className="current-badge">Currently Assigned</span>
                                                )}
                                            </div>
                                            <div className="tech-checkbox">
                                                {isSelected ? '✓' : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                                {availableTechs.length === 0 && (
                                    <div className="no-techs">
                                        No available TNC technicians. All technicians are currently assigned to active projects.
                                    </div>
                                )}
                            </div>

                            {selectedTech && (
                                <div className="selected-tech">
                                    <strong>Selected Technician:</strong>
                                    <span className="selected-tech-tag">
                                        {selectedTech.last_name} {selectedTech.first_name} ({selectedTech.island_group})
                                    </span>
                                </div>
                            )}
                        </div>

                        {assignmentStatus && (
                            <div className={`status ${
                                assignmentStatus === 'success' ? 'success' : 
                                assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' ? 'info' : 'error'
                            }`}>
                                {assignmentStatus === 'assigning' ? 'Processing...' : 
                                 assignmentStatus === 'unassigning' ? 'Unassigning...' : assignmentStatus}
                            </div>
                        )}

                        <div className="modal-actions">
                            {assignModal.mode === 'edit' && (
                                <button 
                                    onClick={handleUnassign}
                                    className="btn-danger"
                                    disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success'}
                                >
                                    {assignmentStatus === 'unassigning' ? 'Unassigning...' : 'Unassign'}
                                </button>
                            )}
                            <button onClick={handleAssignClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignConfirm} 
                                className="btn-confirm"
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success' || !selectedTech || !startDate || !endDate}
                            >
                                {assignmentStatus === 'assigning' ? 'Processing...' : 
                                 assignModal.mode === 'edit' ? 'Update Assignment' : 'Assign Technician'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-main">
                    <h1>TNC Assignment Dashboard</h1>
                    <div className="header-stats">
                        <div className="stat-badge urgent">
                            <span className="stat-count">{projectsNeedingAssignment}</span>
                            <span className="stat-label">Need Assignment</span>
                        </div>
                        <div className="stat-badge assigned">
                            <span className="stat-count">{totalAssignedProjects}</span>
                            <span className="stat-label">Assigned</span>
                        </div>
                        <div className="stat-badge ongoing">
                            <span className="stat-count">{ongoingTNCAssignments}</span>
                            <span className="stat-label">Active TNCs</span>
                        </div>
                        <div className="stat-badge total">
                            <span className="stat-count">{projects.length}</span>
                            <span className="stat-label">Total Projects</span>
                        </div>
                    </div>
                </div>
                
                <div className="header-actions">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search projects by name, client, or location..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button 
                                    className="clear-search-btn"
                                    onClick={handleClearSearch}
                                >
                                    ×
                                </button>
                            )}
                            <span className="search-icon">🔍</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleCreateClick} 
                        className="create-project-btn"
                        style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none'}}
                    >
                        + New Project
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Projects Panel */}
                <div className="projects-panel">
                    <div className="panel-header">
                        <h2>Projects Needing TNC</h2>
                        <div className="panel-actions">
                            <span className="results-count">
                                {filteredProjects.filter(p => p.tnc_pending && !p.tnc_is_assigned).length} of {filteredProjects.length} projects
                            </span>
                        </div>
                    </div>
                    
                    <div className="projects-table">
                        <div className="table-header">
                            <div className="table-cell">Project & Client</div>
                            <div className="table-cell">Progress</div>
                            <div className="table-cell">Phase</div>
                            <div className="table-cell">Current Task</div>
                            <div className="table-cell">TNC Status</div>
                            <div className="table-cell">Assignment Period</div>
                            <div className="table-cell">Actions</div>
                        </div>
                        
                        <div className="table-body">
                            <TNCList 
                                projects={filteredProjects}
                                searchTerm={searchTerm} 
                                setSelectedEntry={setSelectedEntry}
                                onAssignClick={handleAssignClick}
                                tncTechs={tncTechs}
                            />
                        </div>
                    </div>

                    {filteredProjects.length === 0 && projects.length > 0 && (
                        <div className="no-results">
                            <p>No projects found matching "{searchTerm}"</p>
                            <button onClick={handleClearSearch} className="clear-search-link">
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Details Panel */}
                <div className="details-panel">
                    <div className="panel-header">
                        <h2>Project Details</h2>
                    </div>
                    
                    {selectedEntry.id ? (
                        <div className="project-details">
                            <div className="project-card">
                                <div className="project-header">
                                    <h3 className="project-title">{selectedEntry.lift_name}</h3>
                                    <div className="project-meta">
                                        <span className="client">{selectedEntry.client}</span>
                                        <span className="location">{selectedEntry.city_municipality || selectedEntry.region}</span>
                                        <span className="phase">{selectedEntry.status}</span>
                                    </div>
                                </div>
                                
                                <div className="project-info-grid">
                                    <div className="info-item">
                                        <label>Current Task:</label>
                                        <span>{selectedEntry.current_task || 'No active task'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Progress:</label>
                                        <span>{selectedEntry.progress}% Complete</span>
                                    </div>
                                    <div className="info-item">
                                        <label>TNC Status:</label>
                                        <span className={`status-badge ${
                                            selectedEntry.tnc_ongoing ? 'ongoing' : 
                                            selectedEntry.tnc_is_assigned ? 'assigned' : 
                                            selectedEntry.tnc_pending ? 'pending' : 'none'
                                        }`}>
                                            {selectedEntry.tnc_ongoing ? 'Ongoing' : 
                                             selectedEntry.tnc_is_assigned ? 'Assigned' : 
                                             selectedEntry.tnc_pending ? 'Pending Assignment' : 'No Inspection'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="quick-actions-section">
                                    <h4>Quick Actions</h4>
                                    <div className="action-buttons">
                                        {selectedEntry.tnc_pending && !selectedEntry.tnc_is_assigned ? (
                                            <button 
                                                className="btn-primary"
                                                onClick={() => handleAssignClick(selectedEntry)}
                                            >
                                                👥 Assign TNC
                                            </button>
                                        ) : (<></>)}
                                        
                                        {(selectedEntry.tnc_is_assigned || selectedEntry.tnc_ongoing) ? (
                                            <button 
                                                className="btn-primary"
                                                onClick={() => handleAssignClick(selectedEntry)}
                                            >
                                                ✏️ Edit Assignment
                                            </button>
                                        ) : (<></>)}
                                    </div>
                                </div>

                                {/* Current Assignment Info */}
                                {(selectedEntry.tnc_is_assigned || selectedEntry.tnc_ongoing) ? (
                                    <div className="current-assignment-info">
                                        <h4>Current Assignment</h4>
                                        {tncTechs && (() => {
                                            const assignedTech = tncTechs.find(t => t.project_id === selectedEntry.id);
                                            const techDetails = assignedTech && tncEmployees.find(e => e.employee_id === assignedTech.employee_id);
                                            return techDetails ? (
                                                <div className="assigned-tech">
                                                    <strong>{techDetails.last_name} {techDetails.first_name}</strong>
                                                    <span>{techDetails.island_group}</span>
                                                    <span>Assignment Period: {assignedTech.tnc_start_date ? 
                                                        new Date(assignedTech.tnc_start_date).toLocaleDateString('en-GB') : 'N/A'} to {assignedTech.project_end_date ? 
                                                        new Date(assignedTech.project_end_date).toLocaleDateString('en-GB') : 'N/A'}</span>
                                                </div>
                                            ) : (
                                                <div className="no-assignment">No technician assigned</div>
                                            );
                                        })()}
                                    </div>
                                ) : (<></>)}
                            </div>
                        </div>
                    ) : (
                        <div className="no-selection">
                            <div className="no-selection-content">
                                <div className="no-selection-icon">📋</div>
                                <h3>No Project Selected</h3>
                                <p>Select a project from the list to view details and take action</p>
                            </div>
                        </div>
                    )}

                    {/* Technician Workload */}
                    <div className="workload-section">
                        <h3>TNC Technician Workload</h3>
                        <div className="workload-cards">
                            {tncEmployees.map(tech => {
                                const assignedProjects = tncTechs?.filter(t => 
                                    t.employee_id === tech.employee_id && 
                                    t.project_id
                                ) || [];
                                
                                const activeAssignments = assignedProjects.filter(p => 
                                    new Date(p.project_end_date) >= new Date()
                                );
                                
                                return (
                                    <div key={tech.employee_id} className="workload-card">
                                        <div className="workload-header">
                                            <h4>{tech.last_name} {tech.first_name}</h4>
                                            <span className={`project-count ${activeAssignments.length > 0 ? 'busy' : 'available'}`}>
                                                {activeAssignments.length} active / {assignedProjects.length} total
                                            </span>
                                        </div>
                                        <div className="workload-projects">
                                            {assignedProjects.map((project, index) => {
                                                const isActive = new Date(project.project_end_date) >= new Date();
                                                return (
                                                    <div key={index} className={`project-item ${isActive ? 'active' : 'completed'}`}>
                                                        <div className="project-name">{project.lift_name}</div>
                                                        <div className="project-meta">
                                                            <span>{project.client}</span>
                                                            <span>{project.tnc_start_date ? 
                                                                new Date(project.tnc_start_date).toLocaleDateString('en-GB') : 'No date'} - {project.project_end_date ? 
                                                                new Date(project.project_end_date).toLocaleDateString('en-GB') : 'No date'}</span>
                                                        </div>
                                                        {isActive && <div className="active-badge">Active</div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TNCAssignment