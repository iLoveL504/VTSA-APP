import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import PMSList from '../../components/PMS/PMSList';
import '../../css/PMSAssignment.css';

const PMSAssignment = ({ updateIsLoading }) => {
    const navigate = useNavigate();
    const pmsProjects = useStoreState(state => state.pmsProjects);
    const employees = useStoreState(state => state.employees);
    const tncTechs = employees.filter(e => e.job === 'TNC Technician' && e.is_active === 0);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEntry, setSelectedEntry] = useState({});
    const [assignModal, setAssignModal] = useState({ isOpen: false, project: null });
    const [selectedTech, setSelectedTech] = useState('');
    const [assignmentStatus, setAssignmentStatus] = useState('');

    // Filter projects based on search term
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return pmsProjects;
        
        const term = searchTerm.toLowerCase();
        return pmsProjects.filter(project => 
            project.lift_name?.toLowerCase().includes(term) ||
            project.client?.toLowerCase().includes(term) ||
            project.contract_type?.toLowerCase().includes(term) ||
            project.region?.toLowerCase().includes(term)
        );
    }, [pmsProjects, searchTerm]);

    const handleCreateClick = () => {
        navigate('/projects');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleAssignClick = (project) => {
        setAssignModal({ isOpen: true, project });
        setSelectedTech('');
        setAssignmentStatus('');
    };

    const handleAssignConfirm = async () => {
        if (!selectedTech) {
            setAssignmentStatus('Please select a TNC technician');
            return;
        }

        try {
            setAssignmentStatus('assigning');
            // Assignment logic would go here
            setTimeout(() => {
                setAssignmentStatus('success');
                setTimeout(() => {
                    setAssignModal({ isOpen: false, project: null });
                    // Refresh data or update state here
                }, 1500);
            }, 1000);
        } catch (error) {
            console.error('Error assigning TNC technician:', error);
            setAssignmentStatus('error');
        }
    };

    const handleAssignClose = () => {
        setAssignModal({ isOpen: false, project: null });
        setSelectedTech('');
        setAssignmentStatus('');
    };

    return (
        <div className="Content PMSAssignment">
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>Assign TNC Technician</h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Next Inspection:</strong> {assignModal.project.pms_inspection_date ? 
                                new Date(assignModal.project.pms_inspection_date).toLocaleDateString('en-GB') : 'Not set'}</p>
                            <p><strong>Contract Type:</strong> {assignModal.project.contract_type}</p>
                        </div>
                        
                        <div className="tech-selection">
                            <label htmlFor="tnc-tech-select">Select TNC Technician:</label>
                            <span>Only available technicians are listed</span>
                            <select 
                                id="tnc-tech-select"
                                value={selectedTech.employee_id} 
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    const tech = tncTechs.find(t => t.employee_id === selectedId);
                                    setSelectedTech(tech);
                                }}
                                className="tech-select"
                            >
                                <option value="">Choose a technician...</option>
                                {tncTechs.map(tech => (
                                    <option key={tech.employee_id} value={tech.employee_id}>
                                        {tech.first_name} {tech.last_name} ({tech.username})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {assignmentStatus === 'error' && (
                            <div className="status error">Error assigning technician. Please try again.</div>
                        )}
                        {assignmentStatus === 'Please select a TNC technician' && (
                            <div className="status error">{assignmentStatus}</div>
                        )}
                        {assignmentStatus === 'success' && (
                            <div className="status success">Technician assigned successfully!</div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleAssignClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignConfirm} 
                                className="btn-confirm"
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'success'}
                            >
                                {assignmentStatus === 'assigning' ? 'Assigning...' : 'Assign Technician'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
            {/* Selected Project Info Section */}
            <div className='entry-section'>
                <h1>PMS Project Info</h1>
                <div className='entry-info'>
                    <div className="info-item">
                        <strong>Project</strong>
                        <span>{selectedEntry.lift_name || 'No project selected'}</span>
                    </div>
                    <div className="info-item">
                        <strong>Client</strong>
                        <span>{selectedEntry.client || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <strong>Contract Type</strong>
                        <span>{selectedEntry.contract_type || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <strong>Next Inspection</strong>
                        <span>
                            {selectedEntry.pms_inspection_date ? 
                                new Date(selectedEntry.pms_inspection_date).toLocaleDateString('en-GB') : 'Not scheduled'}
                        </span>
                    </div>
                    <div className="info-item">
                        <strong>Location</strong>
                        <span>{selectedEntry.city_munnicipality ? `${selectedEntry.city_munnicipality}, ${selectedEntry.province}` : 'N/A'}</span>
                    </div>
                    
                    {selectedEntry.inspection_pending ? (
                        <div className="entry-pms-assignment">
                            <h3>PMS Inspection Required</h3>
                            <p>This project needs TNC technician assignment for preventive maintenance</p>
                            <button 
                                className="assign-pms-btn"
                                onClick={() => handleAssignClick(selectedEntry)}
                            >
                                Assign TNC Technician
                            </button>
                        </div>
                    ) : selectedEntry.inspection_assigned ? (
                        <div className="entry-pms-assigned">
                            <strong>TNC Assigned</strong>
                            <span>Assigned to: {selectedEntry.assigned_tech || 'Technician'}</span>
                            <span>Scheduled: {new Date(selectedEntry.pms_inspection_date).toLocaleDateString('en-GB')}</span>
                        </div>
                    ) : selectedEntry.inspection_ongoing ? (
                        <div className="entry-pms-ongoing">
                            <strong>PMS Ongoing</strong>
                            <span>Assigned to: {selectedEntry.assigned_tech || 'Technician'}</span>
                            <span>Started: {new Date(selectedEntry.inspection_start_date).toLocaleDateString('en-GB')}</span>
                        </div>
                    ) : (
                        <div className="entry-no-inspection">
                            <strong>PMS Status</strong>
                            <span>No inspection required at the moment</span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Header Section */}
            <div className="projects-header">
                <div className="header-left">
                    <h1>PMS Assignment</h1>
                    <div className="projects-count">
                        {pmsProjects.filter(p => p.pms_inspection_date && !p.inspection_assigned).length} projects need TNC assignment
                    </div>
                </div>
                
                <div className="header-right">
                    {/* Search Bar */}
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
                    <div className="table-cell">Contract Type</div>
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
                    searchTerm={searchTerm} 
                    updateIsLoading={updateIsLoading} 
                    setSelectedEntry={setSelectedEntry}
                    onAssignClick={handleAssignClick}
                    tncTechs={tncTechs}
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