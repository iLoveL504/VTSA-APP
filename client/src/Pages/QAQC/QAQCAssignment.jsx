import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import QAQCList from '../../components/QAQCTNC/QAQCList.jsx'
import { useSharedSocket } from '../../Context/SocketContext.js';
import '../../css/QAQCPage.css'
import { Axios } from '../../api/axios.js'

const QAQCAssignment = () => {
    const { utilitiesSocket } = useSharedSocket()
    const manpower = useStoreState(state => state.manpower)
    const qaqcTechs = useStoreState(state => state.qaqcTechs)
    const {manpowerIsLoading} = useStoreState(state => state)
    const navigate = useNavigate()
    const projects = useStoreState(state => state.projects)
    const employees = useStoreState(state => state.employees)
    console.log(manpower)
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
    const [inspectionDate, setInspectionDate] = useState('')
    const [currentAssignedTech, setCurrentAssignedTech] = useState(null)

    // Filter QAQC technicians
    const qaqcEmployees = useMemo(() => {
        return employees.filter(e => e.job === 'QAQC');
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
            if (selectedEntry.qaqc_inspection_date) {
                const date = new Date(selectedEntry.qaqc_inspection_date);
                const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                setInspectionDate(localDate.toISOString().split('T')[0]);
            } else {
                // Default to tomorrow for new assignments
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setInspectionDate(tomorrow.toISOString().split('T')[0]);
            }
        }
    }, [selectedEntry])

    const loadAvailableTechnicians = async () => {
        try {
            // Get technicians not currently assigned to any project or available for assignment
            const available = qaqcEmployees.filter(tech => {
                const isAssigned = qaqcTechs?.find(q => q.employee_id === tech.employee_id && q.project_id);
                return !isAssigned;
            });
            setAvailableTechs(available);
        } catch (error) {
            console.error('Error loading technicians:', error);
            setAvailableTechs([]);
        }
    };

    const loadCurrentAssignment = async (project) => {
        try {
            // If project already has QAQC assigned, load current technician
            if (project.qaqc_is_assigned || project.qaqc_ongoing) {
                const assignedTech = qaqcTechs?.find(q => q.project_id === project.id);
                if (assignedTech) {
                    const techDetails = qaqcEmployees.find(e => e.employee_id === assignedTech.employee_id);
                    setCurrentAssignedTech(techDetails);
                    setSelectedTech(techDetails);
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
        const isEditMode = project.qaqc_is_assigned || project.qaqc_ongoing;
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
            setAssignmentStatus('Please select a QAQC technician');
            return;
        }

        try {
            const peID = projects.find(p => p.id === assignModal.project.id)?.project_engineer_id;
            const ProjectManagerId = employees.find(e => e.job === 'Project Manager')?.employee_id;
            
            setAssignmentStatus('assigning');
            
            const payload = {
                projId: assignModal.project.id,
                qaqcId: selectedTech.employee_id,
                assign_date: new Date().toISOString().split('T')[0],
                inspection_type: 'QAQC',
                inspection_reason: selectedEntry.qaqc_inspection_reason || 'Routine Inspection',
                inspection_date: inspectionDate
            };

            let endpoint, method;
            
            if (assignModal.mode === 'edit') {
                // Update existing assignment
                endpoint = `/api/projects/qaqc/assign/${assignModal.project.id}`;
                method = 'PUT';
            } else {
                // Create new assignment
                endpoint = `/api/projects/qaqc/assign/${assignModal.project.id}`;
                method = 'PUT';
            }

            const response = await Axios({
                method,
                url: endpoint,
                data: payload
            });
            console.log(payload)
             if (response.data.success) {
                 setAssignmentStatus('success');

                // Make Notification
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error("Socket emit timeout"));
                    }, 5000); 

                    utilitiesSocket.emit("new_notification", {
                        subject: assignModal.mode === 'edit' ? 'QAQC Assignment Updated' : 'Assigned for QAQC Inspection',
                        body: `QAQC Inspection for ${assignModal.project.lift_name} is ${assignModal.mode === 'edit' ? 'updated' : 'assigned'} to ${selectedTech.last_name} ${selectedTech.first_name}`,
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
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error assigning QAQC technician:', error);
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
        if (!confirm('Are you sure you want to unassign the QAQC technician from this project?')) {
            return;
        }

        try {
            setAssignmentStatus('unassigning');
            const response = await Axios.delete(`/api/projects/qaqc/assignment/${assignModal.project.id}`);
            
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
    const projectsNeedingAssignment = projects.filter(p => p.qaqc_pending).length;
    const totalAssignedProjects = projects.filter(p => p.qaqc_is_assigned || p.qaqc_ongoing).length;
    console.log('assigned projects')
    console.log(projects.filter(p => p.qaqc_is_assigned || p.qaqc_ongoing))
    if (manpowerIsLoading) return (
        <div className="Loading">
            <p>Loading data...</p>
        </div>
    )

    return (
        <div className='Content QAQCMenu'>
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>
                            {assignModal.mode === 'edit' ? 'Edit QAQC Assignment' : 'Assign QAQC Technician'}
                        </h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Location:</strong> {assignModal.project.city_municipality || assignModal.project.region}</p>
                            <p><strong>QAQC Status:</strong> {assignModal.project.qaqc_is_assigned ? 'Assigned' : assignModal.project.qaqc_ongoing ? 'Ongoing' : 'Pending'}</p>
                            <p><strong>Inspection Reason:</strong> {assignModal.project.qaqc_inspection_reason || 'Routine Inspection'}</p>
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
                            <label>Inspection Date:</label>
                            <input
                                type="date"
                                value={inspectionDate}
                                onChange={(e) => setInspectionDate(e.target.value)}
                                className="date-input"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        
                        {/* Technician Selection */}
                        <div className="tech-selection">
                            <label>
                                {assignModal.mode === 'edit' ? 'Update Technician:' : 'Select Technician:'}
                            </label>
                            <span>Available QAQC Technicians</span>
                            
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
                                    <div className="no-techs">No available QAQC technicians</div>
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
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success' || !selectedTech}
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
                    <h1>QAQC Assignment Dashboard</h1>
                    <div className="header-stats">
                        <div className="stat-badge urgent">
                            <span className="stat-count">{projectsNeedingAssignment}</span>
                            <span className="stat-label">Need Assignment</span>
                        </div>
                        <div className="stat-badge assigned">
                            <span className="stat-count">{totalAssignedProjects}</span>
                            <span className="stat-label">Assigned</span>
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
                        <h2>Projects Needing QAQC</h2>
                        <div className="panel-actions">
                            <span className="results-count">
                                {filteredProjects.filter(p => p.qaqc_pending).length} of {filteredProjects.length} projects
                            </span>
                        </div>
                    </div>
                    
                    <div className="projects-table">
                        <div className="table-header">
                            <div className="table-cell">Project & Client</div>
                            <div className="table-cell">Progress</div>
                            <div className="table-cell">Phase</div>
                            <div className="table-cell">Current Task</div>
                            <div className="table-cell">QAQC Reason</div>
                            <div className="table-cell">QAQC Status</div>
                            <div className="table-cell">Inspection Date</div>
                            <div className="table-cell">Actions</div>
                        </div>
                        
                        <div className="table-body">
                            <QAQCList 
                                projects={filteredProjects}
                                searchTerm={searchTerm} 
                                setSelectedEntry={setSelectedEntry}
                                onAssignClick={handleAssignClick}
                                manpower={manpower}
                                qaqcTechs={qaqcTechs}
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
                                        <label>QAQC Status:</label>
                                        <span className={`status-badge ${
                                            selectedEntry.qaqc_ongoing ? 'ongoing' : 
                                            selectedEntry.qaqc_is_assigned ? 'assigned' : 
                                            selectedEntry.qaqc_pending ? 'pending' : 'none'
                                        }`}>
                                            {selectedEntry.qaqc_ongoing ? 'Ongoing' : 
                                             selectedEntry.qaqc_is_assigned ? 'Assigned' : 
                                             selectedEntry.qaqc_pending ? 'Pending Assignment' : 'No Inspection'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Inspection Reason:</label>
                                        <span>{selectedEntry.qaqc_inspection_reason || 'Routine Inspection'}</span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="quick-actions-section">
                                    <h4>Quick Actions</h4>
                                    <div className="action-buttons">
                                        {selectedEntry.qaqc_pending ? (
                                            <button 
                                                className="btn-primary"
                                                onClick={() => handleAssignClick(selectedEntry)}
                                            >
                                                👥 Assign QAQC
                                            </button>
                                        ) : (<></>)}
                                        
                                        {(selectedEntry.qaqc_is_assigned || selectedEntry.qaqc_ongoing) ? (
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
                                {(selectedEntry.qaqc_is_assigned || selectedEntry.qaqc_ongoing) ? (
                                    <div className="current-assignment-info">
                                        <h4>Current Assignment</h4>
                                        {qaqcTechs && (() => {
                                            const assignedTech = qaqcTechs.find(q => q.project_id === selectedEntry.id);
                                            const techDetails = assignedTech && qaqcEmployees.find(e => e.employee_id === assignedTech.employee_id);
                                            return techDetails ? (
                                                <div className="assigned-tech">
                                                    <strong>{techDetails.last_name} {techDetails.first_name}</strong>
                                                    <span>{techDetails.island_group}</span>
                                                    <span>Assigned on: {assignedTech.qaqc_inspection_date ? 
                                                        new Date(assignedTech.qaqc_inspection_date).toLocaleDateString('en-GB') : 'N/A'}</span>
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
                        <h3>QAQC Technician Workload</h3>
                        <div className="workload-cards">
                            {qaqcEmployees.map(tech => {
                                const assignedProjects = qaqcTechs?.filter(q => q.employee_id === tech.employee_id && q.project_id) || [];
                                return (
                                    <div key={tech.employee_id} className="workload-card">
                                        <div className="workload-header">
                                            <h4>{tech.last_name} {tech.first_name}</h4>
                                            <span className="project-count">{assignedProjects.length} projects</span>
                                        </div>
                                        <div className="workload-projects">
                                            {assignedProjects.map((project, index) => (
                                                <div key={index} className="project-item">
                                                    <div className="project-name">{project.lift_name}</div>
                                                    <div className="project-meta">
                                                        <span>{project.client}</span>
                                                        <span>{project.qaqc_inspection_date ? 
                                                            new Date(project.qaqc_inspection_date).toLocaleDateString('en-GB') : 'No date'}</span>
                                                    </div>
                                                </div>
                                            ))}
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

export default QAQCAssignment