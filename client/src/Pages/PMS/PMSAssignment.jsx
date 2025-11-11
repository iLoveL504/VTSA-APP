import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { useSharedSocket } from '../../Context/SocketContext'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import PMSList from '../../components/PMS/PMSList';
import { Axios } from '../../api/axios';

const PMSAssignment = ({ updateIsLoading }) => {
    const {utilitiesSocket} = useSharedSocket()
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const navigate = useNavigate();
    const { data: pmsProjects } = useAxiosFetch(`${backendURL}/api/pms/clients`)
    const { data: pmsTeams, error:pmsError } = useAxiosFetch(`${backendURL}/api/pms/techs`)
    const employees = useStoreState(state => state.employees);
    console.log(pmsError)
    console.log('hello')
    console.log(pmsProjects)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntry, setSelectedEntry] = useState({});
    const [assignModal, setAssignModal] = useState({ isOpen: false, project: null });
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [assignmentStatus, setAssignmentStatus] = useState('');
    const [availableTechs, setAvailableTechs] = useState([]);
    const [newInspectionDate, setNewInspectionDate] = useState('');
    const [scheduleStatus, setScheduleStatus] = useState('');

    console.log(pmsTeams)
    
    // Filter PMS technicians by island group
    const pmsTechs = useMemo(() => {
        return employees.filter(e => 
            e.job === 'PMS Technician'
        );
    }, [employees]);
    console.log(pmsTechs)

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

    // Load available technicians when assign modal opens
    useEffect(() => {
        if (assignModal.isOpen && assignModal.project) {
            loadAvailableTechnicians(assignModal.project.island_group);
        }
    }, [assignModal.isOpen, assignModal.project]);

    // Set initial date when an entry is selected
    useEffect(() => {
        if (selectedEntry && selectedEntry.id) {
            // Set initial inspection date when entry is selected - handle timezone correctly
            if (selectedEntry.pms_inspection_date) {
                // Create date in local timezone to avoid day shift
                const date = new Date(selectedEntry.pms_inspection_date);
                const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                setNewInspectionDate(localDate.toISOString().split('T')[0]);
            } else {
                setNewInspectionDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [selectedEntry]);

    const loadAvailableTechnicians = async (islandGroup) => {
        try {
            console.log(islandGroup)
            const techs = pmsTechs.filter(t => t.island_group === islandGroup)
            setAvailableTechs(techs);
        } catch (error) {
            console.error('Error loading technicians:', error);
            setAvailableTechs([]);
        } finally {
            console.log('yippee')
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

    const handleAssignClick = async (project, action) => {
        console.log(action)
        setAssignModal({ isOpen: true, project, action });
        setSelectedTechs([]);
        setAssignmentStatus('');
    };

    const handleScheduleConfirm = async () => {
        if (!newInspectionDate || !selectedEntry.id) {
            setScheduleStatus('Please select an inspection date');
            return;
        }

        try {
            console.log(newInspectionDate)
            // setScheduleStatus('updating');
            const response = await Axios.put(`/api/pms/update-schedule/${selectedEntry.id}`, {
                inspection_date: newInspectionDate
            });
            console.log(response)
            if (response.data.success) {
                setScheduleStatus('success');
                setTimeout(() => {
                    // Refresh data
                    window.location.reload();
                }, 1500);
            } else {
                setScheduleStatus('Failed to update schedule');
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
            setScheduleStatus('Error updating schedule');
        }
    };

    const handleAssignConfirm = async () => {
        console.log(selectedTechs.length === 0)
        console.log(assignModal)
        
        if (selectedTechs.length === 0) {
            console.log('0')
            setAssignmentStatus('Please select at least one technician');
            return;
        }

        if (selectedTechs.length > 2) {
            setAssignmentStatus('Maximum 2 technicians can be assigned');
            return;
        }
        console.log(selectedTechs)
        try {
            setAssignmentStatus('assigning');
            const technicianIds = selectedTechs.map(tech => tech.employee_id);
            
            const payload = { 
                technicianIds,
                inspection_date: newInspectionDate
            };
            
            console.log(payload);
            const response = await Axios.post(`/api/pms/assign/${assignModal.project.id}`, payload);

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to assign technicians');
            }
            console.log(technicianIds)
            const iDate = new Date(selectedEntry.pms_inspection_date)
            const localDate = new Date(iDate.getTime() - (iDate.getTimezoneOffset() * 60000));
            console.log(localDate.toISOString().split('T')[0])
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Assigned for PMS Inspection',
                    body: `PMS Inspection to be condected for ${selectedEntry.client} (${selectedEntry.lift_name})
                    at ${localDate.toISOString().split('T')[0]}`,
                    Ids: technicianIds
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

            setAssignmentStatus('success');
            
            setTimeout(() => {
                setAssignModal({ isOpen: false, project: null });
                setNewInspectionDate('');
                // Refresh data
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error assigning technicians:', error);
            setAssignmentStatus(error.message);
        }
    };

    const handleAssignClose = () => {
        setAssignModal({ isOpen: false, project: null });
        setSelectedTechs([]);
        setAssignmentStatus('');
        setNewInspectionDate('');
    };

    const handleTechSelection = (tech) => {
        console.log(tech)
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

    const projectsNeedingAssignment = pmsProjects.filter(p => 
        p.pms_status === 'PMS Inspection Pending' || p.pms_status === 'Free PMS Available'
    ).length;

    return (
        <div className="Content PMSAssignment">
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>Assign PMS Technician</h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Location:</strong> {assignModal.project.location}, {assignModal.project.island_group}</p>
                            <p><strong>Product Type:</strong> {assignModal.project.product_type}</p>
                            <p><strong>PMS Status:</strong> {assignModal.project.pms_status}</p>
                        </div>
                        
                        {/* Inspection Date Selection */}
                        {/* Technician Selection */}
                        <div className="tech-selection">
                            <label>Select PMS Technicians (Max 2):</label>
                            <span>Available technicians in {assignModal.project.island_group}</span>
                            
                            <div className="techs-list">
                                {availableTechs.map(tech => (
                                    <div 
                                        key={tech.employee_id}
                                        className={`tech-item ${
                                            selectedTechs.find(t => t.employee_id === tech.employee_id) ? 'selected' : ''
                                        }`}
                                        onClick={() => handleTechSelection(tech)}
                                    >
                                        <div className="tech-info">
                                            <strong>{tech.last_name} {tech.first_name}</strong>
                                            <span>{tech.island_group}</span>
                                        </div>
                                        <div className="tech-checkbox">
                                            {selectedTechs.find(t => t.employee_id === tech.employee_id) ? '✓' : ''}
                                        </div>
                                    </div>
                                ))}
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
                                assignmentStatus === 'assigning' ? 'info' : 'error'
                            }`}>
                                {assignmentStatus === 'assigning' ? 'Assigning technicians...' : assignmentStatus}
                            </div>
                        )}
                        {console.log(newInspectionDate)}
                        {console.log(selectedTechs)}
                        <div className="modal-actions">
                            <button onClick={handleAssignClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignConfirm} 
                                className="btn-confirm"
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'success' || selectedTechs.length === 0}
                            >
                                {assignmentStatus === 'assigning' ? 'Assigning...' : `Assign`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
<div className='info-section'>
    {/* Selected Project Info Section */}
    <div className='entry-section compact'>
        <div className='entry-header'>
            <h1>PMS Project Details</h1>
            {selectedEntry.id && (
                <div className="entry-actions">
                    <button
                        onClick={() => navigate(`/baby-book/${selectedEntry.id}`)}
                        className="baby-book-btn"
                    >
                        View Baby Book
                    </button>
                </div>
            )}
        </div>
        
        {selectedEntry.id ? (
            <div className='selected-entry-content'>
                {/* Compact Project Overview */}
                <div className="project-overview">
                    <div className="project-main-info">
                        <h2 className="project-title">{selectedEntry.lift_name}</h2>
                        <div className="project-meta">
                            <span className="client">{selectedEntry.client}</span>
                            <span className="product-type">{selectedEntry.product_type}</span>
                            <span className="location">{selectedEntry.location}, {selectedEntry.island_group}</span>
                        </div>
                    </div>
                    <div className="project-dates">
                        <div className="date-item">
                            <label>Handover:</label>
                            <span>{selectedEntry.handover_date ? 
                                new Date(selectedEntry.handover_date).toLocaleDateString('en-GB') : 'N/A'}
                            </span>
                        </div>
                        <div className="date-item">
                            <label>Days Since:</label>
                            <span>{selectedEntry.days_since_handover || 'N/A'} days</span>
                        </div>
                    </div>
                </div>

                {/* PMS Status Section - More Prominent */}
                <div className="pms-status-section compact">
                    {(selectedEntry.pms_status === 'PMS Inspection Pending' || selectedEntry.pms_status === 'Free PMS Available') ? (
                        <div className="entry-pms-assignment">
                            <div className="pms-status-header">
                                <h3>🔄 PMS Inspection Required</h3>
                                <span className="status-badge urgent">Urgent</span>
                            </div>
                            <p>This project needs PMS technician assignment for preventive maintenance</p>
                            <div className="pms-action-group">
                                <div className="schedule-update-section compact">
                                    <div className="schedule-selection">
                                        <div className="date-input-group">
                                            <label>Inspection Date:</label>
                                            <input
                                                type="date"
                                                value={newInspectionDate}
                                                onChange={(e) => setNewInspectionDate(e.target.value)}
                                                className="date-input"
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleScheduleConfirm} 
                                            className="btn-schedule"
                                            disabled={scheduleStatus === 'updating' || scheduleStatus === 'success'}
                                        >
                                            {scheduleStatus === 'updating' ? 'Updating...' : 'Update Date'}
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    className="assign-pms-btn primary"
                                    onClick={() => handleAssignClick(selectedEntry, 'assign')}
                                >
                                    👥 Assign PMS Technicians
                                </button>
                            </div>
                            {scheduleStatus && (
                                <div className={`status compact ${
                                    scheduleStatus === 'success' ? 'success' : 
                                    scheduleStatus === 'updating' ? 'info' : 'error'
                                }`}>
                                    {scheduleStatus === 'updating' ? 'Updating schedule...' : scheduleStatus}
                                </div>
                            )}
                        </div>                            
                    ) : selectedEntry.pms_status === 'PMS Inspection Assigned' ? (
                        <div className="entry-pms-assigned">
                            <div className="pms-status-header">
                                <h3>✅ PMS Assigned</h3>
                                <span className="status-badge assigned">Assigned</span>
                            </div>
                            <div className="status-details">
                                <span>Technicians assigned and ready for inspection</span>
                                <span className="inspection-date">
                                    Next Inspection: {selectedEntry.pms_inspection_date ? 
                                        new Date(selectedEntry.pms_inspection_date).toLocaleDateString('en-GB') : 'Not scheduled'}
                                </span>
                            </div>
                            <div className="pms-action-group">
                                <div className="schedule-update-section compact">
                                    <div className="schedule-selection">
                                        <div className="date-input-group">
                                            <label>Reschedule:</label>
                                            <input
                                                type="date"
                                                value={newInspectionDate}
                                                onChange={(e) => setNewInspectionDate(e.target.value)}
                                                className="date-input"
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleScheduleConfirm} 
                                            className="btn-schedule"
                                            disabled={scheduleStatus === 'updating' || scheduleStatus === 'success'}
                                        >
                                            {scheduleStatus === 'updating' ? 'Updating...' : 'Reschedule'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : selectedEntry.pms_status === 'PMS Inspection Ongoing' ? (
                        <div className="entry-pms-ongoing">
                            <div className="pms-status-header">
                                <h3>⏳ PMS Ongoing</h3>
                                <span className="status-badge ongoing">In Progress</span>
                            </div>
                            <div className="status-details">
                                <span>Inspection is currently in progress</span>
                                <span className="inspection-date">
                                    Scheduled: {selectedEntry.pms_inspection_date ? 
                                        new Date(selectedEntry.pms_inspection_date).toLocaleDateString('en-GB') : 'N/A'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="entry-no-inspection">
                            <h3>ℹ️ PMS Status</h3>
                            <span>{selectedEntry.pms_status || 'No inspection required'}</span>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="no-selection">
                <div className="no-selection-content">
                    <div className="no-selection-icon">📋</div>
                    <h3>No Project Selected</h3>
                    <p>Click on a project from the list below to view details and assign PMS technicians</p>
                </div>
            </div>
        )}


                    
                </div>
                
                <div className="tech-tally-section">
                    <h3>Technician Project Tally</h3>
                    <div className="tally-cards">
                        {console.log(pmsTeams.map(t => t))}
                        {pmsTeams.map(([techName, data]) => (
                            <div key={techName} className="tally-card">
                                <div className="tally-header">
                                    <h4>{techName} <span>({data.island_group})</span></h4>
                                    <span className="project-count">{data.projects?.length > 0 ? data.projects?.length : 'No'} project{data.projects?.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="tally-projects">
                                    {data.projects?.map((project, index) => (
                                        <div key={index} className="project-item">
                                            <div className="project-name">{project.project_name}</div>
                                            <div className="project-details">
                                                <span className="project-location">{project.project_location}</span>
                                                <span className="inspection-date">
                                                    {new Date(project.inspection_date).toLocaleDateString('en-GB')}
                                                </span>
                                            </div>
                                            <div>
                                            {project.ongoing ? 'Ongoing' : ''} 
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>      
            </div>

            
            {/* Header Section */}
            <div className="projects-header">
                <div className="header-left">
                    <h1>PMS Assignment Dashboard</h1>
                    <div className="projects-count">
                        {projectsNeedingAssignment} projects need PMS assignment
                    </div>
                </div>
                
                <div className="header-right">
                    {/* Search Bar */}
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search projects by name, client, product type, or location..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button 
                                    className="clear-search-btn"
                                    onClick={handleClearSearch}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                            <span className="search-icon">🔍</span>
                        </div>
                    </div>

                    {/* Create Project Button */}
                    <button 
                        onClick={handleCreateClick} 
                        className="create-project-btn"
                        style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none'}}
                    >
                        + Add New Project
                    </button>
                </div>
            </div>

            {/* Projects Table Header */}
            <div className="project-table-header">
                <div className="table-row header-row">
                    <div className="table-cell">Project & Client</div>
                    <div className="table-cell">Product Type</div>
                    <div className="table-cell">Location</div>
                    <div className="table-cell">PMS Status</div>
                    <div className="table-cell">Last Inspection</div>
                    <div className="table-cell">Next Inspection</div>
                    <div className="table-cell">Free PMS</div>
                    <div className="table-cell">Callback</div>
                </div>
            </div>

            {/* Project List */}
            <div>
                <PMSList 
                    projects={filteredProjects}
                    searchTerm={searchTerm} 
                    updateIsLoading={updateIsLoading} 
                    setSelectedEntry={setSelectedEntry}
                    onAssignClick={handleAssignClick}
                />
            </div>

            {/* No Results Message */}
            {filteredProjects.length === 0 && pmsProjects.length > 0 && (
                <div className="no-results">
                    <p>No projects found matching "{searchTerm}"</p>
                    <button onClick={handleClearSearch} className="clear-search-link">
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
};

export default PMSAssignment;