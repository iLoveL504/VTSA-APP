// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useStoreState } from 'easy-peasy';
// import { useSharedSocket } from '../../Context/SocketContext'
// import useAxiosFetch from '../../hooks/useAxiosFetch';
// import PMSList from '../../components/PMS/PMSList';
// import { Axios } from '../../api/axios';

// const PMSAssignment = () => {
//     const {utilitiesSocket} = useSharedSocket()
//     const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
//     const navigate = useNavigate();
//     const { data: pmsProjects } = useAxiosFetch(`${backendURL}/api/pms/clients`)
//     const { data: pmsTeams } = useAxiosFetch(`${backendURL}/api/pms/techs`)
//     const employees = useStoreState(state => state.employees);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedEntry, setSelectedEntry] = useState({});
//     const [assignModal, setAssignModal] = useState({ isOpen: false, project: null, type: '', mode: 'assign', assigned:[] });
//     const [selectedTechs, setSelectedTechs] = useState([]);
//     const [assignmentStatus, setAssignmentStatus] = useState('');
//     const [availableTechs, setAvailableTechs] = useState([]);
//     const [inspectionDate, setInspectionDate] = useState('');
//     const [currentAssignedTechs, setCurrentAssignedTechs] = useState([]);

//     // Filter PMS technicians by island group
//     const pmsTechs = useMemo(() => {
//         return employees.filter(e => e.job === 'PMS Technician');
//     }, [employees]);

//     // Filter projects based on search term
//     const filteredProjects = useMemo(() => {
//         if (!searchTerm) return pmsProjects;
//         const term = searchTerm.toLowerCase();
//         return pmsProjects.filter(project => 
//             project.lift_name?.toLowerCase().includes(term) ||
//             project.client?.toLowerCase().includes(term) ||
//             project.product_type?.toLowerCase().includes(term) ||
//             project.location?.toLowerCase().includes(term)
//         );
//     }, [pmsProjects, searchTerm]);

//     // Load available technicians when modal opens
//     useEffect(() => {
//         if (assignModal.isOpen && assignModal.project) {
//             loadAvailableTechnicians(assignModal.project.island_group);
//             loadCurrentAssignment(assignModal.project, assignModal.type === 'callback' ? true : false);
//         }
//     }, [assignModal.isOpen, assignModal.project]);

//     // Set initial dates when an entry is selected
//     useEffect(() => {
//         if (selectedEntry && selectedEntry.id) {
//             if (selectedEntry.pms_inspection_date) {
//                 const date = new Date(selectedEntry.pms_inspection_date);
//                 const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
//                 setInspectionDate(localDate.toISOString().split('T')[0]);
//             } else {
//                 setInspectionDate(new Date().toISOString().split('T')[0]);
//             }
//         }
//     }, [selectedEntry]);

//     const loadAvailableTechnicians = async (islandGroup) => {
//         try {
//             const techs = pmsTechs.filter(t => t.island_group === islandGroup);
//             setAvailableTechs(techs);
//         } catch (error) {
//             console.error('Error loading technicians:', error);
//             setAvailableTechs([]);
//         }
//     };

//     const loadCurrentAssignment = async (project, isCallback) => {
//         try {
//             if ((project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing') && !isCallback) {
//                 const assignedTechs = pmsTeams.filter(p => {
//                     const exist = p[1].projects.find(p => project.id === p.project_id);
//                     if (exist !== undefined) return true;
//                 }).map(t => t[1].employee_id);
                
//                 setSelectedTechs(pmsTechs.filter(t => assignedTechs.includes(t.employee_id)));
//             } else {
//                 setCurrentAssignedTechs([]);
//                 setSelectedTechs([]);
//             }
//         } catch (error) {
//             console.error('Error loading current assignment:', error);
//             setCurrentAssignedTechs([]);
//         }
//     };

//     const handleAssignClick = (project, type = 'regular') => {
//         const isEditMode = project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing';
//         setAssignModal({ 
//             isOpen: true, 
//             project, 
//             type, 
//             mode: isEditMode ? 'edit' : 'assign',
//         });
        
//         if(!isEditMode) {
//             setSelectedTechs([]);
//         }
//         setAssignmentStatus('');
//     };

//     const handleAssignConfirm = async () => {
//         if (selectedTechs.length === 0) {
//             setAssignmentStatus('Please select at least one technician');
//             return;
//         }

//         if (selectedTechs.length > 2) {
//             setAssignmentStatus('Maximum 2 technicians can be assigned');
//             return;
//         }

//         try {
//             setAssignmentStatus('assigning');
//             const technicianIds = selectedTechs.map(tech => tech.employee_id);
            
//             const payload = { 
//                 technicianIds,
//                 inspection_date: inspectionDate,
//                 is_callback: assignModal.type === 'callback'
//             };
            
//             let endpoint, method;
            
//             if (assignModal.mode === 'edit') {
//                 endpoint = `/api/pms/assign/${assignModal.project.id}`;
//                 method = 'POST';
//             } else {
//                 endpoint = assignModal.type === 'callback' 
//                     ? `/api/pms/callback/${assignModal.project.id}`
//                     : `/api/pms/assign/${assignModal.project.id}`;
//                 method = 'POST';
//             }
            
//             const response = await Axios({
//                 method,
//                 url: endpoint,
//                 data: payload
//             });

//             if (!response.data.success) {
//                 throw new Error(response.data.error || 'Failed to assign technicians');
//             }

//             // Send notification
//             const project = assignModal.project;
//             const message = assignModal.type === 'callback' 
//                 ? `Callback ${assignModal.mode === 'edit' ? 'rescheduled' : 'scheduled'} for ${project.client} (${project.lift_name}) on ${inspectionDate}`
//                 : `PMS Inspection ${assignModal.mode === 'edit' ? 'rescheduled' : 'scheduled'} for ${project.client} (${project.lift_name}) on ${inspectionDate}`;

//             await new Promise((resolve, reject) => {
//                 utilitiesSocket.emit("new_notification", {
//                     subject: assignModal.type === 'callback' 
//                         ? `Callback ${assignModal.mode === 'edit' ? 'Updated' : 'Scheduled'}` 
//                         : `PMS Inspection ${assignModal.mode === 'edit' ? 'Updated' : 'Assigned'}`,
//                     body: message,
//                     Ids: technicianIds
//                 }, (ack) => {
//                     if (ack?.success) {
//                         utilitiesSocket.emit("refresh_project_data");
//                         resolve();
//                     } else {
//                         reject(new Error("Server failed to process notification."));
//                     }
//                 });
//             });

//             setAssignmentStatus('success');
//             setTimeout(() => {
//                 setAssignModal({ isOpen: false, project: null, type: '', mode: 'assign' });
//                 setSelectedTechs([]);
//                 setCurrentAssignedTechs([]);
//                 window.location.reload();
//             }, 1500);
//         } catch (error) {
//             console.error('Error assigning technicians:', error);
//             setAssignmentStatus(error.message);
//         }
//     };

//     const handleAssignClose = () => {
//         setAssignModal({ isOpen: false, project: null, type: '', mode: 'assign' });
//         setSelectedTechs([]);
//         setAssignmentStatus('');
//         setCurrentAssignedTechs([]);
//     };

//     const handleCallbackClick = (project) => {
//         setAssignModal({ 
//             isOpen: true, 
//             project, 
//             type: 'callback', 
//             mode: 'assign' 
//         });
//         setSelectedTechs([]);
//         setAssignmentStatus('');
//     };

//     const handleTechSelection = (tech) => {
//         setSelectedTechs(prev => {
//             const isSelected = prev.find(t => t.employee_id === tech.employee_id);
//             if (isSelected) {
//                 return prev.filter(t => t.employee_id !== tech.employee_id);
//             } else {
//                 if (prev.length >= 2) {
//                     setAssignmentStatus('Maximum 2 technicians allowed');
//                     return prev;
//                 }
//                 setAssignmentStatus('');
//                 return [...prev, tech];
//             }
//         });
//     };

//     const handleUnassign = async () => {
//         if (!confirm('Are you sure you want to unassign all technicians from this project?')) {
//             return;
//         }

//         try {
//             setAssignmentStatus('unassigning');
//             const response = await Axios.delete(`/api/pms/assignment/${assignModal.project.id}`);
            
//             if (response.data.success) {
//                 setAssignmentStatus('success');
//                 setTimeout(() => {
//                     setAssignModal({ isOpen: false, project: null, type: '', mode: 'assign' });
//                     setSelectedTechs([]);
//                     setCurrentAssignedTechs([]);
//                     window.location.reload();
//                 }, 1500);
//             } else {
//                 throw new Error('Failed to unassign technicians');
//             }
//         } catch (error) {
//             console.error('Error unassigning technicians:', error);
//             setAssignmentStatus('Error unassigning technicians');
//         }
//     };

//     const projectsNeedingAssignment = pmsProjects.filter(p => 
//         p.pms_status === 'PMS Inspection Pending' || p.pms_status === 'Free PMS Available'
//     ).length;

//     const isAssignedProject = assignModal.project && 
//         (assignModal.project.pms_status === 'PMS Inspection Assigned' || 
//          assignModal.project.pms_status === 'PMS Inspection Ongoing');

//     return (
//         <div className="pms-assignment">
//             {/* Assignment Modal */}
//             {assignModal.isOpen && (
//                 <div className="pms-modal-overlay">
//                     <div className="pms-modal-content">
//                         <div className="pms-modal-header">
//                             <h3 className="pms-modal-title">
//                                 {assignModal.mode === 'edit' ? 'Edit Assignment' : 
//                                  assignModal.type === 'callback' ? 'Schedule Callback' : 'Assign PMS Technician'}
//                             </h3>
//                             <button className="pms-modal-close" onClick={handleAssignClose}>×</button>
//                         </div>
                        
//                         <div className="pms-modal-body">
//                             <div className="pms-project-info">
//                                 <div className="pms-project-card">
//                                     <h4 className="pms-project-name">{assignModal.project.lift_name}</h4>
//                                     <div className="pms-project-details">
//                                         <div className="pms-detail-item">
//                                             <span className="pms-detail-label">Client:</span>
//                                             <span className="pms-detail-value">{assignModal.project.client}</span>
//                                         </div>
//                                         <div className="pms-detail-item">
//                                             <span className="pms-detail-label">Location:</span>
//                                             <span className="pms-detail-value">{assignModal.project.location}, {assignModal.project.island_group}</span>
//                                         </div>
//                                         <div className="pms-detail-item">
//                                             <span className="pms-detail-label">Product Type:</span>
//                                             <span className="pms-detail-value">{assignModal.project.product_type}</span>
//                                         </div>
//                                         <div className="pms-detail-item">
//                                             <span className="pms-detail-label">PMS Status:</span>
//                                             <span className={`pms-status-badge ${assignModal.project.pms_status?.toLowerCase().replace(' ', '-')}`}>
//                                                 {assignModal.project.pms_status}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Current Assignment */}
//                             {isAssignedProject && currentAssignedTechs.length > 0 && (
//                                 <div className="pms-current-assignment">
//                                     <h4 className="pms-section-title">Current Assignment</h4>
//                                     <div className="pms-current-techs">
//                                         {currentAssignedTechs.map(tech => (
//                                             <div key={tech.employee_id} className="pms-current-tech">
//                                                 <span className="pms-tech-name">{tech.last_name} {tech.first_name}</span>
//                                                 <span className="pms-tech-status">Currently Assigned</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Date Selection */}
//                             <div className="pms-date-section">
//                                 <label className="pms-date-label">
//                                     {assignModal.type === 'callback' ? 'Callback Date:' : 'Inspection Date:'}
//                                 </label>
//                                 <input
//                                     type="date"
//                                     value={inspectionDate}
//                                     onChange={(e) => setInspectionDate(e.target.value)}
//                                     className="pms-date-input"
//                                     min={new Date().toISOString().split('T')[0]}
//                                 />
//                             </div>

//                             {/* Technician Selection */}
//                             <div className="pms-tech-selection">
//                                 <div className="pms-selection-header">
//                                     <h4 className="pms-section-title">
//                                         {assignModal.mode === 'edit' ? 'Update Technicians:' : 'Select Technicians:'}
//                                     </h4>
//                                     <span className="pms-selection-subtitle">Available in {assignModal.project.island_group} (Max 2)</span>
//                                 </div>
                                
//                                 <div className="pms-techs-grid">
//                                     {availableTechs.map(tech => {
//                                         const isCurrentlyAssigned = currentAssignedTechs.find(t => t.employee_id === tech.employee_id);
//                                         const isSelected = selectedTechs.find(t => t.employee_id === tech.employee_id);
                                        
//                                         return (
//                                             <div 
//                                                 key={tech.employee_id}
//                                                 className={`pms-tech-card ${isSelected ? 'pms-tech-selected' : ''} ${
//                                                     isCurrentlyAssigned && assignModal.mode === 'edit' ? 'pms-tech-current' : ''
//                                                 }`}
//                                                 onClick={() => handleTechSelection(tech)}
//                                             >
//                                                 <div className="pms-tech-avatar">
//                                                     {tech.first_name[0]}{tech.last_name[0]}
//                                                 </div>
//                                                 <div className="pms-tech-info">
//                                                     <div className="pms-tech-name">{tech.first_name} {tech.last_name}</div>
//                                                     <div className="pms-tech-region">{tech.island_group}</div>
//                                                     {isCurrentlyAssigned && assignModal.mode === 'edit' && (
//                                                         <div className="pms-current-badge">Currently Assigned</div>
//                                                     )}
//                                                 </div>
//                                                 <div className="pms-tech-checkbox">
//                                                     {isSelected && <div className="pms-checkmark">✓</div>}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                     {availableTechs.length === 0 && (
//                                         <div className="pms-no-techs">
//                                             No available technicians in {assignModal.project.island_group} region
//                                         </div>
//                                     )}
//                                 </div>

//                                 {selectedTechs.length > 0 && (
//                                     <div className="pms-selected-techs">
//                                         <h5 className="pms-selected-title">Selected Technicians:</h5>
//                                         <div className="pms-selected-list">
//                                             {selectedTechs.map(tech => (
//                                                 <div key={tech.employee_id} className="pms-selected-tag">
//                                                     <span className="pms-tag-name">{tech.first_name} {tech.last_name}</span>
//                                                     <button 
//                                                         className="pms-tag-remove"
//                                                         onClick={() => handleTechSelection(tech)}
//                                                     >
//                                                         ×
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {assignmentStatus && (
//                                 <div className={`pms-status-message pms-status-${
//                                     assignmentStatus === 'success' ? 'success' : 
//                                     assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' ? 'info' : 'error'
//                                 }`}>
//                                     {assignmentStatus === 'assigning' ? 'Processing assignment...' : 
//                                      assignmentStatus === 'unassigning' ? 'Unassigning technicians...' : assignmentStatus}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="pms-modal-actions">
//                             {assignModal.mode === 'edit' && (
//                                 <button 
//                                     onClick={handleUnassign}
//                                     className="pms-btn pms-btn-danger"
//                                     disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success'}
//                                 >
//                                     {assignmentStatus === 'unassigning' ? 'Unassigning...' : 'Unassign All'}
//                                 </button>
//                             )}
//                             <button onClick={handleAssignClose} className="pms-btn pms-btn-secondary">
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={handleAssignConfirm} 
//                                 className="pms-btn pms-btn-primary"
//                                 disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success' || selectedTechs.length === 0}
//                             >
//                                 {assignmentStatus === 'assigning' ? 'Processing...' : 
//                                  assignModal.mode === 'edit' ? 'Update Assignment' :
//                                  assignModal.type === 'callback' ? 'Schedule Callback' : 'Assign Technicians'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             {/* Main Dashboard */}
//             <div className="pms-dashboard">
//                 {/* Header */}
//                 <header className="pms-header">
//                     <div className="pms-header-content">
//                         <div className="pms-header-main">
//                             <h1 className="pms-title">PMS Assignment Dashboard</h1>
//                             <p className="pms-subtitle">Manage preventive maintenance schedules and technician assignments</p>
                            
//                             <div className="pms-stats">
//                                 <div className="pms-stat-card pms-stat-urgent">
//                                     <div className="pms-stat-number">{projectsNeedingAssignment}</div>
//                                     <div className="pms-stat-label">Need Assignment</div>
//                                 </div>
//                                 <div className="pms-stat-card pms-stat-total">
//                                     <div className="pms-stat-number">{pmsProjects.length}</div>
//                                     <div className="pms-stat-label">Total Projects</div>
//                                 </div>
//                                 <div className="pms-stat-card pms-stat-assigned">
//                                     <div className="pms-stat-number">
//                                         {pmsProjects.filter(p => p.pms_status === 'PMS Inspection Assigned' || p.pms_status === 'PMS Inspection Ongoing').length}
//                                     </div>
//                                     <div className="pms-stat-label">Assigned</div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="pms-header-actions">
//                             <div className="pms-search">
//                                 <div className="pms-search-container">
//                                     <input
//                                         type="text"
//                                         placeholder="Search projects by name, client, or location..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="pms-search-input"
//                                     />
//                                     {searchTerm && (
//                                         <button 
//                                             className="pms-search-clear"
//                                             onClick={() => setSearchTerm('')}
//                                         >
//                                             ×
//                                         </button>
//                                     )}
//                                     <span className="pms-search-icon">🔍</span>
//                                 </div>
//                             </div>
                            
//                         </div>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <div className="pms-main-content">
//                     {/* Projects Panel */}
//                     <section className="pms-projects-panel">
//                         <div className="pms-panel-header">
//                             <h2 className="pms-panel-title">Projects</h2>
//                             <div className="pms-panel-meta">
//                                 <span className="pms-results-count">{filteredProjects.length} projects</span>
//                             </div>
//                         </div>
                        
//                         <div className="pms-projects-container">
//                             <div className="pms-projects-header">
//                                 <div className="pms-projects-column pms-col-project">Project & Client</div>
//                                 <div className="pms-projects-column pms-col-product">Product Type</div>
//                                 <div className="pms-projects-column pms-col-location">Location</div>
//                                 <div className="pms-projects-column pms-col-status">PMS Status</div>
//                                 <div className="pms-projects-column pms-col-last">Last Inspection</div>
//                                 <div className="pms-projects-column pms-col-next">Next Inspection</div>
//                                 <div className="pms-projects-column pms-col-contract">Contract</div>
//                                 <div className="pms-projects-column pms-col-callback">Callback</div>
//                             </div>
                            
//                             <div className="pms-projects-list">
//                                 <PMSList 
//                                     projects={filteredProjects}
//                                     searchTerm={searchTerm} 
//                                     setSelectedEntry={setSelectedEntry}
//                                     onAssignClick={handleAssignClick}
//                                     onCallbackClick={handleCallbackClick}
//                                     selectedEntryId={selectedEntry.id}
//                                 />
//                             </div>

//                             {filteredProjects.length === 0 && pmsProjects.length > 0 && (
//                                 <div className="pms-no-results">
//                                     <div className="pms-no-results-icon">📋</div>
//                                     <h3>No projects found</h3>
//                                     <p>No projects match your search criteria</p>
//                                     <button onClick={() => setSearchTerm('')} className="pms-clear-search">
//                                         Clear search
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </section>

//                     {/* Details Panel */}
//                     <aside className="pms-details-panel">
//                         <div className="pms-panel-header">
//                             <h2 className="pms-panel-title">Project Details</h2>
//                             {selectedEntry.id && (
//                                 <button  onClick={() => navigate(`/baby-book/${selectedEntry.id}`)} className="pms-baby-book-btn">
//                                     View Baby Book
//                                 </button>
//                             )}
//                         </div>
                        
//                         {selectedEntry.id ? (
//                             <div className="pms-project-details">
//                                 <div className="pms-detail-card">
//                                     <div className="pms-detail-header">
//                                         <h3 className="pms-detail-title">{selectedEntry.lift_name}</h3>
//                                         <div className="pms-detail-meta">
//                                             <span className="pms-client">{selectedEntry.client}</span>
//                                             <span className="pms-product-type">{selectedEntry.product_type}</span>
//                                             <span className="pms-location">{selectedEntry.location}, {selectedEntry.island_group}</span>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="pms-detail-grid">
//                                         <div className="pms-detail-item">
//                                             <label className="pms-detail-label">Handover Date:</label>
//                                             <span className="pms-detail-value">
//                                                 {selectedEntry.handover_date ? 
//                                                     new Date(selectedEntry.handover_date).toLocaleDateString('en-GB') : 'N/A'}
//                                             </span>
//                                         </div>
//                                         <div className="pms-detail-item">
//                                             <label className="pms-detail-label">Days Since Handover:</label>
//                                             <span className="pms-detail-value">{selectedEntry.days_since_handover || 'N/A'} days</span>
//                                         </div>
//                                         <div className="pms-detail-item">
//                                             <label className="pms-detail-label">PMS Status:</label>
//                                             <span className={`pms-status-badge pms-status-${selectedEntry.pms_status?.toLowerCase().replace(' ', '-')}`}>
//                                                 {selectedEntry.pms_status}
//                                             </span>
//                                         </div>
//                                         <div className="pms-detail-item">
//                                             <label className="pms-detail-label">Contract Type:</label>
//                                             <span className="pms-detail-value">{selectedEntry.contract_type}</span>
//                                         </div>
//                                     </div>

//                                     {/* Quick Actions */}
//                                     <div className="pms-quick-actions">
//                                         <h4 className="pms-actions-title">Quick Actions</h4>
//                                         <div className="pms-action-buttons">
//                                             {(selectedEntry.pms_status === 'PMS Inspection Pending' || selectedEntry.pms_status === 'Free PMS Available') && (
//                                                 <button 
//                                                     className="pms-action-btn pms-action-primary"
//                                                     onClick={() => handleAssignClick(selectedEntry, 'regular')}
//                                                 >
//                                                     <span className="pms-action-icon">👥</span>
//                                                     Assign PMS
//                                                 </button>
//                                             )}
                                            
//                                             {(selectedEntry.pms_status === 'PMS Inspection Assigned' || selectedEntry.pms_status === 'PMS Inspection Ongoing') && (
//                                                 <button 
//                                                     className="pms-action-btn pms-action-primary"
//                                                     onClick={() => handleAssignClick(selectedEntry, 'regular')}
//                                                 >
//                                                     <span className="pms-action-icon">✏️</span>
//                                                     Edit Assignment
//                                                 </button>
//                                             )}
                                            
//                                             <button 
//                                                 className="pms-action-btn pms-action-secondary"
//                                                 onClick={() => handleCallbackClick(selectedEntry)}
//                                             >
//                                                 <span className="pms-action-icon">📞</span>
//                                                 Schedule Callback
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="pms-no-selection">
//                                 <div className="pms-no-selection-content">
//                                     <div className="pms-no-selection-icon">📋</div>
//                                     <h3>No Project Selected</h3>
//                                     <p>Select a project from the list to view details and take action</p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Team Workload */}
//                         <div className="pms-workload-section">
//                             <h3 className="pms-workload-title">Team Workload</h3>
//                             <div className="pms-workload-cards">
//                                 {pmsTeams.map(([techName, data]) => (
//                                     <div key={techName} className="pms-workload-card">
//                                         <div className="pms-workload-header">
//                                             <h4 className="pms-tech-name">{techName}</h4>
//                                             <span className="pms-project-count">{data.projects?.length || 0} projects</span>
//                                         </div>
//                                         <div className="pms-workload-projects">
//                                             {data.projects?.map((project, index) => (
//                                                 <div key={index} className="pms-workload-project">
//                                                     <div className="pms-workload-project-name">{project.project_name}</div>
//                                                     <div className="pms-workload-project-meta">
//                                                         <span>{project.project_location}</span>
//                                                         <span>{new Date(project.inspection_date).toLocaleDateString('en-GB')}</span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </aside>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PMSAssignment;

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { useSharedSocket } from '../../Context/SocketContext'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { Axios } from '../../api/axios';


// Material-UI Icons
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Groups as GroupsIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Engineering as EngineeringIcon,
  Book as BookIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  PhoneCallback as CallbackIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AssignedIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

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
    const [activeView, setActiveView] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const pmsTechs = useMemo(() => {
        return employees.filter(e => e.job === 'PMS Technician');
    }, [employees]);

    const filteredProjects = useMemo(() => {
        let filtered = pmsProjects || [];
        
        if (activeView === 'pending') {
            filtered = filtered.filter(p => p.pms_status === 'PMS Inspection Pending' || p.pms_status === 'Free PMS Available');
        } else if (activeView === 'assigned') {
            filtered = filtered.filter(p => p.pms_status === 'PMS Inspection Assigned');
        } else if (activeView === 'ongoing') {
            filtered = filtered.filter(p => p.pms_status === 'PMS Inspection Ongoing');
        }
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(project => 
                project.lift_name?.toLowerCase().includes(term) ||
                project.client?.toLowerCase().includes(term) ||
                project.product_type?.toLowerCase().includes(term) ||
                project.location?.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    }, [pmsProjects, searchTerm, activeView]);

    useEffect(() => {
        if (assignModal.isOpen && assignModal.project) {
            loadAvailableTechnicians(assignModal.project.island_group);
            loadCurrentAssignment(assignModal.project, assignModal.type === 'callback' ? true : false);
        }
    }, [assignModal.isOpen, assignModal.project]);

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
            if ((project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing') && !isCallback) {
                const assignedTechs = pmsTeams.filter(p => {
                    const exist = p[1].projects.find(p => project.id === p.project_id);
                    if (exist !== undefined) return true;
                }).map(t => t[1].employee_id);
                
                setSelectedTechs(pmsTechs.filter(t => assignedTechs.includes(t.employee_id)));
            } else {
                setCurrentAssignedTechs([]);
                setSelectedTechs([]);
            }
        } catch (error) {
            console.error('Error loading current assignment:', error);
            setCurrentAssignedTechs([]);
        }
    };

    const handleAssignClick = (project, type = 'regular') => {
        const isEditMode = project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing';
        setAssignModal({ 
            isOpen: true, 
            project, 
            type, 
            mode: isEditMode ? 'edit' : 'assign',
        });
        
        if(!isEditMode) {
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
            
            if (assignModal.mode === 'edit') {
                endpoint = `/api/pms/assign/${assignModal.project.id}`;
                method = 'POST';
            } else {
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

    const stats = {
        total: pmsProjects?.length || 0,
        pending: pmsProjects?.filter(p => p.pms_status === 'PMS Inspection Pending' || p.pms_status === 'Free PMS Available').length || 0,
        assigned: pmsProjects?.filter(p => p.pms_status === 'PMS Inspection Assigned').length || 0,
        ongoing: pmsProjects?.filter(p => p.pms_status === 'PMS Inspection Ongoing').length || 0
    };

    const isAssignedProject = assignModal.project && 
        (assignModal.project.pms_status === 'PMS Inspection Assigned' || 
         assignModal.project.pms_status === 'PMS Inspection Ongoing');

    return (
        <div className="pms-modern-dashboard">
            {/* Assignment Modal - Updated Design */}
            {assignModal.isOpen && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal">
                        <div className="modal-header">
                            <div className="modal-title-group">
                                <AssignmentIcon className="modal-icon" />
                                <div>
                                    <h2>
                                        {assignModal.mode === 'edit' ? 'Edit Assignment' : 
                                         assignModal.type === 'callback' ? 'Schedule Callback' : 'Assign Technician'}
                                    </h2>
                                    <p>Manage project assignment details</p>
                                </div>
                            </div>
                            <button className="modal-close" onClick={handleAssignClose}>
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="modal-content">
                            {/* Project Overview */}
                            <div className="project-overview-card">
                                <div className="project-basic-info">
                                    <BusinessIcon className="project-icon" />
                                    <div className="project-details">
                                        <h3>{assignModal.project?.lift_name}</h3>
                                        <div className="project-meta">
                                            <span className="client">{assignModal.project?.client}</span>
                                            <span className="product">{assignModal.project?.product_type}</span>
                                        </div>
                                        <div className="project-location">
                                            <LocationIcon />
                                            {assignModal.project?.location}, {assignModal.project?.island_group}
                                        </div>
                                    </div>
                                </div>
                                <div className={`status-tag ${assignModal.project?.pms_status?.toLowerCase().replace(' ', '-')}`}>
                                    {assignModal.project?.pms_status}
                                </div>
                            </div>

                            {/* Current Assignment */}
                            {isAssignedProject && currentAssignedTechs.length > 0 && (
                                <div className="current-assignment-section">
                                    <h4>Current Assignment</h4>
                                    <div className="current-techs">
                                        {currentAssignedTechs.map(tech => (
                                            <div key={tech.employee_id} className="current-tech">
                                                <div className="tech-avatar">
                                                    {tech.first_name[0]}{tech.last_name[0]}
                                                </div>
                                                <span>{tech.first_name} {tech.last_name}</span>
                                                <span className="current-badge">Assigned</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date Selection */}
                            <div className="form-section">
                                <label>
                                    <CalendarIcon />
                                    {assignModal.type === 'callback' ? 'Callback Date' : 'Inspection Date'}
                                </label>
                                <input
                                    type="date"
                                    value={inspectionDate}
                                    onChange={(e) => setInspectionDate(e.target.value)}
                                    className="date-picker"
                                />
                            </div>

                            {/* Technician Selection */}
                            <div className="form-section">
                                <div className="section-header">
                                    <EngineeringIcon />
                                    <div>
                                        <h4>Select Technicians</h4>
                                        <p>Choose from available technicians in {assignModal.project?.island_group}</p>
                                    </div>
                                </div>
                                
                                <div className="tech-grid">
                                    {availableTechs.map(tech => {
                                        const isSelected = selectedTechs.find(t => t.employee_id === tech.employee_id);
                                        return (
                                            <div 
                                                key={tech.employee_id}
                                                className={`tech-card ${isSelected ? 'selected' : ''}`}
                                                onClick={() => handleTechSelection(tech)}
                                            >
                                                <div className="tech-avatar">
                                                    {tech.first_name[0]}{tech.last_name[0]}
                                                </div>
                                                <div className="tech-info">
                                                    <div className="tech-name">{tech.first_name} {tech.last_name}</div>
                                                    <div className="tech-location">
                                                        <LocationIcon />
                                                        {tech.island_group}
                                                    </div>
                                                </div>
                                                <div className="selection-indicator">
                                                    {isSelected && <CheckIcon />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedTechs.length > 0 && (
                                    <div className="selected-techs">
                                        <h5>Selected ({selectedTechs.length}/2)</h5>
                                        <div className="selected-list">
                                            {selectedTechs.map(tech => (
                                                <div key={tech.employee_id} className="selected-tag">
                                                    <PersonIcon />
                                                    <span>{tech.first_name} {tech.last_name}</span>
                                                    <button onClick={() => handleTechSelection(tech)}>
                                                        <CloseIcon />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {assignmentStatus && (
                                <div className={`status-message ${assignmentStatus}`}>
                                    {assignmentStatus === 'success' && <CheckIcon />}
                                    {assignmentStatus === 'error' && <WarningIcon />}
                                    {assignmentStatus}
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            {assignModal.mode === 'edit' && (
                                <button className="btn-danger" onClick={handleUnassign}>
                                    <ClearIcon />
                                    Unassign All
                                </button>
                            )}
                            <div className="action-group">
                                <button className="btn-secondary" onClick={handleAssignClose}>
                                    Cancel
                                </button>
                                <button 
                                    className="btn-primary" 
                                    onClick={handleAssignConfirm}
                                    disabled={selectedTechs.length === 0}
                                >
                                    <AssignmentIcon />
                                    {assignModal.mode === 'edit' ? 'Update' : 'Assign'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* COMPLETELY RECONFIGURED MAIN LAYOUT */}
            <div className="dashboard-layout">
                {/* Left Sidebar - Quick Stats & Filters */}
                <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <DashboardIcon />
                        {!sidebarCollapsed && <span>PMS Dashboard</span>}
                        <button 
                            className="collapse-btn"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            <MoreIcon />
                        </button>
                    </div>

                    <div className="sidebar-content">
                        {/* Quick Stats */}
                        <div className="stats-widget">
                            {!sidebarCollapsed && <h3>Overview</h3>}
                            <div className="stat-items">
                                <div className="stat-item">
                                    <div className="stat-icon total">
                                        <WorkIcon />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.total}</span>
                                            <span className="stat-label">Total</span>
                                        </div>
                                    )}
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon pending">
                                        <ScheduleIcon />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.pending}</span>
                                            <span className="stat-label">Pending</span>
                                        </div>
                                    )}
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon assigned">
                                        <AssignedIcon />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.assigned}</span>
                                            <span className="stat-label">Assigned</span>
                                        </div>
                                    )}
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon ongoing">
                                        <TrendingUpIcon />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.ongoing}</span>
                                            <span className="stat-label">Ongoing</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        {!sidebarCollapsed && (
                            <div className="filters-widget">
                                <h3>Quick Filters</h3>
                                <div className="filter-buttons">
                                    <button 
                                        className={`filter-btn ${activeView === 'all' ? 'active' : ''}`}
                                        onClick={() => setActiveView('all')}
                                    >
                                        <WorkIcon />
                                        All Projects
                                    </button>
                                    <button 
                                        className={`filter-btn ${activeView === 'pending' ? 'active' : ''}`}
                                        onClick={() => setActiveView('pending')}
                                    >
                                        <ScheduleIcon />
                                        Pending
                                    </button>
                                    <button 
                                        className={`filter-btn ${activeView === 'assigned' ? 'active' : ''}`}
                                        onClick={() => setActiveView('assigned')}
                                    >
                                        <AssignedIcon />
                                        Assigned
                                    </button>
                                    <button 
                                        className={`filter-btn ${activeView === 'ongoing' ? 'active' : ''}`}
                                        onClick={() => setActiveView('ongoing')}
                                    >
                                        <TrendingUpIcon />
                                        In Progress
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Team Overview */}
                        {!sidebarCollapsed && (
                            <div className="team-widget">
                                <h3>Team Overview</h3>
                                <div className="team-list">
                                    {pmsTeams.slice(0, 4).map(([techName, data]) => (
                                        <div key={techName} className="team-member">
                                            <div className="member-avatar">
                                                <PersonIcon />
                                            </div>
                                            <div className="member-info">
                                                <span className="member-name">{techName}</span>
                                                <span className="member-projects">{data.projects?.length || 0} projects</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    {/* Top Bar */}
                    <header className="top-bar">
                        <div className="search-section">
                            <div className="search-box">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')}>
                                        <ClearIcon />
                                    </button>
                                )}
                            </div>
                        </div>

                    </header>

                    {/* Projects Grid */}
                    <section className="projects-section">
                        {/* <div className="section-header">
                            <h2>Projects</h2>
                            <span className="project-count">{filteredProjects.length} projects</span>
                        </div> */}

                        <div className="projects-grid">
                            {filteredProjects.map(project => (
                                <div 
                                    key={project.id}
                                    className={`project-card ${selectedEntry.id === project.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedEntry(project)}
                                >
                                    <div className="project-header">
                                        <div className="project-title">
                                            <BusinessIcon />
                                            <div>
                                                <h3>{project.lift_name}</h3>
                                                <p>{project.client}</p>
                                            </div>
                                        </div>
                                        <div className={`status-badge ${project.pms_status?.toLowerCase().replace(' ', '-')}`}>
                                            {project.pms_status}
                                        </div>
                                    </div>

                                    <div className="project-details">
                                        <div className="detail">
                                            <LocationIcon />
                                            <span>{project.location}</span>
                                        </div>
                                        <div className="detail">
                                            <CalendarIcon />
                                            <span>
                                                {project.pms_inspection_date 
                                                    ? new Date(project.pms_inspection_date).toLocaleDateString('en-GB')
                                                    : 'Not scheduled'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="project-actions">
                                        {(project.pms_status === 'PMS Inspection Pending' || project.pms_status === 'Free PMS Available') && (
                                            <button 
                                                className="btn-assign"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAssignClick(project, 'regular');
                                                }}
                                            >
                                                <AssignmentIcon />
                                                Assign
                                            </button>
                                        )}
                                        {(project.pms_status === 'PMS Inspection Assigned' || project.pms_status === 'PMS Inspection Ongoing') && (
                                            <button 
                                                className="btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAssignClick(project, 'regular');
                                                }}
                                            >
                                                <EditIcon />
                                                Edit
                                            </button>
                                        )}
                                        <button 
                                            className="btn-callback"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCallbackClick(project);
                                            }}
                                        >
                                            <CallbackIcon />
                                            Callback
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* {filteredProjects.length === 0 && (
                            <div className="empty-state">
                                <WorkIcon />
                                <h3>No projects found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )} */}
                    </section>
                </main>

                {/* Right Panel - Project Details */}
                <aside className="details-panel">
                    <div className="panel-header">
                        <h2>Project Details</h2>
                        {selectedEntry.id && (
                            <button 
                                className="btn-babybook"
                                onClick={() => navigate(`/baby-book/${selectedEntry.id}`)}
                            >
                                <BookIcon />
                                Baby Book
                            </button>
                        )}
                    </div>

                    {selectedEntry.id ? (
                        <div className="project-details">
                            <div className="detail-section">
                                <h3>{selectedEntry.lift_name}</h3>
                                <p className="client-name">{selectedEntry.client}</p>
                                
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Product Type</label>
                                        <span>{selectedEntry.product_type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Location</label>
                                        <span>{selectedEntry.location}, {selectedEntry.island_group}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Handover Date</label>
                                        <span>
                                            {selectedEntry.handover_date 
                                                ? new Date(selectedEntry.handover_date).toLocaleDateString('en-GB')
                                                : 'N/A'
                                            }
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Contract Type</label>
                                        <span>{selectedEntry.contract_type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="action-section">
                                <h4>Quick Actions</h4>
                                <div className="action-buttons">
                                    {(selectedEntry.pms_status === 'PMS Inspection Pending' || selectedEntry.pms_status === 'Free PMS Available') && (
                                        <button 
                                            className="btn-primary"
                                            onClick={() => handleAssignClick(selectedEntry, 'regular')}
                                        >
                                            <AssignmentIcon />
                                            Assign PMS
                                        </button>
                                    )}
                                    <button 
                                        className="btn-secondary"
                                        onClick={() => handleCallbackClick(selectedEntry)}
                                    >
                                        <CallbackIcon />
                                        Schedule Callback
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-selection">
                            <InfoIcon />
                            <p>Select a project to view details</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default PMSAssignment;