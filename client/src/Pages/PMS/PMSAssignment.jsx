import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { useSharedSocket } from '../../Context/SocketContext'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import PMSList from '../../components/PMS/PMSList';
import { Axios } from '../../api/axios';

const PMSAssignment = () => {
    const {utilitiesSocket} = useSharedSocket()
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const navigate = useNavigate();
    const { data: pmsProjects } = useAxiosFetch(`${backendURL}/api/pms/clients`)
    const { data: pmsTeams } = useAxiosFetch(`${backendURL}/api/pms/techs`)
    const employees = useStoreState(state => state.employees);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntry, setSelectedEntry] = useState({});
    const [assignModal, setAssignModal] = useState({ isOpen: false, project: null, type: '', mode: 'assign', assigned:[] });
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [assignmentStatus, setAssignmentStatus] = useState('');
    const [availableTechs, setAvailableTechs] = useState([]);
    const [inspectionDate, setInspectionDate] = useState('');
    const [currentAssignedTechs, setCurrentAssignedTechs] = useState([]);

    // Filter PMS technicians by island group
    const pmsTechs = useMemo(() => {
        return employees.filter(e => e.job === 'PMS Technician');
    }, [employees]);

    // Filter projects based on search term
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return pmsProjects;
        const term = searchTerm.toLowerCase();
        return pmsProjects.filter(project => 
            project.lift_name?.toLowerCase().includes(term) ||
            project.client?.toLowerCase().includes(term) ||
            project.product_type?.toLowerCase().includes(term) ||
            project.location?.toLowerCase().includes(term)
        );
    }, [pmsProjects, searchTerm]);

    // Load available technicians when modal opens
    useEffect(() => {
        if (assignModal.isOpen && assignModal.project) {
            console.log('use effect LOADEEEEEEEEEEEEED')
            loadAvailableTechnicians(assignModal.project.island_group);
            loadCurrentAssignment(assignModal.project, assignModal.type === 'callback' ? true : false);
        }
    }, [assignModal.isOpen, assignModal.project]);

    // Set initial dates when an entry is selected
    useEffect(() => {
        if (selectedEntry && selectedEntry.id) {
            if (selectedEntry.pms_inspection_date) {
                const date = new Date(selectedEntry.pms_inspection_date);
                const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                setInspectionDate(localDate.toISOString().split('T')[0]);
            } else {
                setInspectionDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [selectedEntry]);

    const loadAvailableTechnicians = async (islandGroup) => {
        try {
            const techs = pmsTechs.filter(t => t.island_group === islandGroup);
            setAvailableTechs(techs);
        } catch (error) {
            console.error('Error loading technicians:', error);
            setAvailableTechs([]);
        }
    };

    const loadCurrentAssignment = async (project, isCallback) => {
        try {
            // If project is already assigned, load current technicians
            if ((project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing') && !isCallback) {
                const assignedTechs = pmsTeams.filter(p => {
            const exist = p[1].projects.find(p => project.id === p.project_id)    
                if (exist !== undefined) return true
            }).map(t => t[1].employee_id)
            console.log(assignedTechs)
            console.log(pmsTechs)
            setSelectedTechs(pmsTechs.filter(t => {

                return assignedTechs.includes(t.employee_id)
            }))             
            } else {
                setCurrentAssignedTechs([]);
                setSelectedTechs([]);
            }
        } catch (error) {
            console.error('Error loading current assignment:', error);
            setCurrentAssignedTechs([]);
        }
    };

    const handleCreateClick = () => {
        navigate('/projects');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // PMS Assignment Functions
    const handleAssignClick = (project, type = 'regular') => {
        console.log(project)
        console.log(pmsTeams)

        const isEditMode = project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing';
        setAssignModal({ 
            isOpen: true, 
            project, 
            type, 
            mode: isEditMode ? 'edit' : 'assign',
        });
        console.log(isEditMode)
        if(isEditMode) {
            console.log('Then it is in edit mode')
        } else {
        setSelectedTechs([]);            
        }

        setAssignmentStatus('');
    };

    const handleAssignConfirm = async () => {
        if (selectedTechs.length === 0) {
            setAssignmentStatus('Please select at least one technician');
            return;
        }

        if (selectedTechs.length > 2) {
            setAssignmentStatus('Maximum 2 technicians can be assigned');
            return;
        }

        try {
            setAssignmentStatus('assigning');
            const technicianIds = selectedTechs.map(tech => tech.employee_id);
            
            const payload = { 
                technicianIds,
                inspection_date: inspectionDate,
                is_callback: assignModal.type === 'callback'
            };
            
            let endpoint, method;
            console.log(payload)
            if (assignModal.mode === 'edit') {
                // Update existing assignment
                endpoint = `/api/pms/assign/${assignModal.project.id}`;
                method = 'POST';
            } else {
                // Create new assignment
                endpoint = assignModal.type === 'callback' 
                    ? `/api/pms/callback/${assignModal.project.id}`
                    : `/api/pms/assign/${assignModal.project.id}`;
                method = 'POST';
            }
            
            const response = await Axios({
                method,
                url: endpoint,
                data: payload
            });

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to assign technicians');
            }

            // Send notification
            const project = assignModal.project;
            const message = assignModal.type === 'callback' 
                ? `Callback ${assignModal.mode === 'edit' ? 'rescheduled' : 'scheduled'} for ${project.client} (${project.lift_name}) on ${inspectionDate}`
                : `PMS Inspection ${assignModal.mode === 'edit' ? 'rescheduled' : 'scheduled'} for ${project.client} (${project.lift_name}) on ${inspectionDate}`;

            await new Promise((resolve, reject) => {
                utilitiesSocket.emit("new_notification", {
                    subject: assignModal.type === 'callback' 
                        ? `Callback ${assignModal.mode === 'edit' ? 'Updated' : 'Scheduled'}` 
                        : `PMS Inspection ${assignModal.mode === 'edit' ? 'Updated' : 'Assigned'}`,
                    body: message,
                    Ids: technicianIds
                }, (ack) => {
                    if (ack?.success) {
                        utilitiesSocket.emit("refresh_project_data");
                        resolve();
                    } else {
                        reject(new Error("Server failed to process notification."));
                    }
                });
            });

            setAssignmentStatus('success');
            setTimeout(() => {
                setAssignModal({ isOpen: false, project: null, type: '', mode: 'assign' });
                setSelectedTechs([]);
                setCurrentAssignedTechs([]);
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error assigning technicians:', error);
            setAssignmentStatus(error.message);
        }
    };

    const handleAssignClose = () => {
        setAssignModal({ isOpen: false, project: null, type: '', mode: 'assign' });
        setSelectedTechs([]);
        setAssignmentStatus('');
        setCurrentAssignedTechs([]);
    };

    // Callback Functions
    const handleCallbackClick = (project) => {
        setAssignModal({ 
            isOpen: true, 
            project, 
            type: 'callback', 
            mode: 'assign' 
        });
        setSelectedTechs([]);
        setAssignmentStatus('');
    };

    const handleTechSelection = (tech) => {
        setSelectedTechs(prev => {
            const isSelected = prev.find(t => t.employee_id === tech.employee_id);
            if (isSelected) {
                return prev.filter(t => t.employee_id !== tech.employee_id);
            } else {
                if (prev.length >= 2) {
                    setAssignmentStatus('Maximum 2 technicians allowed');
                    return prev;
                }
                setAssignmentStatus('');
                return [...prev, tech];
            }
        });
    };

    const handleUnassign = async () => {
        if (!confirm('Are you sure you want to unassign all technicians from this project?')) {
            return;
        }

        try {
            setAssignmentStatus('unassigning');
            const response = await Axios.delete(`/api/pms/assignment/${assignModal.project.id}`);
            
            if (response.data.success) {
                setAssignmentStatus('success');
                setTimeout(() => {
                    setAssignModal({ isOpen: false, project: null, type: '', mode: 'assign' });
                    setSelectedTechs([]);
                    setCurrentAssignedTechs([]);
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error('Failed to unassign technicians');
            }
        } catch (error) {
            console.error('Error unassigning technicians:', error);
            setAssignmentStatus('Error unassigning technicians');
        }
    };

    const projectsNeedingAssignment = pmsProjects.filter(p => 
        p.pms_status === 'PMS Inspection Pending' || p.pms_status === 'Free PMS Available'
    ).length;

    const isAssignedProject = assignModal.project && 
        (assignModal.project.pms_status === 'PMS Inspection Assigned' || 
         assignModal.project.pms_status === 'PMS Inspection Ongoing');

    return (
        <div className="Content PMSAssignment">
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>
                            {assignModal.mode === 'edit' ? 'Edit Assignment' : 
                             assignModal.type === 'callback' ? 'Schedule Callback' : 'Assign PMS Technician'}
                        </h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Location:</strong> {assignModal.project.location}, {assignModal.project.island_group}</p>
                            <p><strong>Product Type:</strong> {assignModal.project.product_type}</p>
                            <p><strong>PMS Status:</strong> {assignModal.project.pms_status}</p>
                        </div>
                        
                        {/* Current Assignment Info */}
                        {isAssignedProject && currentAssignedTechs.length > 0 && (
                            <div className="current-assignment">
                                <h4>Current Assignment</h4>
                                <div className="current-techs">
                                    {currentAssignedTechs.map(tech => (
                                        <div key={tech.employee_id} className="current-tech-item">
                                            <span>{tech.last_name} {tech.first_name}</span>
                                            <span className="tech-status">Assigned</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {console.log(selectedTechs)}
                        {/* Date Selection */}
                        <div className="date-selection">
                            <label>
                                {assignModal.type === 'callback' ? 'Callback Date:' : 'Inspection Date:'}
                            </label>
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
                                {assignModal.mode === 'edit' ? 'Update Technicians:' : 'Select Technicians:'} (Max 2)
                            </label>
                            <span>Available technicians in {assignModal.project.island_group}</span>
                            
                            <div className="techs-list">
                                {availableTechs.map(tech => {
                                    const isCurrentlyAssigned = currentAssignedTechs.find(t => t.employee_id === tech.employee_id);
                                    const isSelected = selectedTechs.find(t => t.employee_id === tech.employee_id);
                                    
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
                                    <div className="no-techs">No available technicians in this region</div>
                                )}
                            </div>

                            {selectedTechs.length > 0 && (
                                <div className="selected-techs">
                                    <strong>Selected Technicians:</strong>
                                    {selectedTechs.map(tech => (
                                        <span key={tech.employee_id} className="selected-tech-tag">
                                            {tech.last_name} {tech.first_name}
                                        </span>
                                    ))}
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
                                    {assignmentStatus === 'unassigning' ? 'Unassigning...' : 'Unassign All'}
                                </button>
                            )}
                            <button onClick={handleAssignClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignConfirm} 
                                className="btn-confirm"
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success' || selectedTechs.length === 0}
                            >
                                {assignmentStatus === 'assigning' ? 'Processing...' : 
                                 assignModal.mode === 'edit' ? 'Update Assignment' :
                                 assignModal.type === 'callback' ? 'Schedule Callback' : 'Assign Technicians'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-main">
                    <h1>PMS Assignment Dashboard</h1>
                    <div className="header-stats">
                        <div className="stat-badge urgent">
                            <span className="stat-count">{projectsNeedingAssignment}</span>
                            <span className="stat-label">Need Assignment</span>
                        </div>
                        <div className="stat-badge total">
                            <span className="stat-count">{pmsProjects.length}</span>
                            <span className="stat-label">Total Projects</span>
                        </div>
                    </div>
                </div>
                
                <div className="header-actions">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search projects..."
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
                        <h2>Projects</h2>
                        <div className="panel-actions">
                            <span className="results-count">{filteredProjects.length} projects</span>
                        </div>
                    </div>
                    
                    <div className="projects-table">
                        <div className="table-header">
                            <div className="table-cell">Project & Client</div>
                            <div className="table-cell">Product Type</div>
                            <div className="table-cell">Location</div>
                            <div className="table-cell">PMS Status</div>
                            <div className="table-cell">Last Inspection</div>
                            <div className="table-cell">Next Inspection</div>
                            <div className="table-cell">Contract</div>
                            <div className="table-cell">Callback Date</div>
                        </div>
                        
                        <div className="table-body">
                            <PMSList 
                                projects={filteredProjects}
                                searchTerm={searchTerm} 
                                setSelectedEntry={setSelectedEntry}
                                onAssignClick={handleAssignClick}
                                onCallbackClick={handleCallbackClick}
                                selectedEntryId={selectedEntry.id}
                            />
                        </div>
                    </div>

                    {filteredProjects.length === 0 && pmsProjects.length > 0 && (
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
                        {selectedEntry.id && (
                            <button
                                onClick={() => navigate(`/baby-book/${selectedEntry.id}`)}
                                className="baby-book-btn"
                            >
                                View Baby Book
                            </button>
                        )}
                    </div>
                    
                    {selectedEntry.id ? (
                        <div className="project-details">
                            <div className="project-card">
                                <div className="project-header">
                                    <h3 className="project-title">{selectedEntry.lift_name}</h3>
                                    <div className="project-meta">
                                        <span className="client">{selectedEntry.client}</span>
                                        <span className="product-type">{selectedEntry.product_type}</span>
                                        <span className="location">{selectedEntry.location}, {selectedEntry.island_group}</span>
                                    </div>
                                </div>
                                
                                <div className="project-info-grid">
                                    <div className="info-item">
                                        <label>Handover Date:</label>
                                        <span>{selectedEntry.handover_date ? 
                                            new Date(selectedEntry.handover_date).toLocaleDateString('en-GB') : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Days Since Handover:</label>
                                        <span>{selectedEntry.days_since_handover || 'N/A'} days</span>
                                    </div>
                                    <div className="info-item">
                                        <label>PMS Status:</label>
                                        <span className={`status-badge ${selectedEntry.pms_status?.toLowerCase().replace(' ', '-')}`}>
                                            {selectedEntry.pms_status}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>PMS Scheduling:</label>
                                        <span className={`status-badge ${selectedEntry.pms_status?.toLowerCase().replace(' ', '-')}`}>
                                            {selectedEntry.contract_type}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="quick-actions-section">
                                    <h4>Quick Actions</h4>
                                    <div className="action-buttons">
                                        {(selectedEntry.pms_status === 'PMS Inspection Pending' || selectedEntry.pms_status === 'Free PMS Available') && (
                                            <button 
                                                className="btn-primary"
                                                onClick={() => handleAssignClick(selectedEntry, 'regular')}
                                            >
                                                👥 Assign PMS
                                            </button>
                                        )}
                                        
                                        {(selectedEntry.pms_status === 'PMS Inspection Assigned' || selectedEntry.pms_status === 'PMS Inspection Ongoing') && (
                                            <button 
                                                className="btn-primary"
                                                onClick={() => handleAssignClick(selectedEntry, 'regular')}
                                            >
                                                ✏️ Edit Assignment
                                            </button>
                                        )}
                                        
                                        <button 
                                            className="btn-secondary"
                                            onClick={() => handleCallbackClick(selectedEntry)}
                                        >
                                            📞 Schedule Callback
                                        </button>
                                    </div>
                                </div>
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

                    {/* Technician Tally */}
                    <div className="tally-section">
                        <h3>Team Workload</h3>
                        <div className="tally-cards">
                            {pmsTeams.map(([techName, data]) => (
                                <div key={techName} className="tally-card">
                                    <div className="tally-header">
                                        <h4>{techName}</h4>
                                        <span className="project-count">{data.projects?.length || 0} projects</span>
                                    </div>
                                    <div className="tally-projects">
                                        {data.projects?.map((project, index) => (
                                            <div key={index} className="project-item">
                                                <div className="project-name">{project.project_name}</div>
                                                <div className="project-meta">
                                                    <span>{project.project_location}</span>
                                                    <span>{new Date(project.inspection_date).toLocaleDateString('en-GB')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PMSAssignment;