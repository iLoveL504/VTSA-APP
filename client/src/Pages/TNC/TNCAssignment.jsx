// import React, { useState, useMemo, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { useStoreState } from 'easy-peasy'
// import TNCList from '../../components/QAQCTNC/TNCList.jsx'
// import { useSharedSocket } from '../../Context/SocketContext.js';
// import '../../css/TNCPage.css'
// import { Axios } from '../../api/axios.js'

// const TNCAssignment = () => {
//     const { utilitiesSocket } = useSharedSocket()
//     const navigate = useNavigate()
//     const projects = useStoreState(state => state.projects)
//     const employees = useStoreState(state => state.employees)
//     const {tncTechs} = useStoreState(state => state)
//     console.log(tncTechs)
//     const [searchTerm, setSearchTerm] = useState('')
//     const [selectedEntry, setSelectedEntry] = useState({})
//     const [assignModal, setAssignModal] = useState({ 
//         isOpen: false, 
//         project: null, 
//         mode: 'assign' // 'assign' or 'edit'
//     })
//     const [selectedTech, setSelectedTech] = useState(null)
//     const [assignmentStatus, setAssignmentStatus] = useState('')
//     const [availableTechs, setAvailableTechs] = useState([])
//     const [startDate, setStartDate] = useState('')
//     const [endDate, setEndDate] = useState('')
//     const [currentAssignedTech, setCurrentAssignedTech] = useState(null)

//     // Filter TNC technicians from employees
//     const tncEmployees = useMemo(() => {
//         return employees.filter(e => e.job === 'TNC Technician' || e.job === 'TNC');
//     }, [employees]);

//     // Filter projects based on search term
//     const filteredProjects = useMemo(() => {
//         if (!searchTerm) return projects
        
//         const term = searchTerm.toLowerCase()
//         return projects.filter(project => 
//             project.lift_name?.toLowerCase().includes(term) ||
//             project.client?.toLowerCase().includes(term) ||
//             project.status?.toLowerCase().includes(term) ||
//             project.region?.toLowerCase().includes(term) ||
//             project.city_municipality?.toLowerCase().includes(term)
//         )
//     }, [projects, searchTerm])

//     // Load available technicians when modal opens
//     useEffect(() => {
//         if (assignModal.isOpen && assignModal.project) {
//             loadAvailableTechnicians();
//             loadCurrentAssignment(assignModal.project);
//         }
//     }, [assignModal.isOpen, assignModal.project])

//     // Set initial dates when an entry is selected
//     useEffect(() => {
//         if (selectedEntry && selectedEntry.id) {
//             // Set default dates for new assignments
//             const today = new Date();
//             const defaultEndDate = new Date();
//             defaultEndDate.setDate(today.getDate() + 14); // Default 2-week assignment
            
//             setStartDate(today.toISOString().split('T')[0]);
//             setEndDate(defaultEndDate.toISOString().split('T')[0]);
//         }
//     }, [selectedEntry])

//     const loadAvailableTechnicians = async () => {
//         try {
//             console.log(tncTechs)
//             // Get technicians not currently assigned to any active project
//             const available = tncEmployees.filter(tech => {
//                 const currentAssignment = tncTechs?.find(t => 
//                     t.employee_id === tech.employee_id && 
//                     t.project_id && 
//                     new Date(t.project_end_date) >= new Date() // Only consider active assignments
//                 );
//                 return !currentAssignment;
//             });
//             console.log(available)
//             setAvailableTechs(available);
//         } catch (error) {
//             console.error('Error loading technicians:', error);
//             setAvailableTechs([]);
//         }
//     };

//     const loadCurrentAssignment = async (project) => {
//         try {
//             // If project already has TNC assigned, load current technician
//             if (project.tnc_is_assigned || project.tnc_ongoing) {
//                 const assignedTech = tncTechs?.find(t => t.project_id === project.id);
//                 if (assignedTech) {
//                     const techDetails = tncEmployees.find(e => e.employee_id === assignedTech.employee_id);
//                     setCurrentAssignedTech(techDetails);
//                     setSelectedTech(techDetails);
                    
//                     // Set current dates
//                     if (assignedTech.tnc_start_date) {
//                         setStartDate(new Date(assignedTech.tnc_start_date).toISOString().split('T')[0]);
//                     }
//                     if (assignedTech.project_end_date) {
//                         setEndDate(new Date(assignedTech.project_end_date).toISOString().split('T')[0]);
//                     }
//                 }
//             } else {
//                 setCurrentAssignedTech(null);
//                 setSelectedTech(null);
//             }
//         } catch (error) {
//             console.error('Error loading current assignment:', error);
//             setCurrentAssignedTech(null);
//         }
//     };

//     const handleCreateClick = () => {
//         navigate('create')
//     }

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value)
//     }

//     const handleClearSearch = () => {
//         setSearchTerm('')
//     }

//     const handleAssignClick = (project) => {
//         const isEditMode = project.tnc_is_assigned || project.tnc_ongoing;
//         setAssignModal({ 
//             isOpen: true, 
//             project, 
//             mode: isEditMode ? 'edit' : 'assign'
//         });
//         setAssignmentStatus('');
        
//         if (!isEditMode) {
//             setSelectedTech(null);
//         }
//     }

//     const handleAssignConfirm = async () => {
//         if (!selectedTech) {
//             setAssignmentStatus('Please select a TNC technician');
//             return;
//         }

//         if (!startDate || !endDate) {
//             setAssignmentStatus('Please select both start and end dates');
//             return;
//         }

//         if (new Date(startDate) >= new Date(endDate)) {
//             setAssignmentStatus('End date must be after start date');
//             return;
//         }

//         try {
//             const peID = projects.find(p => p.id === assignModal.project.id)?.project_engineer_id;
//             const ProjectManagerId = employees.find(e => e.job === 'Project Manager')?.employee_id;
            
//             setAssignmentStatus('assigning');
            
//             const payload = {
//                 project_id: assignModal.project.id,
//                 tnc_technician_id: selectedTech.employee_id,
//                 assign_date: new Date().toISOString().split('T')[0],
//                 tnc_start_date: startDate,
//                 project_end_date: endDate
//             };

//             let endpoint, method;
            
//             if (assignModal.mode === 'edit') {
//                 // Update existing assignment
//                 endpoint = `/api/projects/tnc/assign/${assignModal.project.id}`;
//                 method = 'PUT';
//             } else {
//                 // Create new assignment
//                 endpoint = `/api/projects/tnc/assign/${assignModal.project.id}`;
//                 method = 'PUT';
//             }

//             const response = await Axios({
//                 method,
//                 url: endpoint,
//                 data: payload
//             });
            
//             if (response.data.success) {
//                 setAssignmentStatus('success');

//                 // Make Notification
//                 await new Promise((resolve, reject) => {
//                     const timeout = setTimeout(() => {
//                         reject(new Error("Socket emit timeout"));
//                     }, 5000); 

//                     utilitiesSocket.emit("new_notification", {
//                         subject: assignModal.mode === 'edit' ? 'TNC Assignment Updated' : 'Assigned for TNC Inspection',
//                         body: `TNC Inspection for ${assignModal.project.lift_name} is ${assignModal.mode === 'edit' ? 'updated' : 'assigned'} to ${selectedTech.last_name} ${selectedTech.first_name} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
//                         Ids: [selectedTech.employee_id, ProjectManagerId, peID].filter(Boolean)
//                     }, (ack) => {
//                         clearTimeout(timeout);
//                         if (ack?.success) {
//                             utilitiesSocket.emit("refresh_project_data");
//                             resolve();
//                         } else {
//                             reject(new Error("Server failed to process notification."));
//                         }
//                     });
//                 });

//                 setTimeout(() => {
//                     setAssignModal({ isOpen: false, project: null, mode: 'assign' });
//                     utilitiesSocket.emit('refresh_all_projects')
//                     window.location.reload();
//                 }, 1500);
//             }
//         } catch (error) {
//             console.error('Error assigning TNC technician:', error);
//             setAssignmentStatus(error.message || 'Error assigning technician');
//         }
//     }

//     const handleAssignClose = () => {
//         setAssignModal({ isOpen: false, project: null, mode: 'assign' });
//         setSelectedTech(null);
//         setAssignmentStatus('');
//         setCurrentAssignedTech(null);
//     }

//     const handleUnassign = async () => {
//         if (!confirm('Are you sure you want to unassign the TNC technician from this project?')) {
//             return;
//         }

//         try {
//             setAssignmentStatus('unassigning');
//             const response = await Axios.delete(`/api/projects/tnc/assignment/${assignModal.project.id}`);
            
//             if (response.data.success) {
//                 setAssignmentStatus('success');
//                 setTimeout(() => {
//                     setAssignModal({ isOpen: false, project: null, mode: 'assign' });
//                     setSelectedTech(null);
//                     setCurrentAssignedTech(null);
//                     window.location.reload();
//                 }, 1500);
//             } else {
//                 throw new Error('Failed to unassign technician');
//             }
//         } catch (error) {
//             console.error('Error unassigning technician:', error);
//             setAssignmentStatus('Error unassigning technician');
//         }
//     };

//     const handleTechSelection = (tech) => {
//         setSelectedTech(tech);
//         setAssignmentStatus('');
//     };

//     // Statistics
//     const projectsNeedingAssignment = projects.filter(p => p.tnc_pending && !p.tnc_is_assigned).length;
//     const totalAssignedProjects = projects.filter(p => p.tnc_is_assigned || p.tnc_ongoing).length;
//     const ongoingTNCAssignments = tncTechs?.filter(t => t.project_id && new Date(t.project_end_date) >= new Date()).length || 0;

//     return (
//         <div className='Content TNCMenu'>
//             {/* Assignment Modal */}
//             {assignModal.isOpen && (
//                 <div className="modal-overlay">
//                     <div className="modal-content assign-modal">
//                         <h3>
//                             {assignModal.mode === 'edit' ? 'Edit TNC Assignment' : 'Assign TNC Technician'}
//                         </h3>
//                         <div className="modal-project-info">
//                             <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
//                             <p><strong>Client:</strong> {assignModal.project.client}</p>
//                             <p><strong>Location:</strong> {assignModal.project.city_municipality || assignModal.project.region}</p>
//                             <p><strong>TNC Status:</strong> {assignModal.project.tnc_is_assigned ? 'Assigned' : assignModal.project.tnc_ongoing ? 'Ongoing' : 'Pending'}</p>
//                         </div>
                        
//                         {/* Current Assignment Info */}
//                         {currentAssignedTech && (
//                             <div className="current-assignment">
//                                 <h4>Current Assignment</h4>
//                                 <div className="current-tech">
//                                     <div className="current-tech-item">
//                                         <span>{currentAssignedTech.last_name} {currentAssignedTech.first_name}</span>
//                                         <span className="tech-status">Currently Assigned</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
                        
//                         {/* Date Selection */}
//                         <div className="date-selection">
//                             <div className="date-input-group">
//                                 <label>Start Date:</label>
//                                 <input
//                                     type="date"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                     className="date-input"
//                                     min={new Date().toISOString().split('T')[0]}
//                                 />
//                             </div>
//                         </div>
                        
//                         {/* Technician Selection */}
//                         <div className="tech-selection">
//                             <label>
//                                 {assignModal.mode === 'edit' ? 'Update Technician:' : 'Select Technician:'}
//                             </label>
//                             <span>Available TNC Technicians (Not currently assigned to active projects)</span>
                            
//                             <div className="techs-list">
//                                 {availableTechs.map(tech => {
//                                     const isCurrentlyAssigned = currentAssignedTech && currentAssignedTech.employee_id === tech.employee_id;
//                                     const isSelected = selectedTech && selectedTech.employee_id === tech.employee_id;
                                    
//                                     return (
//                                         <div 
//                                             key={tech.employee_id}
//                                             className={`tech-item ${isSelected ? 'selected' : ''} ${
//                                                 isCurrentlyAssigned && assignModal.mode === 'edit' ? 'currently-assigned' : ''
//                                             }`}
//                                             onClick={() => handleTechSelection(tech)}
//                                         >
//                                             <div className="tech-info">
//                                                 <strong>{tech.last_name} {tech.first_name}</strong>
//                                                 <span>{tech.island_group}</span>
//                                                 {isCurrentlyAssigned && assignModal.mode === 'edit' && (
//                                                     <span className="current-badge">Currently Assigned</span>
//                                                 )}
//                                             </div>
//                                             <div className="tech-checkbox">
//                                                 {isSelected ? '✓' : ''}
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                                 {availableTechs.length === 0 && (
//                                     <div className="no-techs">
//                                         No available TNC technicians. All technicians are currently assigned to active projects.
//                                     </div>
//                                 )}
//                             </div>

//                             {selectedTech && (
//                                 <div className="selected-tech">
//                                     <strong>Selected Technician:</strong>
//                                     <span className="selected-tech-tag">
//                                         {selectedTech.last_name} {selectedTech.first_name} ({selectedTech.island_group})
//                                     </span>
//                                 </div>
//                             )}
//                         </div>

//                         {assignmentStatus && (
//                             <div className={`status ${
//                                 assignmentStatus === 'success' ? 'success' : 
//                                 assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' ? 'info' : 'error'
//                             }`}>
//                                 {assignmentStatus === 'assigning' ? 'Processing...' : 
//                                  assignmentStatus === 'unassigning' ? 'Unassigning...' : assignmentStatus}
//                             </div>
//                         )}

//                         <div className="modal-actions">
//                             {assignModal.mode === 'edit' && (
//                                 <button 
//                                     onClick={handleUnassign}
//                                     className="btn-danger"
//                                     disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success'}
//                                 >
//                                     {assignmentStatus === 'unassigning' ? 'Unassigning...' : 'Unassign'}
//                                 </button>
//                             )}
//                             <button onClick={handleAssignClose} className="btn-cancel">
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={handleAssignConfirm} 
//                                 className="btn-confirm"
//                                 disabled={assignmentStatus === 'assigning' || assignmentStatus === 'unassigning' || assignmentStatus === 'success' || !selectedTech || !startDate || !endDate}
//                             >
//                                 {assignmentStatus === 'assigning' ? 'Processing...' : 
//                                  assignModal.mode === 'edit' ? 'Update Assignment' : 'Assign Technician'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             {/* Header Section */}
//             <div className="dashboard-header">
//                 <div className="header-main">
//                     <h1>TNC Assignment Dashboard</h1>
//                     <div className="header-stats">
//                         <div className="stat-badge urgent">
//                             <span className="stat-count">{projectsNeedingAssignment}</span>
//                             <span className="stat-label">Need Assignment</span>
//                         </div>
//                         <div className="stat-badge assigned">
//                             <span className="stat-count">{totalAssignedProjects}</span>
//                             <span className="stat-label">Assigned</span>
//                         </div>
//                         <div className="stat-badge ongoing">
//                             <span className="stat-count">{ongoingTNCAssignments}</span>
//                             <span className="stat-label">Active TNCs</span>
//                         </div>
//                         <div className="stat-badge total">
//                             <span className="stat-count">{projects.length}</span>
//                             <span className="stat-label">Total Projects</span>
//                         </div>
//                     </div>
//                 </div>
                
//                 <div className="header-actions">
//                     <div className="search-container">
//                         <div className="search-input-wrapper">
//                             <input
//                                 type="text"
//                                 placeholder="Search projects by name, client, or location..."
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                                 className="search-input"
//                             />
//                             {searchTerm && (
//                                 <button 
//                                     className="clear-search-btn"
//                                     onClick={handleClearSearch}
//                                 >
//                                     ×
//                                 </button>
//                             )}
//                             <span className="search-icon">🔍</span>
//                         </div>
//                     </div>

//                     <button 
//                         onClick={handleCreateClick} 
//                         className="create-project-btn"
//                         style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none'}}
//                     >
//                         + New Project
//                     </button>
//                 </div>
//             </div>

//             {/* Main Content Grid */}
//             <div className="dashboard-grid">
//                 {/* Projects Panel */}
//                 <div className="projects-panel">
//                     <div className="panel-header">
//                         <h2>Projects Needing TNC</h2>
//                         <div className="panel-actions">
//                             <span className="results-count">
//                                 {filteredProjects.filter(p => p.tnc_pending && !p.tnc_is_assigned).length} of {filteredProjects.length} projects
//                             </span>
//                         </div>
//                     </div>
                    
//                     <div className="projects-table">
//                         <div className="table-header">
//                             <div className="table-cell">Project & Client</div>
//                             <div className="table-cell">Progress</div>
//                             <div className="table-cell">Phase</div>
//                             <div className="table-cell">Current Task</div>
//                             <div className="table-cell">TNC Status</div>
//                             <div className="table-cell">Assignment Period</div>
//                             <div className="table-cell">Actions</div>
//                         </div>
                        
//                         <div className="table-body">
//                             <TNCList 
//                                 projects={filteredProjects}
//                                 searchTerm={searchTerm} 
//                                 setSelectedEntry={setSelectedEntry}
//                                 onAssignClick={handleAssignClick}
//                                 tncTechs={tncTechs}
//                             />
//                         </div>
//                     </div>

//                     {filteredProjects.length === 0 && projects.length > 0 && (
//                         <div className="no-results">
//                             <p>No projects found matching "{searchTerm}"</p>
//                             <button onClick={handleClearSearch} className="clear-search-link">
//                                 Clear search
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Details Panel */}
//                 <div className="details-panel">
//                     <div className="panel-header">
//                         <h2>Project Details</h2>
//                     </div>
                    
//                     {selectedEntry.id ? (
//                         <div className="project-details">
//                             <div className="project-card">
//                                 <div className="project-header">
//                                     <h3 className="project-title">{selectedEntry.lift_name}</h3>
//                                     <div className="project-meta">
//                                         <span className="client">{selectedEntry.client}</span>
//                                         <span className="location">{selectedEntry.city_municipality || selectedEntry.region}</span>
//                                         <span className="phase">{selectedEntry.status}</span>
//                                     </div>
//                                 </div>
                                
//                                 <div className="project-info-grid">
//                                     <div className="info-item">
//                                         <label>Current Task:</label>
//                                         <span>{selectedEntry.current_task || 'No active task'}</span>
//                                     </div>
//                                     <div className="info-item">
//                                         <label>Progress:</label>
//                                         <span>{selectedEntry.progress}% Complete</span>
//                                     </div>
//                                     <div className="info-item">
//                                         <label>TNC Status:</label>
//                                         <span className={`status-badge ${
//                                             selectedEntry.tnc_ongoing ? 'ongoing' : 
//                                             selectedEntry.tnc_is_assigned ? 'assigned' : 
//                                             selectedEntry.tnc_pending ? 'pending' : 'none'
//                                         }`}>
//                                             {selectedEntry.tnc_ongoing ? 'Ongoing' : 
//                                              selectedEntry.tnc_is_assigned ? 'Assigned' : 
//                                              selectedEntry.tnc_pending ? 'Pending Assignment' : 'No Inspection'}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Quick Actions */}
//                                 <div className="quick-actions-section">
//                                     <h4>Quick Actions</h4>
//                                     <div className="action-buttons">
//                                         {selectedEntry.tnc_pending && !selectedEntry.tnc_is_assigned ? (
//                                             <button 
//                                                 className="btn-primary"
//                                                 onClick={() => handleAssignClick(selectedEntry)}
//                                             >
//                                                 👥 Assign TNC
//                                             </button>
//                                         ) : (<></>)}
                                        
//                                         {(selectedEntry.tnc_is_assigned || selectedEntry.tnc_ongoing) ? (
//                                             <button 
//                                                 className="btn-primary"
//                                                 onClick={() => handleAssignClick(selectedEntry)}
//                                             >
//                                                 ✏️ Edit Assignment
//                                             </button>
//                                         ) : (<></>)}
//                                     </div>
//                                 </div>

//                                 {/* Current Assignment Info */}
//                                 {(selectedEntry.tnc_is_assigned || selectedEntry.tnc_ongoing) ? (
//                                     <div className="current-assignment-info">
//                                         <h4>Current Assignment</h4>
//                                         {tncTechs && (() => {
//                                             const assignedTech = tncTechs.find(t => t.project_id === selectedEntry.id);
//                                             const techDetails = assignedTech && tncEmployees.find(e => e.employee_id === assignedTech.employee_id);
//                                             return techDetails ? (
//                                                 <div className="assigned-tech">
//                                                     <strong>{techDetails.last_name} {techDetails.first_name}</strong>
//                                                     <span>{techDetails.island_group}</span>
//                                                     <span>Assignment Period: {assignedTech.tnc_start_date ? 
//                                                         new Date(assignedTech.tnc_start_date).toLocaleDateString('en-GB') : 'N/A'} to {assignedTech.project_end_date ? 
//                                                         new Date(assignedTech.project_end_date).toLocaleDateString('en-GB') : 'N/A'}</span>
//                                                 </div>
//                                             ) : (
//                                                 <div className="no-assignment">No technician assigned</div>
//                                             );
//                                         })()}
//                                     </div>
//                                 ) : (<></>)}
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="no-selection">
//                             <div className="no-selection-content">
//                                 <div className="no-selection-icon">📋</div>
//                                 <h3>No Project Selected</h3>
//                                 <p>Select a project from the list to view details and take action</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Technician Workload */}
//                     <div className="workload-section">
//                         <h3>TNC Technician Workload</h3>
//                         <div className="workload-cards">
//                             {tncEmployees.map(tech => {
//                                 const assignedProjects = tncTechs?.filter(t => 
//                                     t.employee_id === tech.employee_id && 
//                                     t.project_id
//                                 ) || [];
                                
//                                 const activeAssignments = assignedProjects.filter(p => 
//                                     new Date(p.project_end_date) >= new Date()
//                                 );
                                
//                                 return (
//                                     <div key={tech.employee_id} className="workload-card">
//                                         <div className="workload-header">
//                                             <h4>{tech.last_name} {tech.first_name}</h4>
//                                             <span className={`project-count ${activeAssignments.length > 0 ? 'busy' : 'available'}`}>
//                                                 {activeAssignments.length} active / {assignedProjects.length} total
//                                             </span>
//                                         </div>
//                                         <div className="workload-projects">
//                                             {assignedProjects.map((project, index) => {
//                                                 const isActive = new Date(project.project_end_date) >= new Date();
//                                                 return (
//                                                     <div key={index} className={`project-item ${isActive ? 'active' : 'completed'}`}>
//                                                         <div className="project-name">{project.lift_name}</div>
//                                                         <div className="project-meta">
//                                                             <span>{project.client}</span>
//                                                             <span>{project.tnc_start_date ? 
//                                                                 new Date(project.tnc_start_date).toLocaleDateString('en-GB') : 'No date'} - {project.project_end_date ? 
//                                                                 new Date(project.project_end_date).toLocaleDateString('en-GB') : 'No date'}</span>
//                                                         </div>
//                                                         {isActive && <div className="active-badge">Active</div>}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default TNCAssignment

import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import { useSharedSocket } from '../../Context/SocketContext.js';
import { Axios } from '../../api/axios.js'
import '../../css/TNCPage.css'
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
  Close as CloseIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AssignedIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  EventAvailable as EventIcon
} from '@mui/icons-material';

const TNCAssignment = () => {
    const { utilitiesSocket } = useSharedSocket()
    const navigate = useNavigate()
    const projects = useStoreState(state => state.projects)
    const employees = useStoreState(state => state.employees)
    const {tncTechs} = useStoreState(state => state)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEntry, setSelectedEntry] = useState({})
    const [assignModal, setAssignModal] = useState({ 
        isOpen: false, 
        project: null, 
        mode: 'assign'
    })
    const [selectedTech, setSelectedTech] = useState(null)
    const [assignmentStatus, setAssignmentStatus] = useState('')
    const [availableTechs, setAvailableTechs] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentAssignedTech, setCurrentAssignedTech] = useState(null)
    const [activeView, setActiveView] = useState('all')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Filter TNC technicians from employees
    const tncEmployees = useMemo(() => {
        return employees.filter(e => e.job === 'TNC Technician' || e.job === 'TNC');
    }, [employees]);

    // Filter projects based on search term and active view
    const filteredProjects = useMemo(() => {
        let filtered = projects || [];
        
        if (activeView === 'pending') {
            filtered = filtered.filter(p => p.tnc_pending && !p.tnc_is_assigned);
        } else if (activeView === 'assigned') {
            filtered = filtered.filter(p => p.tnc_is_assigned);
        } else if (activeView === 'ongoing') {
            filtered = filtered.filter(p => p.tnc_ongoing);
        }
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(project => 
                project.lift_name?.toLowerCase().includes(term) ||
                project.client?.toLowerCase().includes(term) ||
                project.status?.toLowerCase().includes(term) ||
                project.region?.toLowerCase().includes(term) ||
                project.city_municipality?.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    }, [projects, searchTerm, activeView]);

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
            const today = new Date();
            const defaultEndDate = new Date();
            defaultEndDate.setDate(today.getDate() + 14);
            
            setStartDate(today.toISOString().split('T')[0]);
            setEndDate(defaultEndDate.toISOString().split('T')[0]);
        }
    }, [selectedEntry])

    const loadAvailableTechnicians = async () => {
        try {
            const available = tncEmployees.filter(tech => {
                const currentAssignment = tncTechs?.find(t => 
                    t.employee_id === tech.employee_id && 
                    t.project_id && 
                    new Date(t.project_end_date) >= new Date()
                );
                return !currentAssignment;
            });
            setAvailableTechs(available);
        } catch (error) {
            console.error('Error loading technicians:', error);
            setAvailableTechs([]);
        }
    };

    const loadCurrentAssignment = async (project) => {
        try {
            if (project.tnc_is_assigned || project.tnc_ongoing) {
                const assignedTech = tncTechs?.find(t => t.project_id === project.id);
                if (assignedTech) {
                    const techDetails = tncEmployees.find(e => e.employee_id === assignedTech.employee_id);
                    setCurrentAssignedTech(techDetails);
                    setSelectedTech(techDetails);
                    
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

            const endpoint = `/api/projects/tnc/assign/${assignModal.project.id}`;
            const method = 'PUT';

            const response = await Axios({
                method,
                url: endpoint,
                data: payload
            });
            
            if (response.data.success) {
                setAssignmentStatus('success');

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
    const stats = {
        total: projects?.length || 0,
        pending: projects?.filter(p => p.tnc_pending && !p.tnc_is_assigned).length || 0,
        assigned: projects?.filter(p => p.tnc_is_assigned).length || 0,
        ongoing: projects?.filter(p => p.tnc_ongoing).length || 0,
        activeAssignments: tncTechs?.filter(t => t.project_id && new Date(t.project_end_date) >= new Date()).length || 0
    };

    return (
        <div className="tnc-modern-dashboard">
            {/* Assignment Modal - Modern Design */}
            {assignModal.isOpen ? (
                <div className="modern-modal-overlay">
                    <div className="modern-modal">
                        <div className="modal-header">
                            <div className="modal-title-group">
                                <AssignmentIcon className="modal-icon" />
                                <div>
                                    <h2>
                                        {assignModal.mode === 'edit' ? 'Edit TNC Assignment' : 'Assign TNC Technician'}
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
                                            <span className="status">{assignModal.project?.status}</span>
                                        </div>
                                        <div className="project-location">
                                            <LocationIcon />
                                            {assignModal.project?.city_municipality || assignModal.project?.region}
                                        </div>
                                    </div>
                                </div>
                                <div className={`status-tag ${
                                    assignModal.project?.tnc_ongoing ? 'ongoing' : 
                                    assignModal.project?.tnc_is_assigned ? 'assigned' : 
                                    'pending'
                                }`}>
                                    {assignModal.project?.tnc_ongoing ? 'Ongoing' : 
                                     assignModal.project?.tnc_is_assigned ? 'Assigned' : 'Pending'}
                                </div>
                            </div>

                            {/* Current Assignment */}
                            {currentAssignedTech ? (
                                <div className="current-assignment-section">
                                    <h4>Current Assignment</h4>
                                    <div className="current-techs">
                                        <div className="current-tech">
                                            <div className="tech-avatar">
                                                {currentAssignedTech.first_name[0]}{currentAssignedTech.last_name[0]}
                                            </div>
                                            <span>{currentAssignedTech.first_name} {currentAssignedTech.last_name}</span>
                                            <span className="current-badge">Assigned</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Date Selection */}
                            <div className="form-section">
                                <div className="date-input-group">
                                    <label>
                                        <CalendarIcon />
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="date-picker"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="date-input-group">
                                    <label>
                                        <EventIcon />
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="date-picker"
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* Technician Selection */}
                            <div className="form-section">
                                <div className="section-header">
                                    <EngineeringIcon />
                                    <div>
                                        <h4>Select Technician</h4>
                                        <p>Choose from available TNC technicians</p>
                                    </div>
                                </div>
                                
                                <div className="tech-grid">
                                    {availableTechs.length > 0 ? (
                                        availableTechs.map(tech => {
                                            const isSelected = selectedTech && selectedTech.employee_id === tech.employee_id;
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
                                                        {isSelected ? <CheckIcon /> : null}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="no-techs">
                                            No available TNC technicians. All technicians are currently assigned to active projects.
                                        </div>
                                    )}
                                </div>

                                {selectedTech ? (
                                    <div className="selected-techs">
                                        <h5>Selected Technician</h5>
                                        <div className="selected-list">
                                            <div className="selected-tag">
                                                <PersonIcon />
                                                <span>{selectedTech.first_name} {selectedTech.last_name}</span>
                                                <button onClick={() => handleTechSelection(selectedTech)}>
                                                    <CloseIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {assignmentStatus ? (
                                <div className={`status-message ${assignmentStatus}`}>
                                    {assignmentStatus === 'success' ? <CheckIcon /> : null}
                                    {assignmentStatus === 'error' ? <WarningIcon /> : null}
                                    {assignmentStatus}
                                </div>
                            ) : null}
                        </div>

                        <div className="modal-actions">
                            {assignModal.mode === 'edit' ? (
                                <button className="btn-danger" onClick={handleUnassign}>
                                    <ClearIcon />
                                    Unassign
                                </button>
                            ) : null}
                            <div className="action-group">
                                <button className="btn-secondary" onClick={handleAssignClose}>
                                    Cancel
                                </button>
                                <button 
                                    className="btn-primary" 
                                    onClick={handleAssignConfirm}
                                    disabled={!selectedTech || !startDate || !endDate}
                                >
                                    <AssignmentIcon />
                                    {assignModal.mode === 'edit' ? 'Update' : 'Assign'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Modern Dashboard Layout */}
            <div className="dashboard-layout">
                {/* Left Sidebar - Quick Stats & Filters */}
                <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <DashboardIcon />
                        {!sidebarCollapsed ? <span>TNC Menu</span> : null}
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
                            {!sidebarCollapsed ? <h3>Overview</h3> : null}
                            <div className="stat-items">
                                <div className="stat-item">
                                    <div className="stat-icon total">
                                        <WorkIcon />
                                    </div>
                                    {!sidebarCollapsed ? (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.total}</span>
                                            <span className="stat-label">Total</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon pending">
                                        <ScheduleIcon />
                                    </div>
                                    {!sidebarCollapsed ? (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.pending}</span>
                                            <span className="stat-label">Pending</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon assigned">
                                        <AssignedIcon />
                                    </div>
                                    {!sidebarCollapsed ? (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.assigned}</span>
                                            <span className="stat-label">Assigned</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="stat-item">
                                    <div className="stat-icon ongoing">
                                        <TrendingUpIcon />
                                    </div>
                                    {!sidebarCollapsed ? (
                                        <div className="stat-info">
                                            <span className="stat-number">{stats.activeAssignments}</span>
                                            <span className="stat-label">Active</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        {!sidebarCollapsed ? (
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
                        ) : null}

                        {/* Team Overview */}
                        {!sidebarCollapsed ? (
                            <div className="team-widget">
                                <h3>Team Overview</h3>
                                <div className="team-list">
                                    {tncEmployees.slice(0, 4).map(tech => {
                                        const assignedProjects = tncTechs?.filter(t => 
                                            t.employee_id === tech.employee_id && t.project_id
                                        ) || [];
                                        const activeAssignments = assignedProjects.filter(p => 
                                            new Date(p.project_end_date) >= new Date()
                                        );
                                        return (
                                            <div key={tech.employee_id} className="team-member">
                                                <div className="member-avatar">
                                                    <PersonIcon />
                                                </div>
                                                <div className="member-info">
                                                    <span className="member-name">{tech.first_name} {tech.last_name}</span>
                                                    <span className="member-projects">
                                                        {activeAssignments.length} active
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
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
                                {searchTerm ? (
                                    <button onClick={() => setSearchTerm('')}>
                                        <ClearIcon />
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <div className="actions-section">
                            <button 
                                className="action-btn primary"
                                onClick={() => navigate('create')}
                                style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'flex' : 'none'}}
                            >
                                <AssignmentIcon />
                                New Project
                            </button>
                        </div>
                    </header>

                    {/* Projects Grid */}
                    <section className="projects-section">
                        <div className="projects-grid">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(project => (
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
                                            <div className={`status-badge ${
                                                project.tnc_ongoing ? 'ongoing' : 
                                                project.tnc_is_assigned ? 'assigned' : 
                                                'pending'
                                            }`}>
                                                {project.tnc_ongoing ? 'Ongoing' : 
                                                 project.tnc_is_assigned ? 'Assigned' : 'Pending'}
                                            </div>
                                        </div>

                                        <div className="project-details">
                                            <div className="detail">
                                                <LocationIcon />
                                                <span>{project.city_municipality || project.region}</span>
                                            </div>
                                            <div className="detail">
                                                <CalendarIcon />
                                                <span>
                                                    {project.tnc_start_date 
                                                        ? `${new Date(project.tnc_start_date).toLocaleDateString('en-GB')} - ${new Date(project.project_end_date).toLocaleDateString('en-GB')}`
                                                        : 'Not scheduled'
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="project-actions">
                                            {project.tnc_pending && !project.tnc_is_assigned ? (
                                                <button 
                                                    className="btn-assign"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAssignClick(project);
                                                    }}
                                                >
                                                    <AssignmentIcon />
                                                    Assign
                                                </button>
                                            ) : null}
                                            {(project.tnc_is_assigned || project.tnc_ongoing) ? (
                                                <button 
                                                    className="btn-edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAssignClick(project);
                                                    }}
                                                >
                                                    <EditIcon />
                                                    Edit
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <WorkIcon />
                                    <h3>No projects found</h3>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Right Panel - Project Details */}
                <aside className="details-panel">
                    <div className="panel-header">
                        <h2>Project Details</h2>
                        {selectedEntry.id ? (
                            <button 
                                className="btn-babybook"
                                onClick={() => navigate(`/baby-book/${selectedEntry.id}`)}
                            >
                                <BookIcon />
                                Baby Book
                            </button>
                        ) : null}
                    </div>

                    {selectedEntry.id ? (
                        <div className="project-details">
                            <div className="detail-section">
                                <h3>{selectedEntry.lift_name}</h3>
                                <p className="client-name">{selectedEntry.client}</p>
                                
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Location</label>
                                        <span>{selectedEntry.city_municipality || selectedEntry.region}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Phase</label>
                                        <span>{selectedEntry.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Progress</label>
                                        <span>{selectedEntry.progress}% Complete</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Current Task</label>
                                        <span>{selectedEntry.current_task || 'No active task'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="action-section">
                                <h4>Quick Actions</h4>
                                <div className="action-buttons">
                                    {selectedEntry.tnc_pending && !selectedEntry.tnc_is_assigned ? (
                                        <button 
                                            className="btn-primary"
                                            onClick={() => handleAssignClick(selectedEntry)}
                                        >
                                            <AssignmentIcon />
                                            Assign TNC
                                        </button>
                                    ) : null}
                                    {(selectedEntry.tnc_is_assigned || selectedEntry.tnc_ongoing) ? (
                                        <button 
                                            className="btn-primary"
                                            onClick={() => handleAssignClick(selectedEntry)}
                                        >
                                            <EditIcon />
                                            Edit Assignment
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            {/* Current Assignment Info */}
                            {(selectedEntry.tnc_is_assigned || selectedEntry.tnc_ongoing) ? (
                                <div className="current-assignment-info">
                                    <h4>Current Assignment</h4>
                                    {tncTechs ? (() => {
                                        const assignedTech = tncTechs.find(t => t.project_id === selectedEntry.id);
                                        const techDetails = assignedTech && tncEmployees.find(e => e.employee_id === assignedTech.employee_id);
                                        return techDetails ? (
                                            <div className="assigned-tech-card">
                                                <div className="tech-avatar">
                                                    {techDetails.first_name[0]}{techDetails.last_name[0]}
                                                </div>
                                                <div className="tech-details">
                                                    <strong>{techDetails.first_name} {techDetails.last_name}</strong>
                                                    <span>{techDetails.island_group}</span>
                                                    <span className="assignment-date">
                                                        Assignment Period: {assignedTech.tnc_start_date ? 
                                                            new Date(assignedTech.tnc_start_date).toLocaleDateString('en-GB') : 'N/A'} to {assignedTech.project_end_date ? 
                                                            new Date(assignedTech.project_end_date).toLocaleDateString('en-GB') : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="no-assignment">No technician assigned</div>
                                        );
                                    })() : null}
                                </div>
                            ) : null}
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
    )
}

export default TNCAssignment