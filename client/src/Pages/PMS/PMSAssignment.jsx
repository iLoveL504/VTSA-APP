import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreActions } from 'easy-peasy';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import PMSList from '../../components/PMS/PMSList';
import '../../css/PMSAssignment.css';

const PMSAssignment = ({ updateIsLoading }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const navigate = useNavigate();
    const { data: pmsProjects } = useAxiosFetch(`${backendURL}/api/pms/clients`)
  //  const employees = useStoreState(state => state.employees);
    const fetchPMSProjects = useStoreActions(actions => actions.fetchPMSProjects);
   // const fetchEmployees = useStoreActions(actions => actions.fetchEmployees);
    console.log(pmsProjects)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntry, setSelectedEntry] = useState({});
    const [assignModal, setAssignModal] = useState({ isOpen: false, project: null });
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [assignmentStatus, setAssignmentStatus] = useState('');
    const [availableTechs, setAvailableTechs] = useState([]);

    // Filter PMS technicians by island group
    // const pmsTechs = useMemo(() => {
    //     return employees.filter(e => 
    //         e.role === 'PMS Technician' && 
    //         e.is_active === 1
    //     );
    // }, [employees]);

    // // Load data on component mount
    // useEffect(() => {
    //     const loadData = async () => {
    //         updateIsLoading(true);
    //         try {
    //             await Promise.all([
    //                 fetchPMSProjects(),
    //                 fetchEmployees()
    //             ]);
    //         } catch (error) {
    //             console.error('Error loading data:', error);
    //         } finally {
    //             updateIsLoading(false);
    //         }
    //     };
    //     loadData();
    // }, [fetchPMSProjects, fetchEmployees, updateIsLoading]);

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

    const loadAvailableTechnicians = async (islandGroup) => {
        try {
            updateIsLoading(true);
            const response = await fetch(`/api/pms/techs/${islandGroup}`);
            const techs = await response.json();
            setAvailableTechs(techs);
        } catch (error) {
            console.error('Error loading technicians:', error);
            setAvailableTechs([]);
        } finally {
            updateIsLoading(false);
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

    const handleAssignClick = async (project) => {
        setAssignModal({ isOpen: true, project });
        setSelectedTechs([]);
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
            
            const response = await fetch(`/api/pms/assign/${assignModal.project.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    technicianIds: selectedTechs.map(tech => tech.employee_id)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to assign technicians');
            }

            setAssignmentStatus('success');
            
            // Refresh data
            await fetchPMSProjects();
            
            setTimeout(() => {
                setAssignModal({ isOpen: false, project: null });
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

    const projectsNeedingAssignment = pmsProjects.filter(p => 
        p.pms_status === 'PMS Inspection Pending' || p.pms_status === 'Free PMS Available'
    ).length;

    return (
        <div className="Content PMSAssignment">
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>Assign PMS Technicians</h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Location:</strong> {assignModal.project.location}, {assignModal.project.island_group}</p>
                            <p><strong>Product Type:</strong> {assignModal.project.product_type}</p>
                            <p><strong>PMS Status:</strong> {assignModal.project.pms_status}</p>
                        </div>
                        
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
                                            <strong>{tech.full_name}</strong>
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
                                            {tech.full_name}
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

                        <div className="modal-actions">
                            <button onClick={handleAssignClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignConfirm} 
                                className="btn-confirm"
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'success' || selectedTechs.length === 0}
                            >
                                {assignmentStatus === 'assigning' ? 'Assigning...' : 'Assign Technicians'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
            {/* Selected Project Info Section */}
            <div className='entry-section'>
                <h1>PMS Project Details</h1>
                <div className='entry-info'>
                    <div className="info-grid">
                        <div className="info-item">
                            <strong>Project</strong>
                            <span>{selectedEntry.lift_name || 'No project selected'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Client</strong>
                            <span>{selectedEntry.client || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Product Type</strong>
                            <span>{selectedEntry.product_type || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Location</strong>
                            <span>{selectedEntry.location ? `${selectedEntry.location}, ${selectedEntry.island_group}` : 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Handover Date</strong>
                            <span>
                                {selectedEntry.handover_date ? 
                                    new Date(selectedEntry.handover_date).toLocaleDateString('en-GB') : 'N/A'}
                            </span>
                        </div>
                        <div className="info-item">
                            <strong>Days Since Handover</strong>
                            <span>{selectedEntry.days_since_handover || 'N/A'} days</span>
                        </div>
                    </div>
                    
                    {/* PMS Status Section */}
                    <div className="pms-status-section">
                        {selectedEntry.pms_status === 'PMS Inspection Pending' || selectedEntry.pms_status === 'Free PMS Available' ? (
                            <div className="entry-pms-assignment">
                                <h3>PMS Inspection Required</h3>
                                <p>This project needs PMS technician assignment for preventive maintenance</p>
                                <button 
                                    className="assign-pms-btn"
                                    onClick={() => handleAssignClick(selectedEntry)}
                                >
                                    Assign PMS Technicians
                                </button>
                            </div>
                        ) : selectedEntry.pms_status === 'PMS Inspection Assigned' ? (
                            <div className="entry-pms-assigned">
                                <strong>PMS Assigned</strong>
                                <span>Technicians assigned and ready for inspection</span>
                                <span>Next Inspection: {selectedEntry.pms_inspection_date ? 
                                    new Date(selectedEntry.pms_inspection_date).toLocaleDateString('en-GB') : 'Not scheduled'}</span>
                            </div>
                        ) : selectedEntry.pms_status === 'PMS Inspection Ongoing' ? (
                            <div className="entry-pms-ongoing">
                                <strong>PMS Ongoing</strong>
                                <span>Inspection is currently in progress</span>
                                <span>Scheduled: {selectedEntry.pms_inspection_date ? 
                                    new Date(selectedEntry.pms_inspection_date).toLocaleDateString('en-GB') : 'N/A'}</span>
                            </div>
                        ) : (
                            <div className="entry-no-inspection">
                                <strong>PMS Status</strong>
                                <span>{selectedEntry.pms_status || 'No inspection required'}</span>
                            </div>
                        )}
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
                    <div className="table-cell">Next Inspection</div>
                    <div className="table-cell">Free PMS</div>
                    <div className="table-cell">Actions</div>
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